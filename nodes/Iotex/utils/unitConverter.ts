/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Unit Conversion Utilities
 * 
 * IoTeX uses "Rau" as the smallest unit:
 * 1 IOTX = 10^18 Rau (same as Ethereum's Wei to Ether)
 * 
 * Common units:
 * - Rau: Smallest unit (10^0)
 * - Qev: 10^3 Rau
 * - Jing: 10^6 Rau
 * - IOTX: 10^18 Rau
 */

import { ethers } from 'ethers';

/**
 * Unit definitions with their decimal places
 */
export const UNITS: Record<string, number> = {
	rau: 0,
	qev: 3,
	jing: 6,
	iotx: 18,
};

/**
 * Convert Rau to IOTX
 */
export function rauToIotx(rau: string | bigint): string {
	return ethers.formatUnits(rau.toString(), 18);
}

/**
 * Convert IOTX to Rau
 */
export function iotxToRau(iotx: string | number): string {
	return ethers.parseUnits(iotx.toString(), 18).toString();
}

/**
 * Convert between any units
 */
export function convertUnits(
	amount: string | number | bigint,
	fromUnit: string,
	toUnit: string,
): string {
	const fromDecimals = UNITS[fromUnit.toLowerCase()];
	const toDecimals = UNITS[toUnit.toLowerCase()];
	
	if (fromDecimals === undefined) {
		throw new Error(`Unknown unit: ${fromUnit}`);
	}
	if (toDecimals === undefined) {
		throw new Error(`Unknown unit: ${toUnit}`);
	}
	
	// Convert to Rau first, then to target unit
	const amountBigInt = BigInt(amount.toString());
	const fromMultiplier = BigInt(10 ** fromDecimals);
	const toMultiplier = BigInt(10 ** toDecimals);
	
	if (fromDecimals === toDecimals) {
		return amount.toString();
	}
	
	if (fromDecimals > toDecimals) {
		// Going from smaller precision to larger (e.g., Rau to IOTX)
		const divisor = BigInt(10 ** (fromDecimals - toDecimals));
		const result = amountBigInt / divisor;
		const remainder = amountBigInt % divisor;
		
		if (remainder === BigInt(0)) {
			return result.toString();
		}
		
		// Handle decimal places
		const decimalPlaces = fromDecimals - toDecimals;
		const remainderStr = remainder.toString().padStart(decimalPlaces, '0');
		return `${result}.${remainderStr}`.replace(/\.?0+$/, '');
	} else {
		// Going from larger precision to smaller (e.g., IOTX to Rau)
		const multiplier = BigInt(10 ** (toDecimals - fromDecimals));
		return (amountBigInt * multiplier).toString();
	}
}

/**
 * Format IOTX amount for display
 */
export function formatIotx(rau: string | bigint, decimals: number = 4): string {
	const iotx = rauToIotx(rau);
	const num = parseFloat(iotx);
	
	if (num === 0) return '0';
	if (num < 0.0001) return num.toExponential(2);
	
	return num.toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Format token amount based on decimals
 */
export function formatTokenAmount(
	amount: string | bigint,
	decimals: number,
	displayDecimals: number = 4,
): string {
	const formatted = ethers.formatUnits(amount.toString(), decimals);
	const num = parseFloat(formatted);
	
	if (num === 0) return '0';
	if (num < 0.0001) return num.toExponential(2);
	
	return num.toFixed(displayDecimals).replace(/\.?0+$/, '');
}

/**
 * Parse token amount to smallest unit
 */
export function parseTokenAmount(amount: string | number, decimals: number): string {
	return ethers.parseUnits(amount.toString(), decimals).toString();
}

/**
 * Validate amount string
 */
export function isValidAmount(amount: string): boolean {
	try {
		const num = parseFloat(amount);
		return !isNaN(num) && num >= 0 && isFinite(num);
	} catch {
		return false;
	}
}

/**
 * Compare two amounts (in same units)
 */
export function compareAmounts(a: string | bigint, b: string | bigint): number {
	const bigA = BigInt(a.toString());
	const bigB = BigInt(b.toString());
	
	if (bigA < bigB) return -1;
	if (bigA > bigB) return 1;
	return 0;
}

/**
 * Add amounts
 */
export function addAmounts(a: string | bigint, b: string | bigint): string {
	return (BigInt(a.toString()) + BigInt(b.toString())).toString();
}

/**
 * Subtract amounts
 */
export function subtractAmounts(a: string | bigint, b: string | bigint): string {
	const result = BigInt(a.toString()) - BigInt(b.toString());
	if (result < 0) {
		throw new Error('Result would be negative');
	}
	return result.toString();
}

/**
 * Multiply amount by percentage
 */
export function multiplyByPercentage(amount: string | bigint, percentage: number): string {
	const bigAmount = BigInt(amount.toString());
	const multiplier = BigInt(Math.floor(percentage * 10000));
	return ((bigAmount * multiplier) / BigInt(10000)).toString();
}

/**
 * Calculate gas cost in IOTX
 */
export function calculateGasCost(gasLimit: string | bigint, gasPrice: string | bigint): string {
	const cost = BigInt(gasLimit.toString()) * BigInt(gasPrice.toString());
	return rauToIotx(cost.toString());
}
