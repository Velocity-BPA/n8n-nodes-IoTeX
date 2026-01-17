/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { ethers } from 'ethers';

import { IotexClient, createIotexClient } from './transport/iotexClient';
import { ExplorerApi, createExplorerApi } from './transport/explorerApi';
import { W3bstreamClient, createW3bstreamClient } from './transport/w3bstreamClient';
import { NETWORKS } from './constants/networks';
import { XRC20_ABI, XRC721_ABI } from './constants/tokens';
import {
	toHexAddress,
	toIoAddress,
	isValidAddress,
	generateKeypair,
	privateKeyToAddress,
	getAddressFormats,
} from './utils/addressUtils';
import {
	rauToIotx,
	iotxToRau,
	convertUnits,
	formatIotx,
	formatTokenAmount,
	parseTokenAmount,
} from './utils/unitConverter';
import {
	encodeFunctionCall,
	decodeFunctionResult,
} from './utils/actionBuilder';
import {
	generateDeviceId,
	createDeviceDID,
	signDeviceData,
	verifyDeviceSignature,
	parsePebbleData,
	isValidPebbleIMEI,
	createW3bstreamMessage,
} from './utils/deviceUtils';

export class Iotex implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IoTeX',
		name: 'iotex',
		icon: 'file:iotex.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with IoTeX blockchain - DePIN infrastructure for machine economy',
		defaults: {
			name: 'IoTeX',
		},
		inputs: ['main'],
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
		properties: [
			// Resource Selection
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Action', value: 'action' },
					{ name: 'Block', value: 'block' },
					{ name: 'Bridge', value: 'bridge' },
					{ name: 'Contract', value: 'contract' },
					{ name: 'Delegate', value: 'delegate' },
					{ name: 'Device', value: 'device' },
					{ name: 'DID', value: 'did' },
					{ name: 'Epoch', value: 'epoch' },
					{ name: 'MachineFi', value: 'machinefi' },
					{ name: 'NFT (XRC-721)', value: 'nft' },
					{ name: 'Pebble Tracker', value: 'pebble' },
					{ name: 'Staking', value: 'staking' },
					{ name: 'Token (XRC-20)', value: 'token' },
					{ name: 'Utility', value: 'utility' },
					{ name: 'W3bstream', value: 'w3bstream' },
				],
				default: 'account',
			},

			// ==================== ACCOUNT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{ name: 'Convert Address', value: 'convertAddress', description: 'Convert between io and 0x address formats' },
					{ name: 'Create Account', value: 'createAccount', description: 'Generate a new account keypair' },
					{ name: 'Get Account Info', value: 'getAccountInfo', description: 'Get account information' },
					{ name: 'Get Balance', value: 'getBalance', description: 'Get IOTX balance' },
					{ name: 'Get Nonce', value: 'getNonce', description: 'Get account nonce' },
					{ name: 'Get Token Balances', value: 'getTokenBalances', description: 'Get XRC-20 token balances' },
					{ name: 'Validate Address', value: 'validateAddress', description: 'Validate an IoTeX address' },
				],
				default: 'getBalance',
			},

			// ==================== ACTION OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['action'] } },
				options: [
					{ name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for a transaction' },
					{ name: 'Get Action', value: 'getAction', description: 'Get action by hash' },
					{ name: 'Get Action Receipt', value: 'getActionReceipt', description: 'Get action receipt' },
					{ name: 'Get Actions by Address', value: 'getActionsByAddress', description: 'Get actions for an address' },
					{ name: 'Get Gas Price', value: 'getGasPrice', description: 'Get current gas price' },
					{ name: 'Send IOTX', value: 'sendIotx', description: 'Send IOTX to an address' },
				],
				default: 'sendIotx',
			},

			// ==================== TOKEN OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['token'] } },
				options: [
					{ name: 'Approve Spending', value: 'approve', description: 'Approve token spending allowance' },
					{ name: 'Get Allowance', value: 'getAllowance', description: 'Get token spending allowance' },
					{ name: 'Get Balance', value: 'getTokenBalance', description: 'Get token balance' },
					{ name: 'Get Token Info', value: 'getTokenInfo', description: 'Get token information' },
					{ name: 'Get Total Supply', value: 'getTotalSupply', description: 'Get token total supply' },
					{ name: 'Transfer', value: 'transfer', description: 'Transfer tokens' },
					{ name: 'Transfer From', value: 'transferFrom', description: 'Transfer tokens from another address' },
				],
				default: 'getTokenBalance',
			},

			// ==================== NFT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['nft'] } },
				options: [
					{ name: 'Approve', value: 'approveNft', description: 'Approve NFT transfer' },
					{ name: 'Get Collection Info', value: 'getCollectionInfo', description: 'Get NFT collection info' },
					{ name: 'Get NFT Info', value: 'getNftInfo', description: 'Get NFT information' },
					{ name: 'Get NFTs by Owner', value: 'getNftsByOwner', description: 'Get NFTs owned by address' },
					{ name: 'Get Owner', value: 'getNftOwner', description: 'Get NFT owner' },
					{ name: 'Transfer', value: 'transferNft', description: 'Transfer NFT' },
				],
				default: 'getNftInfo',
			},

			// ==================== CONTRACT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['contract'] } },
				options: [
					{ name: 'Decode Function Result', value: 'decodeResult', description: 'Decode function call result' },
					{ name: 'Deploy Contract', value: 'deployContract', description: 'Deploy a smart contract' },
					{ name: 'Encode Function Call', value: 'encodeCall', description: 'Encode a function call' },
					{ name: 'Execute Contract', value: 'executeContract', description: 'Execute contract function (write)' },
					{ name: 'Get Contract Code', value: 'getContractCode', description: 'Get contract bytecode' },
					{ name: 'Read Contract', value: 'readContract', description: 'Read contract state (view)' },
				],
				default: 'readContract',
			},

			// ==================== STAKING OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['staking'] } },
				options: [
					{ name: 'Add to Bucket', value: 'addDeposit', description: 'Add more stake to a bucket' },
					{ name: 'Change Candidate', value: 'changeCandidate', description: 'Change bucket delegate' },
					{ name: 'Claim Rewards', value: 'claimRewards', description: 'Claim staking rewards' },
					{ name: 'Create Bucket', value: 'createBucket', description: 'Create a staking bucket' },
					{ name: 'Get Bucket Info', value: 'getBucketInfo', description: 'Get bucket information' },
					{ name: 'Get Buckets by Address', value: 'getBucketsByAddress', description: 'Get staking buckets for address' },
					{ name: 'Get Staking Rewards', value: 'getStakingRewards', description: 'Get available staking rewards' },
					{ name: 'Restake', value: 'restake', description: 'Restake a bucket' },
					{ name: 'Transfer Bucket', value: 'transferBucket', description: 'Transfer bucket ownership' },
					{ name: 'Unstake', value: 'unstake', description: 'Unstake a bucket' },
					{ name: 'Withdraw', value: 'withdraw', description: 'Withdraw unstaked tokens' },
				],
				default: 'getBucketsByAddress',
			},

			// ==================== DELEGATE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['delegate'] } },
				options: [
					{ name: 'Get Active Delegates', value: 'getActiveDelegates', description: 'Get currently active delegates' },
					{ name: 'Get All Delegates', value: 'getDelegates', description: 'Get all registered delegates' },
					{ name: 'Get Consensus Delegates', value: 'getConsensusDelegates', description: 'Get block-producing delegates' },
					{ name: 'Get Delegate Info', value: 'getDelegateInfo', description: 'Get delegate information' },
					{ name: 'Get Delegate Voters', value: 'getDelegateVoters', description: 'Get delegate voters' },
				],
				default: 'getDelegates',
			},

			// ==================== DEVICE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['device'] } },
				options: [
					{ name: 'Generate Device ID', value: 'generateDeviceId', description: 'Generate a unique device ID' },
					{ name: 'Get Device DID', value: 'getDeviceDID', description: 'Get device DID' },
					{ name: 'Get Device Info', value: 'getDeviceInfo', description: 'Get device information' },
					{ name: 'Register Device', value: 'registerDevice', description: 'Register a new device' },
					{ name: 'Sign Device Data', value: 'signDeviceData', description: 'Sign data with device key' },
					{ name: 'Submit Device Data', value: 'submitDeviceData', description: 'Submit device data to chain' },
					{ name: 'Verify Device Signature', value: 'verifyDeviceSignature', description: 'Verify device data signature' },
				],
				default: 'registerDevice',
			},

			// ==================== W3BSTREAM OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['w3bstream'] } },
				options: [
					{ name: 'Create Project', value: 'createProject', description: 'Create a W3bstream project' },
					{ name: 'Delete Applet', value: 'deleteApplet', description: 'Delete an applet' },
					{ name: 'Deploy Applet', value: 'deployApplet', description: 'Deploy a WASM applet' },
					{ name: 'Get Applet Info', value: 'getAppletInfo', description: 'Get applet information' },
					{ name: 'Get Applet Logs', value: 'getAppletLogs', description: 'Get applet execution logs' },
					{ name: 'Get Message History', value: 'getMessageHistory', description: 'Get message history' },
					{ name: 'Get Project Info', value: 'getProjectInfo', description: 'Get project information' },
					{ name: 'Get Project Metrics', value: 'getProjectMetrics', description: 'Get project metrics' },
					{ name: 'Get Proofs', value: 'getProofs', description: 'Get generated proofs' },
					{ name: 'Send Message', value: 'sendMessage', description: 'Send message to applet' },
					{ name: 'Start Applet', value: 'startApplet', description: 'Start an applet' },
					{ name: 'Stop Applet', value: 'stopApplet', description: 'Stop an applet' },
					{ name: 'Verify Proof', value: 'verifyProof', description: 'Verify a proof' },
				],
				default: 'getProjectInfo',
			},

			// ==================== DID OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['did'] } },
				options: [
					{ name: 'Create DID', value: 'createDID', description: 'Create a new DID' },
					{ name: 'Create Device DID', value: 'createDeviceDID', description: 'Create DID for a device' },
					{ name: 'Deactivate DID', value: 'deactivateDID', description: 'Deactivate a DID' },
					{ name: 'Get DID Document', value: 'getDIDDocument', description: 'Get DID document' },
					{ name: 'Resolve DID', value: 'resolveDID', description: 'Resolve a DID' },
					{ name: 'Update DID', value: 'updateDID', description: 'Update DID document' },
				],
				default: 'getDIDDocument',
			},

			// ==================== PEBBLE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['pebble'] } },
				options: [
					{ name: 'Get Firmware Version', value: 'getFirmwareVersion', description: 'Get Pebble firmware version' },
					{ name: 'Get Location History', value: 'getLocationHistory', description: 'Get Pebble location history' },
					{ name: 'Get Pebble Data', value: 'getPebbleData', description: 'Get Pebble sensor data' },
					{ name: 'Get Pebble Info', value: 'getPebbleInfo', description: 'Get Pebble device info' },
					{ name: 'Get Sensor Readings', value: 'getSensorReadings', description: 'Get latest sensor readings' },
					{ name: 'Parse Pebble Data', value: 'parsePebbleData', description: 'Parse raw Pebble data' },
					{ name: 'Register Pebble', value: 'registerPebble', description: 'Register a Pebble device' },
					{ name: 'Verify Pebble Data', value: 'verifyPebbleData', description: 'Verify Pebble data signature' },
				],
				default: 'getPebbleInfo',
			},

			// ==================== MACHINEFI OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['machinefi'] } },
				options: [
					{ name: 'Claim Machine Rewards', value: 'claimMachineRewards', description: 'Claim machine rewards' },
					{ name: 'Get Machine Earnings', value: 'getMachineEarnings', description: 'Get machine earnings' },
					{ name: 'Get Machine Info', value: 'getMachineInfo', description: 'Get machine information' },
					{ name: 'Register Machine', value: 'registerMachine', description: 'Register a machine' },
					{ name: 'Submit Machine Proof', value: 'submitMachineProof', description: 'Submit machine proof' },
				],
				default: 'getMachineInfo',
			},

			// ==================== BLOCK OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['block'] } },
				options: [
					{ name: 'Get Block', value: 'getBlock', description: 'Get block by height or hash' },
					{ name: 'Get Block Actions', value: 'getBlockActions', description: 'Get actions in a block' },
					{ name: 'Get Chain Meta', value: 'getChainMeta', description: 'Get chain metadata' },
					{ name: 'Get Latest Block', value: 'getLatestBlock', description: 'Get latest block' },
				],
				default: 'getLatestBlock',
			},

			// ==================== EPOCH OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['epoch'] } },
				options: [
					{ name: 'Get Current Epoch', value: 'getCurrentEpoch', description: 'Get current epoch info' },
					{ name: 'Get Epoch Delegates', value: 'getEpochDelegates', description: 'Get delegates for an epoch' },
					{ name: 'Get Epoch Meta', value: 'getEpochMeta', description: 'Get epoch metadata' },
				],
				default: 'getCurrentEpoch',
			},

			// ==================== BRIDGE OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['bridge'] } },
				options: [
					{ name: 'Bridge Token', value: 'bridgeToken', description: 'Bridge token to another chain' },
					{ name: 'Get Bridge Fee', value: 'getBridgeFee', description: 'Get bridge fee estimate' },
					{ name: 'Get Bridge Info', value: 'getBridgeInfo', description: 'Get bridge information' },
					{ name: 'Get Bridge Status', value: 'getBridgeStatus', description: 'Get bridge transaction status' },
					{ name: 'Get Supported Tokens', value: 'getSupportedTokens', description: 'Get supported bridge tokens' },
				],
				default: 'getBridgeInfo',
			},

			// ==================== UTILITY OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['utility'] } },
				options: [
					{ name: 'Convert Units', value: 'convertUnits', description: 'Convert between Rau and IOTX' },
					{ name: 'Generate Keypair', value: 'generateKeypair', description: 'Generate a new keypair' },
					{ name: 'Get Chain ID', value: 'getChainId', description: 'Get network chain ID' },
					{ name: 'Hash Data', value: 'hashData', description: 'Hash data with keccak256' },
					{ name: 'Sign Message', value: 'signMessage', description: 'Sign a message' },
					{ name: 'Verify Signature', value: 'verifySignature', description: 'Verify a message signature' },
				],
				default: 'convertUnits',
			},

			// ==================== COMMON INPUT FIELDS ====================
			
			// Address field
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'IoTeX address (io or 0x format)',
				displayOptions: {
					show: {
						resource: ['account', 'staking', 'delegate'],
						operation: ['getAccountInfo', 'getBalance', 'getNonce', 'getTokenBalances', 'validateAddress', 'convertAddress', 'getBucketsByAddress', 'getStakingRewards', 'getDelegateInfo', 'getDelegateVoters'],
					},
				},
			},

			// Token address field
			{
				displayName: 'Token Address',
				name: 'tokenAddress',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'XRC-20 token contract address',
				displayOptions: {
					show: {
						resource: ['token'],
					},
				},
			},

			// Contract address field
			{
				displayName: 'Contract Address',
				name: 'contractAddress',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'Smart contract address',
				displayOptions: {
					show: {
						resource: ['contract', 'nft'],
						operation: ['readContract', 'executeContract', 'getContractCode', 'getNftInfo', 'getNftOwner', 'getNftsByOwner', 'getCollectionInfo', 'transferNft', 'approveNft'],
					},
				},
			},

			// Recipient address
			{
				displayName: 'Recipient',
				name: 'recipient',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'Recipient address',
				displayOptions: {
					show: {
						resource: ['action', 'token'],
						operation: ['sendIotx', 'transfer', 'transferFrom'],
					},
				},
			},

			// Amount field
			{
				displayName: 'Amount',
				name: 'amount',
				type: 'string',
				default: '0',
				description: 'Amount in IOTX or token units',
				displayOptions: {
					show: {
						resource: ['action', 'token', 'staking'],
						operation: ['sendIotx', 'transfer', 'transferFrom', 'approve', 'createBucket', 'addDeposit'],
					},
				},
			},

			// Hash field (transaction/action hash)
			{
				displayName: 'Hash',
				name: 'hash',
				type: 'string',
				default: '',
				description: 'Transaction/action hash',
				displayOptions: {
					show: {
						resource: ['action', 'block'],
						operation: ['getAction', 'getActionReceipt', 'getBlock'],
					},
				},
			},

			// Block height field
			{
				displayName: 'Block Height',
				name: 'blockHeight',
				type: 'number',
				default: 0,
				description: 'Block height/number',
				displayOptions: {
					show: {
						resource: ['block'],
						operation: ['getBlock', 'getBlockActions'],
					},
				},
			},

			// ABI field
			{
				displayName: 'ABI',
				name: 'abi',
				type: 'json',
				default: '[]',
				description: 'Contract ABI (JSON array)',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract', 'executeContract', 'deployContract', 'encodeCall', 'decodeResult'],
					},
				},
			},

			// Function name field
			{
				displayName: 'Function Name',
				name: 'functionName',
				type: 'string',
				default: '',
				description: 'Contract function name',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract', 'executeContract', 'encodeCall', 'decodeResult'],
					},
				},
			},

			// Function arguments
			{
				displayName: 'Arguments',
				name: 'args',
				type: 'json',
				default: '[]',
				description: 'Function arguments (JSON array)',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['readContract', 'executeContract', 'deployContract', 'encodeCall'],
					},
				},
			},

			// Bytecode field
			{
				displayName: 'Bytecode',
				name: 'bytecode',
				type: 'string',
				default: '',
				description: 'Contract bytecode',
				displayOptions: {
					show: {
						resource: ['contract'],
						operation: ['deployContract'],
					},
				},
			},

			// Bucket index
			{
				displayName: 'Bucket Index',
				name: 'bucketIndex',
				type: 'number',
				default: 0,
				description: 'Staking bucket index',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['getBucketInfo', 'addDeposit', 'unstake', 'withdraw', 'restake', 'changeCandidate', 'transferBucket'],
					},
				},
			},

			// Candidate name
			{
				displayName: 'Candidate Name',
				name: 'candidateName',
				type: 'string',
				default: '',
				description: 'Delegate candidate name',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['createBucket', 'changeCandidate'],
					},
				},
			},

			// Stake duration
			{
				displayName: 'Stake Duration (Days)',
				name: 'stakeDuration',
				type: 'number',
				default: 0,
				description: 'Stake lock duration in days (0 for flexible)',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['createBucket', 'restake'],
					},
				},
			},

			// Auto-stake
			{
				displayName: 'Auto-Stake',
				name: 'autoStake',
				type: 'boolean',
				default: false,
				description: 'Whether to enable auto-staking for bonus rewards',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['createBucket', 'restake'],
					},
				},
			},

			// Token ID (for NFTs)
			{
				displayName: 'Token ID',
				name: 'tokenId',
				type: 'string',
				default: '',
				description: 'NFT token ID',
				displayOptions: {
					show: {
						resource: ['nft', 'pebble'],
						operation: ['getNftInfo', 'getNftOwner', 'transferNft', 'approveNft', 'getPebbleInfo', 'getPebbleData'],
					},
				},
			},

			// Device ID
			{
				displayName: 'Device ID',
				name: 'deviceId',
				type: 'string',
				default: '',
				description: 'Device identifier',
				displayOptions: {
					show: {
						resource: ['device', 'w3bstream', 'pebble'],
						operation: ['getDeviceInfo', 'submitDeviceData', 'signDeviceData', 'verifyDeviceSignature', 'getDeviceDID', 'sendMessage', 'registerPebble'],
					},
				},
			},

			// Project ID (W3bstream)
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				default: '',
				description: 'W3bstream project ID',
				displayOptions: {
					show: {
						resource: ['w3bstream'],
					},
				},
			},

			// Applet ID
			{
				displayName: 'Applet ID',
				name: 'appletId',
				type: 'string',
				default: '',
				description: 'W3bstream applet ID',
				displayOptions: {
					show: {
						resource: ['w3bstream'],
						operation: ['getAppletInfo', 'startApplet', 'stopApplet', 'deleteApplet', 'getAppletLogs', 'sendMessage'],
					},
				},
			},

			// DID
			{
				displayName: 'DID',
				name: 'did',
				type: 'string',
				default: '',
				placeholder: 'did:io:...',
				description: 'Decentralized Identifier',
				displayOptions: {
					show: {
						resource: ['did'],
						operation: ['getDIDDocument', 'resolveDID', 'updateDID', 'deactivateDID'],
					},
				},
			},

			// Message field
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				description: 'Message to sign or hash',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['signMessage', 'verifySignature', 'hashData'],
					},
				},
			},

			// Signature field
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				default: '',
				description: 'Message signature',
				displayOptions: {
					show: {
						resource: ['utility', 'device'],
						operation: ['verifySignature', 'verifyDeviceSignature'],
					},
				},
			},

			// Data/Payload field
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '{}',
				description: 'Data payload (JSON)',
				displayOptions: {
					show: {
						resource: ['device', 'w3bstream', 'pebble'],
						operation: ['submitDeviceData', 'signDeviceData', 'sendMessage', 'parsePebbleData'],
					},
				},
			},

			// Public key field
			{
				displayName: 'Public Key',
				name: 'publicKey',
				type: 'string',
				default: '',
				description: 'Public key (hex format)',
				displayOptions: {
					show: {
						resource: ['device', 'did'],
						operation: ['registerDevice', 'verifyDeviceSignature', 'createDeviceDID'],
					},
				},
			},

			// Unit conversion fields
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '0',
				description: 'Value to convert',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['convertUnits'],
					},
				},
			},
			{
				displayName: 'From Unit',
				name: 'fromUnit',
				type: 'options',
				options: [
					{ name: 'Rau', value: 'rau' },
					{ name: 'Qev', value: 'qev' },
					{ name: 'Jing', value: 'jing' },
					{ name: 'IOTX', value: 'iotx' },
				],
				default: 'iotx',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['convertUnits'],
					},
				},
			},
			{
				displayName: 'To Unit',
				name: 'toUnit',
				type: 'options',
				options: [
					{ name: 'Rau', value: 'rau' },
					{ name: 'Qev', value: 'qev' },
					{ name: 'Jing', value: 'jing' },
					{ name: 'IOTX', value: 'iotx' },
				],
				default: 'rau',
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['convertUnits'],
					},
				},
			},

			// IMEI field (Pebble)
			{
				displayName: 'IMEI',
				name: 'imei',
				type: 'string',
				default: '',
				description: 'Pebble device IMEI (15 digits)',
				displayOptions: {
					show: {
						resource: ['pebble'],
						operation: ['registerPebble', 'getPebbleInfo'],
					},
				},
			},

			// Raw data field (Pebble)
			{
				displayName: 'Raw Data',
				name: 'rawData',
				type: 'string',
				default: '',
				description: 'Raw hex data from Pebble device',
				displayOptions: {
					show: {
						resource: ['pebble'],
						operation: ['parsePebbleData', 'verifyPebbleData'],
					},
				},
			},

			// Epoch number
			{
				displayName: 'Epoch Number',
				name: 'epochNum',
				type: 'number',
				default: 0,
				description: 'Epoch number (0 for current)',
				displayOptions: {
					show: {
						resource: ['epoch', 'delegate'],
						operation: ['getEpochMeta', 'getEpochDelegates', 'getDelegates', 'getConsensusDelegates'],
					},
				},
			},

			// Bridge target chain
			{
				displayName: 'Target Chain',
				name: 'targetChain',
				type: 'options',
				options: [
					{ name: 'Ethereum', value: 'ethereum' },
					{ name: 'BSC', value: 'bsc' },
					{ name: 'Polygon', value: 'polygon' },
				],
				default: 'ethereum',
				displayOptions: {
					show: {
						resource: ['bridge'],
						operation: ['bridgeToken', 'getBridgeFee'],
					},
				},
			},

			// Proof ID
			{
				displayName: 'Proof ID',
				name: 'proofId',
				type: 'string',
				default: '',
				description: 'W3bstream proof ID',
				displayOptions: {
					show: {
						resource: ['w3bstream'],
						operation: ['verifyProof'],
					},
				},
			},

			// Machine ID
			{
				displayName: 'Machine ID',
				name: 'machineId',
				type: 'string',
				default: '',
				description: 'MachineFi machine identifier',
				displayOptions: {
					show: {
						resource: ['machinefi'],
						operation: ['getMachineInfo', 'getMachineEarnings', 'claimMachineRewards', 'submitMachineProof'],
					},
				},
			},

			// Spender address (for approvals)
			{
				displayName: 'Spender',
				name: 'spender',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'Spender address for allowance',
				displayOptions: {
					show: {
						resource: ['token'],
						operation: ['approve', 'getAllowance'],
					},
				},
			},

			// Owner address (for token queries)
			{
				displayName: 'Owner',
				name: 'owner',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'Token owner address',
				displayOptions: {
					show: {
						resource: ['token', 'nft'],
						operation: ['getAllowance', 'transferFrom', 'getNftsByOwner'],
					},
				},
			},

			// New owner (for transfers)
			{
				displayName: 'New Owner',
				name: 'newOwner',
				type: 'string',
				default: '',
				placeholder: 'io1... or 0x...',
				description: 'New owner address',
				displayOptions: {
					show: {
						resource: ['staking'],
						operation: ['transferBucket'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Get credentials
		const credentials = await this.getCredentials('iotexNetwork');
		
		// Initialize client
		const client = createIotexClient({
			network: credentials.network as 'mainnet' | 'testnet' | 'custom',
			httpEndpoint: credentials.httpEndpoint as string,
			grpcEndpoint: credentials.grpcEndpoint as string,
			privateKey: credentials.privateKey as string,
			apiKey: credentials.apiKey as string,
		});

		// Initialize explorer API if credentials available
		let explorerApi: ExplorerApi | null = null;
		try {
			const scanCredentials = await this.getCredentials('iotexScan');
			explorerApi = createExplorerApi({
				network: scanCredentials.network as 'mainnet' | 'testnet',
				apiKey: scanCredentials.apiKey as string,
				customEndpoint: scanCredentials.apiEndpoint as string,
			});
		} catch {
			// IoTeXScan credentials not provided, some operations may not work
		}

		// Initialize W3bstream client if credentials available
		let w3bstreamClient: W3bstreamClient | null = null;
		try {
			const w3bCredentials = await this.getCredentials('w3bstream');
			w3bstreamClient = createW3bstreamClient({
				environment: w3bCredentials.environment as 'production' | 'staging' | 'custom',
				customEndpoint: w3bCredentials.endpoint as string,
				projectId: w3bCredentials.projectId as string,
				apiKey: w3bCredentials.apiKey as string,
				publisherToken: w3bCredentials.publisherToken as string,
			});
		} catch {
			// W3bstream credentials not provided
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject = {};

				// ==================== ACCOUNT OPERATIONS ====================
				if (resource === 'account') {
					if (operation === 'getAccountInfo') {
						const address = this.getNodeParameter('address', i) as string;
						const accountInfo = await client.getAccountInfo(address);
						result = accountInfo as unknown as IDataObject;
					}
					else if (operation === 'getBalance') {
						const address = this.getNodeParameter('address', i) as string;
						const balance = await client.getBalance(address);
						result = { address: toIoAddress(address), balance, unit: 'IOTX' };
					}
					else if (operation === 'getNonce') {
						const address = this.getNodeParameter('address', i) as string;
						const nonce = await client.getNonce(address);
						result = { address: toIoAddress(address), nonce };
					}
					else if (operation === 'validateAddress') {
						const address = this.getNodeParameter('address', i) as string;
						const valid = isValidAddress(address);
						result = { address, valid, format: address.startsWith('io') ? 'io' : '0x' };
					}
					else if (operation === 'convertAddress') {
						const address = this.getNodeParameter('address', i) as string;
						const formats = getAddressFormats(address);
						result = { original: address, ...formats };
					}
					else if (operation === 'createAccount') {
						const keypair = generateKeypair();
						result = {
							ioAddress: keypair.ioAddress,
							hexAddress: keypair.hexAddress,
							publicKey: keypair.publicKey,
							privateKey: keypair.privateKey,
							warning: 'Store your private key securely! It cannot be recovered.',
						};
					}
					else if (operation === 'getTokenBalances') {
						const address = this.getNodeParameter('address', i) as string;
						if (explorerApi) {
							const transfers = await explorerApi.getTokenTransfers(address);
							result = { address: toIoAddress(address), transfers };
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required for this operation');
						}
					}
				}

				// ==================== ACTION OPERATIONS ====================
				else if (resource === 'action') {
					if (operation === 'sendIotx') {
						const recipient = this.getNodeParameter('recipient', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const tx = await client.sendIotx(recipient, amount);
						result = {
							hash: tx.hash,
							from: tx.from,
							to: tx.to,
							value: amount,
							status: 'pending',
						};
					}
					else if (operation === 'getAction') {
						const hash = this.getNodeParameter('hash', i) as string;
						const action = await client.getTransaction(hash);
						result = action as unknown as IDataObject;
					}
					else if (operation === 'getActionReceipt') {
						const hash = this.getNodeParameter('hash', i) as string;
						const receipt = await client.getTransactionReceipt(hash);
						result = receipt as unknown as IDataObject;
					}
					else if (operation === 'getActionsByAddress') {
						const address = this.getNodeParameter('address', i) as string;
						if (explorerApi) {
							const actions = await explorerApi.getActionsByAddress(address);
							result = { address: toIoAddress(address), actions };
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required for this operation');
						}
					}
					else if (operation === 'estimateGas') {
						const address = this.getNodeParameter('address', i) as string;
						const recipient = this.getNodeParameter('recipient', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const gas = await client.estimateGas(address, recipient, amount);
						result = { estimatedGas: gas.toString() };
					}
					else if (operation === 'getGasPrice') {
						const gasPrice = await client.getGasPrice();
						result = { gasPrice: gasPrice.toString(), gasPriceIotx: rauToIotx(gasPrice.toString()) };
					}
				}

				// ==================== TOKEN OPERATIONS ====================
				else if (resource === 'token') {
					const tokenAddress = this.getNodeParameter('tokenAddress', i) as string;
					
					if (operation === 'getTokenInfo') {
						const tokenResults = await Promise.all([
							client.readContract(tokenAddress, XRC20_ABI, 'name'),
							client.readContract(tokenAddress, XRC20_ABI, 'symbol'),
							client.readContract(tokenAddress, XRC20_ABI, 'decimals'),
							client.readContract(tokenAddress, XRC20_ABI, 'totalSupply'),
						]);
						const [name, symbol, decimals, totalSupply] = tokenResults as [string, string, unknown, unknown];
						result = { address: tokenAddress, name, symbol, decimals: Number(decimals), totalSupply: String(totalSupply) };
					}
					else if (operation === 'getTokenBalance') {
						const address = this.getNodeParameter('address', i) as string;
						const balance = await client.readContract(tokenAddress, XRC20_ABI, 'balanceOf', [toHexAddress(address)]);
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						result = {
							address: toIoAddress(address),
							tokenAddress,
							balance: balance?.toString(),
							formatted: formatTokenAmount(balance?.toString() || '0', Number(decimals)),
						};
					}
					else if (operation === 'transfer') {
						const recipient = this.getNodeParameter('recipient', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						const amountRaw = parseTokenAmount(amount, Number(decimals));
						const tx = await client.executeContract(tokenAddress, XRC20_ABI, 'transfer', [toHexAddress(recipient), amountRaw]);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'approve') {
						const spender = this.getNodeParameter('spender', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						const amountRaw = parseTokenAmount(amount, Number(decimals));
						const tx = await client.executeContract(tokenAddress, XRC20_ABI, 'approve', [toHexAddress(spender), amountRaw]);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'getAllowance') {
						const owner = this.getNodeParameter('owner', i) as string;
						const spender = this.getNodeParameter('spender', i) as string;
						const allowance = await client.readContract(tokenAddress, XRC20_ABI, 'allowance', [toHexAddress(owner), toHexAddress(spender)]);
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						result = {
							owner: toIoAddress(owner),
							spender: toIoAddress(spender),
							allowance: allowance?.toString(),
							formatted: formatTokenAmount(allowance?.toString() || '0', Number(decimals)),
						};
					}
					else if (operation === 'transferFrom') {
						const owner = this.getNodeParameter('owner', i) as string;
						const recipient = this.getNodeParameter('recipient', i) as string;
						const amount = this.getNodeParameter('amount', i) as string;
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						const amountRaw = parseTokenAmount(amount, Number(decimals));
						const tx = await client.executeContract(tokenAddress, XRC20_ABI, 'transferFrom', [toHexAddress(owner), toHexAddress(recipient), amountRaw]);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'getTotalSupply') {
						const totalSupply = await client.readContract(tokenAddress, XRC20_ABI, 'totalSupply');
						const decimals = await client.readContract(tokenAddress, XRC20_ABI, 'decimals');
						result = {
							tokenAddress,
							totalSupply: totalSupply?.toString(),
							formatted: formatTokenAmount(totalSupply?.toString() || '0', Number(decimals)),
						};
					}
				}

				// ==================== NFT OPERATIONS ====================
				else if (resource === 'nft') {
					const contractAddress = this.getNodeParameter('contractAddress', i) as string;
					
					if (operation === 'getNftInfo') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						const nftResults = await Promise.all([
							client.readContract(contractAddress, XRC721_ABI, 'name'),
							client.readContract(contractAddress, XRC721_ABI, 'symbol'),
							client.readContract(contractAddress, XRC721_ABI, 'ownerOf', [tokenId]),
							client.readContract(contractAddress, XRC721_ABI, 'tokenURI', [tokenId]),
						]);
						const [name, symbol, owner, tokenUri] = nftResults as [string, string, string, string];
						result = { contractAddress, tokenId, name, symbol, owner: toIoAddress(owner), tokenUri };
					}
					else if (operation === 'getNftOwner') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						const owner = await client.readContract(contractAddress, XRC721_ABI, 'ownerOf', [tokenId]);
						result = { contractAddress, tokenId, owner: toIoAddress(owner as string) };
					}
					else if (operation === 'getNftsByOwner') {
						const owner = this.getNodeParameter('owner', i) as string;
						if (explorerApi) {
							const nfts = await explorerApi.getNFTsByOwner(owner, contractAddress);
							result = { owner: toIoAddress(owner), nfts };
						} else {
							const balance = await client.readContract(contractAddress, XRC721_ABI, 'balanceOf', [toHexAddress(owner)]);
							result = { owner: toIoAddress(owner), balance: balance?.toString() };
						}
					}
					else if (operation === 'getCollectionInfo') {
						const collectionResults = await Promise.all([
							client.readContract(contractAddress, XRC721_ABI, 'name'),
							client.readContract(contractAddress, XRC721_ABI, 'symbol'),
						]);
						const [name, symbol] = collectionResults as [string, string];
						result = { contractAddress, name, symbol };
					}
					else if (operation === 'transferNft') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						const recipient = this.getNodeParameter('recipient', i) as string;
						const wallet = client.getWallet();
						if (!wallet) throw new NodeOperationError(this.getNode(), 'Private key required');
						const tx = await client.executeContract(contractAddress, XRC721_ABI, 'transferFrom', [wallet.address, toHexAddress(recipient), tokenId]);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'approveNft') {
						const tokenId = this.getNodeParameter('tokenId', i) as string;
						const spender = this.getNodeParameter('spender', i) as string;
						const tx = await client.executeContract(contractAddress, XRC721_ABI, 'approve', [toHexAddress(spender), tokenId]);
						result = { hash: tx.hash, status: 'pending' };
					}
				}

				// ==================== CONTRACT OPERATIONS ====================
				else if (resource === 'contract') {
					if (operation === 'readContract') {
						const contractAddress = this.getNodeParameter('contractAddress', i) as string;
						const abi = this.getNodeParameter('abi', i) as string;
						const functionName = this.getNodeParameter('functionName', i) as string;
						const args = this.getNodeParameter('args', i) as string;
						const abiArray = JSON.parse(abi);
						const argsArray = JSON.parse(args);
						const res = await client.readContract(contractAddress, abiArray, functionName, argsArray);
						const formattedRes = res != null && typeof (res as { toString?: () => string }).toString === 'function' 
							? String(res) 
							: (res as IDataObject);
						result = { result: formattedRes };
					}
					else if (operation === 'executeContract') {
						const contractAddress = this.getNodeParameter('contractAddress', i) as string;
						const abi = this.getNodeParameter('abi', i) as string;
						const functionName = this.getNodeParameter('functionName', i) as string;
						const args = this.getNodeParameter('args', i) as string;
						const amount = this.getNodeParameter('amount', i, '0') as string;
						const abiArray = JSON.parse(abi);
						const argsArray = JSON.parse(args);
						const tx = await client.executeContract(contractAddress, abiArray, functionName, argsArray, amount);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'deployContract') {
						const abi = this.getNodeParameter('abi', i) as string;
						const bytecode = this.getNodeParameter('bytecode', i) as string;
						const args = this.getNodeParameter('args', i) as string;
						const abiArray = JSON.parse(abi);
						const argsArray = JSON.parse(args);
						const tx = await client.deployContract(abiArray, bytecode, argsArray);
						result = { hash: tx.hash, status: 'pending' };
					}
					else if (operation === 'getContractCode') {
						const contractAddress = this.getNodeParameter('contractAddress', i) as string;
						const code = await client.getContractCode(contractAddress);
						result = { contractAddress, code, hasCode: code !== '0x' };
					}
					else if (operation === 'encodeCall') {
						const abi = this.getNodeParameter('abi', i) as string;
						const functionName = this.getNodeParameter('functionName', i) as string;
						const args = this.getNodeParameter('args', i) as string;
						const abiArray = JSON.parse(abi);
						const argsArray = JSON.parse(args);
						const encoded = encodeFunctionCall(abiArray, functionName, argsArray);
						result = { encoded };
					}
					else if (operation === 'decodeResult') {
						const abi = this.getNodeParameter('abi', i) as string;
						const functionName = this.getNodeParameter('functionName', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const abiArray = JSON.parse(abi);
						const decoded = decodeFunctionResult(abiArray, functionName, data);
						result = { decoded: decoded as IDataObject };
					}
				}

				// ==================== STAKING OPERATIONS ====================
				else if (resource === 'staking') {
					if (operation === 'getBucketsByAddress') {
						const address = this.getNodeParameter('address', i) as string;
						if (explorerApi) {
							const buckets = await explorerApi.getBucketsByAddress(address);
							result = { address: toIoAddress(address), buckets };
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required');
						}
					}
					else if (operation === 'getBucketInfo') {
						const bucketIndex = this.getNodeParameter('bucketIndex', i) as number;
						if (explorerApi) {
							const bucket = await explorerApi.getBucketByIndex(bucketIndex);
							result = bucket as unknown as IDataObject;
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required');
						}
					}
					else if (operation === 'getStakingRewards') {
						const address = this.getNodeParameter('address', i) as string;
						if (explorerApi) {
							const rewards = await explorerApi.getStakingRewards(address);
							result = { address: toIoAddress(address), ...rewards };
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required');
						}
					}
					else if (operation === 'createBucket') {
						result = { message: 'Staking bucket creation requires native IoTeX staking protocol. Use IoTeX native wallet or SDK.' };
					}
					else if (operation === 'addDeposit' || operation === 'unstake' || operation === 'withdraw' || operation === 'restake' || operation === 'changeCandidate' || operation === 'transferBucket' || operation === 'claimRewards') {
						result = { message: `${operation} requires native IoTeX staking protocol. Use IoTeX native wallet or SDK.` };
					}
				}

				// ==================== DELEGATE OPERATIONS ====================
				else if (resource === 'delegate') {
					if (!explorerApi) {
						throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required for delegate operations');
					}
					
					if (operation === 'getDelegates') {
						const epochNum = this.getNodeParameter('epochNum', i, 0) as number;
						const delegates = await explorerApi.getDelegates(epochNum || undefined);
						result = { delegates };
					}
					else if (operation === 'getDelegateInfo') {
						const address = this.getNodeParameter('address', i) as string;
						const delegate = await explorerApi.getDelegate(address);
						result = delegate as unknown as IDataObject;
					}
					else if (operation === 'getDelegateVoters') {
						const address = this.getNodeParameter('address', i) as string;
						const voters = await explorerApi.getDelegateVoters(address);
						result = { delegate: address, voters };
					}
					else if (operation === 'getConsensusDelegates') {
						const epochNum = this.getNodeParameter('epochNum', i, 0) as number;
						const delegates = await explorerApi.getConsensusDelegates(epochNum || undefined);
						result = { delegates };
					}
					else if (operation === 'getActiveDelegates') {
						const delegates = await explorerApi.getDelegates();
						const active = delegates.filter(d => d.status === 'active');
						result = { delegates: active };
					}
				}

				// ==================== DEVICE OPERATIONS ====================
				else if (resource === 'device') {
					if (operation === 'generateDeviceId') {
						const deviceId = generateDeviceId();
						result = { deviceId };
					}
					else if (operation === 'signDeviceData') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const wallet = client.getWallet();
						if (!wallet) throw new NodeOperationError(this.getNode(), 'Private key required');
						const dataObj = JSON.parse(data);
						const signature = signDeviceData({ deviceId, ...dataObj }, wallet.privateKey);
						result = { deviceId, signature };
					}
					else if (operation === 'verifyDeviceSignature') {
						const message = this.getNodeParameter('message', i) as string;
						const signature = this.getNodeParameter('signature', i) as string;
						const publicKey = this.getNodeParameter('publicKey', i) as string;
						const valid = verifyDeviceSignature(message, signature, publicKey);
						result = { valid };
					}
					else if (operation === 'getDeviceDID') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						result = { did: `did:io:${deviceId}` };
					}
					else if (operation === 'registerDevice' || operation === 'getDeviceInfo' || operation === 'submitDeviceData') {
						result = { message: 'Device registry operations require W3bstream or MachineFi integration.' };
					}
				}

				// ==================== W3BSTREAM OPERATIONS ====================
				else if (resource === 'w3bstream') {
					if (!w3bstreamClient) {
						throw new NodeOperationError(this.getNode(), 'W3bstream credentials required');
					}
					
					const projectId = this.getNodeParameter('projectId', i, '') as string;
					
					if (operation === 'getProjectInfo') {
						const project = await w3bstreamClient.getProject(projectId);
						result = project as unknown as IDataObject;
					}
					else if (operation === 'createProject') {
						const name = this.getNodeParameter('name', i, 'New Project') as string;
						const project = await w3bstreamClient.createProject(name);
						result = project as unknown as IDataObject;
					}
					else if (operation === 'getAppletInfo') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						const applet = await w3bstreamClient.getApplet(projectId, appletId);
						result = applet as unknown as IDataObject;
					}
					else if (operation === 'startApplet') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						const applet = await w3bstreamClient.startApplet(projectId, appletId);
						result = applet as unknown as IDataObject;
					}
					else if (operation === 'stopApplet') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						const applet = await w3bstreamClient.stopApplet(projectId, appletId);
						result = applet as unknown as IDataObject;
					}
					else if (operation === 'deleteApplet') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						await w3bstreamClient.deleteApplet(projectId, appletId);
						result = { success: true };
					}
					else if (operation === 'getAppletLogs') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						const logs = await w3bstreamClient.getAppletLogs(projectId, appletId);
						result = { logs };
					}
					else if (operation === 'sendMessage') {
						const appletId = this.getNodeParameter('appletId', i) as string;
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const data = this.getNodeParameter('data', i) as string;
						const message = await w3bstreamClient.sendMessage(projectId, appletId, deviceId, JSON.parse(data));
						result = message as unknown as IDataObject;
					}
					else if (operation === 'getMessageHistory') {
						const appletId = this.getNodeParameter('appletId', i, '') as string;
						const messages = await w3bstreamClient.getMessages(projectId, appletId || undefined);
						result = { messages };
					}
					else if (operation === 'getProofs') {
						const proofs = await w3bstreamClient.getProofs(projectId);
						result = { proofs };
					}
					else if (operation === 'verifyProof') {
						const proofId = this.getNodeParameter('proofId', i) as string;
						const verification = await w3bstreamClient.verifyProof(projectId, proofId);
						result = verification as IDataObject;
					}
					else if (operation === 'getProjectMetrics') {
						const metrics = await w3bstreamClient.getProjectMetrics(projectId);
						result = metrics as IDataObject;
					}
					else if (operation === 'deployApplet') {
						result = { message: 'Applet deployment requires WASM binary upload. Use W3bstream Studio or CLI.' };
					}
				}

				// ==================== DID OPERATIONS ====================
				else if (resource === 'did') {
					if (operation === 'createDeviceDID') {
						const deviceId = this.getNodeParameter('deviceId', i) as string;
						const publicKey = this.getNodeParameter('publicKey', i) as string;
						const wallet = client.getWallet();
						const controller = wallet ? toIoAddress(wallet.address) : '';
						const didDoc = createDeviceDID(deviceId, publicKey, controller);
						result = didDoc as unknown as IDataObject;
					}
					else if (operation === 'getDIDDocument' || operation === 'resolveDID') {
						const did = this.getNodeParameter('did', i) as string;
						result = { did, message: 'DID resolution requires IoTeX DID registry contract.' };
					}
					else if (operation === 'createDID' || operation === 'updateDID' || operation === 'deactivateDID') {
						result = { message: `${operation} requires IoTeX DID registry contract.` };
					}
				}

				// ==================== PEBBLE OPERATIONS ====================
				else if (resource === 'pebble') {
					if (operation === 'parsePebbleData') {
						const rawData = String(this.getNodeParameter('rawData', i));
						const sensorData = parsePebbleData(rawData);
						result = sensorData as unknown as IDataObject;
					}
					else if (operation === 'registerPebble') {
						const imei = this.getNodeParameter('imei', i) as string;
						if (!isValidPebbleIMEI(imei)) {
							throw new NodeOperationError(this.getNode(), 'Invalid IMEI format');
						}
						result = { imei, message: 'Pebble registration requires Pebble Portal.' };
					}
					else if (operation === 'getPebbleInfo' || operation === 'getPebbleData' || operation === 'getSensorReadings' || operation === 'getLocationHistory' || operation === 'getFirmwareVersion' || operation === 'verifyPebbleData') {
						result = { message: `${operation} requires Pebble Tracker API or contract integration.` };
					}
				}

				// ==================== MACHINEFI OPERATIONS ====================
				else if (resource === 'machinefi') {
					const machineId = this.getNodeParameter('machineId', i, '') as string;
					result = { machineId, message: `${operation} requires MachineFi Portal integration.` };
				}

				// ==================== BLOCK OPERATIONS ====================
				else if (resource === 'block') {
					if (operation === 'getLatestBlock') {
						const block = await client.getLatestBlock();
						result = block as unknown as IDataObject;
					}
					else if (operation === 'getBlock') {
						const hash = this.getNodeParameter('hash', i, '') as string;
						const blockHeight = this.getNodeParameter('blockHeight', i, 0) as number;
						const block = await client.getBlock(hash || blockHeight);
						result = block as unknown as IDataObject;
					}
					else if (operation === 'getBlockActions') {
						const blockHeight = this.getNodeParameter('blockHeight', i) as number;
						if (explorerApi) {
							const actions = await explorerApi.getActionsByBlock(blockHeight);
							result = { blockHeight, actions };
						} else {
							throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required');
						}
					}
					else if (operation === 'getChainMeta') {
						const chainMeta = await client.getChainMeta();
						result = chainMeta as unknown as IDataObject;
					}
				}

				// ==================== EPOCH OPERATIONS ====================
				else if (resource === 'epoch') {
					if (!explorerApi) {
						throw new NodeOperationError(this.getNode(), 'IoTeXScan credentials required for epoch operations');
					}
					
					if (operation === 'getCurrentEpoch') {
						const epochInfo = await explorerApi.getEpochInfo();
						result = epochInfo as IDataObject;
					}
					else if (operation === 'getEpochMeta') {
						const epochNum = this.getNodeParameter('epochNum', i, 0) as number;
						const epochInfo = await explorerApi.getEpochInfo(epochNum || undefined);
						result = epochInfo as IDataObject;
					}
					else if (operation === 'getEpochDelegates') {
						const epochNum = this.getNodeParameter('epochNum', i, 0) as number;
						const delegates = await explorerApi.getDelegates(epochNum || undefined);
						result = { epoch: epochNum, delegates };
					}
				}

				// ==================== BRIDGE OPERATIONS ====================
				else if (resource === 'bridge') {
					result = { message: `${operation} requires ioTube bridge integration. Visit https://iotube.org for cross-chain transfers.` };
				}

				// ==================== UTILITY OPERATIONS ====================
				else if (resource === 'utility') {
					if (operation === 'convertUnits') {
						const value = this.getNodeParameter('value', i) as string;
						const fromUnit = this.getNodeParameter('fromUnit', i) as string;
						const toUnit = this.getNodeParameter('toUnit', i) as string;
						const converted = convertUnits(value, fromUnit, toUnit);
						result = { original: value, fromUnit, toUnit, converted };
					}
					else if (operation === 'generateKeypair') {
						const keypair = generateKeypair();
						result = {
							ioAddress: keypair.ioAddress,
							hexAddress: keypair.hexAddress,
							publicKey: keypair.publicKey,
							privateKey: keypair.privateKey,
							warning: 'Store your private key securely! It cannot be recovered.',
						};
					}
					else if (operation === 'getChainId') {
						const chainId = await client.getChainId();
						result = { chainId: chainId.toString() };
					}
					else if (operation === 'signMessage') {
						const message = this.getNodeParameter('message', i) as string;
						const signature = await client.signMessage(message);
						result = { message, signature };
					}
					else if (operation === 'verifySignature') {
						const message = this.getNodeParameter('message', i) as string;
						const signature = this.getNodeParameter('signature', i) as string;
						const address = client.verifyMessage(message, signature);
						result = { message, signature, recoveredAddress: toIoAddress(address) };
					}
					else if (operation === 'hashData') {
						const message = this.getNodeParameter('message', i) as string;
						const hash = client.keccak256(message);
						result = { data: message, hash };
					}
				}

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
