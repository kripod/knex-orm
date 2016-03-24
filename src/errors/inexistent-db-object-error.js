const ExtendableError = require('./extendable-error');

class InexistentDbObjectError extends ExtendableError {
  constructor() {
    super('Database object does not exist');
  }
}

module.exports = InexistentDbObjectError;
