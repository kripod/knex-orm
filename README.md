# [knex-orm](http://kripod.github.io/knex-orm)

Knex-based object-relational mapping for JavaScript.

[![Version (npm)](https://img.shields.io/npm/v/knex-orm.svg)](https://npmjs.com/package/knex-orm)
[![Build Status](https://img.shields.io/travis/kripod/knex-orm/master.svg)](https://travis-ci.org/kripod/knex-orm)
[![Code Coverage](https://img.shields.io/codecov/c/github/kripod/knex-orm/master.svg)](https://codecov.io/gh/kripod/knex-orm)
[![Gitter](https://img.shields.io/gitter/room/kripod/knex-orm.svg)](https://gitter.im/kripod/knex-orm)

## Introduction

The motivation behind this project is to combine the simplicity of [Bookshelf][]
with the power of [Knex][] and modern ECMAScript features.

Knex-ORM aims to provide a wrapper for every significant method of [Knex][],
while keeping the ORM code overhead as low as possible.

[bookshelf]: http://bookshelfjs.org

[knex]: http://knexjs.org

## Getting started

Installing [Knex][] and at least one of its supported database drivers as peer
dependencies is mandatory.

```bash
$ npm install knex --save
$ npm install knex-orm --save

# Then add at least one of the following:
$ npm install pg --save
$ npm install mysql --save
$ npm install mariasql --save
$ npm install sqlite3 --save
```

An instance of the Knex-ORM library can be created by passing a [Knex][] client
instance to the entry class.

```js
const knex = require('knex');
const KnexOrm = require('knex-orm');

const Database = new KnexOrm(
  knex({
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  })
);

class Employee extends Database.Model {
  static get tableName() { return 'employees'; } // Redundant

  // Specify related Models which can optionally be fetched
  static get related() {
    return {
      company: this.belongsTo('Company'), // No Model cross-referencing
    };
  }
}

class Company extends Database.Model {
  // The 'tableName' property is omitted on purpose, as it gets assigned
  // automatically based on the Model's class name.

  static get primaryKey() { return 'rank'; }

  static get related() {
    return {
      employees: this.hasMany('Employee'),
    };
  }
}

// Register Models to make them relatable without cross-referencing each other
Database.register(Employee);
Database.register(Company);
```

## Examples

Creating and storing a new Model:

```js
const famousCompany = new Company({
  name: 'A Really Famous Company',
  email: 'info@famouscompany.example'
});

famousCompany.save()
  .then((ids) => {
    // An ordinary response of a Knex 'insert' query
    // (See http://knexjs.org/#Builder-insert)
    console.log(ids);
  });
```

Modifying an existing Model gathered by a query:

```js
Company.query().where({ email: 'info@famouscompany.example' }).first()
  .then((company) => {
    // Response of a Knex 'where' query, with results parsed as Models
    // (See http://knexjs.org/#Builder-where)
    console.log(company); // Should be equal with 'famousCompany' (see above)

    company.name = 'The Most Famous Company Ever';
    return company.save();
  })
  .then((rowsCount) => {
    // An ordinary response of a Knex 'update' query
    // (See http://knexjs.org/#Builder-update)
    console.log(rowsCount); // Should be 1
  });
```
