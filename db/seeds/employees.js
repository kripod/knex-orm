exports.seed = (knex, Promise) => {
  const tableName = 'employees';

  return Promise.join(
    // Delete every existing entry
    knex(tableName).del(),

    knex(tableName).insert({
      id: 1,
      company_id: 3,
      name: 'Eaton Sanchez',
      birth_date: new Date(1963, 10, 28),
      zip_code: 11596,
    }),

    knex(tableName).insert({
      id: 2,
      company_id: 1,
      name: 'Jana Conley',
      birth_date: new Date(1984, 4, 1),
    }),

    knex(tableName).insert({
      id: 3,
      company_id: 1,
      name: 'Pandora McCarty',
      birth_date: new Date(1977, 3, 7),
      zip_code: 4634,
    }),

    knex(tableName).insert({
      id: 4,
      company_id: 2,
      name: 'Keiko Russell',
      birth_date: new Date(1979, 1, 3),
      zip_code: 14712,
    }),

    knex(tableName).insert({
      id: 5,
      company_id: 1,
      name: 'Alexa Buckner',
      birth_date: new Date(1982, 7, 16),
      zip_code: 391311,
    }),

    knex(tableName).insert({
      id: 6,
      company_id: 3,
      name: 'Xaviera Park',
      birth_date: new Date(1964, 3, 7),
    }),

    knex(tableName).insert({
      id: 7,
      company_id: 2,
      name: 'Victor Frank',
      birth_date: new Date(1984, 7, 31),
      zip_code: 10226,
    }),

    knex(tableName).insert({
      id: 8,
      company_id: 1,
      name: 'Emerald Chang',
      birth_date: new Date(1960, 7, 6),
      zip_code: 6262,
    }),

    knex(tableName).insert({
      id: 9,
      company_id: 1,
      name: 'Victoria Ayers',
      birth_date: new Date(1988, 3, 22),
      zip_code: 59897,
    }),

    knex(tableName).insert({
      id: 10,
      company_id: 2,
      name: 'James Conner',
      birth_date: new Date(1972, 6, 6),
      zip_code: 9059,
    })
  );
};
