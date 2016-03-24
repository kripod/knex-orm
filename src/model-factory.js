const _ = require('lodash');
const pluralize = require('pluralize');
const Config = require('./config');
const EmptyDbObjectError = require('./errors/empty-db-object-error');
const InexistentDbObjectError = require('./errors/inexistent-db-object-error');

const OLD_PROPS = Symbol();

class Model {
  static get tableName() { return pluralize(_.snakeCase(this.name)); }
  static get idAttribute() { return 'id'; }

  constructor(props) {
    // Set the initial properties of the instance
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }

    // Initialize a store for old properties of the instance
    this[OLD_PROPS] = [];
  }

  del() {
    const knexObject = this._getKnexObject();

    if (!knexObject) {
      throw new InexistentDbObjectError();
    }

    return knexObject.del();
  }

  save() {
    const knexObject = this._getKnexObject();
    const ignorableProps = [this.constructor.idAttribute];
    const updatableProps = {};

    for (const key of Object.keys(this)) {
      // Respect ignorable properties
      if (ignorableProps.includes(key)) continue;

      const oldValue = this[OLD_PROPS][key];
      const newValue = this[key];

      // New and modified properties must be updated
      if (typeof oldValue === 'undefined' || newValue !== oldValue) {
        updatableProps[key] = newValue;
      }
    }

    // Don't run unnecessary queries
    if (Object.keys(updatableProps).length === 0) {
      if (!knexObject) {
        throw new EmptyDbObjectError();
      }

      return knexObject;
    }

    // Update the Model's old properties with the new ones
    for (const key of Object.keys(updatableProps)) {
      this[OLD_PROPS][key] = updatableProps[key];
    }

    // Check whether the current instance needs to be given an ID
    if (!knexObject) {
      const knex = this.constructor._parent.knex;
      return knex(this.constructor.tableName).insert(updatableProps);
    }

    return knexObject.update(updatableProps);
  }

  _getKnexObject() {
    const idAttribute = this.constructor.idAttribute;
    if (typeof this[idAttribute] === 'undefined') return null;

    const knex = this.constructor._parent.knex;
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
      if (Config.KNEX_IGNORED_STATIC_METHODS.includes(property)) continue;

      // Associate the function with the current object's base Knex state
      Model[property] = function x(...args) {
        // In the current context, 'this' refers to a static Model object
        return knex(this.tableName)[property](...args);
      };
    }
  }

  return Model;
};
