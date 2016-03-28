/**
 * Represents a database relation type.
 * @enum {number}
 * @private
 */
const RelationType = {
  ONE_TO_MANY: 1,
  ONE_TO_ONE: 2,
  MANY_TO_ONE: 3,
  MANY_TO_MANY: 4,
};

module.exports = RelationType;
