const test = require('tape');
const Database = require('./database');
const Company = require('./models/company');
const Employee = require('./models/employee');

const NEW_EMPLOYEE_PROPS = {
  name: 'Olympia Pearson',
  birth_date: new Date('1982-08-20 00:00'),
};

const newEmployee = new Employee(NEW_EMPLOYEE_PROPS);

// console.log(Company.where({ id: 3 }).orderBy('id').withRelated().toString());

test('static model property defaults', (t) => {
  t.equal(Company.tableName, 'companies');

  t.end();
});

test('static model methods', (t) => {
  t.equal(Company.where({ id: 3 }).toString(),
    'select * from "companies" where "id" = 3'
  );

  t.end();
});

test('creating new models', (t) => {
  // Ensure that no private Model property gets exposed
  for (const key of Object.keys(newEmployee)) {
    t.equal(newEmployee[key], NEW_EMPLOYEE_PROPS[key]);
  }

  t.equals(newEmployee.save().toString(),
    'insert into "employees" ("birth_date", "name") ' +
    'values (\'1982-08-20 00:00:00.000\', \'Olympia Pearson\')'
  );

  t.end();
});

test('modifying existing models', (t) => {
  newEmployee.birth_date = new Date('1982-08-20 00:00');
  newEmployee.zip_code = 5998;

  t.equals(newEmployee.save().toString(),
    'insert into "employees" ("birth_date", "zip_code") ' +
    'values (\'1982-08-20 00:00:00.000\', 5998)'
  );

  // Test modifying an existing employee
  const employee = new Employee({
    id: 5,
    zip_code: 4674,
  });

  t.equals(employee.save().toString(),
    'update "employees" set "zip_code" = 4674 where "id" = 5'
  );

  // Cover the avoidance of unnecessary queries
  t.throws(() => newEmployee.save(), /EmptyDbObjectError/);
  t.equals(employee.save().toString(),
    'select * from "employees" where "id" = 5'
  );

  t.end();
});

test('deleting existing models', (t) => {
  t.throws(() => newEmployee.del(), /InexistentDbObjectError/);

  const employee = new Employee({ id: 1 });
  t.equals(employee.del().toString(),
    'delete from "employees" where "id" = 1'
  );

  t.end();
});

// Destroy the Knex instance being used to exit from the test suite
Database.knex.destroy();
