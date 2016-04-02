import Config from './config';

export default class QueryBuilder {
  constructor(parent, tableName) {
    Object.defineProperty(this, '_knexQb', {
      writable: true,
      value: parent.knex.from(tableName),
    });
  }

  withRelated(props) {
    // TODO
  }

  then(...args) {
    this._knexQb = this._knexQb.then(...args);
    return this._knexQb;
  }
}

// Inherit Knex query methods
for (const method of Config.KNEX_ALLOWED_QUERY_METHODS) {
  QueryBuilder.prototype[method] = function queryMethod(...args) {
    // Update Knex state
    this._knexQb = this._knexQb[method](...args);
    return this;
  };
}
