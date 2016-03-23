const knex = require('knex');
const Knexpress = require('./../src/index');
const knexConfig = require('./../knexfile');

module.exports = new Knexpress(knex(knexConfig));
