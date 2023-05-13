import bigInt from 'big-integer'
import { Fraction } from './fraction'

describe('Fraction', () => {
  describe('#quotient', () => {
    it('floor division', () => {
      expect(new Fraction(bigInt(8), bigInt(3)).quotient).toEqual(bigInt(2)) // one below
      expect(new Fraction(bigInt(12), bigInt(4)).quotient).toEqual(bigInt(3)) // exact
      expect(new Fraction(bigInt(16), bigInt(5)).quotient).toEqual(bigInt(3)) // one above
    })
  })
  describe('#remainder', () => {
    it('returns fraction after divison', () => {
      expect(new Fraction(bigInt(8), bigInt(3)).remainder).toEqual(new Fraction(bigInt(2), bigInt(3)))
      expect(new Fraction(bigInt(12), bigInt(4)).remainder).toEqual(new Fraction(bigInt(0), bigInt(4)))
      expect(new Fraction(bigInt(16), bigInt(5)).remainder).toEqual(new Fraction(bigInt(1), bigInt(5)))
    })
  })
  describe('#invert', () => {
    it('flips num and denom', () => {
      expect(new Fraction(bigInt(5), bigInt(10)).invert().numerator).toEqual(bigInt(10))
      expect(new Fraction(bigInt(5), bigInt(10)).invert().denominator).toEqual(bigInt(5))
    })
  })
  describe('#add', () => {
    it('multiples denoms and adds nums', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).add(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(52), bigInt(120))
      )
    })
    it('same denom', () => {
      expect(new Fraction(bigInt(1), bigInt(5)).add(new Fraction(bigInt(2), bigInt(5)))).toEqual(
        new Fraction(bigInt(3), bigInt(5))
      )
    })
  })
  describe('#subtract', () => {
    it('multiples denoms and subtracts nums', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).subtract(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(-28), bigInt(120))
      )
    })
    it('same denom', () => {
      expect(new Fraction(bigInt(3), bigInt(5)).subtract(new Fraction(bigInt(2), bigInt(5)))).toEqual(
        new Fraction(bigInt(1), bigInt(5))
      )
    })
  })
  describe('#lessThan', () => {
    it('correct', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).lessThan(new Fraction(bigInt(4), bigInt(12)))).toBe(true)
      expect(new Fraction(bigInt(1), bigInt(3)).lessThan(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
      expect(new Fraction(bigInt(5), bigInt(12)).lessThan(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
    })
  })
  describe('#equalTo', () => {
    it('correct', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).equalTo(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
      expect(new Fraction(bigInt(1), bigInt(3)).equalTo(new Fraction(bigInt(4), bigInt(12)))).toBe(true)
      expect(new Fraction(bigInt(5), bigInt(12)).equalTo(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
    })
  })
  describe('#greaterThan', () => {
    it('correct', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).greaterThan(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
      expect(new Fraction(bigInt(1), bigInt(3)).greaterThan(new Fraction(bigInt(4), bigInt(12)))).toBe(false)
      expect(new Fraction(bigInt(5), bigInt(12)).greaterThan(new Fraction(bigInt(4), bigInt(12)))).toBe(true)
    })
  })
  describe('#multiplty', () => {
    it('correct', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).multiply(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(4), bigInt(120))
      )
      expect(new Fraction(bigInt(1), bigInt(3)).multiply(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(4), bigInt(36))
      )
      expect(new Fraction(bigInt(5), bigInt(12)).multiply(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(20), bigInt(144))
      )
    })
  })
  describe('#divide', () => {
    it('correct', () => {
      expect(new Fraction(bigInt(1), bigInt(10)).divide(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(12), bigInt(40))
      )
      expect(new Fraction(bigInt(1), bigInt(3)).divide(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(12), bigInt(12))
      )
      expect(new Fraction(bigInt(5), bigInt(12)).divide(new Fraction(bigInt(4), bigInt(12)))).toEqual(
        new Fraction(bigInt(60), bigInt(48))
      )
    })
  })
  describe('#asFraction', () => {
    it('returns an equivalent but not the same reference fraction', () => {
      const f = new Fraction(1, 2)
      expect(f.asFraction).toEqual(f)
      expect(f === f.asFraction).toEqual(false)
    })
  })
  describe('NaN, Infinity and -Infinity', () => {
    it('correct', () => {
      const A = new Fraction(1, 1)
      const NA = new Fraction(0, 0)
      const I = new Fraction(1, 0)
      const NI = new Fraction(-1, 0)
      const Z = new Fraction(0, 1)

      expect(NA.equalTo(A)).toEqual(false)
      expect(I.equalTo(I)).toEqual(true)
      expect(I.equalTo(NI)).toEqual(false)
      expect(I.equalTo(A)).toEqual(false)

      expect(NA.greaterThan(A)).toEqual(false)
      expect(A.greaterThan(NA)).toEqual(false)
      expect(I.greaterThan(A)).toEqual(true)

      expect(A.lessThan(NA)).toEqual(false)
      expect(NA.lessThan(A)).toEqual(false)
      expect(NI.lessThan(A)).toEqual(true)
      
      expect(NA.add(A).equalTo(NA)).toEqual(true)
      expect(I.add(A).equalTo(I)).toEqual(true)

      expect(NA.subtract(A).equalTo(NA)).toEqual(true)
      expect(I.subtract(I).equalTo(NA)).toEqual(true)

      expect(NA.multiply(A).equalTo(NA)).toEqual(true)
      expect(I.multiply(NI).equalTo(NI)).toEqual(true)

      expect(NA.divide(A).equalTo(NA)).toEqual(true)
      expect(A.divide(I).equalTo(Z)).toEqual(true)
      expect(A.divide(NI).equalTo(Z)).toEqual(true)
    })
  })
})
