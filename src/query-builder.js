import Config from './config';

export default class QueryBuilder {
  constructor(Model) {
    this.model = Model;

    Object.defineProperty(this, '_knexQb', {
      writable: true,
      value: Model._parent.knex.from(Model.tableName),
    });

    Object.defineProperty(this, '_relations', { value: new Set() });
  }

  withRelated(...props) {
    const relationNames = [].concat.apply([], props);

    if (relationNames.length > 0) {
      // Fetch the given relations by name
      for (const [name, relation] of Object.entries(this.model.getRelated())) {
        if (relationNames.includes(name)) {
          this._relations.add(relation);
        }
      }
    } else {
      // Fetch every relation if no parameters are given
      for (const relation of Object.values(this.model.getRelated())) {
        this._relations.add(relation);
      }
    }

    return this;
  }

  then(...args) {
    const knex = this.model._parent.knex;
    let originalResult;

    return this._knexQb
      .then((res) => {
        const awaitableQueries = [];
        originalResult = res;

        for (const relation of this._relations) {
          // TODO: Add support for result sets which return multiple results
          awaitableQueries.push(relation.applyAsync(knex, res[0]));
        }

        return Promise.all(awaitableQueries);
      })
      .then(() => originalResult)
      .then(...args);
  }

  toString() {
    return this._knexQb.toString();
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
