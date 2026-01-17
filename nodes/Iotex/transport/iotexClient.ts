/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Client Transport
 * 
 * Main client for interacting with IoTeX blockchain via JSON-RPC.
 * Uses ethers.js for EVM-compatible operations.
 */

import { ethers } from 'ethers';
import axios, { AxiosInstance } from 'axios';
import { NETWORKS, getNetworkConfig, NetworkConfig } from '../constants/networks';
import { toHexAddress, toIoAddress } from '../utils/addressUtils';
import { rauToIotx, iotxToRau } from '../utils/unitConverter';

/**
 * Client configuration
 */
export interface IotexClientConfig {
	network: 'mainnet' | 'testnet' | 'custom';
	httpEndpoint?: string;
	grpcEndpoint?: string;
	privateKey?: string;
	apiKey?: string;
}

/**
 * Account information
 */
export interface AccountInfo {
	address: string;
	balance: string;
	nonce: string;
	pendingNonce: string;
	numActions: string;
	isContract: boolean;
}

/**
 * Action (transaction) information
 */
export interface ActionInfo {
	actHash: string;
	blkHash: string;
	blkHeight: string;
	sender: string;
	gasFee: string;
	timestamp: string;
	actionType: string;
	action: unknown;
}

/**
 * Block information
 */
export interface BlockInfo {
	hash: string;
	height: string;
	timestamp: string;
	numActions: number;
	producerAddress: string;
	transferAmount: string;
	txRoot: string;
	receiptRoot: string;
	deltaStateDigest: string;
}

/**
 * Epoch information
 */
export interface EpochInfo {
	num: string;
	height: string;
	gravityChainStartHeight: string;
}

/**
 * Chain metadata
 */
export interface ChainMeta {
	height: string;
	numActions: string;
	tps: string;
	epoch: EpochInfo;
	tpsFloat: number;
}

/**
 * IoTeX Client class
 */
export class IotexClient {
	private provider: ethers.JsonRpcProvider;
	private wallet: ethers.Wallet | null = null;
	private httpClient: AxiosInstance;
	private config: IotexClientConfig;
	private networkConfig: NetworkConfig;

	constructor(config: IotexClientConfig) {
		this.config = config;
		
		// Get network configuration
		if (config.network === 'custom') {
			this.networkConfig = {
				name: 'Custom',
				chainId: 0,
				httpEndpoint: config.httpEndpoint || '',
				grpcEndpoint: config.grpcEndpoint || '',
				wsEndpoint: '',
				explorerUrl: '',
				explorerApiUrl: '',
				nativeCurrency: {
					name: 'IOTX',
					symbol: 'IOTX',
					decimals: 18,
				},
			};
		} else {
			this.networkConfig = getNetworkConfig(config.network);
		}
		
		// Initialize provider
		const endpoint = config.httpEndpoint || this.networkConfig.httpEndpoint;
		this.provider = new ethers.JsonRpcProvider(endpoint);
		
		// Initialize wallet if private key provided
		if (config.privateKey) {
			this.wallet = new ethers.Wallet(config.privateKey, this.provider);
		}
		
		// Initialize HTTP client for native IoTeX API
		this.httpClient = axios.create({
			baseURL: endpoint,
			headers: {
				'Content-Type': 'application/json',
				...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
			},
		});
	}

	/**
	 * Get the provider instance
	 */
	getProvider(): ethers.JsonRpcProvider {
		return this.provider;
	}

	/**
	 * Get the wallet instance
	 */
	getWallet(): ethers.Wallet | null {
		return this.wallet;
	}

	/**
	 * Get network configuration
	 */
	getNetworkConfig(): NetworkConfig {
		return this.networkConfig;
	}

	/**
	 * Make a native IoTeX API call
	 */
	private async nativeCall(method: string, params: unknown = {}): Promise<unknown> {
		const response = await this.httpClient.post('', {
			jsonrpc: '2.0',
			method,
			params,
			id: Date.now(),
		});
		
		if (response.data.error) {
			throw new Error(response.data.error.message || 'Unknown RPC error');
		}
		
		return response.data.result;
	}

	// ==================== Account Operations ====================

	/**
	 * Get account information
	 */
	async getAccountInfo(address: string): Promise<AccountInfo> {
		const hexAddress = toHexAddress(address);
		
		const [balance, nonce, code] = await Promise.all([
			this.provider.getBalance(hexAddress),
			this.provider.getTransactionCount(hexAddress),
			this.provider.getCode(hexAddress),
		]);
		
		return {
			address: toIoAddress(hexAddress),
			balance: rauToIotx(balance.toString()),
			nonce: nonce.toString(),
			pendingNonce: nonce.toString(),
			numActions: '0',
			isContract: code !== '0x',
		};
	}

	/**
	 * Get IOTX balance
	 */
	async getBalance(address: string): Promise<string> {
		const hexAddress = toHexAddress(address);
		const balance = await this.provider.getBalance(hexAddress);
		return rauToIotx(balance.toString());
	}

	/**
	 * Get account nonce
	 */
	async getNonce(address: string): Promise<number> {
		const hexAddress = toHexAddress(address);
		return this.provider.getTransactionCount(hexAddress);
	}

	// ==================== Transaction Operations ====================

	/**
	 * Send IOTX
	 */
	async sendIotx(
		to: string,
		amount: string,
		data: string = '0x',
		gasLimit?: bigint,
	): Promise<ethers.TransactionResponse> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized. Private key required.');
		}
		
		const tx: ethers.TransactionRequest = {
			to: toHexAddress(to),
			value: ethers.parseEther(amount),
			data,
		};
		
		if (gasLimit) {
			tx.gasLimit = gasLimit;
		}
		
		return this.wallet.sendTransaction(tx);
	}

	/**
	 * Get transaction by hash
	 */
	async getTransaction(hash: string): Promise<ethers.TransactionResponse | null> {
		return this.provider.getTransaction(hash);
	}

	/**
	 * Get transaction receipt
	 */
	async getTransactionReceipt(hash: string): Promise<ethers.TransactionReceipt | null> {
		return this.provider.getTransactionReceipt(hash);
	}

	/**
	 * Estimate gas
	 */
	async estimateGas(
		from: string,
		to: string,
		value: string = '0',
		data: string = '0x',
	): Promise<bigint> {
		return this.provider.estimateGas({
			from: toHexAddress(from),
			to: toHexAddress(to),
			value: ethers.parseEther(value),
			data,
		});
	}

	/**
	 * Get gas price
	 */
	async getGasPrice(): Promise<bigint> {
		const feeData = await this.provider.getFeeData();
		return feeData.gasPrice || BigInt(1000000000000);
	}

	// ==================== Contract Operations ====================

	/**
	 * Read contract (call)
	 */
	async readContract(
		contractAddress: string,
		abi: string[],
		functionName: string,
		args: unknown[] = [],
	): Promise<unknown> {
		const contract = new ethers.Contract(
			toHexAddress(contractAddress),
			abi,
			this.provider,
		);
		
		return contract[functionName](...args);
	}

	/**
	 * Execute contract (send transaction)
	 */
	async executeContract(
		contractAddress: string,
		abi: string[],
		functionName: string,
		args: unknown[] = [],
		value: string = '0',
	): Promise<ethers.TransactionResponse> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized. Private key required.');
		}
		
		const contract = new ethers.Contract(
			toHexAddress(contractAddress),
			abi,
			this.wallet,
		);
		
		const options: ethers.Overrides = {};
		if (value !== '0') {
			options.value = ethers.parseEther(value);
		}
		
		return contract[functionName](...args, options);
	}

	/**
	 * Deploy contract
	 */
	async deployContract(
		abi: string[],
		bytecode: string,
		args: unknown[] = [],
		value: string = '0',
	): Promise<ethers.ContractTransactionResponse> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized. Private key required.');
		}
		
		const factory = new ethers.ContractFactory(abi, bytecode, this.wallet);
		
		const options: ethers.Overrides = {};
		if (value !== '0') {
			options.value = ethers.parseEther(value);
		}
		
		const contract = await factory.deploy(...args, options);
		return contract.deploymentTransaction() as ethers.ContractTransactionResponse;
	}

	/**
	 * Get contract code
	 */
	async getContractCode(address: string): Promise<string> {
		return this.provider.getCode(toHexAddress(address));
	}

	// ==================== Block Operations ====================

	/**
	 * Get block by number or hash
	 */
	async getBlock(blockHashOrNumber: string | number): Promise<ethers.Block | null> {
		return this.provider.getBlock(blockHashOrNumber);
	}

	/**
	 * Get latest block
	 */
	async getLatestBlock(): Promise<ethers.Block | null> {
		return this.provider.getBlock('latest');
	}

	/**
	 * Get block number
	 */
	async getBlockNumber(): Promise<number> {
		return this.provider.getBlockNumber();
	}

	// ==================== Chain Operations ====================

	/**
	 * Get chain ID
	 */
	async getChainId(): Promise<bigint> {
		const network = await this.provider.getNetwork();
		return network.chainId;
	}

	/**
	 * Get chain metadata
	 */
	async getChainMeta(): Promise<ChainMeta> {
		const blockNumber = await this.getBlockNumber();
		const block = await this.getBlock(blockNumber);
		
		// Calculate current epoch (8640 blocks per epoch)
		const epochNum = Math.floor(blockNumber / 8640);
		const epochHeight = epochNum * 8640;
		
		return {
			height: blockNumber.toString(),
			numActions: '0',
			tps: '0',
			epoch: {
				num: epochNum.toString(),
				height: epochHeight.toString(),
				gravityChainStartHeight: '0',
			},
			tpsFloat: 0,
		};
	}

	// ==================== Event Operations ====================

	/**
	 * Get logs
	 */
	async getLogs(
		filter: ethers.Filter,
	): Promise<ethers.Log[]> {
		return this.provider.getLogs(filter);
	}

	/**
	 * Subscribe to events
	 */
	on(
		eventName: ethers.ProviderEvent,
		listener: ethers.Listener,
	): void {
		this.provider.on(eventName, listener);
	}

	/**
	 * Unsubscribe from events
	 */
	off(
		eventName: ethers.ProviderEvent,
		listener?: ethers.Listener,
	): void {
		this.provider.off(eventName, listener);
	}

	// ==================== Utility Methods ====================

	/**
	 * Sign message
	 */
	async signMessage(message: string): Promise<string> {
		if (!this.wallet) {
			throw new Error('Wallet not initialized. Private key required.');
		}
		return this.wallet.signMessage(message);
	}

	/**
	 * Verify message signature
	 */
	verifyMessage(message: string, signature: string): string {
		return ethers.verifyMessage(message, signature);
	}

	/**
	 * Hash data with keccak256
	 */
	keccak256(data: string): string {
		return ethers.keccak256(ethers.toUtf8Bytes(data));
	}
}

/**
 * Create an IoTeX client instance
 */
export function createIotexClient(config: IotexClientConfig): IotexClient {
	return new IotexClient(config);
}
