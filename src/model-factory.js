/** @module knexpress */

const snakeCase = require('lodash.snakecase');
const pluralize = require('pluralize');
const QueryBuilder = require('./query-builder');
const EmptyDbObjectError = require('./errors/empty-db-object-error');
const InexistentDbObjectError = require('./errors/inexistent-db-object-error');

const OLD_PROPS = Symbol();

/**
 * Base Model class which shall be extended by the attributes of a database
 * object.
 */
class Model {
  /**
   * Case-sensitive name of the database table which corresponds to the Model.
   * @type string
   */
  static get tableName() { return pluralize(snakeCase(this.name)); }

  /**
   * ID attribute, which is used as the primary key of the Model.
   * @type string
   */
  static get idAttribute() { return 'id'; }

  /**
   * Creates a new Model instance.
   * @property {Object} props Initial properties of the instance.
   */
  constructor(props) {
    // Set the initial properties of the instance
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }

    // Initialize a store for old properties of the instance
    this[OLD_PROPS] = [];
  }

  /**
   * Queues the deletion of the current Model from the database.
   */
  del() {
    const knexObject = this._getKnexObject();

    if (!knexObject) {
      throw new InexistentDbObjectError();
    }

    return knexObject.del();
  }

  /**
   * Queues saving (creating or updating) the current Model in the database.
   * If the 'idAttribute' of the current instance is set, then this method
   * queues an update query based on it. Otherwise, a new Model gets inserted
   * into the database.
   */
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
  Model._parent = parent;

  // Extend the static model with query builder functionality
  return Object.assign(Model, new QueryBuilder(parent.knex));
};
