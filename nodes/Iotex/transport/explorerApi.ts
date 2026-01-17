/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeXScan Explorer API Transport
 * 
 * Client for interacting with IoTeXScan API for indexed blockchain data.
 */

import axios, { AxiosInstance } from 'axios';
import { NETWORKS } from '../constants/networks';

/**
 * Explorer API configuration
 */
export interface ExplorerApiConfig {
	network: 'mainnet' | 'testnet';
	apiKey?: string;
	customEndpoint?: string;
}

/**
 * Action list item from explorer
 */
export interface ExplorerAction {
	actHash: string;
	blkHash: string;
	blkHeight: number;
	sender: string;
	recipient: string;
	amount: string;
	actType: string;
	timestamp: string;
	gasFee: string;
	status: 'success' | 'failure';
}

/**
 * Token transfer from explorer
 */
export interface ExplorerTokenTransfer {
	actHash: string;
	blkHeight: number;
	from: string;
	to: string;
	amount: string;
	tokenAddress: string;
	tokenSymbol: string;
	tokenDecimals: number;
	timestamp: string;
}

/**
 * Delegate information from explorer
 */
export interface ExplorerDelegate {
	name: string;
	address: string;
	votes: string;
	rewards: string;
	productivity: number;
	rank: number;
	status: 'active' | 'probation' | 'inactive';
	selfStake: string;
}

/**
 * Staking bucket from explorer
 */
export interface ExplorerBucket {
	index: number;
	owner: string;
	candidate: string;
	stakedAmount: string;
	stakeDuration: number;
	createTime: string;
	stakeStartTime: string;
	unstakeStartTime: string | null;
	autoStake: boolean;
	status: 'staked' | 'unstaking' | 'withdrawn';
}

/**
 * Explorer API client class
 */
export class ExplorerApi {
	private client: AxiosInstance;
	private network: string;

	constructor(config: ExplorerApiConfig) {
		this.network = config.network;
		
		const baseURL = config.customEndpoint || 
			(config.network === 'mainnet' 
				? NETWORKS.mainnet.explorerApiUrl 
				: NETWORKS.testnet.explorerApiUrl);
		
		this.client = axios.create({
			baseURL,
			headers: {
				'Content-Type': 'application/json',
				...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
			},
		});
	}

	// ==================== Action Operations ====================

	/**
	 * Get actions by address
	 */
	async getActionsByAddress(
		address: string,
		start: number = 0,
		count: number = 20,
	): Promise<ExplorerAction[]> {
		const response = await this.client.get('/v1/actions', {
			params: {
				address,
				start,
				count,
			},
		});
		return response.data.actions || [];
	}

	/**
	 * Get action by hash
	 */
	async getActionByHash(hash: string): Promise<ExplorerAction | null> {
		try {
			const response = await this.client.get(`/v1/actions/${hash}`);
			return response.data;
		} catch {
			return null;
		}
	}

	/**
	 * Get actions by block
	 */
	async getActionsByBlock(
		blockHeight: number,
		start: number = 0,
		count: number = 20,
	): Promise<ExplorerAction[]> {
		const response = await this.client.get('/v1/actions', {
			params: {
				block: blockHeight,
				start,
				count,
			},
		});
		return response.data.actions || [];
	}

	// ==================== Token Operations ====================

	/**
	 * Get XRC-20 token transfers for address
	 */
	async getTokenTransfers(
		address: string,
		tokenAddress?: string,
		start: number = 0,
		count: number = 20,
	): Promise<ExplorerTokenTransfer[]> {
		const response = await this.client.get('/v1/xrc20/transfers', {
			params: {
				address,
				token: tokenAddress,
				start,
				count,
			},
		});
		return response.data.transfers || [];
	}

	/**
	 * Get XRC-20 token info
	 */
	async getTokenInfo(tokenAddress: string): Promise<unknown> {
		const response = await this.client.get(`/v1/xrc20/${tokenAddress}`);
		return response.data;
	}

	/**
	 * Get XRC-20 token holders
	 */
	async getTokenHolders(
		tokenAddress: string,
		start: number = 0,
		count: number = 20,
	): Promise<Array<{ address: string; balance: string }>> {
		const response = await this.client.get(`/v1/xrc20/${tokenAddress}/holders`, {
			params: { start, count },
		});
		return response.data.holders || [];
	}

	/**
	 * Get XRC-721 NFTs by owner
	 */
	async getNFTsByOwner(
		ownerAddress: string,
		contractAddress?: string,
	): Promise<unknown[]> {
		const response = await this.client.get('/v1/xrc721/tokens', {
			params: {
				owner: ownerAddress,
				contract: contractAddress,
			},
		});
		return response.data.tokens || [];
	}

	// ==================== Staking Operations ====================

	/**
	 * Get staking buckets by address
	 */
	async getBucketsByAddress(address: string): Promise<ExplorerBucket[]> {
		const response = await this.client.get('/v1/staking/buckets', {
			params: { address },
		});
		return response.data.buckets || [];
	}

	/**
	 * Get bucket by index
	 */
	async getBucketByIndex(index: number): Promise<ExplorerBucket | null> {
		try {
			const response = await this.client.get(`/v1/staking/buckets/${index}`);
			return response.data;
		} catch {
			return null;
		}
	}

	/**
	 * Get staking rewards for address
	 */
	async getStakingRewards(address: string): Promise<{
		available: string;
		claimed: string;
		total: string;
	}> {
		const response = await this.client.get('/v1/staking/rewards', {
			params: { address },
		});
		return response.data;
	}

	// ==================== Delegate Operations ====================

	/**
	 * Get all delegates
	 */
	async getDelegates(
		epoch?: number,
		start: number = 0,
		count: number = 100,
	): Promise<ExplorerDelegate[]> {
		const response = await this.client.get('/v1/delegates', {
			params: {
				epoch,
				start,
				count,
			},
		});
		return response.data.delegates || [];
	}

	/**
	 * Get delegate by name or address
	 */
	async getDelegate(nameOrAddress: string): Promise<ExplorerDelegate | null> {
		try {
			const response = await this.client.get(`/v1/delegates/${nameOrAddress}`);
			return response.data;
		} catch {
			return null;
		}
	}

	/**
	 * Get delegate voters
	 */
	async getDelegateVoters(
		delegateName: string,
		start: number = 0,
		count: number = 100,
	): Promise<Array<{ address: string; votes: string }>> {
		const response = await this.client.get(`/v1/delegates/${delegateName}/voters`, {
			params: { start, count },
		});
		return response.data.voters || [];
	}

	/**
	 * Get consensus delegates (block producers)
	 */
	async getConsensusDelegates(epoch?: number): Promise<ExplorerDelegate[]> {
		const response = await this.client.get('/v1/delegates/consensus', {
			params: { epoch },
		});
		return response.data.delegates || [];
	}

	// ==================== Block Operations ====================

	/**
	 * Get block by height
	 */
	async getBlock(height: number): Promise<unknown> {
		const response = await this.client.get(`/v1/blocks/${height}`);
		return response.data;
	}

	/**
	 * Get blocks in range
	 */
	async getBlocks(
		start: number,
		count: number = 20,
	): Promise<unknown[]> {
		const response = await this.client.get('/v1/blocks', {
			params: { start, count },
		});
		return response.data.blocks || [];
	}

	// ==================== Epoch Operations ====================

	/**
	 * Get epoch info
	 */
	async getEpochInfo(epochNum?: number): Promise<{
		num: number;
		height: number;
		gravityChainStartHeight: number;
		numDelegates: number;
		numBlocks: number;
	}> {
		const response = await this.client.get('/v1/epochs', {
			params: { num: epochNum },
		});
		return response.data;
	}

	// ==================== Chain Operations ====================

	/**
	 * Get chain statistics
	 */
	async getChainStats(): Promise<{
		height: number;
		numActions: number;
		numAddresses: number;
		tps: number;
		supply: string;
		staked: string;
	}> {
		const response = await this.client.get('/v1/chain');
		return response.data;
	}

	/**
	 * Search for address, transaction, or block
	 */
	async search(query: string): Promise<{
		type: 'address' | 'action' | 'block' | 'unknown';
		result: unknown;
	}> {
		const response = await this.client.get('/v1/search', {
			params: { q: query },
		});
		return response.data;
	}
}

/**
 * Create an Explorer API client instance
 */
export function createExplorerApi(config: ExplorerApiConfig): ExplorerApi {
	return new ExplorerApi(config);
}
