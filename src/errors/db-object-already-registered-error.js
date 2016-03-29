const ExtendableError = require('./extendable-error');

/**
 * An error which gets thrown when an attempt is made to register a database
 * object multiple times.
 * @extends Error
 * @property {string} name Name of the database object in question.
 */
class DbObjectAlreadyRegisteredError extends ExtendableError {
  constructor(name) {
    super(
      `Database object with name '${name}' cannot be registered multiple times`
    );
    this.name = name;
  }
}

module.exports = DbObjectAlreadyRegisteredError;
