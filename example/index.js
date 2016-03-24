const Employee = require('./models/employee');

const employee = new Employee({
  name: 'Olympia Pearson',
  birth_date: new Date(1982, 1, 20),
});

Employee.where({ id: 3 })
  .then((res) => {
    console.log(res);
    //return res.del();
  })
  //.then((res) => console.log(res))
  .then(() => employee.save())
  .then((res) => {
    console.log(res);
    employee.birth_date = new Date(1982, 7, 20);
    employee.zip_code = 5998;
    return employee.save();
  })
  .then((res) => {
    console.log(res);
  });
