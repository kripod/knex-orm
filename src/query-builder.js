/** @module knexpress */

const Config = require('./config');

const KNEX_STATE = Symbol();

class QueryBuilder {
  constructor(knex) {
    // Forcefully add return methods
    const props = [
      ...Object.getOwnPropertyNames(knex),
      ...Config.KNEX_RETURN_METHODS,
    ];

    // Inherit the static Knex methods of the corresponding DB table
    for (const property of props) {
      const value = knex[property];

      // console.log(`${property}: ${typeof value}`);
      if (typeof value === 'function') {
        // Check for ignored functions
        if (Config.KNEX_IGNORED_STATIC_METHODS.includes(property)) continue;

        const self = this;

        // Inherit non-ignored functions
        this[property] = function x(...args) {
          // Associate the function's result with the current Knex state
          self[KNEX_STATE] = (self[KNEX_STATE] || knex(this.tableName))
            [property](...args);

          // Return a query result if appropriate
          if (Config.KNEX_RETURN_METHODS.includes(property)) {
            return self[KNEX_STATE];
          }

          // Make methods chainable
          return self;
        };
      }
    }
  }
}

module.exports = QueryBuilder;
