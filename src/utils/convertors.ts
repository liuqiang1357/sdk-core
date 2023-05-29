import BigNumber from 'bignumber.js';

export function integerToDecimal(integer: string, unit: number): string {
	const bn = new BigNumber(integer);
	return bn.dp(0, BigNumber.ROUND_DOWN).shiftedBy(-unit).toFixed();
}

export function decimalToInteger(decimal: string, unit: number): string {
	const bn = new BigNumber(decimal);
	return bn.shiftedBy(unit).dp(0, BigNumber.ROUND_DOWN).toFixed();
}
