import knex from 'knex';
import { ModelBase, Plugins } from './../src';
import knexConfig from './../knexfile';

export default class Model extends ModelBase {
  static knex = knex(knexConfig.development);
  // static plugins = [new Plugins.CaseConverterPlugin()];
}
