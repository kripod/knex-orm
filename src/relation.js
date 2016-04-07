import { underscore } from 'inflection';
import RelationType from './enums/relation-type';
import { flattenArray } from './utils';

/**
 * Represents a relation between Models.
 * @property {Model} Origin Static Model object which shall be joined with the
 * target.
 * @property {Model} Target Static Model object which corresponds to the origin.
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
    this.foreignKey = foreignKey;
  }

  _executeQuery(originAttribute, targetAttribute, ...originInstances) {
    const models = originInstances;
    const knex = this.origin._parent.knex;

    /* TODO: Remove the debug statements below
    console.log(`
      knex.from(${this.target.tableName})
      .whereIn(
        ${originAttribute},
        models.map((model) => model[${targetAttribute}])
      )`
    );
    console.log(models);
    console.log(models.map((model) => model[targetAttribute]));
    */

    return knex.from(this.target.tableName)
      .whereIn(
        originAttribute,
        models.map((model) => model[targetAttribute])
      )
      .then((relatedModels) => {
        for (const relatedModel of relatedModels) {
          // Pair up the related Model with its origin
          const foreignValue = relatedModel[originAttribute];
          const origin = models.find((model) =>
            model[targetAttribute] === foreignValue
          );

          if (origin) {
            if (!origin[this.name]) origin[this.name] = [];
            origin[this.name].push(relatedModel);
          }
        }
      });
  }

  applyAsync(...originInstances) {
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return this._executeQuery(
          this.foreignKey || `${underscore(this.origin.name)}_id`,
          this.origin.idAttribute,
          ...flattenArray(originInstances)
        );

      case RelationType.MANY_TO_ONE:
        return this._executeQuery(
          this.target.idAttribute,
          this.foreignKey || `${underscore(this.target.name)}_id`,
          ...flattenArray(originInstances)
        );

      default:
        return null;
    }
  }
}
