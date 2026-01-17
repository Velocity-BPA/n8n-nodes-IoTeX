/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	rauToIotx,
	iotxToRau,
	convertUnits,
	formatIotx,
	formatTokenAmount,
	parseTokenAmount,
} from '../../nodes/Iotex/utils/unitConverter';

describe('unitConverter', () => {
	describe('rauToIotx', () => {
		it('should convert 1 IOTX worth of Rau', () => {
			expect(rauToIotx('1000000000000000000')).toBe('1');
		});

		it('should convert 0 Rau', () => {
			expect(rauToIotx('0')).toBe('0');
		});

		it('should handle decimal amounts', () => {
			expect(rauToIotx('1500000000000000000')).toBe('1.5');
		});

		it('should handle large amounts', () => {
			expect(rauToIotx('1000000000000000000000')).toBe('1000');
		});
	});

	describe('iotxToRau', () => {
		it('should convert 1 IOTX to Rau', () => {
			expect(iotxToRau('1')).toBe('1000000000000000000');
		});

		it('should convert 0 IOTX', () => {
			expect(iotxToRau('0')).toBe('0');
		});

		it('should handle decimal IOTX', () => {
			expect(iotxToRau('1.5')).toBe('1500000000000000000');
		});

		it('should handle small decimal amounts', () => {
			expect(iotxToRau('0.000000000000000001')).toBe('1');
		});
	});

	describe('convertUnits', () => {
		it('should convert from Rau to IOTX', () => {
			expect(convertUnits('1000000000000000000', 'rau', 'iotx')).toBe('1');
		});

		it('should convert from IOTX to Rau', () => {
			expect(convertUnits('1', 'iotx', 'rau')).toBe('1000000000000000000');
		});

		it('should handle same unit conversion', () => {
			expect(convertUnits('100', 'iotx', 'iotx')).toBe('100');
		});
	});

	describe('formatIotx', () => {
		it('should format with default decimals', () => {
			const result = formatIotx('1234567890000000000');
			expect(result).toContain('1.23');
		});

		it('should format 0 correctly', () => {
			expect(formatIotx('0')).toBe('0 IOTX');
		});
	});

	describe('formatTokenAmount', () => {
		it('should format with 18 decimals', () => {
			expect(formatTokenAmount('1000000000000000000', 18)).toBe('1');
		});

		it('should format with 6 decimals (USDT-like)', () => {
			expect(formatTokenAmount('1000000', 6)).toBe('1');
		});

		it('should format with 8 decimals (BTC-like)', () => {
			expect(formatTokenAmount('100000000', 8)).toBe('1');
		});
	});

	describe('parseTokenAmount', () => {
		it('should parse with 18 decimals', () => {
			expect(parseTokenAmount('1', 18)).toBe('1000000000000000000');
		});

		it('should parse with 6 decimals', () => {
			expect(parseTokenAmount('1', 6)).toBe('1000000');
		});

		it('should handle decimal input', () => {
			expect(parseTokenAmount('1.5', 18)).toBe('1500000000000000000');
		});
	});
});
