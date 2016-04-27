/* eslint-disable */

var nodeVersion = parseInt(process.versions.node.split('.')[0], 10);

if (nodeVersion >= 6) {
  // Use the untranspiled ES6 code
  module.exports = require('./lib');
} else {
  // Use the transpiled ES5 code
  module.exports = require('./legacy');
}
