const Config = require('./config');

class Model {
  constructor() {
    // TODO: Instance-based methods: update, save
  }

  static get idAttribute() {
    return 'id';
  }

  del() {
    const knex = this.constructor._parent.knex;
    const idAttribute = this.constructor.idAttribute;

    return knex(this.constructor.tableName)
      .where({ [idAttribute]: this[idAttribute] })
      .del();
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
      Model[property] = function x() {
        // In the current context, 'this' refers to a static Model object
        const fn = knex(this.tableName);
        return fn[property].apply(fn, arguments);
      };
    }
  }

  return Model;
};
