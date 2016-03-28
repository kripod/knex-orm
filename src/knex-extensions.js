module.exports = {
  withRelated(...args) {
    console.log(this._parentModel.name);
    return this;
  },
};
