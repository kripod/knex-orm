const Database = require('./../database');

class Employee extends Database.Model {
  static get tableName() { return 'employees'; }

  static get related() {
    return {
      company: this.belongsTo('Company'),
    };
  }
}

module.exports = Database.register(Employee);
