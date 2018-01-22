import { expect } from 'chai'
import RelationType from '../../../src/enums/relation-type'

describe('Enums', () => {
  describe('RelationType', () => {
    it('Should return ONE_TO_MANY relation type', () => {
      expect(RelationType.ONE_TO_MANY).to.eq(1)
    })

    it('Should return ONE_TO_ONE relation type', () => {
      expect(RelationType.ONE_TO_ONE).to.eq(2)
    })

    it('Should return MANY_TO_ONE relation type', () => {
      expect(RelationType.MANY_TO_ONE).to.eq(3)
    })

    it('Should return MANY_TO_MANY relation type', () => {
      expect(RelationType.MANY_TO_MANY).to.eq(4)
    })
  })
})
