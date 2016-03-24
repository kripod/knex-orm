const ExtendableError = require('./extendable-error');

class EmptyDbObjectError extends ExtendableError {
  constructor() {
    super('Empty database object cannot be stored');
  }
}

module.exports = EmptyDbObjectError;
