const inflection = require('inflection');
const RelationType = require('./enums/relation-type');

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
class Relation {
  constructor(origin, target, type, foreignKey) {
    this.origin = origin;

    // Get the Target's registered Model if Target is a string
    const modelRegistry = origin._parent._models;
    this.target = typeof target === 'string' ? modelRegistry[target] : target;

    this.type = type;

    if (typeof foreignKey !== 'undefined') {
      this.foreignKey = foreignKey;
      return;
    }

    if (type === RelationType.MANY_TO_ONE) {
      this.foreignKey = `${inflection.underscore(this.target.name)}_id`;
    } else {
      this.foreignKey = `${inflection.underscore(this.origin.name)}_id`;
    }
  }

  applyToQuery(knexQuery) {
    switch (this.type) {
      case RelationType.MANY_TO_ONE:
        return knexQuery.join(
          this.target.tableName,
          `${this.origin.tableName}.${this.foreignKey}`,
          `${this.target.tableName}.${this.target.idAttribute}`
        );

      case RelationType.MANY_TO_MANY:
        // TODO
        return knexQuery;

      default:
        return knexQuery.join(
          this.target.tableName,
          `${this.origin.tableName}.${this.origin.idAttribute}`,
          `${this.target.tableName}.${this.foreignKey}`
        );
    }
  }
}

module.exports = Relation;
