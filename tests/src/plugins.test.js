import { expect } from 'chai'
import * as Plugins from '../../src/plugins'
import ModelBase from '../../src/model-base'
import knex from 'knex'
import knexConfig from '../../knexfile'
let knx = knex(knexConfig.development)

describe('src', () => {
  describe('Plugins', () => {
    after(() => knx.destroy())

    describe('CaseConverterPlugin', () => {
      it('Should convert instance attributes to camelCase', () => {
        class Customer extends ModelBase {
          static knex = knx
        }
        let ccp = new Plugins.CaseConverterPlugin()
        ccp.init(Customer)

        let c1 = new Customer({ first_name: 'John' })
        c1 = ccp.afterQuery(c1)
        expect(c1.firstName).to.eq('John')
      })

      it('Should convert instance array attributes to camelCase', () => {
        class Customer extends ModelBase {
          static knex = knx
        }
        let ccp = new Plugins.CaseConverterPlugin()
        ccp.init(Customer)

        let c1 = new Customer({ first_name: 'John' })
        let c2 = new Customer({ first_name: 'Doe' })
        let arr = [c1, c2]
        let res = ccp.afterQuery(arr)
        expect(res[0].firstName).to.eq('John')
        expect(res[1].firstName).to.eq('Doe')
      })
    })

    describe('ValidationPlugin', () => {
      it('Should validate model')
    })
  })
})
