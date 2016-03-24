const test = require('tape');
const Database = require('./database');
const Employee = require('./models/employee');

const NEW_EMPLOYEE_BIRTH_DATE_STRING = '1982-08-20 00:00:00.000';
const NEW_EMPLOYEE_PROPS = {
  name: 'Olympia Pearson',
  birth_date: new Date(NEW_EMPLOYEE_BIRTH_DATE_STRING),
};

const employee = new Employee(NEW_EMPLOYEE_PROPS);

test('creating new models', (t) => {
  // Ensure that no private Model property gets exposed
  for (const key of Object.keys(employee)) {
    t.equal(employee[key], NEW_EMPLOYEE_PROPS[key]);
  }

  t.equals(employee.save().toString(),
    `insert into "${Employee.tableName}" ("birth_date", "name") ` +
    `values ('${NEW_EMPLOYEE_BIRTH_DATE_STRING}', '${NEW_EMPLOYEE_PROPS.name}')`
  );

  t.end();
});

test('modifying existing models', (t) => {
  const birthDateString = '1982-08-20 00:00:00.000';
  employee.birth_date = new Date(birthDateString);
  employee.zip_code = 5998;

  t.equals(employee.save().toString(),
    `insert into "${Employee.tableName}" ("birth_date", "zip_code") ` +
    `values ('${birthDateString}', ${employee.zip_code})`
  );

  console.log(employee.save().toString());

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
