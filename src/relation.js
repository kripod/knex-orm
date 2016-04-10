import { underscore } from 'inflection';
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
    const modelRegistry = Origin._parent._models;
    this.target = typeof Target === 'string' ? modelRegistry[Target] : Target;

    this.type = type;
    this._foreignKey = foreignKey;
  }

  get foreignKey() {
    if (!this._foreignKey) {
      // Set the foreign key deterministically
      switch (this.type) {
        case RelationType.ONE_TO_MANY:
        case RelationType.ONE_TO_ONE:
          this._foreignKey = `${underscore(this.origin.name)}_id`;
          break;

        default:
          this._foreignKey = `${underscore(this.target.name)}_id`;
          break;
      }
    }

    return this._foreignKey;
  }

  get originAttribute() {
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return this.foreignKey;

      default:
        return this.target.idAttribute;
    }
  }

  get targetAttribute() {
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return this.origin.idAttribute;

      default:
        return this.foreignKey;
    }
  }

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
            const isRelationAnyToOne =
              this.type === RelationType.ONE_TO_ONE ||
              this.type === RelationType.MANY_TO_ONE;

            if (typeof origin[this.name] === 'undefined') {
              // Initially set the origin's related property
              if (isRelationAnyToOne) {
                origin[this.name] = relatedModel;
              } else {
                origin[this.name] = [relatedModel];
              }
            } else {
              // Modify the origin's related property if possible
              if (isRelationAnyToOne) {
                throw new RelationError();
              } else {
                origin[this.name].push(relatedModel);
              }
            }
          }
        }
      });
  }
}
