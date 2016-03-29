const ExtendableError = require('./extendable-error');

/**
 * An error which gets thrown when an attempt is made to store an empty database
 * object.
 * @extends Error
 */
class EmptyDbObjectError extends ExtendableError {
  constructor() {
    super('Empty database object cannot be stored');
  }
}

module.exports = EmptyDbObjectError;
