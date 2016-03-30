const knexDefaultMethods = require('knex/lib/query/methods');
const knexExtensions = require('./knex-extensions');

const KNEX_IGNORED_DEFAULT_METHODS = [
  'from',
  'fromJS',
  'into',
  'table',
  'queryBuilder',
];

const KNEX_ALLOWED_DEFAULT_METHODS = knexDefaultMethods.filter((item) =>
  !KNEX_IGNORED_DEFAULT_METHODS.includes(item)
);

const Config = {
  KNEX_ALLOWED_QUERY_METHODS: [
    ...KNEX_ALLOWED_DEFAULT_METHODS,
    ...Object.keys(knexExtensions),
  ],
};

module.exports = Config;
