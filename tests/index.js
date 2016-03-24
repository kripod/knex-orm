const test = require('tape');
const Database = require('./database');
const Employee = require('./models/employee');

const NEW_EMPLOYEE_PROPS = {
  name: 'Olympia Pearson',
  birth_date: new Date('1982-08-20 00:00'),
};

const employee = new Employee(NEW_EMPLOYEE_PROPS);

test('creating new models', (t) => {
  // Ensure that no private Model property gets exposed
  for (const key of Object.keys(employee)) {
    t.equal(employee[key], NEW_EMPLOYEE_PROPS[key]);
  }

  t.equals(employee.save().toString(),
    'insert into "employees" ("birth_date", "name") ' +
    'values (\'1982-08-20 00:00:00.000\', \'Olympia Pearson\')'
  );

  t.end();
});

test('modifying existing models', (t) => {
  employee.birth_date = new Date('1982-08-20 00:00');
  employee.zip_code = 5998;

  t.equals(employee.save().toString(),
    'insert into "employees" ("birth_date", "zip_code") ' +
    'values (\'1982-08-20 00:00:00.000\', 5998)'
  );

  t.throws(() => employee.save(), /EmptyDbObjectError/);

  t.end();

  /*employee.save()
    .then((res) => {
      t.equal(res, employee);
      //employee.save(); // Cover the avoidance of unnecessary queries
    });
    //.then((res) => {
    //  t.equal(res, employee);
    //});

  t.end();*/
});

/*test('deleting existing models', (t) => {
  employee.del()
    .then(() => {
      t.ok();
    });

  t.end();
});*/

// Destroy the Knex instance being used to exit from the test suite
Database.knex.destroy();
