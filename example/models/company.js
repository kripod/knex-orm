import Database from './../database';

class Company extends Database.Model {
  // The 'tableName' property is omitted on purpose
  static get idAttribute() { return 'rank'; }

  static get related() {
    return {
      employees: this.hasMany('Employee'),
    };
  }
}

export default Database.register(Company);
