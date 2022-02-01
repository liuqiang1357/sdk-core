import bigInt, { BigInteger } from 'big-integer'
import invariant from 'tiny-invariant'

export const MAX_SAFE_INTEGER = bigInt(Number.MAX_SAFE_INTEGER)

const ZERO = bigInt(0)
const ONE = bigInt(1)
const TWO = bigInt(2)

/**
 * Computes floor(sqrt(value))
 * @param value the value for which to compute the square root, rounded down
 */
export function sqrt(value: BigInteger): BigInteger {
  invariant(value.greaterOrEquals(ZERO), 'NEGATIVE')

  // rely on built in sqrt if possible
  if (value.lesser(MAX_SAFE_INTEGER)) {
    return bigInt(Math.floor(Math.sqrt(value.toJSNumber())))
  }

  let z: BigInteger
  let x: BigInteger
  z = value
  x = value.divide(TWO).add(ONE)
  while (x.lesser(z)) {
    z = x
    x = value
      .divide(x)
      .add(x)
      .divide(TWO)
  }
  return z
}
