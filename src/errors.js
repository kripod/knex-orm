import ErrorBase from 'es6-error';

/**
 * An error which gets thrown when an attempt is made to register a Model
 * multiple times.
 */
export class DuplicateModelError extends ErrorBase {
  /**
   * Name of the Model in question.
   * @type {string}
   * @memberof DuplicateModelError
   * @instance
   */
  name;

  constructor(name) {
    super(`Model with name '${name}' cannot be registered multiple times`);
    this.name = name;
  }
}

/**
 * An error which gets thrown when an attempt is made to store an empty Model.
 */
export class EmptyModelError extends ErrorBase {
  constructor() {
    super('Empty Model cannot be stored');
  }
}

/**
 * An error which gets thrown when a Relation does not behave as expected.
 */
export class RelationError extends ErrorBase {
  constructor() {
    super('One-to-one and many-to-one Relations cannot be re-assigned');
  }
}

/**
 * An error which gets thrown when an attempt is made to modify a Model instance
 * without specifying its primary key.
 */
export class UnidentifiedModelError extends ErrorBase {
  constructor() {
    super('Model cannot be identified without specifying primary key value(s)');
  }
}

/**
 * An error which gets thrown when a Model cannot be successfully validated
 * against its JSON Schema.
 */
export class ValidationError extends ErrorBase {
  /**
   * Detailed information about why the validation has failed.
   * @type {?Object}
   * @memberof ValidationError
   * @instance
   */
  data;

  constructor(data) {
    super('Model could not be successfully validated against its JSON Schema');
    this.data = data;
  }
}
