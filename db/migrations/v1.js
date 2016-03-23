exports.up = (knex, Promise) =>
  Promise.all([
    knex.schema.createTable('employees', (table) => {
      table.increments();
      table.timestamps();

      table.integer('company_id').unsigned().notNullable();

      table.string('name').notNullable();
      table.date('birth_date').notNullable();
      table.integer('zip_code').unsigned();
    }),

    knex.schema.createTable('companies', (table) => {
      table.increments('rank');

      table.string('name').notNullable();
      table.string('email');
    }),
  ]);

exports.down = (knex, Promise) =>
  Promise.all([
    knex.schema.dropTable('employees'),
    knex.schema.dropTable('companies'),
  ]);
