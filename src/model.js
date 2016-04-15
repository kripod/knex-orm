import { tableize } from 'inflection';
import QueryBuilder from './query-builder';
import Relation from './relation';
import RelationType from './enums/relation-type';
import { EmptyDbObjectError, InexistentDbObjectError } from './errors';

/**
 * Base Model class which shall be extended by the attributes of a database
 * object.
 */
export default class Model {
  /**
   * Case-sensitive name of the database table which corresponds to the Model.
   * @type {string}
   */
  static get tableName() { return tableize(this.name); }

  /**
   * ID attribute, which is used as the primary key of the Model.
   * @type {string}
   */
  static get idAttribute() { return 'id'; }

  /**
   * Creates a new Model instance.
   * @param {Object} [props={}] Initial properties of the instance.
   * @param {boolean} [isNew=true] Determines whether the "props" of the
   * instance are considered new.
   */
  constructor(props = {}, isNew = true) {
    // Set the initial properties of the instance
    for (const key of Object.keys(props)) {
      this[key] = props[key];
    }

    // Initialize a store for old properties of the instance
    Object.defineProperty(this, '_oldProps', {
      writable: true,
      value: isNew ? {} : Object.assign({}, props),
    });
  }

  /**
   * Returns a new QueryBuilder instance which corresponds to the current Model.
   * @returns {QueryBuilder}
   */
  static query() {
    return new QueryBuilder(this);
  }

  /**
   * Creates a one-to-one relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in the target Model.
   * @returns {Relation}
   */
  static hasOne(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_ONE, foreignKey);
  }

  /**
   * Creates a one-to-many relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in the target Model.
   * @returns {Relation}
   */
  static hasMany(Target, foreignKey) {
    return new Relation(this, Target, RelationType.ONE_TO_MANY, foreignKey);
  }

  /**
   * Creates a many-to-one relation between the current Model and a target.
   * @param {string|Model} Target Name or static reference to the joinable
   * table's Model.
   * @param {string} [foreignKey] Foreign key in this Model.
   * @returns {Relation}
   */
  static belongsTo(Target, foreignKey) {
    return new Relation(this, Target, RelationType.MANY_TO_ONE, foreignKey);
  }

  /**
   * Fetches the given related Models of the current instance.
   * @param {...string} props Relation attributes to be fetched.
   * @returns {QueryBuilder}
   */
  fetchRelated(...props) {
    const qb = this._getQueryBuilder();
    if (!qb) throw new InexistentDbObjectError();

    return qb.withRelated(...props);
  }

  /**
   * Queues the deletion of the current Model from the database.
   * @throws {InexistentDbObjectError}
   * @returns {QueryBuilder}
   */
  del() {
    const qb = this._getQueryBuilder();
    if (!qb) throw new InexistentDbObjectError();

    return qb.del();
  }

  /**
   * Queues saving (creating or updating) the current Model in the database.
   * If the 'idAttribute' of the current instance is set, then this method
   * queues an update query based on it. Otherwise, a new Model gets inserted
   * into the database.
   * @throws {EmptyDbObjectError}
   * @returns {QueryBuilder}
   */
  save() {
    const qb = this._getQueryBuilder();
    const ignorableProps = [this.constructor.idAttribute];
    const updatableProps = {};

    for (const key of Object.keys(this)) {
      // Respect ignorable properties
      if (ignorableProps.indexOf(key) >= 0) continue;

      const oldValue = this._oldProps[key];
      const newValue = this[key];

      // New and modified properties must be updated
      if (typeof oldValue === 'undefined' || newValue !== oldValue) {
        updatableProps[key] = newValue;
      }
    }

    // Don't run unnecessary queries
    if (Object.keys(updatableProps).length === 0) {
      if (!qb) {
        throw new EmptyDbObjectError();
      }

      return qb;
    }

    // Update the Model's old properties with the new ones
    for (const key of Object.keys(updatableProps)) {
      this._oldProps[key] = updatableProps[key];
    }

    // Check whether the current instance needs to be given an ID
    if (!qb) {
      return this.constructor.query().insert(updatableProps);
    }

    return qb.update(updatableProps);
  }

  /**
   * @returns {?QueryBuilder}
   * @private
   */
  _getQueryBuilder() {
    const idAttribute = this.constructor.idAttribute;
    if (typeof this[idAttribute] === 'undefined') return null;

    return this.constructor.query()
      .where({ [idAttribute]: this[idAttribute] });
  }
}
