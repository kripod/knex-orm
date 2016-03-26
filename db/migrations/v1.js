exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('employees', (table) => {
      table.increments().primary();
      table.timestamps();

      table.integer('company_id').unsigned().references('companies.rank');

      table.string('name').notNullable();
      table.date('birth_date').notNullable();
      table.integer('zip_code').unsigned();
    }),

    knex.schema.createTable('companies', (table) => {
      table.increments('rank').primary();

      table.string('name').notNullable();
      table.string('email').unique();
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('employees'),
    knex.schema.dropTable('companies'),
  ]);
