/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
	toHexAddress,
	toIoAddress,
	isValidAddress,
	getAddressFormats,
} from '../../nodes/Iotex/utils/addressUtils';

describe('addressUtils', () => {
	describe('isValidAddress', () => {
		it('should validate io-format addresses', () => {
			expect(isValidAddress('io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms')).toBe(true);
		});

		it('should validate 0x-format addresses', () => {
			expect(isValidAddress('0xda7e12ef57c236a06117c5e0d04a228e7181cf36')).toBe(true);
		});

		it('should reject invalid addresses', () => {
			expect(isValidAddress('invalid')).toBe(false);
			expect(isValidAddress('')).toBe(false);
			expect(isValidAddress('0x123')).toBe(false);
		});
	});

	describe('toHexAddress', () => {
		it('should convert io-format to 0x-format', () => {
			const ioAddr = 'io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms';
			const hexAddr = toHexAddress(ioAddr);
			expect(hexAddr).toMatch(/^0x[a-fA-F0-9]{40}$/);
		});

		it('should return 0x addresses unchanged', () => {
			const hexAddr = '0xda7e12ef57c236a06117c5e0d04a228e7181cf36';
			expect(toHexAddress(hexAddr)).toBe(hexAddr.toLowerCase());
		});
	});

	describe('toIoAddress', () => {
		it('should convert 0x-format to io-format', () => {
			const hexAddr = '0xda7e12ef57c236a06117c5e0d04a228e7181cf36';
			const ioAddr = toIoAddress(hexAddr);
			expect(ioAddr).toMatch(/^io1[a-z0-9]+$/);
		});

		it('should return io addresses unchanged', () => {
			const ioAddr = 'io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms';
			expect(toIoAddress(ioAddr)).toBe(ioAddr);
		});
	});

	describe('getAddressFormats', () => {
		it('should return both formats from io-address', () => {
			const ioAddr = 'io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms';
			const formats = getAddressFormats(ioAddr);
			expect(formats.ioAddress).toBe(ioAddr);
			expect(formats.hexAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
		});

		it('should return both formats from hex-address', () => {
			const hexAddr = '0xda7e12ef57c236a06117c5e0d04a228e7181cf36';
			const formats = getAddressFormats(hexAddr);
			expect(formats.hexAddress).toBe(hexAddr.toLowerCase());
			expect(formats.ioAddress).toMatch(/^io1[a-z0-9]+$/);
		});
	});
});
