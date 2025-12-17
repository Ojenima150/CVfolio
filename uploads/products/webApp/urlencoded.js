/*!
 * body-parser
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 * @private
 */

var bytes = require('bytes')
var contentType = require('content-type')
var createError = require('http-errors')
var debug = require('debug')('body-parser:urlencoded')
var deprecate = require('depd')('body-parser')
var read = require('../read')
var typeis = require('type-is')

/**
 * Module exports.
 */

module.exports = urlencoded

/**
 * Cache of parser modules.
 */

var parsers = Object.create(null)

/**
 * Create a middleware to parse urlencoded bodies.
 *
 * @param {object} [options]
 * @return {function}
 * @public
 */

function urlencoded (options) {
  var opts = options || {}

  // notice because option default will flip in next major
  if (opts.extended === undefined) {
    deprecate('undefined extended: provide extended option')
  }

  var extended = opts.extended !== false
  var inflate = opts.inflate !== false
  var limit = typeof opts.limit !== 'number'
    ? bytes.parse(opts.limit || '100kb')
    : opts.limit
  var type = opts.type || 'application/x-www-form-urlencoded'
  var verify = opts.verify || false
  var depth = typeof opts.depth !== 'number'
    ? Number(opts.depth || 32)
    : opts.depth

  if (verify !== false && typeof verify !== 'function') {
    throw new TypeError('option verify must be function')
  }

  // create the appropriate query parser
  var queryparse = extended
    ? extendedparser(opts)
    : simpleparser(opts)

  // create the appropriate type checking function
  var shouldParse = typeof type !== 'function'
    ? typeChecker(type)
    : type

  function parse (body) {
    return body.length
      ? queryparse(body)
      : {}
  }

  return function urlencodedParser (req, res, next) {
    if (req._body) {
      debug('body already parsed')
      next()
      return
    }

    req.body = req.body || {}

    // skip requests without bodies
    if (!typeis.hasBody(req)) {
      debug('skip empty body')
      next()
      return
    }

    debug('content-type %j', req.headers['content-type'])

    // determine if request should be parsed
    if (!shouldParse(req)) {
      debug('skip parsing')
      next()
      return
    }

    // assert charset
    var charset = getCharset(req) || 'utf-8'
    if (charset !== 'utf-8') {
      debug('invalid charset')
      next(createError(415, 'unsupported charset "' + charset.toUpperCase() + '"', {
        charset: charset,
        type: 'charset.unsupported'
      }))
      return
    }

    // read
    read(req, res, next, parse, debug, {
      debug: debug,
      encoding: charset,
      inflate: inflate,
      limit: limit,
      verify: verify,
      depth: depth
    })
  }
}

/**
 * Get the extended query parser.
 *
 * @param {object} options
 */

function extendedparser (options) {
  var parameterLimit = options.parameterLimit !== undefined
    ? options.parameterLimit
    : 1000

  var depth = typeof options.depth !== 'number'
    ? Number(options.depth || 32)
    : options.depth
  var parse = parser('qs')

  if (isNaN(parameterLimit) || parameterLimit < 1) {
    throw new TypeError('option parameterLimit must be a positive number')
  }

  if (isNaN(depth) || depth < 0) {
    throw new TypeError('option depth must be a zero or a positive number')
  }

  if (isFinite(parameterLimit)) {
    parameterLimit = parameterLimit | 0
  }

  return function queryparse (body) {
    var paramCount = parameterCount(body, parameterLimit)

    if (paramCount === undefined) {
      debug('too many parameters')
      throw createError(413, 'too many parameters', {
        type: 'parameters.too.many'
      })
    }

    var arrayLimit = Math.max(100, paramCount)

    debug('parse extended urlencoding')
    try {
      return parse(body, {
        allowPrototypes: true,
        arrayLimit: arrayLimit,
        depth: depth,
        strictDepth: true,
        parameterLimit: parameterLimit
      })
    } catch (err) {
      if (err instanceof RangeError) {
        throw createError(400, 'The input exceeded the depth', {
          type: 'querystring.parse.rangeError'
        })
      } else {
        throw err
      }
    }
  }
}

/**
 * Get the charset of a request.
 *
 * @param {object} req
 * @api private
 */

function getCharset (req) {
  try {
    return (contentType.parse(req).parameters.charset || '').toLowerCase()
  } catch (e) {
    return undefined
  }
}

/**
 * Count the number of parameters, stopping once limit reached
 *
 * @param {string} body
 * @param {number} limit
 * @api private
 */

function parameterCount (body, limit) {
  var count = 0
  var index = 0

  while ((index = body.indexOf('&', index)) !== -1) {
    count++
    index++

    if (count === limit) {
      return undefined
    }
  }

  return count
}

/**
 * Get parser for module name dynamically.
 *
 * @param {string} name
 * @return {function}
 * @api private
 */

function parser (name) {
  var mod = parsers[name]

  if (mod !== undefined) {
    return mod.parse
  }

  // this uses a switch for static require analysis
  switch (name) {
    case 'qs':
      mod = require('qs')
      break
    case 'querystring':
      mod = require('querystring')
      break
  }

  // store to prevent invoking require()
  parsers[name] = mod

  return mod.parse
}

/**
 * Get the simple query parser.
 *
 * @param {object} options
 */

function simpleparser (options) {
  var parameterLimit = options.parameterLimit !== undefined
    ? options.parameterLimit
    : 1000
  var parse = parser('querystring')

  if (isNaN(parameterLimit) || parameterLimit < 1) {
    throw new TypeError('option parameterLimit must be a positive number')
  }

  if (isFinite(parameterLimit)) {
    parameterLimit = parameterLimit | 0
  }

  return function queryparse (body) {
    var paramCount = parameterCount(body, parameterLimit)

    if (paramCount === undefined) {
      debug('too many parameters')
      throw createError(413, 'too many parameters', {
        type: 'parameters.too.many'
      })
    }

    debug('parse urlencoding')
    return parse(body, undefined, undefined, { maxKeys: parameterLimit })
  }
}

/**
 * Get the simple type checker.
 *
 * @param {string} type
 * @return {function}
 */

function typeChecker (type) {
  return function checkType (req) {
    return Boolean(typeis(req, type))
  }
}
          if (i >= len)
                return cb();
              ++this._bytesVal;
              i = skipValBytes(this, chunk, i, len);
              continue;
          }
          ++i;
          ++this._bytesVal;
          i = skipValBytes(this, chunk, i, len);
        }
        if (this._lastPos < i)
          this._val += chunk.latin1Slice(this._lastPos, i);
      }
    }

    cb();
  }

  _final(cb) {
    if (this._byte !== -2)
      return cb(new Error('Malformed urlencoded form'));
    if (!this._inKey || this._bytesKey > 0 || this._bytesVal > 0) {
      if (this._inKey)
        this._key = this._decoder(this._key, this._encode);
      else
        this._val = this._decoder(this._val, this._encode);
      this.emit(
        'field',
        this._key,
        this._val,
        { nameTruncated: this._keyTrunc,
          valueTruncated: this._valTrunc,
          encoding: this.charset,
          mimeType: 'text/plain' }
      );
    }
    cb();
  }
}

function readPctEnc(self, chunk, pos, len) {
  if (pos >= len)
    return len;

  if (self._byte === -1) {
    // We saw a '%' but no hex characters yet
    const hexUpper = HEX_VALUES[chunk[pos++]];
    if (hexUpper === -1)
      return -1;

    if (hexUpper >= 8)
      self._encode = 2; // Indicate high bits detected

    if (pos < len) {
      // Both hex characters are in this chunk
      const hexLower = HEX_VALUES[chunk[pos++]];
      if (hexLower === -1)
        return -1;

      if (self._inKey)
        self._key += String.fromCharCode((hexUpper << 4) + hexLower);
      else
        self._val += String.fromCharCode((hexUpper << 4) + hexLower);

      self._byte = -2;
      self._lastPos = pos;
    } else {
      // Only one hex character was available in this chunk
      self._byte = hexUpper;
    }
  } else {
    // We saw only one hex character so far
    const hexLower = HEX_VALUES[chunk[pos++]];
    if (hexLower === -1)
      return -1;

    if (self._inKey)
      self._key += String.fromCharCode((self._byte << 4) + hexLower);
    else
      self._val += String.fromCharCode((self._byte << 4) + hexLower);

    self._byte = -2;
    self._lastPos = pos;
  }

  return pos;
}

function skipKeyBytes(self, chunk, pos, len) {
  // Skip bytes if we've truncated
  if (self._bytesKey > self.fieldNameSizeLimit) {
    if (!self._keyTrunc) {
      if (self._lastPos < pos)
        self._key += chunk.latin1Slice(self._lastPos, pos - 1);
    }
    self._keyTrunc = true;
    for (; pos < len; ++pos) {
      const code = chunk[pos];
      if (code === 61/* '=' */ || code === 38/* '&' */)
        break;
      ++self._bytesKey;
    }
    self._lastPos = pos;
  }

  return pos;
}

function skipValBytes(self, chunk, pos, len) {
  // Skip bytes if we've truncated
  if (self._bytesVal > self.fieldSizeLimit) {
    if (!self._valTrunc) {
      if (self._lastPos < pos)
        self._val += chunk.latin1Slice(self._lastPos, pos - 1);
    }
    self._valTrunc = true;
    for (; pos < len; ++pos) {
      if (chunk[pos] === 38/* '&' */)
        break;
      ++self._bytesVal;
    }
    self._lastPos = pos;
  }

  return pos;
}

/* eslint-disable no-multi-spaces */
const HEX_VALUES = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1,
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];
/* eslint-enable no-multi-spaces */

module.exports = URLEncoded;
