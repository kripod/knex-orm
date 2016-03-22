const Config = require('./config');

class Model {
  static get idAttribute() { return 'id'; }

  constructor(props) {
    // Set the initial properties of the instance
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }

    // Store the initial properties of the instance
    this._oldProps = props;
  }

  del() {
    return this._getKnexObject().del();
  }

  save() {
    const updatableProps = {};

    for (const key of Object.keys(this)) {
      // Ignore private properties
      if (key[0] === '_') continue;

      const oldValue = this._oldProps[key];
      const newValue = this[key];

      // New and modified properties must be updated
      if (typeof oldValue === undefined || newValue !== oldValue) {
        updatableProps[key] = newValue;
      }
    }

    // Don't run unnecessary queries
    if (Object.keys(updatableProps).length === 0) {
      return new Promise((resolve) => resolve(this));
    }

    return this._getKnexObject()
      .update(updatableProps)
      .then(() => {
        // Update the Model's old properties with the new ones
        for (const key of Object.keys(updatableProps)) {
          this._oldProps[key] = updatableProps[key];
        }

        return this;
      });
  }

  _getKnexObject() {
    const knex = this.constructor._parent.knex;
    const idAttribute = this.constructor.idAttribute;

    return knex(this.constructor.tableName)
      .where({ [idAttribute]: this[idAttribute] });
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
