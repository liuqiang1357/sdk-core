import bigInt, { BigInteger } from 'big-integer'
import invariant from 'tiny-invariant'
import _Decimal from 'decimal.js-light'
import _Big, { RoundingMode } from 'big.js'
import toFormat from 'toformat'

import { BigintIsh, Rounding } from '../../constants'

const Decimal = toFormat(_Decimal)
const Big = toFormat(_Big)

const toSignificantRounding = {
  [Rounding.ROUND_DOWN]: Decimal.ROUND_DOWN,
  [Rounding.ROUND_HALF_UP]: Decimal.ROUND_HALF_UP,
  [Rounding.ROUND_UP]: Decimal.ROUND_UP
}

const toFixedRounding = {
  [Rounding.ROUND_DOWN]: RoundingMode.RoundDown,
  [Rounding.ROUND_HALF_UP]: RoundingMode.RoundHalfUp,
  [Rounding.ROUND_UP]: RoundingMode.RoundUp
}

export class Fraction {
  public readonly numerator: BigInteger
  public readonly denominator: BigInteger

  public constructor(numerator: BigintIsh, denominator: BigintIsh = bigInt(1)) {
    const numeratorBi = bigInt(numerator)
    const denominatorBi = bigInt(denominator)

    this.numerator =
      denominatorBi.isZero() && !numeratorBi.isZero()
        ? numeratorBi.isPositive()
          ? bigInt(1)
          : bigInt(-1)
        : numeratorBi
    this.denominator = numeratorBi.isZero() && !denominatorBi.isZero() ? bigInt(1) : denominatorBi
  }

  private static tryParseFraction(fractionish: BigintIsh | Fraction): Fraction {
    if (bigInt.isInstance(fractionish) || typeof fractionish === 'number' || typeof fractionish === 'string')
      return new Fraction(fractionish)

    if ('numerator' in fractionish && 'denominator' in fractionish) return fractionish
    throw new Error('Could not parse fraction')
  }

  // performs floor division
  public get quotient(): BigInteger {
    return this.numerator.divide(this.denominator)
  }

  // remainder after floor division
  public get remainder(): Fraction {
    return new Fraction(this.numerator.remainder(this.denominator), this.denominator)
  }

  public invert(): Fraction {
    return new Fraction(this.denominator, this.numerator)
  }

  public add(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (
      (this.numerator.isZero() && this.denominator.isZero()) ||
      (otherParsed.numerator.isZero() && otherParsed.denominator.isZero())
    ) {
      return new Fraction(0, 0)
    }
    if (this.denominator.equals(otherParsed.denominator)) {
      return new Fraction(this.numerator.add(otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      this.numerator.multiply(otherParsed.denominator).add(otherParsed.numerator.multiply(this.denominator)),
      this.denominator.multiply(otherParsed.denominator)
    )
  }

  public subtract(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    if (
      (this.numerator.isZero() && this.denominator.isZero()) ||
      (otherParsed.numerator.isZero() && otherParsed.denominator.isZero())
    ) {
      return new Fraction(0, 0)
    }
    if (this.denominator.equals(otherParsed.denominator)) {
      return new Fraction(this.numerator.subtract(otherParsed.numerator), this.denominator)
    }
    return new Fraction(
      this.numerator.multiply(otherParsed.denominator).subtract(otherParsed.numerator.multiply(this.denominator)),
      this.denominator.multiply(otherParsed.denominator)
    )
  }

  public lessThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    const difference = this.asFraction.subtract(otherParsed)
    return (
      (difference.numerator.isNegative() && !difference.denominator.isNegative()) ||
      (difference.numerator.isPositive() && difference.denominator.isNegative())
    )
  }

  public equalTo(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    if (this.denominator.isZero() && otherParsed.denominator.isZero()) {
      return this.numerator.equals(otherParsed.numerator)
    }
    const difference = this.asFraction.subtract(otherParsed)
    return difference.numerator.isZero() && !difference.denominator.isZero()
  }

  public greaterThan(other: Fraction | BigintIsh): boolean {
    const otherParsed = Fraction.tryParseFraction(other)
    const difference = this.asFraction.subtract(otherParsed)
    return (
      (difference.numerator.isPositive() && !difference.denominator.isNegative()) ||
      (difference.numerator.isNegative() && difference.denominator.isNegative())
    )
  }

  public multiply(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(
      this.numerator.multiply(otherParsed.numerator),
      this.denominator.multiply(otherParsed.denominator)
    )
  }

  public divide(other: Fraction | BigintIsh): Fraction {
    const otherParsed = Fraction.tryParseFraction(other)
    return new Fraction(
      this.numerator.multiply(otherParsed.denominator),
      this.denominator.multiply(otherParsed.numerator)
    )
  }

  private getDivideByZeroResult(): string {
    if (this.numerator.gt(0)) {
      return 'Infinity'
    } else if (this.numerator.lt(0)) {
      return '-Infinity'
    }
    return 'NaN'
  }

  public toSignificant(
    significantDigits: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`)
    invariant(significantDigits > 0, `${significantDigits} is not positive.`)

    if (this.denominator.isZero()) {
      return this.getDivideByZeroResult()
    }

    Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] })
    const quotient = new Decimal(this.numerator.toString())
      .div(this.denominator.toString())
      .toSignificantDigits(significantDigits)
    return quotient.toFormat(quotient.decimalPlaces(), format)
  }

  public toFixed(
    decimalPlaces: number,
    format: object = { groupSeparator: '' },
    rounding: Rounding = Rounding.ROUND_HALF_UP
  ): string {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)

    if (this.denominator.isZero()) {
      return this.getDivideByZeroResult()
    }

    Big.DP = decimalPlaces
    Big.RM = toFixedRounding[rounding]
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format)
  }

  /**
   * Helper method for converting any super class back to a fraction
   */
  public get asFraction(): Fraction {
    return new Fraction(this.numerator, this.denominator)
  }
}
