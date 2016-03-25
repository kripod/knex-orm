# knexpress

[![Version (npm)](https://img.shields.io/npm/v/knexpress.svg)](https://npmjs.com/package/knexpress)
[![Build Status](https://img.shields.io/travis/kripod/knexpress/master.svg)](https://travis-ci.org/kripod/knexpress)
[![Code Coverage](https://img.shields.io/codeclimate/coverage/github/kripod/knexpress.svg)](https://codeclimate.com/github/kripod/knexpress/coverage)
[![Code Climate](https://img.shields.io/codeclimate/github/kripod/knexpress.svg)](https://codeclimate.com/github/kripod/knexpress)

[Knex][]-based object-relational mapping for JavaScript, targeting modern
development environments.

## Introduction

The motivation behind this project is to combine the simplicity of [Bookshelf][]
with the power of [Knex][] and modern ECMAScript features.

Knexpress aims to provide a wrapper for every significant method of [Knex][],
while keeping the ORM code overhead as low as possible.

The project can be run natively with Node.js >=5 by using the `--es-staging` and
`--use-strict` runtime flags, but in order to provide compatibility with older
Node versions, the source code of the package is transpiled to ES5.

## Getting started

Installing [Knex][] and at least one of its supported database drivers as peer
dependencies is mandatory.

```js
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
 * @property {string?} email E-mail address of the company, which shall be
 * unique, but optional.
 */
class Company extends Database.Model {
  // The 'tableName' property is omitted on purpose, as it gets assigned
  // automatically based on the class name.
  // In this particular case, 'tableName' is set to 'companies'.

  static get idAttribute() { return 'rank'; }
}
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
Company.where({ email: 'info@famouscompany.example' })
  .then((rows) => {
    // An ordinary response of a Knex 'where' query
    // (See http://knexjs.org/#Builder-where)
    console.log(rows); // Shall only contain the newly-added company

    const company = new Company(rows[0]); // Equals to 'famousCompany'
    company.name = 'The Most Famous Company Ever';
    return company.save();
  }
  .then((rowsCount) => {
    console.log(rowsCount); // 1
  };
```

## Upcoming features

- Associations based on Model relationships
- Parse ordinary [Knex][] responses as Models if possible
- Option to automatically convert the letter case of strings (between camelCase
  and snake_case)
- Optional Model property validation

## API Reference

<a name="module_knexpress"></a>

## knexpress

* [knexpress](#module_knexpress)
    * [~EmptyDbObjectError](#module_knexpress..EmptyDbObjectError) ⇐ <code>Error</code>
    * [~InexistentDbObjectError](#module_knexpress..InexistentDbObjectError) ⇐ <code>Error</code>
    * [~Knexpress](#module_knexpress..Knexpress)
        * [new Knexpress()](#new_module_knexpress..Knexpress_new)
        * [.Model](#module_knexpress..Knexpress+Model) : <code>Model</code>
    * [~Model](#module_knexpress..Model)
        * [new Model()](#new_module_knexpress..Model_new)
        * _instance_
            * [.del()](#module_knexpress..Model+del)
            * [.save()](#module_knexpress..Model+save)
        * _static_
            * [.tableName](#module_knexpress..Model.tableName) : <code>string</code>
            * [.idAttribute](#module_knexpress..Model.idAttribute) : <code>string</code>

<a name="module_knexpress..EmptyDbObjectError"></a>

### knexpress~EmptyDbObjectError ⇐ <code>Error</code>
An error which gets thrown when an attempt is made to store an empty databaseobject.

**Kind**: inner class of <code>[knexpress](#module_knexpress)</code>  
**Extends:** <code>Error</code>  
<a name="module_knexpress..InexistentDbObjectError"></a>

### knexpress~InexistentDbObjectError ⇐ <code>Error</code>
An error which gets thrown when an attempt is made to modify an inexistentdatabase object.

**Kind**: inner class of <code>[knexpress](#module_knexpress)</code>  
**Extends:** <code>Error</code>  
<a name="module_knexpress..Knexpress"></a>

### knexpress~Knexpress
Entry class for accessing the functionality of Knexpress.

**Kind**: inner class of <code>[knexpress](#module_knexpress)</code>  

* [~Knexpress](#module_knexpress..Knexpress)
    * [new Knexpress()](#new_module_knexpress..Knexpress_new)
    * [.Model](#module_knexpress..Knexpress+Model) : <code>Model</code>

<a name="new_module_knexpress..Knexpress_new"></a>

#### new Knexpress()
Creates a new Knexpress ORM instance.

<a name="module_knexpress..Knexpress+Model"></a>

#### knexpress.Model : <code>Model</code>
Base Model class corresponding to the current ORM instance.

**Kind**: instance property of <code>[Knexpress](#module_knexpress..Knexpress)</code>  
<a name="module_knexpress..Model"></a>

### knexpress~Model
Base Model class which shall be extended by the attributes of a databaseobject.

**Kind**: inner class of <code>[knexpress](#module_knexpress)</code>  

* [~Model](#module_knexpress..Model)
    * [new Model()](#new_module_knexpress..Model_new)
    * _instance_
        * [.del()](#module_knexpress..Model+del)
        * [.save()](#module_knexpress..Model+save)
    * _static_
        * [.tableName](#module_knexpress..Model.tableName) : <code>string</code>
        * [.idAttribute](#module_knexpress..Model.idAttribute) : <code>string</code>

<a name="new_module_knexpress..Model_new"></a>

#### new Model()
Creates a new Model instance.

<a name="module_knexpress..Model+del"></a>

#### model.del()
Queues the deletion of the current Model from the database.

**Kind**: instance method of <code>[Model](#module_knexpress..Model)</code>  
<a name="module_knexpress..Model+save"></a>

#### model.save()
Queues saving (creating or updating) the current Model in the database.If the 'idAttribute' of the current instance is set, then this methodqueues an update query based on it. Otherwise, a new Model gets insertedinto the database.

**Kind**: instance method of <code>[Model](#module_knexpress..Model)</code>  
<a name="module_knexpress..Model.tableName"></a>

#### Model.tableName : <code>string</code>
Case-sensitive name of the database table which corresponds to the Model.

**Kind**: static property of <code>[Model](#module_knexpress..Model)</code>  
<a name="module_knexpress..Model.idAttribute"></a>

#### Model.idAttribute : <code>string</code>
ID attribute, which is used as the primary key of the Model.

**Kind**: static property of <code>[Model](#module_knexpress..Model)</code>  

[Bookshelf]: http://bookshelfjs.org
[Knex]: http://knexjs.org
