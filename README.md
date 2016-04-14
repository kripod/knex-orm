# knex-orm

Knex-based object-relational mapping for JavaScript.

[![Version (npm)](https://img.shields.io/npm/v/knex-orm.svg)](https://npmjs.com/package/knex-orm)
[![Build Status](https://img.shields.io/travis/kripod/knex-orm/master.svg)](https://travis-ci.org/kripod/knex-orm)
[![Code Coverage](https://img.shields.io/codeclimate/coverage/github/kripod/knex-orm.svg)](https://codeclimate.com/github/kripod/knex-orm/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/kripod/knex-orm.svg)](https://codeclimate.com/github/kripod/knex-orm)
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

  static get idAttribute() { return 'rank'; }

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

<a name="api-reference"></a>

## API Reference

### Model

Base Model class which shall be extended by the attributes of a database
object.

#### constructor

Creates a new Model instance.

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Initial properties of the instance. (optional, default `{}`)
-   `isNew` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** Determines whether the "props" of the
    instance are considered new. (optional, default `true`)

#### del

Queues the deletion of the current Model from the database.

-   Throws **InexistentDbObjectError** 

Returns **QueryBuilder** 

#### fetchRelated

Fetches the given related Models of the current instance.

**Parameters**

-   `props` **...[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Relation attributes to be fetched.

Returns **QueryBuilder** 

#### save

Queues saving (creating or updating) the current Model in the database.
If the 'idAttribute' of the current instance is set, then this method
queues an update query based on it. Otherwise, a new Model gets inserted
into the database.

-   Throws **EmptyDbObjectError** 

Returns **QueryBuilder** 

#### idAttribute

ID attribute, which is used as the primary key of the Model.

#### query

Returns a new QueryBuilder instance which corresponds to the current Model.

Returns **QueryBuilder** 

#### tableName

Case-sensitive name of the database table which corresponds to the Model.

### KnexOrm

Entry class for accessing the functionality of Knex-ORM.

**Properties**

-   `knex` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Knex client corresponding to the ORM instance.

#### constructor

Creates a new Knex-ORM instance.

**Parameters**

-   `knex` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Knex client instance to which database functions shall
    be bound.
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Additional options regarding ORM.
    -   `options.convertCase` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** If set to true, then the ORM
        will handle letter case conversion for properties automatically (between
        camelCase and snake_case). (optional, default `false`)

#### Model

Base Model class corresponding to the current ORM instance.

#### register

Registers a static Model object to the list of database objects.

**Parameters**

-   `model` **Model** Model to be registered.
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Name under which the Model shall be registered.


-   Throws **DbObjectAlreadyRegisteredError** 

Returns **Model** The Model which was registered.

### DbObjectAlreadyRegisteredError

**Extends Error**

An error which gets thrown when an attempt is made to register a database
object multiple times.

**Properties**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Name of the database object in question.

### EmptyDbObjectError

**Extends Error**

An error which gets thrown when an attempt is made to store an empty database
object.

### InexistentDbObjectError

**Extends Error**

An error which gets thrown when an attempt is made to modify an inexistent
database object.

### RelationError

**Extends Error**

An error which gets thrown when a Relation does not behave as expected.
