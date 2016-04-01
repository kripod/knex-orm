const knexExtensions = require('./knex-extensions');
const modelFactory = require('./model-factory');
const DbObjectAlreadyRegisteredError =
  require('./errors/db-object-already-registered-error');

const DEFAULT_OPTIONS = {
  convertCase: true,
};

/**
 * Entry class for accessing the functionality of Knexpress.
 * @property {Object} knex Knex client corresponding to the ORM instance.
 */
class Knexpress {
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

    // Initialize the given Knex client instance
    this.knex = knex;

    // Parse and store options
    this.options = Object.assign(DEFAULT_OPTIONS, options);
  }

  get knex() {
    return this._knex;
  }

  set knex(value) {
    // Create a shallow copy of the Knex client and extend its methods
    this._knex = Object.assign({}, value, knexExtensions);
    this._knex.client.QueryBuilder.prototype = Object.assign(
      value.client.QueryBuilder.prototype,
      knexExtensions
    );

    // Override the client's query function to add support for relations
    const queryFn = this._knex.client.query;
    this._knex.client.query = function query(connection, obj) {
      return queryFn(connection, obj)
        .then((mainResult) => {
          // Wait for additional queries if necessary
          const queries = [];

          const relations = this._customProps.withRelated;
          for (const relationName of Object.keys(relations)) {
            const relation = relations[relationName];

            queries.push(
              queryFn(connection, relation.toQueryObj())
                .then((relatedResult) => {
                  const relatedModels = Array.isArray(relatedResult) ?
                    relatedResult :
                    [relatedResult];

                  const mainModels = Array.isArray(mainResult) ?
                    mainResult :
                    [mainResult];

                  // Pair related results with their parents
                  for (const relatedModel of relatedModels) {
                    /* mainModels.filter((mainModel) => {

                    });
                    mainModel[relationName] = relatedModel; */
                  }
                })
            );
          }

          if (Array.isArray(mainResult)) {
            
          }
        });
    };
  }

  /**
   * Base Model class corresponding to the current ORM instance.
   * @type {Model}
   */
  get Model() {
    return modelFactory(this);
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
}

module.exports = Knexpress;
