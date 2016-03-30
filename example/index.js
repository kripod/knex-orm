import Company from './models/company';
import Employee from './models/employee';

Company.where({ rank: 3 }).then((company) => {
  console.log(company);
});

console.log(Employee.first().withRelated('company').toString());
console.log(Company.first().withRelated('employee').toString());
/* Employee.first().withRelated('company').then((employee) => {
  console.log(employee);
});*/
