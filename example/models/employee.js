const Database = require('./../database');

class Employee extends Database.Model {
  static get tableName() { return 'employees'; }
  static get idAttribute() { return 'custom_id'; }
}

module.exports = Employee;
