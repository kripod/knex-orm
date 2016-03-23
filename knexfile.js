module.exports = {
  development: {
    client: 'sqlite3',
    useNullAsDefault: false,
    connection: {
      filename: './dev.sqlite3',
    },
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds',
    },
  },
};
