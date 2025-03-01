import bigInt, { BigInteger } from 'big-integer'
import invariant from 'tiny-invariant'
import { Currency } from '../currency'
import { Token } from '../token'
import { Fraction } from './fraction'
import _Big from 'big.js'

import toFormat from 'toformat'
import { BigintIsh, Rounding } from '../../constants'
import BigNumber from 'bignumber.js'

const Big = toFormat(_Big)

export class CurrencyAmount<T extends Currency> extends Fraction {
  public readonly currency: T
  public readonly decimalScale: BigInteger

  /**
   * Construct a currency amount with a denominator that is not equal to 1
   * @param currency the currency
   * @param numerator the numerator of the fractional token amount
   * @param denominator the denominator of the fractional token amount
   */
  public static fromFractionalAmount<T extends Currency>(
    currency: T,
    numerator: BigintIsh,
    denominator: BigintIsh
  ): CurrencyAmount<T> {
    return new CurrencyAmount(currency, numerator, denominator)
  }

  /**
   * Returns a new currency amount instance from the unitless amount of token, i.e. the raw amount
   * @param currency the currency in the amount
   * @param rawAmount the raw token or ether amount
   */
  public static fromRawAmount<T extends Currency>(currency: T, rawAmount: BigintIsh): CurrencyAmount<T> {
    if (rawAmount === 'NaN' || rawAmount === 'Infinity' || rawAmount === '-Infinity') {
      const fraction = Fraction.fromDecimal(rawAmount);
      return CurrencyAmount.fromFractionalAmount(currency, fraction.numerator, fraction.denominator);
    }
    return new CurrencyAmount(currency, rawAmount)
  }

    /**
   * Returns a new currency amount instance from the decimal amount of token
   * @param currency the currency in the amount
   * @param decimal the decimal amount
   */
  public static fromDecimalAmount<T extends Currency>(currency: T, decimal: string): CurrencyAmount<T> {
    const fraction = Fraction.fromDecimal(new BigNumber(decimal).shiftedBy(currency.decimals).toString())
    return CurrencyAmount.fromFractionalAmount(currency, fraction.numerator, fraction.denominator)
  }

  protected constructor(currency: T, numerator: BigintIsh, denominator?: BigintIsh) {
    super(numerator, denominator)
    this.currency = currency
    this.decimalScale = bigInt(10).pow(bigInt(currency.decimals))
  }

  public add(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const added = super.add(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, added.numerator, added.denominator)
  }

  public subtract(other: CurrencyAmount<T>): CurrencyAmount<T> {
    invariant(this.currency.equals(other.currency), 'CURRENCY')
    const subtracted = super.subtract(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, subtracted.numerator, subtracted.denominator)
  }

  public multiply(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const multiplied = super.multiply(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, multiplied.numerator, multiplied.denominator)
  }

  public divide(other: Fraction | BigintIsh): CurrencyAmount<T> {
    const divided = super.divide(other)
    return CurrencyAmount.fromFractionalAmount(this.currency, divided.numerator, divided.denominator)
  }

  public toSignificant(
    significantDigits: number = 6,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    return super.divide(this.decimalScale).toSignificant(significantDigits, format, rounding)
  }

  public toFixed(
    decimalPlaces: number = this.currency.decimals,
    format?: object,
    rounding: Rounding = Rounding.ROUND_DOWN
  ): string {
    invariant(decimalPlaces <= this.currency.decimals, 'DECIMALS')
    return super.divide(this.decimalScale).toFixed(decimalPlaces, format, rounding)
  }

  public toExact(format: object = { groupSeparator: '' }): string {
    Big.DP = this.currency.decimals
    return new Big(this.quotient.toString()).div(this.decimalScale.toString()).toFormat(format)
  }

  public get wrapped(): CurrencyAmount<Token> {
    if (this.currency.isToken) return this as CurrencyAmount<Token>
    return CurrencyAmount.fromFractionalAmount(this.currency.wrapped, this.numerator, this.denominator)
  }

  public get rawAmount(): string {
    return this.asFraction.toFixed(0)
  }

  public limitDecimals(decimalPlaces?: number, rounding?: Rounding): CurrencyAmount<T> {
    return CurrencyAmount.fromDecimalAmount(this.currency, this.toFixed(decimalPlaces, undefined, rounding))
  }
}
