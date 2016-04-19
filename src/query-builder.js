import Config from './config';
import { camelizeKeys, flattenArray, modelize } from './utils';

/**
 * Represents a query builder which corresponds to a static Model reference.
 * Inherits every query method of the Knex query builder.
 */
export default class QueryBuilder {
  constructor(Model) {
    this.Model = Model;

    Object.defineProperty(this, '_knexQb', {
      writable: true,
      value: Model._parent.knex.from(Model.tableName),
    });

    Object.defineProperty(this, '_relations', { value: new Set() });
  }

  /**
   * Queues fetching the given related Models of the queryable instance(s).
   * @param {...string} props Relation attributes to be fetched.
   * @returns {QueryBuilder}
   */
  withRelated(...props) {
    const relationNames = flattenArray(props);
    const relationEntries = Object.entries(this.Model.related);

    // Filter the given relations by name if necessary
    if (relationNames.length > 0) {
      relationEntries.filter(([name]) => relationNames.indexOf(name) >= 0);
    }

    // Store the filtered relations
    for (const [name, relation] of relationEntries) {
      relation.name = name;
      this._relations.add(relation);
    }

    return this;
  }

  /**
   * Executes the query as a Promise.
   * @param {...Function} callbacks Callbacks to be passed to Promise.then().
   * @returns {Promise}
   */
  then(...callbacks) {
    let result;

    return this._knexQb
      .then((res) => {
        const awaitableQueries = [];
        result = res;

        // Apply letter case conversion if needed
        if (this.Model._parent.options.convertCase) {
          result = camelizeKeys(result);
        }

        // Convert the result to a specific Model type if necessary
        result = modelize(result, this.Model);

        // Apply each desired relation to the original result
        for (const relation of this._relations) {
          awaitableQueries.push(relation.applyAsync(result));
        }

        return Promise.all(awaitableQueries);
      })
      .then(() => result)
      .then(...callbacks);
  }

  /**
   * Gets the list of raw queries to be executed, joined by a string separator.
   * @param {string} [separator=\n] Separator string to be used for joining
   * multiple raw query strings.
   * @returns {string}
   */
  toString(separator = '\n') {
    // Return a list of query strings to be executed, including Relations
    const result = [this._knexQb.toString()];
    for (const relation of this._relations) {
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
    this._knexQb = this._knexQb[method](...args);
    return this;
  };
}
