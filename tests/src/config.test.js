import { expect } from 'chai'
import Config from '../../lib/config'

describe('lib', () => {
  describe('Config', () => {
    it('Should not include "from" method', () => {
      expect(Config.KNEX_ALLOWED_QUERY_METHODS.indexOf('from')).to.eq(-1)
    })

    it('Should not include "fromJS" method', () => {
      expect(Config.KNEX_ALLOWED_QUERY_METHODS.indexOf('fromJS')).to.eq(-1)
    })

    it('Should not include "into" method', () => {
      expect(Config.KNEX_ALLOWED_QUERY_METHODS.indexOf('into')).to.eq(-1)
    })

    it('Should not include "table" method', () => {
      expect(Config.KNEX_ALLOWED_QUERY_METHODS.indexOf('table')).to.eq(-1)
    })

    it('Should not include "queryBuilder" method', () => {
      expect(Config.KNEX_ALLOWED_QUERY_METHODS.indexOf('queryBuilder')).to.eq(-1)
    })
  })
})
