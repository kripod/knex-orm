import { tableize } from 'inflection';
import QueryBuilder from './query-builder';
import Relation from './relation';
import RelationType from './enums/relation-type';
import { EmptyDbObjectError, InexistentDbObjectError } from './errors';

/**
 * Base Model class which should be used as an extension for database entities.
 */
export default class Model {
  /**
   * Case-sensitive name of the database table which corresponds to the Model.
   * @type {string}
   */
  static get tableName() { return tableize(this.name); }

  /**
   * Primary key of the Model, used for instance identification.
   * @type {string}
   */
  static get primaryKey() { return 'id'; }

  /**
   * The blacklist takes precedence over any whitelist rule.
   */
  static get whitelistedProps() { return []; }

  static get blacklistedProps() { return []; }

  /**
   * @deprecated Use 'primaryKey' instead.
   */
  static get idAttribute() { return this.primaryKey; }

  /**
   * Creates a new Model instance.
   * @param {Object} [props={}] Initial properties of the instance.
   * @param {boolean} [isNew=true] True if the instance is not yet stored
   * persistently in the database.
   */
  constructor(props = {}, isNew = true) {
    // Set the initial properties of the instance
    Object.assign(this, props);
    Object.defineProperty(this, '_isNew', { value: isNew });

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
   * Queues fetching the given related Models of the current instance.
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
    const changedProps = {};

    // By default, save only the whitelisted properties, but if none is present,
    // then save every property. Use the blacklist for filtering the results.
    const savablePropNames = (
      this.constructor.whitelistedProps.length > 0 ?
      this.constructor.whitelistedProps :
      Object.keys(this)
    ).filter((propName) =>
      this.constructor.blacklistedProps.indexOf(propName) < 0
    );

    for (const propName of savablePropNames) {
      const oldValue = this._oldProps[propName];
      const newValue = this[propName];

      // New and modified properties must be updated
      if (typeof oldValue === 'undefined' || newValue !== oldValue) {
        changedProps[propName] = newValue;
      }
    }

    // Don't run unnecessary queries
    if (Object.keys(changedProps).length === 0) {
      if (!qb) throw new EmptyDbObjectError();

      return qb;
    }

    // Update the Model's old properties with the new ones
    Object.assign(this._oldProps, changedProps);

    // Insert or update the current instance in the database
    return qb ?
      qb.update(changedProps) :
      this.constructor.query().insert(changedProps);
  }

  /**
   * @returns {?QueryBuilder}
   * @private
   */
  _getQueryBuilder() {
    if (this._isNew) return null;

    const primaryKey = this.constructor.primaryKey;
    return this.constructor.query()
      .where({ [primaryKey]: this[primaryKey] })
      .first();
  }
}
