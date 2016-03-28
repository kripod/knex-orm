const RelationType = require('./enums/relation-type');

class Relation {
  constructor(parentModel, type, Target, foreignKey) {
    this.type = type;

    // Get the Target's registered Model if Target is a string
    const modelRegistry = parentModel._parent._Models;
    this.Target = typeof Target === 'string' ? modelRegistry[Target] : Target;
    this.foreignKey = foreignKey;
  }

  applyToQuery(knexQuery) {
    // TODO
    switch (this.type) {
      case RelationType.ONE_TO_MANY:
        break;

      case RelationType.ONE_TO_ONE:
        break;

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
