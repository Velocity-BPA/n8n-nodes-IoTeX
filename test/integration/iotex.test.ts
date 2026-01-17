/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { createIotexClient } from '../../nodes/Iotex/transport/iotexClient';
import { createExplorerApi } from '../../nodes/Iotex/transport/explorerApi';
import { NETWORKS } from '../../nodes/Iotex/constants/networks';

/**
 * Integration tests for IoTeX node
 * These tests require network connectivity to IoTeX testnet
 * 
 * Run with: npm run test:integration
 */

describe('IoTeX Integration Tests', () => {
	// Skip integration tests in CI unless explicitly enabled
	const runIntegration = process.env.RUN_INTEGRATION_TESTS === 'true';
	
	const testAddress = 'io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms';

	describe('IotexClient', () => {
		const client = createIotexClient({
			network: 'testnet',
			httpEndpoint: NETWORKS.testnet.httpEndpoint,
		});

		it('should get chain metadata', async () => {
			if (!runIntegration) {
				console.log('Skipping integration test - set RUN_INTEGRATION_TESTS=true to enable');
				return;
			}

			const chainMeta = await client.getChainMeta();
			expect(chainMeta).toBeDefined();
			expect(chainMeta.height).toBeDefined();
		});

		it('should get account balance', async () => {
			if (!runIntegration) {
				return;
			}

			const balance = await client.getBalance(testAddress);
			expect(balance).toBeDefined();
			expect(typeof balance).toBe('string');
		});

		it('should get account info', async () => {
			if (!runIntegration) {
				return;
			}

			const info = await client.getAccountInfo(testAddress);
			expect(info).toBeDefined();
			expect(info.address).toBeDefined();
		});

		it('should estimate gas for transfer', async () => {
			if (!runIntegration) {
				return;
			}

			const gas = await client.estimateGas({
				to: testAddress,
				value: '1000000000000000000',
				data: '',
			});
			expect(gas).toBeDefined();
			expect(typeof gas).toBe('string');
		});
	});

	describe('ExplorerApi', () => {
		const explorer = createExplorerApi({
			network: 'testnet',
		});

		it('should get delegates list', async () => {
			if (!runIntegration) {
				return;
			}

			const delegates = await explorer.getDelegates();
			expect(delegates).toBeDefined();
			expect(Array.isArray(delegates)).toBe(true);
		});

		it('should get actions by address', async () => {
			if (!runIntegration) {
				return;
			}

			const actions = await explorer.getActionsByAddress(testAddress, 0, 10);
			expect(actions).toBeDefined();
			expect(Array.isArray(actions)).toBe(true);
		});
	});
});

describe('Network Configuration', () => {
	it('should have mainnet configuration', () => {
		expect(NETWORKS.mainnet).toBeDefined();
		expect(NETWORKS.mainnet.httpEndpoint).toContain('mainnet');
		expect(NETWORKS.mainnet.chainId).toBe(1);
	});

	it('should have testnet configuration', () => {
		expect(NETWORKS.testnet).toBeDefined();
		expect(NETWORKS.testnet.httpEndpoint).toContain('testnet');
		expect(NETWORKS.testnet.chainId).toBe(2);
	});
});
