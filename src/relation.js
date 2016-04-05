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
    this.foreignKey = foreignKey || `${underscore(this.origin.name)}_id`;
  }

  applyAsync(knex, originInstances) {
    const models = originInstances;

    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return knex.from(this.target.tableName)
          .whereIn(
            this.foreignKey,
            models.map((model) => model[this.origin.idAttribute])
          )
          .then((relatedModels) => {
            for (const relatedModel of relatedModels) {
              // Pair up the related Model with its origin
              const foreignValue = relatedModel[this.foreignKey];
              const origin = models.find((model) =>
                model[this.origin.idAttribute] === foreignValue
              );

              if (origin) {
                if (!origin[this.name]) origin[this.name] = [];
                origin[this.name].push(relatedModel);
              }
            }
          });

      case RelationType.MANY_TO_ONE:
        return knex.from(this.target.tableName)
          .whereIn(
            this.target.idAttribute,
            models.map((model) => model[this.foreignKey])
          )
          .then((relatedModels) => {
            for (const relatedModel of relatedModels) {
              // Pair up the related Model with its origin
              const foreignValue = relatedModel[this.target.idAttribute];
              const origin = models.find((model) =>
                model[this.foreignKey] === foreignValue
              );

              if (origin) {
                if (!origin[this.name]) origin[this.name] = [];
                origin[this.name].push(relatedModel);
              }
            }
          });

      default:
        return null;
    }
  }
}
