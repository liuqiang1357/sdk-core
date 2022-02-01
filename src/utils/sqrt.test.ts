import bigInt from 'big-integer'
import { MaxUint256 } from '../constants'
import { sqrt } from './sqrt'

describe('#sqrt', () => {
  it('correct for 0-1000', () => {
    for (let i = 0; i < 1000; i++) {
      expect(sqrt(bigInt(i))).toEqual(bigInt(Math.floor(Math.sqrt(i))))
    }
  })

  describe('correct for all even powers of 2', () => {
    for (let i = 0; i < 256; i++) {
      it(`2^${i * 2}`, () => {
        const root = bigInt(2).pow(bigInt(i))
        const rootSquared = root.multiply(root)

        expect(sqrt(rootSquared)).toEqual(root)
      })
    }
  })

  it('correct for MaxUint256', () => {
    expect(sqrt(MaxUint256)).toEqual(bigInt('340282366920938463463374607431768211455'))
  })
})
