import { camelize } from 'inflection';

export function camelizeKeys(obj) {
  // Support recursive array transformation
  if (Array.isArray(obj)) {
    return obj.map((item) => camelizeKeys(item));
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[camelize(key, true)] = value;
  }

  return result;
}

export function flattenArray(value) {
  return [].concat.apply([], value);
}

export function modelize(obj, Model) {
  // Support recursive array transformation
  if (Array.isArray(obj)) {
    return obj.map((item) => modelize(item, Model));
  }

  // Don't modelize non-objects
  return obj instanceof Object ? new Model(obj, false) : obj;
}

export function requireUncached(modulePath) {
  delete require.cache[require.resolve(modulePath)];
  return require(modulePath).default;
}
