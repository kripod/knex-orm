/**
 * A base class for Plugins.
 */
export default class PluginBase {
  /**
   * Creates a new plugin instance with the given options.
   * @param {Object} [options] Options to be used for the plugin.
   * @param {boolean} [options.beforeQuery=true] Set to false to disable the
   * execution of the 'beforeQuery' function.
   * @param {boolean} [options.afterQuery=true] Set to false to disable the
   * execution of the 'afterQuery' function.
   */
  constructor(options = {}) {
    const defaultOptions = {
      beforeQuery: true,
      afterQuery: true,
    };

    Object.assign(this.options, defaultOptions, options);
  }

  /**
   * Initializes the plugin.
   * @param {ModelBase} BaseModel Base Model class of the plugin's corresponding
   * ORM instance.
   * @returns {PluginBase} The current plugin after initialization.
   */
  /* eslint-disable no-unused-vars */
  init(BaseModel) { return this; }

  /**
   * A function which triggers before query execution.
   * @param {QueryBuilder} qb QueryBuilder which corresponds to the query.
   * @returns {QueryBuilder} The modified QueryBuilder instance.
   */
  beforeQuery(qb) { return qb; }

  /**
   * A function which triggers after query execution, but before returning a
   * response object.
   * @param {Object} res Response object which can be modified.
   * @returns {Object} The modified response object.
   */
  afterQuery(res) { return res; }
}
