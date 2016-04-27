import knex from 'knex';
import KnexOrm from './../src';
import knexConfig from './../knexfile';

export default new KnexOrm(
  knex(knexConfig.development),
  { convertCase: true }
);
