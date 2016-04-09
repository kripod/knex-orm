# knexpress

Knex-based object-relational mapping for JavaScript.

[![Version (npm)](https://img.shields.io/npm/v/knexpress.svg)](https://npmjs.com/package/knexpress)
[![Build Status](https://img.shields.io/travis/kripod/knexpress/master.svg)](https://travis-ci.org/kripod/knexpress)
[![Code Coverage](https://img.shields.io/codeclimate/coverage/github/kripod/knexpress.svg)](https://codeclimate.com/github/kripod/knexpress/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/kripod/knexpress.svg)](https://codeclimate.com/github/kripod/knexpress)
[![Gitter](https://img.shields.io/gitter/room/kripod/knexpress.svg)](https://gitter.im/kripod/knexpress)

## Introduction

The motivation behind this project is to combine the simplicity of [Bookshelf][]
with the power of [Knex][] and modern ECMAScript features.

Knexpress aims to provide a wrapper for every significant method of [Knex][],
while keeping the ORM code overhead as low as possible.

[bookshelf]: http://bookshelfjs.org

[knex]: http://knexjs.org

## Getting started

Installing [Knex][] and at least one of its supported database drivers as peer
dependencies is mandatory.

```bash
$ npm install knex --save
$ npm install knexpress --save

# Then add at least one of the following:
$ npm install pg --save
$ npm install mysql --save
$ npm install mariasql --save
$ npm install sqlite3 --save
```

An instance of the Knexpress library can be created by passing a [Knex][] client
instance to the entry class.

```js
const knex = require('knex');
const Knexpress = require('knexpress');

const Database = new Knexpress(
  knex({
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
  })
);

/**
 * Represents a company for which employees can work.
 * @extends Database.Model
 * @property {number} rank Rank of the company, which serves as a primary key.
 * @property {string} name Name of the company.
 * @property {?string} email E-mail address of the company, which shall be
 * unique, but optional.
 */
class Company extends Database.Model {
  // The 'tableName' property is omitted on purpose, as it gets assigned
  // automatically based on the class name.
  // In this particular case, 'tableName' is set to 'companies'.

  static get idAttribute() { return 'rank'; }
}
```

Every significant [Knex][] query method is inherited as a static Model function.
(For example: `Company.where({ rank: 2 })`, `Company.first()`)

Instances of Models have specific methods discussed in the
[API Reference](#api-reference).

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
Company.where({ email: 'info@famouscompany.example' })
  .then((rows) => {
    // An ordinary response of a Knex 'where' query
    // (See http://knexjs.org/#Builder-where)
    console.log(rows); // Shall only contain the newly-added company

    const company = new Company(rows[0]); // Equals to 'famousCompany'
    company.name = 'The Most Famous Company Ever';
    return company.save();
  })
  .then((rowsCount) => {
    console.log(rowsCount); // 1
  });
```

## Upcoming features

-   Associations based on Model relationships
-   Option to automatically convert the letter case of strings (between
    camelCase and snake_case)
-   Custom defaults for automatic SQL attribute formatting
-   Optional Model property validation

<a name="api-reference"></a>

## API Reference

### Knexpress

Entry class for accessing the functionality of Knexpress.

**Properties**

-   `knex` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Knex client corresponding to the ORM instance.

#### constructor

Creates a new Knexpress ORM instance.

**Parameters**

-   `knex` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Knex client instance to which database functions shall
    be bound.
-   `options` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Additional options regarding ORM.

#### Model

Base Model class corresponding to the current ORM instance.

#### register

Registers a static Model object to the list of database objects.

**Parameters**

-   `model` **Model** Model to be registered.
-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Name under which the Model shall be registered.

Returns **Model** The Model which was registered.

### Model

Base Model class which shall be extended by the attributes of a database
object.

#### constructor

Creates a new Model instance.

**Parameters**

-   `props` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Initial properties of the instance.

#### del

Queues the deletion of the current Model from the database.

#### save

Queues saving (creating or updating) the current Model in the database.
If the 'idAttribute' of the current instance is set, then this method
queues an update query based on it. Otherwise, a new Model gets inserted
into the database.

#### idAttribute

ID attribute, which is used as the primary key of the Model.

#### tableName

Case-sensitive name of the database table which corresponds to the Model.

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
