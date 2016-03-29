class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;

    this.stack = (new Error(message)).stack;
  }
}

module.exports = ExtendableError;
