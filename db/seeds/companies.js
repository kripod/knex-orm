exports.seed = (knex, Promise) => {
  const tableName = 'companies';

  return Promise.join(
    // Delete every existing entry
    knex(tableName).del(),

    knex(tableName).insert({
      rank: 1,
      name: 'Lectus Quis Massa LLP',
      email: 'vulputate@enimnon.edu',
    }),

    knex(tableName).insert({
      rank: 2,
      name: 'Ultrices Consulting',
      email: 'duis@ipsum.com',
    }),

    knex(tableName).insert({
      rank: 3,
      name: 'Eu Turpis Nulla Corporation',
    })
  );
};
