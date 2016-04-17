import test from 'tape';
import Database from './../example/database';
import Company from './../example/models/company';
import Employee from './../example/models/employee';

const NEW_EMPLOYEE_PROPS = {
  company_id: 2,
  name: 'Olympia Pearson',
  birth_date: new Date('1982-08-20 00:00'),
};

const newEmployee = new Employee(NEW_EMPLOYEE_PROPS);
const oldEmployee = new Employee({ id: 5, name: 'Alexa Buckner' }, false);

// console.log(Company.where({ id: 3 }).orderBy('id').withRelated().toString());

test('orm instance methods', (t) => {
  t.throws(() => Database.register(null, 'Company'),
    'should throw DbObjectAlreadyRegisteredError'
  );

  t.end();
});

test('static model property defaults', (t) => {
  t.equal(Company.tableName, 'companies');

  t.end();
});

test('static model methods', (t) => {
  t.equal(Company.query().where({ id: 3 }).toString(),
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
    'insert into "employees" ("birth_date", "company_id", "name") ' +
    'values (\'1982-08-20 00:00:00.000\', 2, \'Olympia Pearson\')'
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
  oldEmployee.zip_code = 4674;
  t.equals(oldEmployee.save().toString(),
    'update "employees" set "zip_code" = 4674 where "id" = 5'
  );

  // Cover the avoidance of unnecessary queries
  t.equals(oldEmployee.save().toString(),
    'select * from "employees" where "id" = 5 limit 1'
  );
  t.throws(() => newEmployee.save(), 'should throw EmptyDbObjectError');
  t.end();
});

test('deleting existing models', (t) => {
  t.throws(() => newEmployee.del(), 'should throw InexistentDbObjectError');

  t.equals(oldEmployee.del().toString(),
    'delete from "employees" where "id" = 5'
  );

  t.end();
});

test('relations', (t) => {
  const qb = oldEmployee.fetchRelated('company');
  t.equals(qb.toString('\t').split('\t')[1],
    'select * from "companies" where "rank" in (\'originInstance.companyId\')'
  );

  qb.then((employee) => {
    t.ok(employee.company instanceof Company);
  }).then(t.end);
});

test('destroying knex instance', (t) => {
  // Destroy the Knex instance being used to exit from the test suite
  Database.knex.destroy();
  t.end();
});
