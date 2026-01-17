/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Action Builder Utility
 * 
 * In IoTeX, transactions are called "Actions".
 * This utility helps build, sign, and send actions.
 */

import { ethers } from 'ethers';
import { toHexAddress } from './addressUtils';
import { iotxToRau } from './unitConverter';

/**
 * Action types in IoTeX
 */
export type ActionType =
	| 'transfer'
	| 'execution'
	| 'stakeCreate'
	| 'stakeUnstake'
	| 'stakeWithdraw'
	| 'stakeAddDeposit'
	| 'stakeRestake'
	| 'stakeChangeCandidate'
	| 'stakeTransferOwnership'
	| 'candidateRegister'
	| 'candidateUpdate'
	| 'claimFromRewardingFund';

/**
 * Base action structure
 */
export interface ActionCore {
	version: number;
	nonce: string;
	gasLimit: string;
	gasPrice: string;
}

/**
 * Transfer action
 */
export interface TransferAction extends ActionCore {
	transfer: {
		amount: string;
		recipient: string;
		payload: string;
	};
}

/**
 * Execution action (smart contract call)
 */
export interface ExecutionAction extends ActionCore {
	execution: {
		amount: string;
		contract: string;
		data: string;
	};
}

/**
 * Stake create action
 */
export interface StakeCreateAction extends ActionCore {
	stakeCreate: {
		candidateName: string;
		stakedAmount: string;
		stakedDuration: number;
		autoStake: boolean;
		payload: string;
	};
}

/**
 * Transaction receipt
 */
export interface ActionReceipt {
	status: number;
	blkHeight: string;
	actHash: string;
	gasConsumed: string;
	contractAddress?: string;
	logs: Array<{
		contractAddress: string;
		topics: string[];
		data: string;
		blkHeight: string;
		actHash: string;
		index: number;
	}>;
	executionRevertMsg?: string;
}

/**
 * Build a transfer action
 */
export function buildTransferAction(
	recipient: string,
	amount: string,
	nonce: string,
	gasLimit: string = '21000',
	gasPrice: string = '1000000000000',
	payload: string = '',
): TransferAction {
	return {
		version: 1,
		nonce,
		gasLimit,
		gasPrice,
		transfer: {
			amount: iotxToRau(amount),
			recipient: toHexAddress(recipient),
			payload: payload ? Buffer.from(payload).toString('hex') : '',
		},
	};
}

/**
 * Build an execution action (contract call)
 */
export function buildExecutionAction(
	contractAddress: string,
	amount: string,
	data: string,
	nonce: string,
	gasLimit: string = '200000',
	gasPrice: string = '1000000000000',
): ExecutionAction {
	return {
		version: 1,
		nonce,
		gasLimit,
		gasPrice,
		execution: {
			amount: iotxToRau(amount),
			contract: toHexAddress(contractAddress),
			data: data.startsWith('0x') ? data.slice(2) : data,
		},
	};
}

/**
 * Build a stake create action
 */
export function buildStakeCreateAction(
	candidateName: string,
	stakedAmount: string,
	stakedDuration: number,
	autoStake: boolean,
	nonce: string,
	gasLimit: string = '100000',
	gasPrice: string = '1000000000000',
): StakeCreateAction {
	return {
		version: 1,
		nonce,
		gasLimit,
		gasPrice,
		stakeCreate: {
			candidateName,
			stakedAmount: iotxToRau(stakedAmount),
			stakedDuration,
			autoStake,
			payload: '',
		},
	};
}

/**
 * Encode function call data
 */
export function encodeFunctionCall(
	abi: string[],
	functionName: string,
	args: unknown[],
): string {
	const iface = new ethers.Interface(abi);
	return iface.encodeFunctionData(functionName, args);
}

/**
 * Decode function result
 */
export function decodeFunctionResult(
	abi: string[],
	functionName: string,
	data: string,
): unknown {
	const iface = new ethers.Interface(abi);
	return iface.decodeFunctionResult(functionName, data);
}

/**
 * Decode event log
 */
export function decodeEventLog(
	abi: string[],
	eventName: string,
	data: string,
	topics: string[],
): unknown {
	const iface = new ethers.Interface(abi);
	return iface.decodeEventLog(eventName, data, topics);
}

/**
 * Create a signed transaction
 */
export async function signTransaction(
	provider: ethers.Provider,
	privateKey: string,
	to: string,
	value: string,
	data: string = '0x',
	gasLimit?: bigint,
): Promise<string> {
	const wallet = new ethers.Wallet(privateKey, provider);
	
	const tx: ethers.TransactionRequest = {
		to: toHexAddress(to),
		value: ethers.parseEther(value),
		data,
	};
	
	if (gasLimit) {
		tx.gasLimit = gasLimit;
	}
	
	const signedTx = await wallet.signTransaction(tx);
	return signedTx;
}

/**
 * Send a signed transaction
 */
export async function sendSignedTransaction(
	provider: ethers.Provider,
	signedTx: string,
): Promise<ethers.TransactionResponse> {
	return provider.broadcastTransaction(signedTx);
}

/**
 * Estimate gas for a transaction
 */
export async function estimateGas(
	provider: ethers.Provider,
	from: string,
	to: string,
	value: string = '0',
	data: string = '0x',
): Promise<bigint> {
	return provider.estimateGas({
		from: toHexAddress(from),
		to: toHexAddress(to),
		value: ethers.parseEther(value),
		data,
	});
}

/**
 * Get current gas price
 */
export async function getGasPrice(provider: ethers.Provider): Promise<bigint> {
	const feeData = await provider.getFeeData();
	return feeData.gasPrice || BigInt(1000000000000); // Default 1 Qev
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
	provider: ethers.Provider,
	txHash: string,
	confirmations: number = 1,
): Promise<ethers.TransactionReceipt | null> {
	return provider.waitForTransaction(txHash, confirmations);
}
