import Database from './../database';

class Employee extends Database.Model {
  static get tableName() { return 'employees'; }

  static get related() {
    return {
      company: this.belongsTo('Company'),
    };
  }
}

export default Database.register(Employee);
