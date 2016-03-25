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
    this.knex = knex;

    this.options = {
      convertCase: (options || {}).convertCase || true,
    };
  }

  /**
   * Base Model class corresponding to the current ORM instance.
   * @type Model
   */
  get Model() {
    return modelFactory(this);
  }
}

module.exports = Knexpress;
