import Database from './database';
import Company from './models/company';
import Employee from './models/employee';

/*
Company.where({ rank: 3 }).orderBy('name').then((res) => {
  console.log(res);
});
*/

async function test() {
  const companies = await Company.withRelated('employees').orderBy('name');
  console.log('Companies:');
  console.log(companies);

  const employee = await Employee.where({ id: 3 }).withRelated('company');
  console.log('Employee:');
  console.log(employee);
}

test();

// console.log(Company.where({ id: 3 }).toString());

/* Company.where({ rank: 3 }).then((company) => {
  console.log(company);
}); */

/*
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

// The 2 lines below equal to Employee.withRelated('company')
Database.knex.from('employees')
  .join('companies', 'employees.company_id', 'companies.rank')
  .select('companies.*')
  .then((employee) => {
    console.log('Knex employee:');
    console.log(employee);
  });
*/
