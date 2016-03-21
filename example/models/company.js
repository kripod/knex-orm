const Database = require('./../database');

class Company extends Database.Model {
  static get tableName() { return 'companies'; }
}

module.exports = Company;
