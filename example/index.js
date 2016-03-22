const Employee = require('./models/employee');

const employee = new Employee();
employee.id = 1;

console.log(Employee.where({ id: 3 }).orderBy('id').toString());
console.log(employee.del().toString());
