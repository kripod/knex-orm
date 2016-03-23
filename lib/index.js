const modelFactory = require('./model-factory');

class Knexpress {
  constructor(knex, options) {
    this.knex = knex;

    this.options = {
      convertCase: (options || {}).convertCase || true,
    };
  }

  get Model() {
    return modelFactory(this);
  }
}

module.exports = Knexpress;
