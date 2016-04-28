import knex from 'knex';
import ModelBase from './../src';
import knexConfig from './../knexfile';

const knexInstance = knex(knexConfig.development);

export default class Model extends ModelBase {
  static get knex() { return knexInstance; }
}
