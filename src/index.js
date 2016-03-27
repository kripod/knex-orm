/** @module knexpress */

const modelFactory = require('./model-factory');

/**
 * Entry class for accessing the functionality of Knexpress.
 */
class Knexpress {
  /**
   * Creates a new Knexpress ORM instance.
   * @property {Object} knex Knex client instance to which database functions
   * shall be bound.
   * @property {Object} [options] Additional options regarding ORM.
   */
  // TODO:
  // @property {boolean} [options.convertCase=true] If set to true, then the ORM
  // will handle letter case convertion for strings automatically (between
  // camelCase and snake_case).
  constructor(knex, options) {
    // Create a deep copy of the Knex client to make its methods alterable
    this.knex = Object.assign({}, knex);

    this.options = Object.assign(
      {
        // Defaults
        convertCase: true,
      },
      options
    );

    // Initialize Model registry
    Object.defineProperty(this, '_Models', {
      value: {},
    });
  }

  /**
   * Base Model class corresponding to the current ORM instance.
   * @type Model
   */
  get Model() {
    return modelFactory(this);
  }

  /**
   * Registers a static Model object to the list of database objects.
   * @property {Model} Model Model to be registered.
   * @property {string} [name] Name under which the Model shall be registered.
   */
  register(Model, name) {
    this._Models[name || Model.tableName] = Model;
  }
}

module.exports = Knexpress;
