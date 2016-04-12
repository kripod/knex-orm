import knex from 'knex';
import Knexpress from './../src';
import knexConfig from './../knexfile';

export default new Knexpress(
  knex(knexConfig.development),
  { convertCase: true }
);
