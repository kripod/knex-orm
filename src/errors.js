class ExtendableError extends Error {
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
export class DbObjectAlreadyRegisteredError extends ExtendableError {
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
export class EmptyDbObjectError extends ExtendableError {
  constructor() {
    super('Empty database object cannot be stored');
  }
}

/**
 * An error which gets thrown when an attempt is made to modify an inexistent
 * database object.
 * @extends Error
 */
export class InexistentDbObjectError extends ExtendableError {
  constructor() {
    super('Database object does not exist');
  }
}

/**
 * An error which gets thrown when a Relation does not behave as expected.
 * @extends Error
 */
export class RelationError extends ExtendableError {
  constructor() {
    super('One-to-one and many-to-one Relations cannot be re-assigned');
  }
}
