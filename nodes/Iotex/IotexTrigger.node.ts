/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IPollFunctions,
	INodeType,
	INodeTypeDescription,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { ethers } from 'ethers';

import { createIotexClient } from './transport/iotexClient';
import { createExplorerApi } from './transport/explorerApi';
import { createW3bstreamClient } from './transport/w3bstreamClient';
import { toHexAddress } from './utils/addressUtils';
import { rauToIotx } from './utils/unitConverter';

export class IotexTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IoTeX Trigger',
		name: 'iotexTrigger',
		icon: 'file:iotex.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Trigger workflows on IoTeX blockchain events - DePIN infrastructure monitoring',
		defaults: {
			name: 'IoTeX Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'iotexNetwork',
				required: true,
			},
			{
				name: 'iotexScan',
				required: false,
			},
			{
				name: 'w3bstream',
				required: false,
			},
		],
		polling: true,
		properties: [
			// Event Category Selection
			{
				displayName: 'Event Category',
				name: 'eventCategory',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Action (Transaction)', value: 'action' },
					{ name: 'Block', value: 'block' },
					{ name: 'Contract Event', value: 'contract' },
					{ name: 'Staking', value: 'staking' },
					{ name: 'Token (XRC-20)', value: 'token' },
					{ name: 'NFT (XRC-721)', value: 'nft' },
					{ name: 'W3bstream', value: 'w3bstream' },
				],
				default: 'action',
			},

			// ==================== ACTION EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['action'],
					},
				},
				options: [
					{ name: 'Action Confirmed', value: 'actionConfirmed' },
					{ name: 'IOTX Received', value: 'iotxReceived' },
					{ name: 'IOTX Sent', value: 'iotxSent' },
					{ name: 'Large Transaction', value: 'largeTransaction' },
				],
				default: 'actionConfirmed',
			},
			{
				displayName: 'Action Hash',
				name: 'actionHash',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['action'],
						event: ['actionConfirmed'],
					},
				},
				default: '',
				placeholder: '0x...',
				description: 'The action hash to monitor for confirmation',
			},
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['action'],
						event: ['iotxReceived', 'iotxSent'],
					},
				},
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'The address to monitor (io or 0x format)',
			},
			{
				displayName: 'Threshold (IOTX)',
				name: 'threshold',
				type: 'number',
				displayOptions: {
					show: {
						eventCategory: ['action'],
						event: ['largeTransaction'],
					},
				},
				default: 1000,
				description: 'Minimum IOTX amount to trigger alert',
			},

			// ==================== BLOCK EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['block'],
					},
				},
				options: [
					{ name: 'New Block', value: 'newBlock' },
					{ name: 'New Epoch', value: 'newEpoch' },
				],
				default: 'newBlock',
			},

			// ==================== TOKEN EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['token'],
					},
				},
				options: [
					{ name: 'Token Transfer', value: 'tokenTransfer' },
					{ name: 'Token Approval', value: 'tokenApproval' },
				],
				default: 'tokenTransfer',
			},
			{
				displayName: 'Token Contract Address',
				name: 'tokenAddress',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['token'],
					},
				},
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'The XRC-20 token contract address',
			},

			// ==================== NFT EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['nft'],
					},
				},
				options: [
					{ name: 'NFT Transfer', value: 'nftTransfer' },
					{ name: 'NFT Minted', value: 'nftMinted' },
					{ name: 'NFT Burned', value: 'nftBurned' },
				],
				default: 'nftTransfer',
			},
			{
				displayName: 'NFT Contract Address',
				name: 'nftAddress',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['nft'],
					},
				},
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'The XRC-721 NFT contract address',
			},

			// ==================== CONTRACT EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['contract'],
					},
				},
				options: [
					{ name: 'Contract Event Emitted', value: 'contractEvent' },
				],
				default: 'contractEvent',
			},
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['contract'],
					},
				},
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'The smart contract address to monitor',
			},
			{
				displayName: 'Contract ABI',
				name: 'contractAbi',
				type: 'json',
				displayOptions: {
					show: {
						eventCategory: ['contract'],
					},
				},
				default: '[]',
				description: 'The contract ABI for decoding events',
			},

			// ==================== STAKING EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['staking'],
					},
				},
				options: [
					{ name: 'Rewards Available', value: 'rewardsAvailable' },
				],
				default: 'rewardsAvailable',
			},
			{
				displayName: 'Staker Address',
				name: 'stakerAddress',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['staking'],
					},
				},
				default: '',
				placeholder: 'io1...',
				description: 'The staker address to monitor',
			},
			{
				displayName: 'Minimum Rewards (IOTX)',
				name: 'minRewards',
				type: 'number',
				displayOptions: {
					show: {
						eventCategory: ['staking'],
						event: ['rewardsAvailable'],
					},
				},
				default: 10,
				description: 'Minimum rewards threshold to trigger',
			},

			// ==================== W3BSTREAM EVENTS ====================
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['w3bstream'],
					},
				},
				options: [
					{ name: 'Message Received', value: 'messageReceived' },
					{ name: 'Proof Generated', value: 'proofGenerated' },
				],
				default: 'messageReceived',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				displayOptions: {
					show: {
						eventCategory: ['w3bstream'],
					},
				},
				default: '',
				description: 'The W3bstream project ID to monitor',
			},

			// ==================== OPTIONS ====================
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Confirmations Required',
						name: 'confirmations',
						type: 'number',
						default: 1,
						description: 'Number of block confirmations required before triggering',
					},
				],
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const eventCategory = this.getNodeParameter('eventCategory', 0) as string;
		const event = this.getNodeParameter('event', 0) as string;
		const options = this.getNodeParameter('options', 0) as IDataObject;

		// Get credentials
		const credentials = await this.getCredentials('iotexNetwork');

		// Create client
		const client = createIotexClient({
			network: credentials.network as 'mainnet' | 'testnet' | 'custom',
			httpEndpoint: credentials.httpEndpoint as string,
			grpcEndpoint: credentials.grpcEndpoint as string,
			privateKey: credentials.privateKey as string,
			apiKey: credentials.apiKey as string,
		});

		// Get workflow static data for state tracking
		const staticData = this.getWorkflowStaticData('node');
		const lastProcessedBlock = (staticData.lastProcessedBlock as number) || 0;
		const lastProcessedTimestamp = (staticData.lastProcessedTimestamp as number) || 0;

		const returnData: INodeExecutionData[] = [];

		try {
			// Get current block number
			const currentBlock = await client.getBlockNumber();

			switch (eventCategory) {
				case 'action': {
					if (event === 'actionConfirmed') {
						const actionHash = this.getNodeParameter('actionHash', 0) as string;
						if (actionHash) {
							const receipt = await client.getTransactionReceipt(actionHash);
							if (receipt && receipt.blockNumber) {
								const confirmations = currentBlock - receipt.blockNumber;
								const requiredConfirmations = (options.confirmations as number) || 1;
								if (confirmations >= requiredConfirmations) {
									returnData.push({
										json: {
											event: 'actionConfirmed',
											actionHash,
											blockNumber: receipt.blockNumber,
											confirmations,
											status: receipt.status === 1 ? 'success' : 'failed',
											gasUsed: receipt.gasUsed?.toString(),
											timestamp: Date.now(),
										},
									});
								}
							}
						}
					} else if (event === 'largeTransaction') {
						const threshold = this.getNodeParameter('threshold', 0) as number;
						const thresholdRau = BigInt(threshold) * BigInt(10 ** 18);
						
						if (currentBlock > lastProcessedBlock) {
							const block = await client.getBlock(currentBlock);
							if (block && block.prefetchedTransactions) {
								for (const tx of block.prefetchedTransactions) {
									if (tx.value >= thresholdRau) {
										returnData.push({
											json: {
												event: 'largeTransaction',
												from: tx.from,
												to: tx.to,
												amount: rauToIotx(tx.value.toString()),
												threshold,
												actionHash: tx.hash,
												blockNumber: currentBlock,
												timestamp: Date.now(),
											},
										});
									}
								}
							}
						}
					} else {
						const address = this.getNodeParameter('address', 0) as string;
						if (address && currentBlock > lastProcessedBlock) {
							const hexAddress = toHexAddress(address);
							const block = await client.getBlock(currentBlock);
							if (block && block.prefetchedTransactions) {
								for (const tx of block.prefetchedTransactions) {
									const isReceived = tx.to?.toLowerCase() === hexAddress.toLowerCase();
									const isSent = tx.from?.toLowerCase() === hexAddress.toLowerCase();
									
									if (event === 'iotxReceived' && isReceived && tx.value > BigInt(0)) {
										returnData.push({
											json: {
												event: 'iotxReceived',
												from: tx.from,
												to: tx.to,
												amount: rauToIotx(tx.value.toString()),
												actionHash: tx.hash,
												blockNumber: currentBlock,
												timestamp: Date.now(),
											},
										});
									} else if (event === 'iotxSent' && isSent && tx.value > BigInt(0)) {
										returnData.push({
											json: {
												event: 'iotxSent',
												from: tx.from,
												to: tx.to,
												amount: rauToIotx(tx.value.toString()),
												actionHash: tx.hash,
												blockNumber: currentBlock,
												timestamp: Date.now(),
											},
										});
									}
								}
							}
						}
					}
					break;
				}

				case 'block': {
					if (event === 'newBlock' && currentBlock > lastProcessedBlock) {
						const block = await client.getBlock(currentBlock);
						if (block) {
							returnData.push({
								json: {
									event: 'newBlock',
									blockNumber: block.number,
									blockHash: block.hash,
									timestamp: block.timestamp,
									transactionCount: block.transactions?.length || 0,
									miner: block.miner,
								},
							});
						}
					} else if (event === 'newEpoch') {
						const BLOCKS_PER_EPOCH = 8640;
						const fromEpoch = Math.floor(lastProcessedBlock / BLOCKS_PER_EPOCH);
						const toEpoch = Math.floor(currentBlock / BLOCKS_PER_EPOCH);
						if (toEpoch > fromEpoch) {
							returnData.push({
								json: {
									event: 'newEpoch',
									epochNumber: toEpoch,
									startBlock: toEpoch * BLOCKS_PER_EPOCH,
									timestamp: Date.now(),
								},
							});
						}
					}
					break;
				}

				case 'token': {
					const tokenAddress = this.getNodeParameter('tokenAddress', 0) as string;
					if (tokenAddress && currentBlock > lastProcessedBlock) {
						const hexTokenAddress = toHexAddress(tokenAddress);
						const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');
						const APPROVAL_TOPIC = ethers.id('Approval(address,address,uint256)');
						
						const topic = event === 'tokenApproval' ? APPROVAL_TOPIC : TRANSFER_TOPIC;
						
						const logs = await client.getLogs({
							address: hexTokenAddress,
							topics: [topic],
							fromBlock: lastProcessedBlock + 1,
							toBlock: currentBlock,
						});
						
						for (const log of logs) {
							const from = '0x' + log.topics[1]?.slice(26);
							const to = '0x' + log.topics[2]?.slice(26);
							const amount = BigInt(log.data).toString();
							
							returnData.push({
								json: {
									event,
									tokenAddress: hexTokenAddress,
									from,
									to,
									amount,
									blockNumber: log.blockNumber,
									transactionHash: log.transactionHash,
									timestamp: Date.now(),
								},
							});
						}
					}
					break;
				}

				case 'nft': {
					const nftAddress = this.getNodeParameter('nftAddress', 0) as string;
					if (nftAddress && currentBlock > lastProcessedBlock) {
						const hexNftAddress = toHexAddress(nftAddress);
						const TRANSFER_TOPIC = ethers.id('Transfer(address,address,uint256)');
						
						const logs = await client.getLogs({
							address: hexNftAddress,
							topics: [TRANSFER_TOPIC],
							fromBlock: lastProcessedBlock + 1,
							toBlock: currentBlock,
						});
						
						for (const log of logs) {
							const from = '0x' + log.topics[1]?.slice(26);
							const to = '0x' + log.topics[2]?.slice(26);
							const tokenId = BigInt(log.topics[3] || '0').toString();
							
							const isMint = from === ethers.ZeroAddress;
							const isBurn = to === ethers.ZeroAddress;
							
							if (event === 'nftMinted' && !isMint) continue;
							if (event === 'nftBurned' && !isBurn) continue;
							
							returnData.push({
								json: {
									event,
									nftAddress: hexNftAddress,
									tokenId,
									from,
									to,
									isMint,
									isBurn,
									blockNumber: log.blockNumber,
									transactionHash: log.transactionHash,
									timestamp: Date.now(),
								},
							});
						}
					}
					break;
				}

				case 'contract': {
					const contractAddress = this.getNodeParameter('contractAddress', 0) as string;
					const contractAbi = this.getNodeParameter('contractAbi', 0) as string;
					
					if (contractAddress && currentBlock > lastProcessedBlock) {
						const hexContractAddress = toHexAddress(contractAddress);
						
						const logs = await client.getLogs({
							address: hexContractAddress,
							fromBlock: lastProcessedBlock + 1,
							toBlock: currentBlock,
						});
						
						let iface: ethers.Interface | null = null;
						try {
							const abi = JSON.parse(contractAbi);
							if (abi.length > 0) {
								iface = new ethers.Interface(abi);
							}
						} catch {
							// Invalid ABI
						}
						
						for (const log of logs) {
							let decodedEvent: IDataObject = {};
							let eventName = 'Unknown';
							
							if (iface) {
								try {
									const parsed = iface.parseLog({
										topics: log.topics as string[],
										data: log.data,
									});
									if (parsed) {
										eventName = parsed.name;
										decodedEvent = Object.fromEntries(
											parsed.fragment.inputs.map((input, i) => [
												input.name || `arg${i}`,
												parsed.args[i]?.toString(),
											]),
										);
									}
								} catch {
									// Failed to decode
								}
							}
							
							returnData.push({
								json: {
									event: 'contractEvent',
									contractAddress: hexContractAddress,
									eventName,
									decodedData: decodedEvent,
									blockNumber: log.blockNumber,
									transactionHash: log.transactionHash,
									timestamp: Date.now(),
								},
							});
						}
					}
					break;
				}

				case 'staking': {
					const stakerAddress = this.getNodeParameter('stakerAddress', 0) as string;
					const minRewards = this.getNodeParameter('minRewards', 0) as number;
					
					if (stakerAddress) {
						let explorerApi: ReturnType<typeof createExplorerApi> | null = null;
						try {
							const scanCreds = await this.getCredentials('iotexScan');
							if (scanCreds) {
								explorerApi = createExplorerApi({
									network: scanCreds.network as 'mainnet' | 'testnet',
									apiKey: scanCreds.apiKey as string,
									customEndpoint: scanCreds.apiEndpoint as string,
								});
							}
						} catch {
							// No credentials
						}
						
						if (explorerApi) {
							const rewards = await explorerApi.getStakingRewards(stakerAddress);
							const totalRewards = parseFloat(rewards.total || '0');
							
							if (totalRewards >= minRewards) {
								returnData.push({
									json: {
										event: 'rewardsAvailable',
										address: stakerAddress,
										totalRewards: rewards.total,
										availableRewards: rewards.available,
										timestamp: Date.now(),
									},
								});
							}
						}
					}
					break;
				}

				case 'w3bstream': {
					const projectId = this.getNodeParameter('projectId', 0) as string;
					
					if (projectId) {
						let w3bstreamClient: ReturnType<typeof createW3bstreamClient> | null = null;
						try {
							const w3bCreds = await this.getCredentials('w3bstream');
							if (w3bCreds) {
								w3bstreamClient = createW3bstreamClient({
									environment: w3bCreds.environment as 'production' | 'staging' | 'custom',
									customEndpoint: w3bCreds.endpoint as string,
									projectId: w3bCreds.projectId as string,
									apiKey: w3bCreds.apiKey as string,
									publisherToken: w3bCreds.publisherToken as string,
								});
							}
						} catch {
							// No credentials
						}
						
						if (w3bstreamClient) {
							if (event === 'messageReceived') {
								const messages = await w3bstreamClient.getMessages(projectId);
								for (const msg of messages) {
									const msgTimestamp = new Date(msg.timestamp || 0).getTime();
									if (msgTimestamp > lastProcessedTimestamp) {
										returnData.push({
											json: {
												event: 'messageReceived',
												projectId,
												messageId: msg.id,
												payload: msg.payload as IDataObject,
												timestamp: msg.timestamp,
											},
										});
									}
								}
							} else if (event === 'proofGenerated') {
								const proofs = await w3bstreamClient.getProofs(projectId);
								for (const proof of proofs) {
									const proofTimestamp = new Date(proof.timestamp || 0).getTime();
									if (proofTimestamp > lastProcessedTimestamp) {
										returnData.push({
											json: {
												event: 'proofGenerated',
												projectId,
												proofId: proof.id,
												proofType: proof.type,
												timestamp: proof.timestamp,
											},
										});
									}
								}
							}
						}
					}
					break;
				}
			}

			// Update static data
			staticData.lastProcessedBlock = currentBlock;
			staticData.lastProcessedTimestamp = Date.now();
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Polling error: ${(error as Error).message}`);
		}

		if (returnData.length === 0) {
			return null;
		}

		return [returnData];
	}
}
