/**
 * A base class for Plugins.
 */
export default class PluginBase {
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
