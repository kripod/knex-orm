import knexDefaultMethods from 'knex/lib/query/methods';

const KNEX_IGNORED_QUERY_METHODS = [
  'from',
  'fromJS',
  'into',
  'table',
  'queryBuilder',
];

const Config = {
  KNEX_ALLOWED_QUERY_METHODS: knexDefaultMethods.filter((item) =>
    KNEX_IGNORED_QUERY_METHODS.indexOf(item) < 0
  ),
};

export default Config;
