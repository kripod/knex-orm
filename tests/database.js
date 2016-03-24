const knex = require('knex');
const Knexpress = require('./../src');
const knexConfig = require('./../knexfile').development;

module.exports = new Knexpress(knex(knexConfig));
