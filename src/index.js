import Config from './config';
import QueryBuilder from './query-builder';
import { DbObjectAlreadyRegisteredError } from './errors';

const DEFAULT_OPTIONS = {
  convertCase: true,
};

// Inherit Knex query methods for the custom query builder
for (const method of Config.KNEX_ALLOWED_QUERY_METHODS) {
  QueryBuilder[method] = function queryMethod(...args) {
    // In the current context, 'this' refers to a static QueryBuilder object
    const qb = new QueryBuilder(this._parent);
    return qb._knexQb[method](...args);
  };
}

/**
 * Entry class for accessing the functionality of Knexpress.
 * @property {Object} knex Knex client corresponding to the ORM instance.
 */
export default class Knexpress {
  /**
   * Creates a new Knexpress ORM instance.
   * @param {Object} knex Knex client instance to which database functions shall
   * be bound.
   * @param {Object} [options] Additional options regarding ORM.
   */
  // TODO:
  // @param {boolean} [options.convertCase=true] If set to true, then the ORM
  // will handle letter case convertion for strings automatically (between
  // camelCase and snake_case).
  constructor(knex, options) {
    // Initialize private properties
    Object.defineProperty(this, '_knex', { writable: true });
    Object.defineProperty(this, '_models', { value: {} });

    // Store the given Knex client instance
    this.knex = knex;

    // Parse and store options
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }

  /**
   * Base Model class corresponding to the current ORM instance.
   * @type {Model}
   */
  get Model() {
    if (!this._model) {
      // Clone the original class
      this._model = this._requireUncached('./model');
      this._model._parent = this;
    }

    return this._model;
  }

  /**
   * Registers a static Model object to the list of database objects.
   * @param {Model} model Model to be registered.
   * @param {string} [name] Name under which the Model shall be registered.
   * @throws {DbObjectAlreadyRegisteredError}
   * @returns {Model} The Model which was registered.
   */
  register(model, name) {
    // Determine the Model's name and then check if it's already registered
    const modelName = name || model.name;
    if (Object.keys(this._models).includes(modelName)) {
      throw new DbObjectAlreadyRegisteredError(modelName);
    }

    this._models[modelName] = model;
    return model;
  }

  _requireUncached(modulePath) {
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath).default;
  }
}
