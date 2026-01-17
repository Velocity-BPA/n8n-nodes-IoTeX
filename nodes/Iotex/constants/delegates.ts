/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * IoTeX Delegate (Validator) Constants
 * 
 * IoTeX uses Roll-DPoS (Delegated Proof of Stake) consensus:
 * - 36 consensus delegates produce blocks
 * - Delegates are elected based on staked votes
 * - Each epoch is 8640 blocks (~1 day)
 * - Rewards are distributed per epoch
 */

export interface DelegateInfo {
	name: string;
	operatorAddress: string;
	rewardAddress: string;
	website?: string;
	logo?: string;
}

/**
 * Well-known delegates on mainnet
 * Note: This list is not exhaustive and delegates can change
 */
export const MAINNET_DELEGATES: Record<string, DelegateInfo> = {
	iotexlab: {
		name: 'IoTeX Lab',
		operatorAddress: 'io1...',
		rewardAddress: 'io1...',
		website: 'https://iotex.io',
	},
	hashquark: {
		name: 'HashQuark',
		operatorAddress: 'io1...',
		rewardAddress: 'io1...',
		website: 'https://hashquark.io',
	},
	iosg: {
		name: 'IOSG Ventures',
		operatorAddress: 'io1...',
		rewardAddress: 'io1...',
		website: 'https://iosg.vc',
	},
};

/**
 * Staking bucket durations
 * IoTeX uses flexible staking with lock periods for bonus rewards
 */
export const STAKING_DURATIONS = {
	DAYS_0: { days: 0, bonus: 0 },
	DAYS_7: { days: 7, bonus: 0.015 },
	DAYS_14: { days: 14, bonus: 0.03 },
	DAYS_30: { days: 30, bonus: 0.06 },
	DAYS_60: { days: 60, bonus: 0.08 },
	DAYS_90: { days: 90, bonus: 0.10 },
	DAYS_180: { days: 180, bonus: 0.15 },
	DAYS_350: { days: 350, bonus: 0.20 },
};

/**
 * Epoch configuration
 */
export const EPOCH_CONFIG = {
	blocksPerEpoch: 8640,
	secondsPerBlock: 10,
	consensusDelegates: 36,
	minimumStake: '100000000000000000000', // 100 IOTX in Rau
};

/**
 * Staking constants
 */
export const STAKING_CONSTANTS = {
	// Minimum stake amount in IOTX
	MIN_STAKE_AMOUNT: 100,
	// Maximum stake duration in days
	MAX_STAKE_DURATION: 1050,
	// Auto-stake bonus
	AUTO_STAKE_BONUS: 0.05,
	// Self-stake requirement for delegates (in IOTX)
	DELEGATE_SELF_STAKE: 1200000,
};

/**
 * Calculate stake lock duration bonus
 */
export function getStakeDurationBonus(days: number): number {
	for (const [, config] of Object.entries(STAKING_DURATIONS).reverse()) {
		if (days >= config.days) {
			return config.bonus;
		}
	}
	return 0;
}

/**
 * Calculate total staking APY
 * Base APY + Duration Bonus + Auto-stake Bonus
 */
export function calculateStakingAPY(
	baseAPY: number,
	durationDays: number,
	autoStake: boolean,
): number {
	const durationBonus = getStakeDurationBonus(durationDays);
	const autoStakeBonus = autoStake ? STAKING_CONSTANTS.AUTO_STAKE_BONUS : 0;
	return baseAPY + durationBonus + autoStakeBonus;
}
