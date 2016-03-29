const ExtendableError = require('./extendable-error');

/**
 * An error which gets thrown when an attempt is made to modify an inexistent
 * database object.
 * @extends Error
 */
class InexistentDbObjectError extends ExtendableError {
  constructor() {
    super('Database object does not exist');
  }
}

module.exports = InexistentDbObjectError;
