import { expect } from 'chai'
import * as Utils from '../../src/utils'

describe('lib', () => {
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
    })
  })
})
