import { camelize, underscore } from 'inflection';
import ModelBase from './model-base';
import PluginBase from './plugin-base';

export class CaseConverterPlugin extends PluginBase {
  init(BaseModel) {
    const formatterPrototype = BaseModel.knex.client.Formatter.prototype;

    // Override a Knex query formatter function by extending it
    /* eslint-disable no-underscore-dangle */
    const originalFunction = formatterPrototype._wrapString;
    formatterPrototype._wrapString = function _wrapString(value) {
      return underscore(originalFunction.call(this, value));
    };
    /* eslint-enable */

    return this;
  }

  afterQuery(res) {
    if (!this.options.afterQuery) return res;

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
    if (!(obj instanceof ModelBase)) return obj;

    // Support recursive array transformation
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformKeys(item, transformer));
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[transformer(key)] = value;
    }

    // Assign the appropriate prototype to the result
    return Object.create(Object.getPrototypeOf(obj), result);
  }
}

export class ValidationPlugin extends PluginBase {
  beforeQuery(qb) {
    if (!this.options.beforeQuery) return qb;

    const model = qb.modelInstance;
    if (model) {
      model.validate();
    }

    return qb;
  }

  afterQuery(res) {
    if (!this.options.afterQuery) return res;

    if (res instanceof ModelBase) {
      res.validate();
    }

    return res;
  }
}
