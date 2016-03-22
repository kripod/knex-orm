const Config = require('./config');

class Model {
  constructor() {
    // TODO: Instance-based methods: update, del, save
  }
}

module.exports = (parent) => {
  const knex = parent.knex;
  Model._parent = parent;

  // Inherit the static Knex methods of the corresponding DB table
  for (const property of Object.getOwnPropertyNames(knex)) {
    const value = knex[property];

    if (typeof value === 'function') {
      // Check for ignored functions
      if (Config.KNEX_IGNORED_STATIC_METHODS.indexOf(property) >= 0) continue;

      // Associate the function with the current object's base Knex state
      Model[property] = function x(args) {
        // In the current context, 'this' refers to a static Model object
        return knex.from(this.tableName)[property](args);
      };
    }
  }

  return Model;
};
