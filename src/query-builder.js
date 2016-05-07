import Config from './config';
import { flattenArray, modelize } from './utils';

/**
 * Represents a query builder which corresponds to a static Model reference.
 * Inherits every query method of the Knex query builder.
 */
export default class QueryBuilder {
  constructor(StaticModel, modelInstance) {
    this.StaticModel = StaticModel;
    this.modelInstance = modelInstance;

    this.includedRelations = new Set();
    this.knexInstance = StaticModel.knex.from(StaticModel.tableName);
    if (modelInstance) {
      const props = {};
      if (Array.isArray(StaticModel.primaryKey)) {
        // Handle composite primary keys
        for (const prop of StaticModel.primaryKey) {
          props[prop] = modelInstance.oldProps[prop] || modelInstance[prop];
        }
      } else {
        // Handle single primary key
        const prop = StaticModel.primaryKey;
        props[prop] = modelInstance.oldProps[prop] || modelInstance[prop];
      }

      // Filter to the given model instance
      this.knexInstance = this.knexInstance.where(props).first();
    }
  }

  /**
   * Queues fetching the given related Models of the queryable instance(s).
   * @param {...string} props Relation attributes to be fetched.
   * @returns {QueryBuilder}
   */
  withRelated(...props) {
    const relationNames = flattenArray(props);
    const relationEntries = Object.entries(this.StaticModel.related);

    // Filter the given relations by name if necessary
    if (relationNames.length > 0) {
      relationEntries.filter(([name]) => relationNames.indexOf(name) >= 0);
    }

    // Store the filtered relations
    for (const [name, relation] of relationEntries) {
      relation.name = name;
      this.includedRelations.add(relation);
    }

    return this;
  }

  /**
   * Executes the query.
   * @param {Function<Object>} [onFulfilled] Success handler function.
   * @param {Function<Object>} [onRejected] Error handler function.
   * @returns {Promise<Object>}
   */
  then(onFulfilled = () => {}, onRejected = () => {}) {
    // Apply the effect of plugins
    let qb = this;
    for (const plugin of this.StaticModel.plugins) {
      qb = plugin.beforeQuery(qb);
    }

    let result;
    return qb.knexInstance
      .then((res) => {
        const awaitableQueries = [];
        result = res;

        // Convert the result to a specific Model type if necessary
        result = modelize(result, qb.StaticModel);

        // Apply each desired relation to the original result
        for (const relation of qb.includedRelations) {
          awaitableQueries.push(relation.applyAsync(result));
        }

        return Promise.all(awaitableQueries);
      })
      .then(() => {
        // Apply the effect of plugins
        for (const plugin of qb.StaticModel.plugins) {
          result = plugin.afterQuery(result);
        }

        return result;
      })
      .then(onFulfilled, onRejected);
  }

  /**
   * Gets the list of raw queries to be executed, joined by a string separator.
   * @param {string} [separator=\n] Separator string to be used for joining
   * multiple raw query strings.
   * @returns {string}
   */
  toString(separator = '\n') {
    // Apply the effect of plugins
    let qb = this;
    for (const plugin of this.StaticModel.plugins) {
      qb = plugin.beforeQuery(qb);
    }

    // Return a list of query strings to be executed, including Relations
    const result = [qb.knexInstance.toString()];
    for (const relation of qb.includedRelations) {
      // Create the relation query with an empty array of Models
      result.push(relation.createQuery([]).toString());
    }

    return result.join(separator);
  }
}

// Inherit Knex query methods
for (const method of Config.KNEX_ALLOWED_QUERY_METHODS) {
  QueryBuilder.prototype[method] = function queryMethod(...args) {
    // Update Knex state
    this.knexInstance = this.knexInstance[method](...args);
    return this;
  };
}
