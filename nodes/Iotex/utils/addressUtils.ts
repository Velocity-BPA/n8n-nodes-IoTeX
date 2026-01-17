/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Address Utilities
 * 
 * IoTeX supports two address formats:
 * - io-address: Native format starting with "io1" (bech32 encoding)
 * - 0x-address: EVM-compatible format (hex encoding)
 * 
 * Both formats represent the same underlying address and can be converted.
 */

import { ethers } from 'ethers';

// Bech32 charset for io-address encoding
const BECH32_CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const BECH32_GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];

/**
 * Validate an io-address format
 */
export function isValidIoAddress(address: string): boolean {
	if (!address) return false;
	if (!address.startsWith('io1')) return false;
	if (address.length !== 41) return false;
	
	// Check bech32 characters
	const data = address.slice(3).toLowerCase();
	for (const char of data) {
		if (!BECH32_CHARSET.includes(char)) return false;
	}
	
	return true;
}

/**
 * Validate a 0x-address format
 */
export function isValidHexAddress(address: string): boolean {
	if (!address) return false;
	if (!address.startsWith('0x')) return false;
	if (address.length !== 42) return false;
	
	try {
		return ethers.isAddress(address);
	} catch {
		return false;
	}
}

/**
 * Validate any IoTeX address (io or 0x format)
 */
export function isValidAddress(address: string): boolean {
	return isValidIoAddress(address) || isValidHexAddress(address);
}

/**
 * Convert 5-bit groups to 8-bit bytes
 */
function bech32ToBytes(chars: string): Uint8Array {
	const values: number[] = [];
	for (const char of chars) {
		values.push(BECH32_CHARSET.indexOf(char));
	}
	
	// Convert from 5-bit to 8-bit
	let bits = 0;
	let value = 0;
	const bytes: number[] = [];
	
	for (const v of values) {
		value = (value << 5) | v;
		bits += 5;
		if (bits >= 8) {
			bits -= 8;
			bytes.push((value >> bits) & 0xff);
		}
	}
	
	return new Uint8Array(bytes);
}

/**
 * Convert 8-bit bytes to 5-bit groups
 */
function bytesToBech32(bytes: Uint8Array): string {
	let bits = 0;
	let value = 0;
	let result = '';
	
	for (const byte of bytes) {
		value = (value << 8) | byte;
		bits += 8;
		while (bits >= 5) {
			bits -= 5;
			result += BECH32_CHARSET[(value >> bits) & 0x1f];
		}
	}
	
	if (bits > 0) {
		result += BECH32_CHARSET[(value << (5 - bits)) & 0x1f];
	}
	
	return result;
}

/**
 * Calculate bech32 checksum
 */
function bech32Checksum(hrp: string, data: string): string {
	const values: number[] = [];
	
	// Add HRP expanded
	for (const char of hrp) {
		values.push(char.charCodeAt(0) >> 5);
	}
	values.push(0);
	for (const char of hrp) {
		values.push(char.charCodeAt(0) & 31);
	}
	
	// Add data
	for (const char of data) {
		values.push(BECH32_CHARSET.indexOf(char));
	}
	
	// Add padding for checksum
	for (let i = 0; i < 6; i++) {
		values.push(0);
	}
	
	// Calculate polymod
	let chk = 1;
	for (const v of values) {
		const top = chk >> 25;
		chk = ((chk & 0x1ffffff) << 5) ^ v;
		for (let i = 0; i < 5; i++) {
			if ((top >> i) & 1) {
				chk ^= BECH32_GENERATOR[i];
			}
		}
	}
	chk ^= 1;
	
	// Convert checksum to characters
	let checksum = '';
	for (let i = 0; i < 6; i++) {
		checksum += BECH32_CHARSET[(chk >> (5 * (5 - i))) & 31];
	}
	
	return checksum;
}

/**
 * Convert io-address to 0x-address
 */
export function ioToHex(ioAddress: string): string {
	if (!isValidIoAddress(ioAddress)) {
		throw new Error(`Invalid io-address: ${ioAddress}`);
	}
	
	// Remove "io1" prefix and checksum (last 6 chars)
	const data = ioAddress.slice(3, -6);
	const bytes = bech32ToBytes(data);
	
	return '0x' + Buffer.from(bytes).toString('hex');
}

/**
 * Convert 0x-address to io-address
 */
export function hexToIo(hexAddress: string): string {
	if (!isValidHexAddress(hexAddress)) {
		throw new Error(`Invalid hex address: ${hexAddress}`);
	}
	
	// Remove 0x prefix and convert to bytes
	const bytes = new Uint8Array(Buffer.from(hexAddress.slice(2), 'hex'));
	
	// Convert to bech32 data
	const data = bytesToBech32(bytes);
	
	// Calculate and append checksum
	const checksum = bech32Checksum('io', '1' + data);
	
	return 'io1' + data + checksum;
}

/**
 * Ensure address is in io-address format
 */
export function toIoAddress(address: string): string {
	if (isValidIoAddress(address)) {
		return address;
	}
	if (isValidHexAddress(address)) {
		return hexToIo(address);
	}
	throw new Error(`Invalid address: ${address}`);
}

/**
 * Ensure address is in 0x-address format
 */
export function toHexAddress(address: string): string {
	if (isValidHexAddress(address)) {
		return address;
	}
	if (isValidIoAddress(address)) {
		return ioToHex(address);
	}
	throw new Error(`Invalid address: ${address}`);
}

/**
 * Get both address formats
 */
export function getAddressFormats(address: string): { io: string; hex: string } {
	if (isValidIoAddress(address)) {
		return {
			io: address,
			hex: ioToHex(address),
		};
	}
	if (isValidHexAddress(address)) {
		return {
			io: hexToIo(address),
			hex: address,
		};
	}
	throw new Error(`Invalid address: ${address}`);
}

/**
 * Generate a new keypair
 */
export function generateKeypair(): { privateKey: string; publicKey: string; ioAddress: string; hexAddress: string } {
	const wallet = ethers.Wallet.createRandom();
	return {
		privateKey: wallet.privateKey,
		publicKey: wallet.publicKey,
		ioAddress: hexToIo(wallet.address),
		hexAddress: wallet.address,
	};
}

/**
 * Get address from private key
 */
export function privateKeyToAddress(privateKey: string): { ioAddress: string; hexAddress: string } {
	const wallet = new ethers.Wallet(privateKey);
	return {
		ioAddress: hexToIo(wallet.address),
		hexAddress: wallet.address,
	};
}
