export function requireUncached(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath).default;
}

export function flattenArray(value) {
  return [].concat.apply([], value);
}
