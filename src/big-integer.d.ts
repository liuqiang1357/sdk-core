import { BigNumber } from "big-integer";

declare module 'big-integer' {
  
  interface BigIntegerStatic {
    (bigInt: BigNumber): BigInteger;
  }
}