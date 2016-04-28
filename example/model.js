import knex from 'knex';
import { ModelBase } from './../src';
import knexConfig from './../knexfile';

export default class Model extends ModelBase {

}

Model.knex = knex(knexConfig.development);
