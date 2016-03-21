const Employee = require('./models/employee');

const employee = new Employee();

console.log(Employee.where({ id: 3 }).orderBy('id').toString());
