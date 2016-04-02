export function requireUncached(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath).default;
}
