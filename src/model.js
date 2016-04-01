import inflection from 'inflection';
import QueryBuilder from './query-builder';
import Relation from './relation';
import RelationType from './enums/relation-type';
import EmptyDbObjectError from './errors/empty-db-object-error';
import InexistentDbObjectError from './errors/inexistent-db-object-error';

/**
 * Base Model class which shall be extended by the attributes of a database
 * object.
 */
export default class Model extends QueryBuilder {
  /**
   * Case-sensitive name of the database table which corresponds to the Model.
   * @type {string}
   */
  static get tableName() {
    return inflection.pluralize(inflection.underscore(this.name));
  }

  /**
   * ID attribute, which is used as the primary key of the Model.
   * @type {string}
   */
  static get idAttribute() { return 'id'; }

  /**
   * Creates a new Model instance.
   * @param {Object} props Initial properties of the instance.
   */
  constructor(props) {
    super();

    // Set the initial properties of the instance
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }

    // Initialize a store for old properties of the instance
    Object.defineProperty(this, '_oldProps', {
      writable: true,
      value: [],
    });

    // Initialize a store for related Models
    Object.defineProperty(this, '_related', {
      value: [],
    });
  }

  static hasOne(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_ONE, foreignKey);
  }

  static hasMany(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_MANY, foreignKey);
  }

  static belongsTo(Target, foreignKey) {
    return new Relation(this, Target, RelationType.MANY_TO_ONE, foreignKey);
  }

  /**
   * Queues the deletion of the current Model from the database.
   * @throws {InexistentDbObjectError}
   * @returns {Object} A Knex query object.
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
   * @throws {EmptyDbObjectError}
   * @returns {Object} A Knex query object.
   */
  save() {
    const knexObject = this._getKnexObject();
    const ignorableProps = [this.constructor.idAttribute];
    const updatableProps = {};

    for (const key of Object.keys(this)) {
      // Respect ignorable properties
      if (ignorableProps.includes(key)) continue;

      const oldValue = this._oldProps[key];
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
      this._oldProps[key] = updatableProps[key];
    }

    // Check whether the current instance needs to be given an ID
    if (!knexObject) {
      const knex = this.constructor._parent.knex;
      return knex.from(this.constructor.tableName).insert(updatableProps);
    }

    return knexObject.update(updatableProps);
  }

  _getKnexObject() {
    const idAttribute = this.constructor.idAttribute;
    if (typeof this[idAttribute] === 'undefined') return null;

    const knex = this.constructor._parent.knex;
    return knex.from(this.constructor.tableName)
      .where({ [idAttribute]: this[idAttribute] });
  }
}
