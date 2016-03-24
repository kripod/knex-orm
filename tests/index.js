const test = require('tape');
const Database = require('./database');
const Employee = require('./models/employee');

const NEW_EMPLOYEE_PROPS = {
  name: 'Olympia Pearson',
  birth_date: new Date(1982, 1, 20),
};

const employee = new Employee(NEW_EMPLOYEE_PROPS);

test('creating new models', (t) => {
  for (const key of Object.keys(employee)) {
    t.equal(employee[key], NEW_EMPLOYEE_PROPS[key]);
  }

  t.end();
});

test('modifying existing models', (t) => {
  employee.birth_date = new Date(1982, 7, 20);
  employee.zip_code = 5998;

  employee.save()
    .then((res) => {
      t.equal(res, employee);
      //employee.save(); // Cover the avoidance of unnecessary queries
    });
    //.then((res) => {
    //  t.equal(res, employee);
    //});

  t.end();
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
