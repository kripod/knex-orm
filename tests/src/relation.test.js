import { expect } from 'chai'
import knex from 'knex'
import knexConfig from '../../knexfile'
import RelationType from '../../src/enums/relation-type'
import ModelBase from '../../src/model-base'
import Relation from '../../src/relation'

describe('src', () => {
  describe('Relation', () => {
    let knx = knex(knexConfig.development)
    class User extends ModelBase {
      static knex = knx
    }
    class Address extends ModelBase {
      static knex = knx
    }
    User.register()
    Address.register()

    after(() => knx.destroy())

    describe('constructor', () => {
      it('Should set relation origin class', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.Origin).to.eq(User)
      })

      it('Should set relation target class', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.Target).to.eq(Address)
      })

      it('Should set relation type', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.type).to.eq(RelationType.ONE_TO_MANY)
      })
    })

    describe('#foreignKey', () => {
      it('Should return custom key', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY, 'my_id')
        expect(r.foreignKey).to.eq('my_id')
      })

      it('Should return user_id for ONE_TO_MANY', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.foreignKey).to.eq('user_id')
      })

      it('Should return user_id for MANY_TO_ONE', () => {
        let r = new Relation(User, 'Address', RelationType.MANY_TO_ONE)
        expect(r.foreignKey).to.eq('address_id')
      })
    })

    describe('#OriginAttribute', () => {
      it('Should return foreignKey for ONE_TO_MANY', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.OriginAttribute).to.eq('user_id')
      })

      it('Should return user_id for MANY_TO_ONE', () => {
        let r = new Relation(User, 'Address', RelationType.MANY_TO_ONE)
        expect(r.OriginAttribute).to.eq('id')
      })

      it('Should return target primary key for MANY_TO_MANY')
    })

    describe('#TargetAttribute', () => {
      it('Should return user_id for ONE_TO_MANY', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.TargetAttribute).to.eq('id')
      })

      it('Should return foreignKey for MANY_TO_ONE', () => {
        let r = new Relation(User, 'Address', RelationType.MANY_TO_ONE)
        expect(r.TargetAttribute).to.eq('address_id')
      })

      it('Should return target primary key for MANY_TO_MANY')
    })

    describe('#isTypeFromOne', () => {
      it('Should return false if MANY_TO_ONE', () => {
        let r = new Relation(User, 'Address', RelationType.MANY_TO_ONE)
        expect(r.isTypeFromOne).to.eq(false)
      })

      it('Should return false if MANY_TO_MANY', () => {
        let r = new Relation(User, 'Address', RelationType.MANY_TO_MANY)
        expect(r.isTypeFromOne).to.eq(false)
      })

      it('Should return true if ONE_TO_ONE', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_ONE)
        expect(r.isTypeFromOne).to.eq(true)
      })

      it('Should return true if ONE_TO_MANY', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.isTypeFromOne).to.eq(true)
      })
    })

    describe('#through', () => {
      it('pending')
    })

    describe('#createQuery', () => {
      it('Should equal query', () => {
        let r = new Relation(User, 'Address', RelationType.ONE_TO_MANY)
        expect(r.createQuery([]).toString()).to.eq('select * from "addresses" where "user_id" in (\'originInstance.id\')')
      })
    })

    describe('#applyAsync', () => {
      it('Should return results')
    })
  })
})
