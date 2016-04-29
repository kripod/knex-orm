class ErrorBase extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = this.constructor.name;

    this.stack = (new Error(message)).stack;
  }
}

/**
 * An error which gets thrown when an attempt is made to register a database
 * object multiple times.
 * @extends Error
 * @property {string} name Name of the database object in question.
 */
export class DbObjectAlreadyRegisteredError extends ErrorBase {
  constructor(name) {
    super(
      `Database object with name '${name}' cannot be registered multiple times`
    );
    this.name = name;
  }
}

/**
 * An error which gets thrown when an attempt is made to store an empty database
 * object.
 * @extends Error
 */
export class EmptyDbObjectError extends ErrorBase {
  constructor() {
    super('Empty database object cannot be stored');
  }
}

/**
 * An error which gets thrown when an attempt is made to modify an inexistent
 * database object.
 * @extends Error
 */
export class InexistentDbObjectError extends ErrorBase {
  constructor() {
    super('Database object does not exist');
  }
}

/**
 * An error which gets thrown when a Relation does not behave as expected.
 * @extends Error
 */
export class RelationError extends ErrorBase {
  constructor() {
    super('One-to-one and many-to-one Relations cannot be re-assigned');
  }
}

/**
 * An error which gets thrown when a Model cannot be successfully validated
 * against its JSON Schema.
 * @extends Error
 * @property {?Object} data Detailed information about why the validation has
 * failed.
 */
export class ValidationError extends ErrorBase {
  constructor(data) {
    super('Model could not be successfully validated against its JSON Schema');
    this.data = data;
  }
}
