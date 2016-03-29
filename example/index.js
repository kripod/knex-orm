import Company from './models/company';

Company.where({ rank: 3 }).then((company) => {
  console.log(company);
});
