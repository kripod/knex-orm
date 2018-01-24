import { expect } from 'chai'
import * as Utils from '../../src/utils'

describe('src', () => {
  describe('Utils', () => {
    describe('flattenArray', () => {
      it('Should return flatten array', () => {
        let arr = [1, [2, 3]]
        let flat = Utils.flattenArray(arr)
        expect(flat[0]).to.eq(1)
        expect(flat[1]).to.eq(2)
        expect(flat[2]).to.eq(3)
      })
    })

    describe('modelize', () => {
      it('Should return model instance', () => {
        class Customer {
        }
        let obj = { name: 'John' }

        let model = Utils.modelize(obj, Customer)
        expect(model instanceof Customer).to.eq(true)
      })

      it('Should return model instance for array', () => {
        class Customer {
        }
        let obj = { name: 'John' }
        let obj2 = { name: 'Doe' }

        let models = Utils.modelize([obj, obj2], Customer)
        expect(models[0] instanceof Customer).to.eq(true)
        expect(models[1] instanceof Customer).to.eq(true)
      })
    })
  })
})
