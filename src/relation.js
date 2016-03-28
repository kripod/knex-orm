const RelationType = require('./enums/relation-type');

/**
 * Represents a relation between Models.
 * @property {Model} origin Static Model object which shall be joined with the
 * target.
 * @property {Model} target Static Model object which corresponds to the origin.
 * @property {RelationType} type Type of the relation between 'origin' and
 * 'target'.
 * @property {string} foreignKey The attribute of 'target' which uniquely
 * identifies a row of 'origin'.
 * @private
 */
class Relation {
  constructor(origin, target, type, foreignKey) {
    this.origin = origin;

    // Get the Target's registered Model if Target is a string
    const modelRegistry = origin._parent._models;
    this.target = typeof target === 'string' ? modelRegistry[target] : target;

    this.type = type;
    this.foreignKey = foreignKey;
  }

  applyToQuery(knexQuery) {
    // TODO
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
      case RelationType.ONE_TO_ONE:
        return knexQuery.join(
          this.target.tableName,
          `${this.origin.tableName}.${this.origin.idAttribute}`,
          `${this.target.tableName}.${this.foreignKey}`
        );

      case RelationType.MANY_TO_ONE:
        break;

      case RelationType.MANY_TO_MANY:
        break;

      default:
        // Do nothing
        return knexQuery;
    }
  }
}

module.exports = Relation;
