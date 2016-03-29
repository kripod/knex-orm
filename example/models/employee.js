const Database = require('./../database');

class Employee extends Database.Model {
  static get tableName() { return 'employees'; }
}

module.exports = Database.register(Employee);
