import { underscore } from 'inflection';
import RelationType from './enums/relation-type';

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
  constructor(origin, target, type, foreignKey) {
    this.origin = origin;

    // Get the target's registered Model if target is a string
    const modelRegistry = origin._parent._models;
    this.target = typeof target === 'string' ? modelRegistry[target] : target;

    this.type = type;
    this.foreignKey = foreignKey || `${underscore(this.target.name)}_id`;
  }

  get originPropertyName() {
    if (!this._originPropertyName) {
      // Loop through the origin's relation declarations, searching for the name
      for (const relationDeclaration of this.origin.related) {
        if (relationDeclaration[1] === this) {
          this._originPropertyName = relationDeclaration[0];
          break;
        }
      }
    }

    return this._originPropertyName;
  }

  applyAsync(knex) {
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return knex.from(this.target.tableName)
          .where({ [this.foreignKey]: this.origin.idAttribute })
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

            this.origin[this.originPropertyName] = related;
          });

      case RelationType.MANY_TO_ONE:
        return knex.from(this.target.tableName)
          .where({ [this.target.idAttribute]: this.origin[this.foreignKey] })
          .then((related) => {
            this.origin[this.originPropertyName] = related;
          });

      default:
        return null;
    }
  }
}
