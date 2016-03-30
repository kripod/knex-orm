import Company from './models/company';
import Employee from './models/employee';

/* Company.where({ rank: 3 }).then((company) => {
  console.log(company);
}); */

console.log(Employee.first().withRelated('company').toString());
console.log(Company.first().withRelated('employee').toString());
console.log();

Employee.withRelated('company').then((employee) => {
  console.log('Employee:');
  console.log(employee);
  console.log();
});

Company.first().withRelated('employee').then((company) => {
  console.log('Company:');
  console.log(company);
  console.log();
});
