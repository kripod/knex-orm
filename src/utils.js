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
