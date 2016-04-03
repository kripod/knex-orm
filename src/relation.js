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

  get originPropertyName() {
    if (!this._originPropertyName) {
      // Loop through the origin's relation declarations, searching for the name
      for (const [name, relation] of Object.entries(this.origin.getRelated())) {
        if (relation === this) {
          this._originPropertyName = name;
          break;
        }
      }
    }

    return this._originPropertyName;
  }

  applyAsync(knex, originInstance) {
    const model = originInstance;

    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return knex.from(this.target.tableName)
          .where({ [this.foreignKey]: model[this.origin.idAttribute] })
          .then((res) => {
            let related = res;

            // Return only the first result if necessary
            if (this.type === RelationType.ONE_TO_ONE) {
              if (res.length > 1) {
                // TODO: Throw an error about wrong relation type
              } else {
                related = res.length > 0 ? res[0] : null;
              }
            }

            model[this.originPropertyName] = related;
          });

      case RelationType.MANY_TO_ONE:
        return knex.from(this.target.tableName)
          .where({ [this.target.idAttribute]: model[this.foreignKey] })
          .then((related) => {
            model[this.originPropertyName] = related;
          });

      default:
        return null;
    }
  }
}
