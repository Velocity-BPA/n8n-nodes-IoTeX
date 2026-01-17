/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Device Utilities
 * 
 * Utilities for working with IoT devices on IoTeX:
 * - Device registration and identity
 * - Pebble Tracker integration
 * - W3bstream data handling
 * - Device DID management
 */

import { ethers } from 'ethers';
import crypto from 'crypto';

/**
 * Device information structure
 */
export interface DeviceInfo {
	deviceId: string;
	owner: string;
	publicKey: string;
	metadata: Record<string, unknown>;
	registeredAt: number;
	lastActivity: number;
	isActive: boolean;
}

/**
 * Pebble sensor data structure
 */
export interface PebbleSensorData {
	timestamp: number;
	latitude: number;
	longitude: number;
	altitude: number;
	temperature: number;
	humidity: number;
	pressure: number;
	accelerometer: {
		x: number;
		y: number;
		z: number;
	};
	gyroscope: {
		x: number;
		y: number;
		z: number;
	};
	snr: number;
	vbat: number;
	gasResistance: number;
	light: number;
}

/**
 * Device DID document
 */
export interface DeviceDIDDocument {
	'@context': string[];
	id: string;
	controller: string;
	verificationMethod: Array<{
		id: string;
		type: string;
		controller: string;
		publicKeyHex?: string;
		publicKeyMultibase?: string;
	}>;
	authentication: string[];
	assertionMethod?: string[];
	created: string;
	updated: string;
}

/**
 * Generate a device ID
 */
export function generateDeviceId(seed?: string): string {
	const data = seed || crypto.randomBytes(32).toString('hex');
	return ethers.keccak256(ethers.toUtf8Bytes(data)).slice(2, 66);
}

/**
 * Create a device DID
 */
export function createDeviceDID(
	deviceId: string,
	publicKey: string,
	controller: string,
): DeviceDIDDocument {
	const did = `did:io:${deviceId}`;
	const now = new Date().toISOString();
	
	return {
		'@context': [
			'https://www.w3.org/ns/did/v1',
			'https://w3id.org/security/suites/ed25519-2020/v1',
		],
		id: did,
		controller: controller,
		verificationMethod: [
			{
				id: `${did}#key-1`,
				type: 'EcdsaSecp256k1VerificationKey2019',
				controller: did,
				publicKeyHex: publicKey.startsWith('0x') ? publicKey.slice(2) : publicKey,
			},
		],
		authentication: [`${did}#key-1`],
		assertionMethod: [`${did}#key-1`],
		created: now,
		updated: now,
	};
}

/**
 * Verify device signature
 */
export function verifyDeviceSignature(
	message: string,
	signature: string,
	publicKey: string,
): boolean {
	try {
		const messageHash = ethers.hashMessage(message);
		const recoveredAddress = ethers.recoverAddress(messageHash, signature);
		const expectedAddress = ethers.computeAddress(publicKey);
		return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
	} catch {
		return false;
	}
}

/**
 * Sign device data
 */
export function signDeviceData(
	data: Record<string, unknown>,
	privateKey: string,
): string {
	const message = JSON.stringify(data);
	const wallet = new ethers.Wallet(privateKey);
	return wallet.signMessageSync(message);
}

/**
 * Parse Pebble sensor data from raw bytes
 */
export function parsePebbleData(rawData: string): PebbleSensorData {
	// Pebble data is packed in a specific binary format
	const data = Buffer.from(rawData.replace('0x', ''), 'hex');
	
	let offset = 0;
	
	// Read values based on Pebble data format
	const timestamp = data.readUInt32LE(offset);
	offset += 4;
	
	const latitude = data.readInt32LE(offset) / 1e7;
	offset += 4;
	
	const longitude = data.readInt32LE(offset) / 1e7;
	offset += 4;
	
	const altitude = data.readInt32LE(offset) / 100;
	offset += 4;
	
	const temperature = data.readInt16LE(offset) / 100;
	offset += 2;
	
	const humidity = data.readUInt16LE(offset) / 100;
	offset += 2;
	
	const pressure = data.readUInt32LE(offset) / 100;
	offset += 4;
	
	const accelX = data.readInt16LE(offset) / 1000;
	offset += 2;
	const accelY = data.readInt16LE(offset) / 1000;
	offset += 2;
	const accelZ = data.readInt16LE(offset) / 1000;
	offset += 2;
	
	const gyroX = data.readInt16LE(offset) / 100;
	offset += 2;
	const gyroY = data.readInt16LE(offset) / 100;
	offset += 2;
	const gyroZ = data.readInt16LE(offset) / 100;
	offset += 2;
	
	const snr = data.readUInt8(offset);
	offset += 1;
	
	const vbat = data.readUInt16LE(offset) / 1000;
	offset += 2;
	
	const gasResistance = data.readUInt32LE(offset);
	offset += 4;
	
	const light = data.readUInt16LE(offset);
	
	return {
		timestamp,
		latitude,
		longitude,
		altitude,
		temperature,
		humidity,
		pressure,
		accelerometer: { x: accelX, y: accelY, z: accelZ },
		gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
		snr,
		vbat,
		gasResistance,
		light,
	};
}

/**
 * Validate Pebble IMEI format
 */
export function isValidPebbleIMEI(imei: string): boolean {
	// IMEI is 15 digits
	if (!/^\d{15}$/.test(imei)) return false;
	
	// Luhn checksum validation
	let sum = 0;
	for (let i = 0; i < 15; i++) {
		let digit = parseInt(imei[i], 10);
		if (i % 2 === 1) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
	}
	
	return sum % 10 === 0;
}

/**
 * Create W3bstream message payload
 */
export function createW3bstreamMessage(
	deviceId: string,
	data: Record<string, unknown>,
	signature?: string,
): Record<string, unknown> {
	return {
		header: {
			device_id: deviceId,
			timestamp: Date.now(),
			version: '1.0',
		},
		payload: data,
		signature: signature || '',
	};
}

/**
 * Generate proof request for W3bstream
 */
export function createProofRequest(
	projectId: string,
	appletId: string,
	data: unknown[],
): Record<string, unknown> {
	return {
		projectID: projectId,
		appletID: appletId,
		data: data,
		timestamp: Date.now(),
	};
}

/**
 * Validate W3bstream proof
 */
export function validateProof(
	proof: string,
	publicInputs: string[],
): boolean {
	// This would typically verify a ZK proof
	// Simplified validation for now
	try {
		const proofData = JSON.parse(proof);
		return proofData && proofData.valid === true;
	} catch {
		return false;
	}
}
