import { camelize } from 'inflection';

export function camelizeKeys(obj) {
  // Don't camelize the keys of non-objects
  if (!(obj instanceof Object)) return obj;

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
