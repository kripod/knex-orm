const Database = require('./../database');

class Employee extends Database.Model {
  // The 'tableName' property is omitted on purpose
  static get idAttribute() { return 'custom_id'; }
}

module.exports = Employee;
