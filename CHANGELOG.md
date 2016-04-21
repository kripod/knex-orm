# Changelog

## 1.1.0 - 2016-04-21
- Added support for whitelisting/blacklisting Model properties
- Fixed automatic camelization of query results: No unnecessary (and invalid)
  conversions should happen from now
- Fixed query results of single Model instances, making them non-arrays
- Fixed the database initializer script for Node <4
- Improved test coverage
- Deprecated `Model.idAttribute` in favor of `Model.primaryKey`

## 1.0.2 - 2016-04-15
- Added a test for checking compatibility with vanilla Node
- Fixed compatibility with vanilla Node

## 1.0.1 - 2016-04-14
- Improved documentation

## 1.0.0 - 2016-04-13
- Initial stable release
