import Model from './../model';

class Company extends Model {
  // The 'tableName' property is omitted on purpose
  static get primaryKey() { return 'rank'; }
  static get whitelistedProps() { return ['rank', 'name', 'email']; }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        rank: { type: 'integer' },
        name: { type: 'string' },
        email: {
          type: 'string',
          format: 'email',
        },
      },
      required: ['name'],
    };
  }

  static get related() {
    return {
      employees: this.hasMany('Employee'),
    };
  }
}

export default Company.register();
