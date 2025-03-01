import bigInt from 'big-integer'
import BigNumber from 'bignumber.js'
import { BigintIsh, Rounding } from '../../constants'
import { Fraction } from './fraction'

const ONE_HUNDRED = new Fraction(bigInt(100))

/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction: Fraction): Percent {
  return new Percent(fraction.numerator, fraction.denominator)
}

export class Percent extends Fraction {
  public static fromDecimalPercent(decimal: string): Percent {
    const fraction = Fraction.fromDecimal(new BigNumber(decimal).shiftedBy(-2).toString())
    return toPercent(fraction)
  }

  /**
   * This boolean prevents a fraction from being interpreted as a Percent
   */
  public readonly isPercent: true = true

  add(other: Fraction | BigintIsh): Percent {
    return toPercent(super.add(other))
  }

  subtract(other: Fraction | BigintIsh): Percent {
    return toPercent(super.subtract(other))
  }

  multiply(other: Fraction | BigintIsh): Percent {
    return toPercent(super.multiply(other))
  }

  divide(other: Fraction | BigintIsh): Percent {
    return toPercent(super.divide(other))
  }

  public toSignificant(significantDigits: number = 5, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string {
    return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding)
  }

  public limitDecimals(decimalPlaces: number, rounding?: Rounding): Percent {
    return Percent.fromDecimalPercent(this.toFixed(decimalPlaces, undefined, rounding))
  }
}
