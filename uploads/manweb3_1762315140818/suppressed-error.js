'use strict';
var parent = require('../stable/suppressed-error');
require('../modules/esnext.suppressed-error.constructor');

module.exports = parent;
r path = require('../internals/path');

module.exports = path.SuppressedError;
