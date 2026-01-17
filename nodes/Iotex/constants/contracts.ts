/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX System Contract Constants
 * 
 * IoTeX has several system contracts for native operations:
 * - Staking: Native token staking and delegation
 * - Rewards: Epoch reward distribution
 * - DID: Decentralized identity management
 */

/**
 * System contract addresses (same on all networks)
 */
export const SYSTEM_CONTRACTS = {
	// Native staking contract
	STAKING: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqd39ym7',
	// Rewards distribution contract
	REWARDS: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxg9f07qr',
	// Block reward contract
	BLOCK_REWARD: 'io1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqxgce2xkh',
};

/**
 * IoTeX system action types
 * These are native actions handled by the protocol
 */
export const ACTION_TYPES = {
	TRANSFER: 'transfer',
	EXECUTION: 'execution',
	CREATE_STAKE: 'stakeCreate',
	UNSTAKE: 'stakeUnstake',
	WITHDRAW_STAKE: 'stakeWithdraw',
	ADD_DEPOSIT: 'stakeAddDeposit',
	RESTAKE: 'stakeRestake',
	CHANGE_CANDIDATE: 'stakeChangeCandidate',
	TRANSFER_STAKE: 'stakeTransferOwnership',
	CANDIDATE_REGISTER: 'candidateRegister',
	CANDIDATE_UPDATE: 'candidateUpdate',
	CLAIM_FROM_REWARDING_FUND: 'claimFromRewardingFund',
	GRANT_REWARD: 'grantReward',
};

/**
 * Contract ABIs for common system operations
 */
export const STAKING_CONTRACT_ABI = [
	// Staking read functions
	'function buckets(uint256 index) view returns (tuple(uint256 index, address owner, bytes12 candidateName, uint256 stakedAmount, uint256 stakeDuration, uint256 createTime, uint256 stakeStartTime, bool autoStake, address candidate))',
	'function bucketsByCandidate(bytes12 candidateName) view returns (uint256[])',
	'function bucketsByVoter(address voter) view returns (uint256[])',
	'function totalStakingAmount() view returns (uint256)',
	'function bucketsCount() view returns (uint256)',
	
	// Staking write functions
	'function createBucket(bytes12 candidateName, uint256 amount, uint256 duration, bool autoStake) payable returns (uint256)',
	'function addDeposit(uint256 bucketIndex, uint256 amount) payable',
	'function unstake(uint256 bucketIndex)',
	'function withdraw(uint256 bucketIndex)',
	'function restake(uint256 bucketIndex, uint256 duration, bool autoStake)',
	'function changeCandidate(uint256 bucketIndex, bytes12 candidateName)',
	'function transferOwnership(uint256 bucketIndex, address newOwner)',
];

/**
 * W3bstream contract ABIs
 */
export const W3BSTREAM_CONTRACTS = {
	PROJECT_REGISTRY: {
		address: 'io1...',
		abi: [
			'function register(string name, string uri) returns (uint256)',
			'function getProject(uint256 projectId) view returns (tuple(uint256 id, address owner, string name, string uri, bool active))',
			'function projectsByOwner(address owner) view returns (uint256[])',
		],
	},
	DEVICE_REGISTRY: {
		address: 'io1...',
		abi: [
			'function registerDevice(bytes32 deviceId, bytes publicKey) returns (bool)',
			'function getDevice(bytes32 deviceId) view returns (tuple(bytes32 id, address owner, bytes publicKey, bool active))',
			'function devicesByOwner(address owner) view returns (bytes32[])',
			'function transferDevice(bytes32 deviceId, address newOwner)',
		],
	},
};

/**
 * DID (Decentralized Identity) contract ABIs
 */
export const DID_CONTRACTS = {
	DID_REGISTRY: {
		address: 'io1...',
		abi: [
			'function createDID(string did, bytes document) returns (bool)',
			'function getDID(string did) view returns (tuple(string did, address controller, bytes document, uint256 created, uint256 updated, bool active))',
			'function updateDID(string did, bytes document) returns (bool)',
			'function deactivateDID(string did) returns (bool)',
			'function transferDID(string did, address newController) returns (bool)',
		],
	},
};

/**
 * MachineFi Portal contract ABIs
 */
export const MACHINEFI_CONTRACTS = {
	MACHINE_REGISTRY: {
		address: 'io1...',
		abi: [
			'function registerMachine(bytes32 machineId, string metadata) returns (uint256)',
			'function getMachine(uint256 tokenId) view returns (tuple(bytes32 machineId, address owner, string metadata, uint256 earnings, bool active))',
			'function claimRewards(uint256 tokenId) returns (uint256)',
		],
	},
};

/**
 * Pebble Tracker contract ABIs
 */
export const PEBBLE_CONTRACTS = {
	PEBBLE_NFT: {
		address: 'io1...',
		abi: [
			'function ownerOf(uint256 tokenId) view returns (address)',
			'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
			'function balanceOf(address owner) view returns (uint256)',
			'function getDeviceInfo(uint256 tokenId) view returns (tuple(bytes32 imei, string firmware, uint256 lastUpdate))',
		],
	},
	PEBBLE_DATA: {
		address: 'io1...',
		abi: [
			'function submitData(uint256 tokenId, bytes data, bytes signature) returns (bool)',
			'function getData(uint256 tokenId, uint256 fromTime, uint256 toTime) view returns (bytes[])',
		],
	},
};

/**
 * Bridge (Hermes/ioTube) contract ABIs
 */
export const BRIDGE_CONTRACTS = {
	TUBE: {
		address: 'io1...',
		abi: [
			'function deposit(address token, uint256 amount, address recipient, uint256 targetChainId) payable returns (bytes32)',
			'function claim(bytes32 transferId, bytes proof) returns (bool)',
			'function getTransfer(bytes32 transferId) view returns (tuple(address token, uint256 amount, address sender, address recipient, uint256 sourceChainId, uint256 targetChainId, uint256 timestamp, uint8 status))',
		],
	},
};
