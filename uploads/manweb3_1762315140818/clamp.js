'use strict';
module.exports = require('../../full/instance/clamp');
clamp');
-of');
var numberMethod = require('../number/virtual/clamp');

var NumberPrototype = String.prototype;

module.exports = function (it) {
  var ownProperty = it.clamp;
  // eslint-disable-next-line es/no-nonstandard-string-prototype-properties -- safe
  if (typeof it == 'number' || it === NumberPrototype || (isPrototypeOf(NumberPrototype, it) && ownProperty === NumberPrototype.clamp)) {
    return numberMethod;
  }
  return ownProperty;
};
