const knex = require('knex');
const Knexpress = require('./../src/index');
const knexConfig = require('./../knexfile').development;

module.exports = new Knexpress(knex(knexConfig));
