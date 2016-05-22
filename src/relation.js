import { underscore } from 'inflection';
import RelationType from './enums/relation-type';
import { RelationError } from './errors';
import { flattenArray } from './utils';

/**
 * Represents a relation between Models.
 * @private
 */
export default class Relation {
  /**
   * Static Model object which shall be joined with the target.
   * @type {Model}
   * @memberof Relation
   * @instance
   */
  Origin;

  /**
   * Static Model object which corresponds to the origin.
   * @type {Model}
   * @memberof Relation
   * @instance
   */
  Target;

  /**
   * Type of the relation between Origin and Target.
   * @type {RelationType}
   * @memberof Relation
   * @instance
   */
  type;

  /**
   * Name of the Relation.
   * @type {string}
   * @memberof Relation
   * @instance
   */
  name;

  constructor(Origin, Target, type, foreignKey) {
    this.Origin = Origin;

    // Get the target's registered Model if target is a string
    const modelRegistry = Origin.registry;
    this.Target = typeof Target === 'string' ? modelRegistry[Target] : Target;

    this.type = type;
    if (foreignKey) this.foreignKey = foreignKey;
  }

  /**
   * The attribute which points to the primary key of the joinable database
   * table.
   * @type {string}
   */
  get foreignKey() {
    // Set the foreign key deterministically
    return this.isTypeFromOne ?
      `${underscore(this.Origin.name)}_id` :
      `${underscore(this.Target.name)}_id`;
  }

  get OriginAttribute() {
    return this.isTypeFromOne ?
      this.foreignKey :
      this.Target.primaryKey;
  }

  get TargetAttribute() {
    return this.isTypeFromOne ?
      this.Origin.primaryKey :
      this.foreignKey;
  }

  get isTypeFromOne() {
    return [
      RelationType.MANY_TO_ONE,
      RelationType.MANY_TO_MANY,
    ].indexOf(this.type) < 0;
  }

  /**
   * Creates a many-to-many Relation from a one-to many Relation.
   * @param {string|Model} Interim Name or static reference to the pivot Model.
   * @param {string} [foreignKey] Foreign key in this Model.
   * @param {string} [otherKey] Foreign key in the Interim Model.
   * @returns {Relation}
   */
  through(Interim, foreignKey, otherKey) { // eslint-disable-line
    // TODO
    return this;
  }

  /**
   * Creates a query based on the given origin Model instances.
   * @param {Object[]} originInstances Origin Model instances.
   * @returns {QueryBuilder}
   */
  createQuery(originInstances) {
    const { OriginAttribute, TargetAttribute } = this;

    return this.Target.query()
      .whereIn(
        OriginAttribute,
        originInstances.length > 0 ? // Pass a mock value if necessary
          originInstances.map((model) => model[TargetAttribute]) :
          [`originInstance.${TargetAttribute}`]
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
    const { OriginAttribute, TargetAttribute } = this;

    // Create and then execute the query, handling Model bindings
    return this.createQuery(models)
      .then((relatedModels) => {
        for (const relatedModel of relatedModels) {
          // Pair up the related Model with its origin
          const foreignValue = relatedModel[OriginAttribute];
          const originInstance = models.find((model) =>
            model[TargetAttribute] === foreignValue
          );

          if (originInstance) {
            if (originInstance[this.name] === undefined) {
              // Initially set the origin's related property
              if (this.type === RelationType.ONE_TO_MANY) {
                originInstance[this.name] = [relatedModel];
              } else {
                originInstance[this.name] = relatedModel;
              }
            } else {
              // Modify the origin instance's related property if possible
              if (this.type === RelationType.ONE_TO_MANY) {
                originInstance[this.name].push(relatedModel);
              } else {
                throw new RelationError();
              }
            }
          }
        }
      });
  }
}
