import { underscore } from 'inflection';
import RelationType from './enums/relation-type';

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
  }

  _executeQuery(knex, originInstances, originAttribute, targetAttribute) {
    const models = originInstances;

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

  applyAsync(knex, originInstances) {
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return this._executeQuery(
          knex,
          originInstances,
          this.foreignKey || `${underscore(this.origin.name)}_id`,
          this.origin.idAttribute
        );

      case RelationType.MANY_TO_ONE:
        return this._executeQuery(
          knex,
          originInstances,
          this.target.idAttribute,
          this.foreignKey || `${underscore(this.target.name)}_id`
        );

      default:
        return null;
    }
  }
}
