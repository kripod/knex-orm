const Extensions = {};

Extensions.withRelated = Extensions.fetchRelated =
  function withRelated(...relationNames) {
    if (relationNames.length > 0) {
      // Apply each requested relation to the current query
      for (const relationName of relationNames) {
        this._customProps.withRelated.push(
          this._parentModel.related[relationName]
        );
      }
    } else {
      // If no arguments are given, then every related Model should be fetched
      this._customProps.withRelated = this._parentModel.related;
    }

    return this;
  };

module.exports = Extensions;
