const knex = require('knex');
const Knexpress = require('./../lib/index');

module.exports = new Knexpress(knex({
  dialect: 'sqlite3',
  useNullAsDefault: false,
  connection: {
    filename: './../test.db',
  },
}));
