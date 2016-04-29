import knex from 'knex';
import { ModelBase } from './../src';
import knexConfig from './../knexfile';

export default class Model extends ModelBase {
  static knex = knex(knexConfig.development);
}
