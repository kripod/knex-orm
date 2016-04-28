import Model from './../model';

class Employee extends Model {
  static get tableName() { return 'employees'; }

  static get related() {
    return {
      company: this.belongsTo('Company'),
    };
  }
}

export default Employee.register();
