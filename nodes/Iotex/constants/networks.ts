/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Network Configuration Constants
 * 
 * IoTeX uses a dual address system:
 * - io-address: Native format (e.g., io1...)
 * - 0x-address: EVM-compatible format (e.g., 0x...)
 * 
 * The network is EVM-compatible, so most Ethereum tools work with IoTeX.
 */

export interface NetworkConfig {
	name: string;
	chainId: number;
	httpEndpoint: string;
	grpcEndpoint: string;
	wsEndpoint: string;
	explorerUrl: string;
	explorerApiUrl: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export const NETWORKS: Record<string, NetworkConfig> = {
	mainnet: {
		name: 'IoTeX Mainnet',
		chainId: 4689,
		httpEndpoint: 'https://babel-api.mainnet.iotex.io',
		grpcEndpoint: 'api.mainnet.iotex.one:443',
		wsEndpoint: 'wss://babel-api.mainnet.iotex.io',
		explorerUrl: 'https://iotexscan.io',
		explorerApiUrl: 'https://iotexscan.io/api',
		nativeCurrency: {
			name: 'IoTeX',
			symbol: 'IOTX',
			decimals: 18,
		},
	},
	testnet: {
		name: 'IoTeX Testnet',
		chainId: 4690,
		httpEndpoint: 'https://babel-api.testnet.iotex.io',
		grpcEndpoint: 'api.testnet.iotex.one:443',
		wsEndpoint: 'wss://babel-api.testnet.iotex.io',
		explorerUrl: 'https://testnet.iotexscan.io',
		explorerApiUrl: 'https://testnet.iotexscan.io/api',
		nativeCurrency: {
			name: 'IoTeX Testnet',
			symbol: 'IOTX-T',
			decimals: 18,
		},
	},
};

/**
 * Get network configuration by network name
 */
export function getNetworkConfig(network: string): NetworkConfig {
	const config = NETWORKS[network];
	if (!config) {
		throw new Error(`Unknown network: ${network}`);
	}
	return config;
}

/**
 * Chain ID to network name mapping
 */
export const CHAIN_ID_TO_NETWORK: Record<number, string> = {
	4689: 'mainnet',
	4690: 'testnet',
};

/**
 * W3bstream endpoints
 */
export const W3BSTREAM_ENDPOINTS = {
	production: 'https://api.w3bstream.com',
	staging: 'https://staging-api.w3bstream.com',
};

/**
 * Native staking contract addresses
 */
export const STAKING_CONTRACTS = {
	mainnet: {
		systemStaking: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym7',
		bucketType: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym8',
	},
	testnet: {
		systemStaking: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym7',
		bucketType: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym8',
	},
};

/**
 * Bridge (Hermes) contract addresses
 */
export const BRIDGE_CONTRACTS = {
	mainnet: {
		tube: 'io1p99pprm79rftj4r6kenfjcp8jkp6zc6mytuah5',
		validator: 'io1a8r9fvu6e3vthfaqvnxlhc6eavsm6t8a2cwtud',
	},
	testnet: {
		tube: 'io1p99pprm79rftj4r6kenfjcp8jkp6zc6mytuah5',
		validator: 'io1a8r9fvu6e3vthfaqvnxlhc6eavsm6t8a2cwtud',
	},
};

/**
 * MachineFi contract addresses
 */
export const MACHINEFI_CONTRACTS = {
	mainnet: {
		registry: 'io1... ',
		rewards: 'io1...',
	},
	testnet: {
		registry: 'io1...',
		rewards: 'io1...',
	},
};

/**
 * Pebble Tracker contracts
 */
export const PEBBLE_CONTRACTS = {
	mainnet: {
		nft: 'io1...',
		data: 'io1...',
	},
	testnet: {
		nft: 'io1...',
		data: 'io1...',
	},
};
