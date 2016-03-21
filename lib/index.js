const modelFactory = require('./model-factory');

class Knexpress {
  constructor(knex) {
    this.knex = knex;
  }

  get Model() {
    return modelFactory(this);
  }
}

module.exports = Knexpress;
