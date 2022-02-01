import bigInt, { BigInteger } from 'big-integer'

// exports for external consumption
export type BigintIsh = BigInteger | number | string

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const MaxUint256 = bigInt('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 16)
