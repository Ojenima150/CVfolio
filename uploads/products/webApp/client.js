'use strict'

// eslint-disable-next-line
var Native
// eslint-disable-next-line no-useless-catch
try {
  // Wrap this `require()` in a try-catch to avoid upstream bundlers from complaining that this might not be available since it is an optional import
  Native = require('pg-native')
} catch (e) {
  throw e
}
const TypeOverrides = require('../type-overrides')
const EventEmitter = require('events').EventEmitter
const util = require('util')
const ConnectionParameters = require('../connection-parameters')

const NativeQuery = require('./query')

const Client = (module.exports = function (config) {
  EventEmitter.call(this)
  config = config || {}

  this._Promise = config.Promise || global.Promise
  this._types = new TypeOverrides(config.types)

  this.native = new Native({
    types: this._types,
  })

  this._queryQueue = []
  this._ending = false
  this._connecting = false
  this._connected = false
  this._queryable = true

  // keep these on the object for legacy reasons
  // for the time being. TODO: deprecate all this jazz
  const cp = (this.connectionParameters = new ConnectionParameters(config))
  if (config.nativeConnectionString) cp.nativeConnectionString = config.nativeConnectionString
  this.user = cp.user

  // "hiding" the password so it doesn't show up in stack traces
  // or if the client is console.logged
  Object.defineProperty(this, 'password', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: cp.password,
  })
  this.database = cp.database
  this.host = cp.host
  this.port = cp.port

  // a hash to hold named queries
  this.namedQueries = {}
})

Client.Query = NativeQuery

util.inherits(Client, EventEmitter)

Client.prototype._errorAllQueries = function (err) {
  const enqueueError = (query) => {
    process.nextTick(() => {
      query.native = this.native
      query.handleError(err)
    })
  }

  if (this._hasActiveQuery()) {
    enqueueError(this._activeQuery)
    this._activeQuery = null
  }

  this._queryQueue.forEach(enqueueError)
  this._queryQueue.length = 0
}

// connect to the backend
// pass an optional callback to be called once connected
// or with an error if there was a connection error
Client.prototype._connect = function (cb) {
  const self = this

  if (this._connecting) {
    process.nextTick(() => cb(new Error('Client has already been connected. You cannot reuse a client.')))
    return
  }

  this._connecting = true

  this.connectionParameters.getLibpqConnectionString(function (err, conString) {
    if (self.connectionParameters.nativeConnectionString) conString = self.connectionParameters.nativeConnectionString
    if (err) return cb(err)
    self.native.connect(conString, function (err) {
      if (err) {
        self.native.end()
        return cb(err)
      }

      // set internal states to connected
      self._connected = true

      // handle connection errors from the native layer
      self.native.on('error', function (err) {
        self._queryable = false
        self._errorAllQueries(err)
        self.emit('error', err)
      })

      self.native.on('notification', function (msg) {
        self.emit('notification', {
          channel: msg.relname,
          payload: msg.extra,
        })
      })

      // signal we are connected now
      self.emit('connect')
      self._pulseQueryQueue(true)

      cb()
    })
  })
}

Client.prototype.connect = function (callback) {
  if (callback) {
    this._connect(callback)
    return
  }

  return new this._Promise((resolve, reject) => {
    this._connect((error) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

// send a query to the server
// this method is highly overloaded to take
// 1) string query, optional array of parameters, optional function callback
// 2) object query with {
//    string query
//    optional array values,
//    optional function callback instead of as a separate parameter
//    optional string name to name & cache the query plan
//    optional string rowMode = 'array' for an array of results
//  }
Client.prototype.query = function (config, values, callback) {
  let query
  let result
  let readTimeout
  let readTimeoutTimer
  let queryCallback

  if (config === null || config === undefined) {
    throw new TypeError('Client was passed a null or undefined query')
  } else if (typeof config.submit === 'function') {
    readTimeout = config.query_timeout || this.connectionParameters.query_timeout
    result = query = config
    // accept query(new Query(...), (err, res) => { }) style
    if (typeof values === 'function') {
      config.callback = values
    }
  } else {
    readTimeout = config.query_timeout || this.connectionParameters.query_timeout
    query = new NativeQuery(config, values, callback)
    if (!query.callback) {
      let resolveOut, rejectOut
      result = new this._Promise((resolve, reject) => {
        resolveOut = resolve
        rejectOut = reject
      }).catch((err) => {
        Error.captureStackTrace(err)
        throw err
      })
      query.callback = (err, res) => (err ? rejectOut(err) : resolveOut(res))
    }
  }

  if (readTimeout) {
    queryCallback = query.callback

    readTimeoutTimer = setTimeout(() => {
      const error = new Error('Query read timeout')

      process.nextTick(() => {
        query.handleError(error, this.connection)
      })

      queryCallback(error)

      // we already returned an error,
      // just do nothing if query completes
      query.callback = () => {}

      // Remove from queue
      const index = this._queryQueue.indexOf(query)
      if (index > -1) {
        this._queryQueue.splice(index, 1)
      }

      this._pulseQueryQueue()
    }, readTimeout)

    query.callback = (err, res) => {
      clearTimeout(readTimeoutTimer)
      queryCallback(err, res)
    }
  }

  if (!this._queryable) {
    query.native = this.native
    process.nextTick(() => {
      query.handleError(new Error('Client has encountered a connection error and is not queryable'))
    })
    return result
  }

  if (this._ending) {
    query.native = this.native
    process.nextTick(() => {
      query.handleError(new Error('Client was closed and is not queryable'))
    })
    return result
  }

  this._queryQueue.push(query)
  this._pulseQueryQueue()
  return result
}

// disconnect from the backend server
Client.prototype.end = function (cb) {
  const self = this

  this._ending = true

  if (!this._connected) {
    this.once('connect', this.end.bind(this, cb))
  }
  let result
  if (!cb) {
    result = new this._Promise(function (resolve, reject) {
      cb = (err) => (err ? reject(err) : resolve())
    })
  }
  this.native.end(function () {
    self._errorAllQueries(new Error('Connection terminated'))

    process.nextTick(() => {
      self.emit('end')
      if (cb) cb()
    })
  })
  return result
}

Client.prototype._hasActiveQuery = function () {
  return this._activeQuery && this._activeQuery.state !== 'error' && this._activeQuery.state !== 'end'
}

Client.prototype._pulseQueryQueue = function (initialConnection) {
  if (!this._connected) {
    return
  }
  if (this._hasActiveQuery()) {
    return
  }
  const query = this._queryQueue.shift()
  if (!query) {
    if (!initialConnection) {
      this.emit('drain')
    }
    return
  }
  this._activeQuery = query
  query.submit(this)
  const self = this
  query.once('_done', function () {
    self._pulseQueryQueue()
  })
}

// attempt to cancel an in-progress query
Client.prototype.cancel = function (query) {
  if (this._activeQuery === query) {
    this.native.cancel(function () {})
  } else if (this._queryQueue.indexOf(query) !== -1) {
    this._queryQueue.splice(this._queryQueue.indexOf(query), 1)
  }
}

Client.prototype.ref = function () {}
Client.prototype.unref = function () {}

Client.prototype.setTypeParser = function (oid, format, parseFn) {
  return this._types.setTypeParser(oid, format, parseFn)
}

Client.prototype.getTypeParser = function (oid, format) {
  return this._types.getTypeParser(oid, format)
}
ection.password(hashedPassword)
      } catch (e) {
        this.emit('error', e)
      }
    })
  }

  _handleAuthSASL(msg) {
    this._checkPgPass(() => {
      try {
        this.saslSession = sasl.startSession(msg.mechanisms, this.enableChannelBinding && this.connection.stream)
        this.connection.sendSASLInitialResponseMessage(this.saslSession.mechanism, this.saslSession.response)
      } catch (err) {
        this.connection.emit('error', err)
      }
    })
  }

  async _handleAuthSASLContinue(msg) {
    try {
      await sasl.continueSession(
        this.saslSession,
        this.password,
        msg.data,
        this.enableChannelBinding && this.connection.stream
      )
      this.connection.sendSCRAMClientFinalMessage(this.saslSession.response)
    } catch (err) {
      this.connection.emit('error', err)
    }
  }

  _handleAuthSASLFinal(msg) {
    try {
      sasl.finalizeSession(this.saslSession, msg.data)
      this.saslSession = null
    } catch (err) {
      this.connection.emit('error', err)
    }
  }

  _handleBackendKeyData(msg) {
    this.processID = msg.processID
    this.secretKey = msg.secretKey
  }

  _handleReadyForQuery(msg) {
    if (this._connecting) {
      this._connecting = false
      this._connected = true
      clearTimeout(this.connectionTimeoutHandle)

      // process possible callback argument to Client#connect
      if (this._connectionCallback) {
        this._connectionCallback(null, this)
        // remove callback for proper error handling
        // after the connect event
        this._connectionCallback = null
      }
      this.emit('connect')
    }
    const { activeQuery } = this
    this.activeQuery = null
    this.readyForQuery = true
    if (activeQuery) {
      activeQuery.handleReadyForQuery(this.connection)
    }
    this._pulseQueryQueue()
  }

  // if we receive an error event or error message
  // during the connection process we handle it here
  _handleErrorWhileConnecting(err) {
    if (this._connectionError) {
      // TODO(bmc): this is swallowing errors - we shouldn't do this
      return
    }
    this._connectionError = true
    clearTimeout(this.connectionTimeoutHandle)
    if (this._connectionCallback) {
      return this._connectionCallback(err)
    }
    this.emit('error', err)
  }

  // if we're connected and we receive an error event from the connection
  // this means the socket is dead - do a hard abort of all queries and emit
  // the socket error on the client as well
  _handleErrorEvent(err) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(err)
    }
    this._queryable = false
    this._errorAllQueries(err)
    this.emit('error', err)
  }

  // handle error messages from the postgres backend
  _handleErrorMessage(msg) {
    if (this._connecting) {
      return this._handleErrorWhileConnecting(msg)
    }
    const activeQuery = this.activeQuery

    if (!activeQuery) {
      this._handleErrorEvent(msg)
      return
    }

    this.activeQuery = null
    activeQuery.handleError(msg, this.connection)
  }

  _handleRowDescription(msg) {
    // delegate rowDescription to active query
    this.activeQuery.handleRowDescription(msg)
  }

  _handleDataRow(msg) {
    // delegate dataRow to active query
    this.activeQuery.handleDataRow(msg)
  }

  _handlePortalSuspended(msg) {
    // delegate portalSuspended to active query
    this.activeQuery.handlePortalSuspended(this.connection)
  }

  _handleEmptyQuery(msg) {
    // delegate emptyQuery to active query
    this.activeQuery.handleEmptyQuery(this.connection)
  }

  _handleCommandComplete(msg) {
    if (this.activeQuery == null) {
      const error = new Error('Received unexpected commandComplete message from backend.')
      this._handleErrorEvent(error)
      return
    }
    // delegate commandComplete to active query
    this.activeQuery.handleCommandComplete(msg, this.connection)
  }

  _handleParseComplete() {
    if (this.activeQuery == null) {
      const error = new Error('Received unexpected parseComplete message from backend.')
      this._handleErrorEvent(error)
      return
    }
    // if a prepared statement has a name and properly parses
    // we track that its already been executed so we don't parse
    // it again on the same client
    if (this.activeQuery.name) {
      this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text
    }
  }

  _handleCopyInResponse(msg) {
    this.activeQuery.handleCopyInResponse(this.connection)
  }

  _handleCopyData(msg) {
    this.activeQuery.handleCopyData(msg, this.connection)
  }

  _handleNotification(msg) {
    this.emit('notification', msg)
  }

  _handleNotice(msg) {
    this.emit('notice', msg)
  }

  getStartupConf() {
    const params = this.connectionParameters

    const data = {
      user: params.user,
      database: params.database,
    }

    const appName = params.application_name || params.fallback_application_name
    if (appName) {
      data.application_name = appName
    }
    if (params.replication) {
      data.replication = '' + params.replication
    }
    if (params.statement_timeout) {
      data.statement_timeout = String(parseInt(params.statement_timeout, 10))
    }
    if (params.lock_timeout) {
      data.lock_timeout = String(parseInt(params.lock_timeout, 10))
    }
    if (params.idle_in_transaction_session_timeout) {
      data.idle_in_transaction_session_timeout = String(parseInt(params.idle_in_transaction_session_timeout, 10))
    }
    if (params.options) {
      data.options = params.options
    }

    return data
  }

  cancel(client, query) {
    if (client.activeQuery === query) {
      const con = this.connection

      if (this.host && this.host.indexOf('/') === 0) {
        con.connect(this.host + '/.s.PGSQL.' + this.port)
      } else {
        con.connect(this.port, this.host)
      }

      // once connection is established send cancel message
      con.on('connect', function () {
        con.cancel(client.processID, client.secretKey)
      })
    } else if (client.queryQueue.indexOf(query) !== -1) {
      client.queryQueue.splice(client.queryQueue.indexOf(query), 1)
    }
  }

  setTypeParser(oid, format, parseFn) {
    return this._types.setTypeParser(oid, format, parseFn)
  }

  getTypeParser(oid, format) {
    return this._types.getTypeParser(oid, format)
  }

  // escapeIdentifier and escapeLiteral moved to utility functions & exported
  // on PG
  // re-exported here for backwards compatibility
  escapeIdentifier(str) {
    return utils.escapeIdentifier(str)
  }

  escapeLiteral(str) {
    return utils.escapeLiteral(str)
  }

  _pulseQueryQueue() {
    if (this.readyForQuery === true) {
      this.activeQuery = this.queryQueue.shift()
      if (this.activeQuery) {
        this.readyForQuery = false
        this.hasExecuted = true

        const queryError = this.activeQuery.submit(this.connection)
        if (queryError) {
          process.nextTick(() => {
            this.activeQuery.handleError(queryError, this.connection)
            this.readyForQuery = true
            this._pulseQueryQueue()
          })
        }
      } else if (this.hasExecuted) {
        this.activeQuery = null
        this.emit('drain')
      }
    }
  }

  query(config, values, callback) {
    // can take in strings, config object or query object
    let query
    let result
    let readTimeout
    let readTimeoutTimer
    let queryCallback

    if (config === null || config === undefined) {
      throw new TypeError('Client was passed a null or undefined query')
    } else if (typeof config.submit === 'function') {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout
      result = query = config
      if (typeof values === 'function') {
        query.callback = query.callback || values
      }
    } else {
      readTimeout = config.query_timeout || this.connectionParameters.query_timeout
      query = new Query(config, values, callback)
      if (!query.callback) {
        result = new this._Promise((resolve, reject) => {
          query.callback = (err, res) => (err ? reject(err) : resolve(res))
        }).catch((err) => {
          // replace the stack trace that leads to `TCP.onStreamRead` with one that leads back to the
          // application that created the query
          Error.captureStackTrace(err)
          throw err
        })
      }
    }

    if (readTimeout) {
      queryCallback = query.callback

      readTimeoutTimer = setTimeout(() => {
        const error = new Error('Query read timeout')

        process.nextTick(() => {
          query.handleError(error, this.connection)
        })

        queryCallback(error)

        // we already returned an error,
        // just do nothing if query completes
        query.callback = () => {}

        // Remove from queue
        const index = this.queryQueue.indexOf(query)
        if (index > -1) {
          this.queryQueue.splice(index, 1)
        }

        this._pulseQueryQueue()
      }, readTimeout)

      query.callback = (err, res) => {
        clearTimeout(readTimeoutTimer)
        queryCallback(err, res)
      }
    }

    if (this.binary && !query.binary) {
      query.binary = true
    }

    if (query._result && !query._result._types) {
      query._result._types = this._types
    }

    if (!this._queryable) {
      process.nextTick(() => {
        query.handleError(new Error('Client has encountered a connection error and is not queryable'), this.connection)
      })
      return result
    }

    if (this._ending) {
      process.nextTick(() => {
        query.handleError(new Error('Client was closed and is not queryable'), this.connection)
      })
      return result
    }

    this.queryQueue.push(query)
    this._pulseQueryQueue()
    return result
  }

  ref() {
    this.connection.ref()
  }

  unref() {
    this.connection.unref()
  }

  end(cb) {
    this._ending = true

    // if we have never connected, then end is a noop, callback immediately
    if (!this.connection._connecting || this._ended) {
      if (cb) {
        cb()
      } else {
        return this._Promise.resolve()
      }
    }

    if (this.activeQuery || !this._queryable) {
      // if we have an active query we need to force a disconnect
      // on the socket - otherwise a hung query could block end forever
      this.connection.stream.destroy()
    } else {
      this.connection.end()
    }

    if (cb) {
      this.connection.once('end', cb)
    } else {
      return new this._Promise((resolve) => {
        this.connection.once('end', resolve)
      })
    }
  }
}

// expose a Query constructor
Client.Query = Query

module.exports = Client
