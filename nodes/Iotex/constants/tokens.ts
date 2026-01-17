/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Token Constants
 * 
 * XRC-20: IoTeX's ERC-20 equivalent token standard
 * XRC-721: IoTeX's ERC-721 equivalent NFT standard
 * 
 * Tokens on IoTeX are fully EVM-compatible.
 */

export interface TokenInfo {
	name: string;
	symbol: string;
	decimals: number;
	address: string;
	logoUrl?: string;
}

/**
 * Common XRC-20 tokens on mainnet
 */
export const MAINNET_TOKENS: Record<string, TokenInfo> = {
	WIOTX: {
		name: 'Wrapped IOTX',
		symbol: 'WIOTX',
		decimals: 18,
		address: 'io15qr5fzpxsnp7garl4m7k355rafzqn8grrm0grz',
	},
	USDT: {
		name: 'Tether USD',
		symbol: 'USDT',
		decimals: 6,
		address: 'io1w8d3n4px74lta9jh4ynfts8y7v3fkrmu2e5p5v',
	},
	USDC: {
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		address: 'io1mk95rl44zrj4twpjf0yqrmsgqdxl9m4w7lqp5g',
	},
	DAI: {
		name: 'Dai Stablecoin',
		symbol: 'DAI',
		decimals: 18,
		address: 'io17caz6qgacrtkk6c8zyqp9rcl3q4z7dp7l6t7rz',
	},
	BUSD: {
		name: 'Binance USD',
		symbol: 'BUSD',
		decimals: 18,
		address: 'io1fww3tjrn0lqsf0cmfxw5wvqv7sps79zr49kghz',
	},
	CIOTX: {
		name: 'Crosschain IOTX',
		symbol: 'CIOTX',
		decimals: 18,
		address: 'io1m4ec7h7mvacrp6jdq6p7e8myrfvwnvdvjjmfst',
	},
	VITA: {
		name: 'VITA',
		symbol: 'VITA',
		decimals: 18,
		address: 'io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw',
	},
};

/**
 * Common XRC-20 tokens on testnet
 */
export const TESTNET_TOKENS: Record<string, TokenInfo> = {
	WIOTX: {
		name: 'Wrapped IOTX',
		symbol: 'WIOTX',
		decimals: 18,
		address: 'io1juvx5g063eu4ts832nukp4vgcwk2gnc5cu9ayd',
	},
	USDT: {
		name: 'Test USDT',
		symbol: 'USDT',
		decimals: 6,
		address: 'io1234567890testusdtaddress',
	},
};

/**
 * XRC-20 Token ABI (ERC-20 compatible)
 */
export const XRC20_ABI = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function decimals() view returns (uint8)',
	'function totalSupply() view returns (uint256)',
	'function balanceOf(address owner) view returns (uint256)',
	'function transfer(address to, uint256 amount) returns (bool)',
	'function allowance(address owner, address spender) view returns (uint256)',
	'function approve(address spender, uint256 amount) returns (bool)',
	'function transferFrom(address from, address to, uint256 amount) returns (bool)',
	'event Transfer(address indexed from, address indexed to, uint256 value)',
	'event Approval(address indexed owner, address indexed spender, uint256 value)',
];

/**
 * XRC-721 NFT ABI (ERC-721 compatible)
 */
export const XRC721_ABI = [
	'function name() view returns (string)',
	'function symbol() view returns (string)',
	'function tokenURI(uint256 tokenId) view returns (string)',
	'function balanceOf(address owner) view returns (uint256)',
	'function ownerOf(uint256 tokenId) view returns (address)',
	'function safeTransferFrom(address from, address to, uint256 tokenId)',
	'function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)',
	'function transferFrom(address from, address to, uint256 tokenId)',
	'function approve(address to, uint256 tokenId)',
	'function getApproved(uint256 tokenId) view returns (address)',
	'function setApprovalForAll(address operator, bool approved)',
	'function isApprovedForAll(address owner, address operator) view returns (bool)',
	'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
	'event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)',
	'event ApprovalForAll(address indexed owner, address indexed operator, bool approved)',
];

/**
 * Get tokens for a specific network
 */
export function getTokensForNetwork(network: string): Record<string, TokenInfo> {
	switch (network) {
		case 'mainnet':
			return MAINNET_TOKENS;
		case 'testnet':
			return TESTNET_TOKENS;
		default:
			return {};
	}
}
