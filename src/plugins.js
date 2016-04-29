import { camelize } from 'inflection';
import PluginBase from './plugin-base';

export class CaseConverterPlugin extends PluginBase {
  afterQuery(res) {
    // TODO: Add support for custom transformations
    return this.transformKeys(res, (key) => camelize(key, true));
  }

  /**
   * Transforms the keys of the given object.
   * @param {Object} obj Object to be transformed.
   * @param {Function<string>} transformer Transformation function to be used.
   * @returns {Object} The transformed object.
   * @private
   */
  transformKeys(obj, transformer) {
    // Don't transform the keys of non-objects
    if (!(obj instanceof Object)) return obj;

    // Support recursive array transformation
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformKeys(item));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[transformer(key)] = value;
    }

    return result;
  }
}
