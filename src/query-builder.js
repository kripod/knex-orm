export default class QueryBuilder {
  constructor(parent) {
    Object.defineProperty(this, '_knexQb', {
      value: parent.knex.from(this.constructor.tableName),
    });
  }

  withRelated(props) {
    // TODO
  }
}
