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

<a name="api-reference"></a>

## API Reference

### Model

Base Model class which should be used as an extension for database entities.

#### constructor

Creates a new Model instance.

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Initial properties of the instance. (optional, default `{}`)
-   `isNew` **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)=** True if the instance is not yet stored
    persistently in the database. (optional, default `true`)

#### del

Queues the deletion of the current Model from the database.

-   Throws **InexistentDbObjectError** 

Returns **QueryBuilder** 

#### fetchRelated

Queues fetching the given related Models of the current instance.

**Parameters**

-   `props` **...[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Relation attributes to be fetched.

Returns **QueryBuilder** 

#### save

Queues saving (creating or updating) the current Model in the database.

-   Throws **EmptyDbObjectError** 

Returns **QueryBuilder** 

#### belongsTo

Creates a many-to-one relation between the current Model and a target.

**Parameters**

-   `Target` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|Model)** Name or static reference to the joinable
    table's Model.
-   `foreignKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Foreign key in this Model.

Returns **Relation** 

#### blacklistedProps

List of properties which shall not be present in database entities. The
blacklist takes precedence over any whitelist rule.

#### hasMany

Creates a one-to-many relation between the current Model and a target.

**Parameters**

-   `Target` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|Model)** Name or static reference to the joinable
    table's Model.
-   `foreignKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Foreign key in the target Model.

Returns **Relation** 

#### hasOne

Creates a one-to-one relation between the current Model and a target.

**Parameters**

-   `Target` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)|Model)** Name or static reference to the joinable
    table's Model.
-   `foreignKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Foreign key in the target Model.

Returns **Relation** 

#### idAttribute

#### primaryKey

Primary key of the Model, used for instance identification.

#### query

Returns a new QueryBuilder instance which corresponds to the current Model.

Returns **QueryBuilder** 

#### tableName

Case-sensitive name of the database table which corresponds to the Model.

#### whitelistedProps

List of properties which should exclusively be present in database
entities. If the list is empty, then every enumerable property of the
instance are considered to be database entities.

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

### QueryBuilder

Represents a query builder which corresponds to a static Model reference.
Inherits every query method of the Knex query builder.

#### then

Executes the query as a Promise.

**Parameters**

-   `callbacks` **...[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** Callbacks to be passed to Promise.then().

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** 

#### toString

Gets the list of raw queries to be executed, joined by a string separator.

**Parameters**

-   `separator` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Separator string to be used for joining
    multiple raw query strings. (optional, default `\n`)

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

#### withRelated

Queues fetching the given related Models of the queryable instance(s).

**Parameters**

-   `props` **...[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Relation attributes to be fetched.

Returns **QueryBuilder** 

### RelationError

**Extends Error**

An error which gets thrown when a Relation does not behave as expected.
