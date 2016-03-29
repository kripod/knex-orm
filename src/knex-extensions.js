module.exports = {
  withRelated(...args) {
    // If no arguments are given, then every relation shall be loaded
    const relationNames = args.length > 0 ?
      args :
      Object.keys(this._parentModel.related);

    // Apply each requested relation to the current query
    for (const relationName of relationNames) {
      this._parentModel.related[relationName].applyToQuery(this);
    }

    return this;
  },
};
