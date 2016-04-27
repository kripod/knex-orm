import './model';
import { underscore } from 'inflection';
import { DbObjectAlreadyRegisteredError } from './errors';
import { requireUncached } from './utils';

const DEFAULT_OPTIONS = {
  convertCase: false,
};

/**
 * Entry class for accessing the functionality of Knex-ORM.
 * @property {Object} knex Knex client corresponding to the ORM instance.
 */
export default class KnexOrm {
  /**
   * Creates a new Knex-ORM instance.
   * @param {Object} knex Knex client instance to which database functions shall
   * be bound.
   * @param {Object} [options] Additional options regarding ORM.
   * @param {boolean} [options.convertCase=false] If set to true, then the ORM
   * will handle letter case conversion for properties automatically (between
   * camelCase and snake_case).
   */
  constructor(knex, options) {
    // Initialize private properties
    Object.defineProperty(this, '_models', { value: {} });

    // Store the given Knex client instance and then make it overridable
    this.knex = Object.assign({}, knex);

    // Parse and store options
    this.options = Object.assign(DEFAULT_OPTIONS, options);
    if (this.options.convertCase) {
      const formatterPrototype = this.knex.client.Formatter.prototype;

      // Override a Knex query formatter function by extending it
      ((originalFunction) => {
        formatterPrototype._wrapString = function _wrapString(value) {
          return underscore(originalFunction.call(this, value));
        };
      })(formatterPrototype._wrapString);
    }
  }

  /**
   * Base Model class corresponding to the current ORM instance.
   * @type {Model}
   */
  get Model() {
    if (!this._model) {
      // Clone the original class
      this._model = requireUncached('./model');
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
    if (Object.keys(this._models).indexOf(modelName) >= 0) {
      throw new DbObjectAlreadyRegisteredError(modelName);
    }

    this._models[modelName] = model;
    return model;
  }
}
