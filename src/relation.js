import { camelize, underscore } from 'inflection';
import RelationType from './enums/relation-type';
import { RelationError } from './errors';
import { flattenArray } from './utils';

/**
 * Represents a relation between Models.
 * @property {Model} origin Static Model object which shall be joined with the
 * target.
 * @property {Model} target Static Model object which corresponds to the origin.
 * @property {RelationType} type Type of the relation between 'origin' and
 * 'target'.
 * @property {string} foreignKey The attribute which points to the primary key
 * (ID attribute) of the joinable database table.
 * @private
 */
export default class Relation {
  constructor(Origin, Target, type, foreignKey) {
    this.origin = Origin;

    // Get the target's registered Model if target is a string
    const modelRegistry = Origin.registry;
    this.target = typeof Target === 'string' ? modelRegistry[Target] : Target;

    this.type = type;
    this._foreignKey = foreignKey;
  }

  get foreignKey() {
    if (!this._foreignKey) {
      // Set the foreign key deterministically
      this._foreignKey = this.type === RelationType.MANY_TO_ONE ?
        `${underscore(this.target.name)}_id` :
        `${underscore(this.origin.name)}_id`;

      // TODO: Handle case conversion properly
      /*
      if (this.origin._parent.options.convertCase) {
        this._foreignKey = camelize(this._foreignKey, true);
      }
      */
    }

    return this._foreignKey;
  }

  get originAttribute() {
    const result = this.type === RelationType.MANY_TO_ONE ?
      this.target.primaryKey :
      this.foreignKey;

    return result;

    // TODO: Handle case conversion properly
    /*
    return this.origin._parent.options.convertCase ?
      camelize(result, true) :
      result;
    */
  }

  get targetAttribute() {
    const result = this.type === RelationType.MANY_TO_ONE ?
      this.foreignKey :
      this.origin.primaryKey;

    return result;

    // TODO: Handle case conversion properly
    /*
    return this.origin._parent.options.convertCase ?
      camelize(result, true) :
      result;
    */
  }

  /**
   * Creates a query based on the given origin Model instances.
   * @param {Object[]} originInstances Origin Model instances.
   * @returns {QueryBuilder}
   */
  createQuery(originInstances) {
    const originAttribute = this.originAttribute;
    const targetAttribute = this.targetAttribute;

    return this.target.query()
      .whereIn(
        originAttribute,
        originInstances.length > 0 ? // Pass a mock value if necessary
          originInstances.map((model) => model[targetAttribute]) :
          [`originInstance.${targetAttribute}`]
      );
  }

  /**
   * Applies the relation by executing subqueries on the origin Model instances.
   * @param {...Object} originInstances Origin Model instances.
   * @throws {RelationError}
   * @returns {Promise}
   */
  applyAsync(...originInstances) {
    const models = flattenArray(originInstances);
    const originAttribute = this.originAttribute;
    const targetAttribute = this.targetAttribute;

    // Create and then execute the query, handling Model bindings
    return this.createQuery(models)
      .then((relatedModels) => {
        for (const relatedModel of relatedModels) {
          // Pair up the related Model with its origin
          const foreignValue = relatedModel[originAttribute];
          const origin = models.find((model) =>
            model[targetAttribute] === foreignValue
          );

          if (origin) {
            if (typeof origin[this.name] === 'undefined') {
              // Initially set the origin's related property
              if (this.type === RelationType.ONE_TO_MANY) {
                origin[this.name] = [relatedModel];
              } else {
                origin[this.name] = relatedModel;
              }
            } else {
              // Modify the origin's related property if possible
              if (this.type === RelationType.ONE_TO_MANY) {
                origin[this.name].push(relatedModel);
              } else {
                throw new RelationError();
              }
            }
          }
        }
      });
  }
}
