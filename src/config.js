const knexQueryMethods = require('knex/lib/query/methods');

const KNEX_IGNORED_STATIC_METHODS = [
  'from',
  'fromJS',
  'into',
  'table',
  'queryBuilder',
];

exports.KNEX_ALLOWED_STATIC_METHODS = knexQueryMethods.filter((item) =>
  !KNEX_IGNORED_STATIC_METHODS.includes(item)
);
