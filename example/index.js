const Employee = require('./models/employee');

const employee = new Employee({
  custom_id: 1,
  test_property: 'original',
});

console.log(Employee.where({ id: 3 }).orderBy('id').toString());
console.log(employee.del().toString());

employee.save()
  .then((e1) => {
    console.log(e1);

    employee.test_property = 'modified';
    employee.new_property = 42;
    return employee.save();
  })
  .then((e2) => {
    console.log(e2);
  });
