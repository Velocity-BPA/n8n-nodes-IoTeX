/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-iotex/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class IoTeX implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'IoTeX',
    name: 'iotex',
    icon: 'file:iotex.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the IoTeX API',
    defaults: {
      name: 'IoTeX',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'iotexApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Action',
            value: 'action',
          },
          {
            name: 'Contract',
            value: 'contract',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          },
          {
            name: 'Delegate',
            value: 'delegate',
          },
          {
            name: 'BlockchainData',
            value: 'blockchainData',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'XrcTokens',
            value: 'xrcTokens',
          },
          {
            name: 'DeviceRegistry',
            value: 'deviceRegistry',
          },
          {
            name: 'PebbleTrackers',
            value: 'pebbleTrackers',
          },
          {
            name: 'W3bstreamProjects',
            value: 'w3bstreamProjects',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Account', value: 'getAccount', description: 'Get account information including balance and nonce', action: 'Get account information' },
    { name: 'Send Raw Action', value: 'sendRawAction', description: 'Send signed action to blockchain', action: 'Send signed action' },
    { name: 'Get Account Meta', value: 'getAccountMeta', description: 'Get account metadata', action: 'Get account metadata' }
  ],
  default: 'getAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['block'],
    },
  },
  options: [
    {
      name: 'Get Block Metas',
      value: 'getBlockMetas',
      description: 'Get block metadata by height range',
      action: 'Get block metas',
    },
    {
      name: 'Get Chain Meta',
      value: 'getChainMeta',
      description: 'Get blockchain metadata and latest block info',
      action: 'Get chain meta',
    },
    {
      name: 'Get Block By Height',
      value: 'getBlockByHeight',
      description: 'Get block details by height',
      action: 'Get block by height',
    },
    {
      name: 'Get Block By Hash',
      value: 'getBlockByHash',
      description: 'Get block details by hash',
      action: 'Get block by hash',
    },
  ],
  default: 'getBlockMetas',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['action'],
		},
	},
	options: [
		{
			name: 'Get Actions',
			value: 'getActions',
			description: 'Get actions by block height or address',
			action: 'Get actions',
		},
		{
			name: 'Get Action by Hash',
			value: 'getActionByHash',
			description: 'Get specific action by hash',
			action: 'Get action by hash',
		},
		{
			name: 'Estimate Gas',
			value: 'estimateGas',
			description: 'Estimate gas for action execution',
			action: 'Estimate gas consumption',
		},
		{
			name: 'Suggest Gas Price',
			value: 'suggestGasPrice',
			description: 'Get suggested gas price',
			action: 'Suggest gas price',
		},
	],
	default: 'getActions',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['contract'] } },
  options: [
    { name: 'Read Contract Storage', value: 'readContractStorage', description: 'Read contract storage data', action: 'Read contract storage' },
    { name: 'Read State', value: 'readState', description: 'Execute read-only contract call', action: 'Read state' },
    { name: 'Get Receipt By Action', value: 'getReceiptByAction', description: 'Get transaction receipt', action: 'Get receipt by action' },
    { name: 'Get Contract Meta', value: 'getContractMeta', description: 'Get contract metadata', action: 'Get contract meta' }
  ],
  default: 'readContractStorage',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['analytics'] } },
  options: [
    { name: 'Get Buckets', value: 'getBuckets', description: 'Get staking bucket analytics', action: 'Get staking bucket analytics' },
    { name: 'Get Rewards', value: 'getRewards', description: 'Get reward distribution data', action: 'Get reward distribution data' },
    { name: 'Get Action Analytics', value: 'getActionAnalytics', description: 'Get action statistics', action: 'Get action statistics' },
    { name: 'Get Chain Stats', value: 'getChainStats', description: 'Get overall blockchain statistics', action: 'Get blockchain statistics' }
  ],
  default: 'getBuckets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['delegate'] } },
  options: [
    { name: 'Get Candidates', value: 'getCandidates', description: 'Get all delegate candidates', action: 'Get delegate candidates' },
    { name: 'Get Buckets by Candidate', value: 'getBucketsByCandidate', description: 'Get staking buckets for delegate', action: 'Get staking buckets for delegate' },
    { name: 'Get Buckets by Voter', value: 'getBucketsByVoter', description: 'Get voter\'s staking buckets', action: 'Get voter staking buckets' },
    { name: 'Get Delegate Buckets', value: 'getDelegateBuckets', description: 'Get delegate bucket analytics', action: 'Get delegate bucket analytics' }
  ],
  default: 'getCandidates',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blockchainData'],
    },
  },
  options: [
    {
      name: 'Get Chain Meta',
      value: 'getChainMeta',
      description: 'Get blockchain metadata and statistics',
      action: 'Get chain meta',
    },
    {
      name: 'Get Block Metas',
      value: 'getBlockMetas',
      description: 'Get block metadata by height or hash',
      action: 'Get block metas',
    },
    {
      name: 'Get Actions',
      value: 'getActions',
      description: 'Get transaction/action data',
      action: 'Get actions',
    },
    {
      name: 'Get Receipt By Action',
      value: 'getReceiptByAction',
      description: 'Get transaction receipt',
      action: 'Get receipt by action',
    },
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account information',
      action: 'Get account',
    },
    {
      name: 'Get Actions From Address',
      value: 'getActionsFromAddress',
      description: 'Get actions from specific address',
      action: 'Get actions from address',
    },
    {
      name: 'Get Actions To Address',
      value: 'getActionsToAddress',
      description: 'Get actions to specific address',
      action: 'Get actions to address',
    },
  ],
  default: 'getChainMeta',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
    },
  },
  options: [
    {
      name: 'Send Action',
      value: 'sendAction',
      description: 'Submit signed transaction/action to blockchain',
      action: 'Send action to blockchain',
    },
    {
      name: 'Estimate Gas For Action',
      value: 'estimateGasForAction',
      description: 'Estimate gas cost for action',
      action: 'Estimate gas for action',
    },
    {
      name: 'Read Contract',
      value: 'readContract',
      description: 'Read smart contract state',
      action: 'Read smart contract state',
    },
    {
      name: 'Suggest Gas Price',
      value: 'suggestGasPrice',
      description: 'Get suggested gas price',
      action: 'Get suggested gas price',
    },
    {
      name: 'Get Server Meta',
      value: 'getServerMeta',
      description: 'Get server and network information',
      action: 'Get server and network information',
    },
  ],
  default: 'sendAction',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
    },
  },
  options: [
    {
      name: 'Get Token Balance',
      value: 'getTokenBalance',
      description: 'Get XRC token balance for address',
      action: 'Get token balance',
    },
    {
      name: 'Read Token Contract',
      value: 'readTokenContract',
      description: 'Read XRC token contract data',
      action: 'Read token contract',
    },
    {
      name: 'Transfer Tokens',
      value: 'transferTokens',
      description: 'Send XRC tokens between addresses',
      action: 'Transfer tokens',
    },
    {
      name: 'Get Token Metadata',
      value: 'getTokenMetadata',
      description: 'Get token name, symbol, decimals',
      action: 'Get token metadata',
    },
    {
      name: 'Get Token Supply',
      value: 'getTokenSupply',
      description: 'Get total token supply',
      action: 'Get token supply',
    },
  ],
  default: 'getTokenBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
    },
  },
  options: [
    {
      name: 'Register Device',
      value: 'registerDevice',
      description: 'Register new IoT device on blockchain',
      action: 'Register device',
    },
    {
      name: 'Get Device Info',
      value: 'getDeviceInfo',
      description: 'Get device information and status',
      action: 'Get device info',
    },
    {
      name: 'List Devices',
      value: 'listDevices',
      description: 'List registered devices',
      action: 'List devices',
    },
    {
      name: 'Update Device Status',
      value: 'updateDeviceStatus',
      description: 'Update device status or metadata',
      action: 'Update device status',
    },
    {
      name: 'Get Device Metrics',
      value: 'getDeviceMetrics',
      description: 'Get device performance metrics',
      action: 'Get device metrics',
    },
  ],
  default: 'registerDevice',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
    },
  },
  options: [
    {
      name: 'Get Pebble Data',
      value: 'getPebbleData',
      description: 'Get Pebble tracker sensor data',
      action: 'Get Pebble tracker sensor data',
    },
    {
      name: 'Submit Pebble Data',
      value: 'submitPebbleData',
      description: 'Submit verified Pebble data to blockchain',
      action: 'Submit verified Pebble data to blockchain',
    },
    {
      name: 'Get Pebble Location',
      value: 'getPebbleLocation',
      description: 'Get Pebble device location data',
      action: 'Get Pebble device location data',
    },
    {
      name: 'Get Pebble Rewards',
      value: 'getPebbleRewards',
      description: 'Get rewards earned by Pebble device',
      action: 'Get rewards earned by Pebble device',
    },
    {
      name: 'Validate Pebble Proof',
      value: 'validatePebbleProof',
      description: 'Validate Pebble proof-of-presence',
      action: 'Validate Pebble proof-of-presence',
    },
  ],
  default: 'getPebbleData',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
    },
  },
  options: [
    {
      name: 'Create Project',
      value: 'createProject',
      description: 'Create new W3bstream project',
      action: 'Create project',
    },
    {
      name: 'Get Project Info',
      value: 'getProjectInfo',
      description: 'Get W3bstream project details',
      action: 'Get project info',
    },
    {
      name: 'List Projects',
      value: 'listProjects',
      description: 'List W3bstream projects',
      action: 'List projects',
    },
    {
      name: 'Update Project',
      value: 'updateProject',
      description: 'Update W3bstream project configuration',
      action: 'Update project',
    },
    {
      name: 'Get Project Metrics',
      value: 'getProjectMetrics',
      description: 'Get project processing metrics',
      action: 'Get project metrics',
    },
    {
      name: 'Process Real World Data',
      value: 'processRealWorldData',
      description: 'Submit real-world data for processing',
      action: 'Process real world data',
    },
  ],
  default: 'createProject',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccount'] } },
  default: '',
  description: 'The IoTeX account address to get information for',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['sendRawAction'] } },
  default: '',
  description: 'Hex-encoded signed action data to send to the blockchain',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['account'], operation: ['getAccountMeta'] } },
  default: '',
  description: 'The IoTeX account address to get metadata for',
},
{
  displayName: 'Start Height',
  name: 'start',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockMetas'],
    },
  },
  default: 1,
  description: 'Starting block height',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockMetas'],
    },
  },
  default: 10,
  description: 'Number of blocks to retrieve',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockByHeight'],
    },
  },
  default: 1,
  description: 'Block height to retrieve',
},
{
  displayName: 'Block Hash',
  name: 'blkHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['block'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'Block hash to retrieve (hex encoded)',
},
{
	displayName: 'Address',
	name: 'byAddr',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['action'],
			operation: ['getActions'],
		},
	},
	default: '',
	description: 'Address to get actions for',
},
{
	displayName: 'Start',
	name: 'start',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['action'],
			operation: ['getActions'],
		},
	},
	default: 0,
	description: 'Start index for pagination',
},
{
	displayName: 'Count',
	name: 'count',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['action'],
			operation: ['getActions'],
		},
	},
	default: 10,
	description: 'Number of actions to retrieve',
},
{
	displayName: 'Action Hash',
	name: 'actionHash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['action'],
			operation: ['getActionByHash'],
		},
	},
	default: '',
	description: 'Hash of the action to retrieve',
},
{
	displayName: 'Action Data',
	name: 'action',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['action'],
			operation: ['estimateGas'],
		},
	},
	default: '{}',
	description: 'Action object to estimate gas for',
},
{
  displayName: 'Contract Address',
  name: 'contract',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['readContractStorage', 'getContractMeta'] } },
  default: '',
  description: 'The smart contract address',
},
{
  displayName: 'Storage Key',
  name: 'key',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['readContractStorage'] } },
  default: '',
  description: 'The storage key to read (hex encoded)',
},
{
  displayName: 'Action',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['readState'] } },
  default: '{}',
  description: 'The action object for the read-only contract call',
},
{
  displayName: 'Action Hash',
  name: 'actionHash',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['contract'], operation: ['getReceiptByAction'] } },
  default: '',
  description: 'The transaction action hash',
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getBuckets'] } },
  default: 0,
  description: 'The epoch number for staking bucket analytics',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['analytics'], operation: ['getBuckets'] } },
  default: 100,
  description: 'Number of buckets to retrieve',
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getRewards'] } },
  default: 0,
  description: 'The epoch number for reward distribution data',
},
{
  displayName: 'Delegate Name',
  name: 'delegateName',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['analytics'], operation: ['getRewards'] } },
  default: '',
  description: 'Name of the delegate to get reward data for',
},
{
  displayName: 'Start Epoch',
  name: 'startEpoch',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['analytics'], operation: ['getActionAnalytics'] } },
  default: 0,
  description: 'Starting epoch number for action statistics',
},
{
  displayName: 'Epoch Count',
  name: 'epochCount',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['analytics'], operation: ['getActionAnalytics'] } },
  default: 1,
  description: 'Number of epochs to analyze',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  default: 'candidates',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegate'],
      operation: ['getCandidates']
    }
  },
  description: 'The method parameter for getting candidates'
},
{
  displayName: 'Candidate Name',
  name: 'candidateName',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegate'],
      operation: ['getBucketsByCandidate']
    }
  },
  description: 'Name of the delegate candidate'
},
{
  displayName: 'Voter Address',
  name: 'voterAddress',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegate'],
      operation: ['getBucketsByVoter']
    }
  },
  description: 'Address of the voter'
},
{
  displayName: 'Delegate Name',
  name: 'delegateName',
  type: 'string',
  default: '',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegate'],
      operation: ['getDelegateBuckets']
    }
  },
  description: 'Name of the delegate'
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  default: 0,
  required: false,
  displayOptions: {
    show: {
      resource: ['delegate'],
      operation: ['getDelegateBuckets']
    }
  },
  description: 'Epoch number for analytics'
},
{
  displayName: 'By Index',
  name: 'byIndex',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getBlockMetas'],
    },
  },
  default: {},
  placeholder: 'Add by index parameters',
  options: [
    {
      displayName: 'Start',
      name: 'start',
      type: 'number',
      default: 1,
      description: 'Starting block height',
    },
    {
      displayName: 'Count',
      name: 'count',
      type: 'number',
      default: 1,
      description: 'Number of blocks to retrieve',
    },
  ],
},
{
  displayName: 'By Hash',
  name: 'byHash',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getBlockMetas'],
    },
  },
  default: '',
  description: 'Block hash to retrieve',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getBlockMetas'],
    },
  },
  default: 1,
  description: 'Number of blocks to retrieve',
},
{
  displayName: 'By Index',
  name: 'byIndex',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActions'],
    },
  },
  default: {},
  placeholder: 'Add by index parameters',
  options: [
    {
      displayName: 'Start',
      name: 'start',
      type: 'number',
      default: 1,
      description: 'Starting action index',
    },
    {
      displayName: 'Count',
      name: 'count',
      type: 'number',
      default: 1,
      description: 'Number of actions to retrieve',
    },
  ],
},
{
  displayName: 'By Hash',
  name: 'byHash',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActions'],
    },
  },
  default: '',
  description: 'Action hash to retrieve',
},
{
  displayName: 'By Address',
  name: 'byAddr',
  type: 'collection',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActions'],
    },
  },
  default: {},
  placeholder: 'Add by address parameters',
  options: [
    {
      displayName: 'Address',
      name: 'address',
      type: 'string',
      default: '',
      description: 'Address to query',
    },
    {
      displayName: 'Start',
      name: 'start',
      type: 'number',
      default: 1,
      description: 'Starting index',
    },
    {
      displayName: 'Count',
      name: 'count',
      type: 'number',
      default: 1,
      description: 'Number of actions to retrieve',
    },
  ],
},
{
  displayName: 'Action Hash',
  name: 'actionHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getReceiptByAction'],
    },
  },
  default: '',
  description: 'The hash of the action to get receipt for',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getAccount'],
    },
  },
  default: '',
  description: 'The account address',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsFromAddress'],
    },
  },
  default: '',
  description: 'The address to get actions from',
},
{
  displayName: 'Start',
  name: 'start',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsFromAddress'],
    },
  },
  default: 1,
  description: 'Starting index',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsFromAddress'],
    },
  },
  default: 10,
  description: 'Number of actions to retrieve',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsToAddress'],
    },
  },
  default: '',
  description: 'The address to get actions to',
},
{
  displayName: 'Start',
  name: 'start',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsToAddress'],
    },
  },
  default: 1,
  description: 'Starting index',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blockchainData'],
      operation: ['getActionsToAddress'],
    },
  },
  default: 10,
  description: 'Number of actions to retrieve',
},
{
  displayName: 'Action',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['sendAction'],
    },
  },
  default: '{}',
  description: 'The signed action/transaction to submit to the blockchain',
},
{
  displayName: 'Action',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['estimateGasForAction'],
    },
  },
  default: '{}',
  description: 'The action to estimate gas cost for',
},
{
  displayName: 'Action',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['readContract'],
    },
  },
  default: '{}',
  description: 'The contract read action parameters',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
      operation: ['getTokenBalance'],
    },
  },
  default: '',
  description: 'The wallet address to check token balance',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
      operation: ['readTokenContract', 'getTokenMetadata', 'getTokenSupply'],
    },
  },
  default: '',
  description: 'The XRC token contract address',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
      operation: ['readTokenContract'],
    },
  },
  default: '',
  description: 'The contract method to call',
},
{
  displayName: 'Parameters',
  name: 'params',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
      operation: ['readTokenContract'],
    },
  },
  default: '[]',
  description: 'Parameters for the contract method as JSON array',
},
{
  displayName: 'Signed Action',
  name: 'signedAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['xrcTokens'],
      operation: ['transferTokens'],
    },
  },
  default: '{}',
  description: 'The signed transaction action for token transfer',
},
{
  displayName: 'Device Action',
  name: 'deviceAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['registerDevice'],
    },
  },
  default: '{}',
  description: 'Device registration action parameters including device ID, owner, metadata, and transaction details',
  placeholder: '{"deviceId": "device123", "owner": "0x...", "metadata": {...}, "gasLimit": "100000"}',
},
{
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['getDeviceInfo', 'getDeviceMetrics'],
    },
  },
  default: '',
  description: 'The unique identifier of the device',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['getDeviceInfo', 'listDevices', 'getDeviceMetrics'],
    },
  },
  default: '',
  description: 'The smart contract address for device registry',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['listDevices'],
    },
  },
  default: '',
  description: 'The wallet address of the device owner',
},
{
  displayName: 'Device Action',
  name: 'deviceAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['updateDeviceStatus'],
    },
  },
  default: '{}',
  description: 'Device update action parameters including device ID, new status, metadata, and transaction details',
  placeholder: '{"deviceId": "device123", "status": "active", "metadata": {...}, "gasLimit": "50000"}',
},
{
  displayName: 'Time Range',
  name: 'timeRange',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['getDeviceMetrics'],
    },
  },
  default: '{}',
  description: 'Time range for metrics query (start, end timestamps)',
  placeholder: '{"start": 1640995200, "end": 1641081600}',
},
{
  displayName: 'Method Name',
  name: 'methodName',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['getDeviceInfo', 'listDevices', 'getDeviceMetrics'],
    },
  },
  default: '',
  description: 'The contract method to call for reading data',
},
{
  displayName: 'Method Parameters',
  name: 'methodParams',
  type: 'json',
  required: false,
  displayOptions: {
    show: {
      resource: ['deviceRegistry'],
      operation: ['getDeviceInfo', 'listDevices', 'getDeviceMetrics'],
    },
  },
  default: '[]',
  description: 'Parameters for the contract method',
},
{
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleData'],
    },
  },
  default: '',
  description: 'The Pebble device identifier',
},
{
  displayName: 'Data Type',
  name: 'dataType',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleData'],
    },
  },
  options: [
    {
      name: 'Temperature',
      value: 'temperature',
    },
    {
      name: 'Humidity',
      value: 'humidity',
    },
    {
      name: 'Light',
      value: 'light',
    },
    {
      name: 'Motion',
      value: 'motion',
    },
  ],
  default: 'temperature',
  description: 'Type of sensor data to retrieve',
},
{
  displayName: 'Time Range',
  name: 'timeRange',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleData'],
    },
  },
  default: '24h',
  description: 'Time range for data retrieval (e.g., 24h, 7d, 30d)',
},
{
  displayName: 'Data Action',
  name: 'dataAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['submitPebbleData'],
    },
  },
  default: '',
  description: 'JSON object containing the data action to submit',
},
{
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleLocation'],
    },
  },
  default: '',
  description: 'The Pebble device identifier',
},
{
  displayName: 'Timestamp',
  name: 'timestamp',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleLocation'],
    },
  },
  default: 0,
  description: 'Unix timestamp for location data',
},
{
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['getPebbleRewards'],
    },
  },
  default: '',
  description: 'The Pebble device identifier',
},
{
  displayName: 'Device ID',
  name: 'deviceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['validatePebbleProof'],
    },
  },
  default: '',
  description: 'The Pebble device identifier',
},
{
  displayName: 'Proof Data',
  name: 'proofData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['pebbleTrackers'],
      operation: ['validatePebbleProof'],
    },
  },
  default: '',
  description: 'JSON object containing the proof-of-presence data',
},
{
  displayName: 'Project Action',
  name: 'projectAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['createProject'],
    },
  },
  default: '{}',
  description: 'The project creation action payload',
},
{
  displayName: 'Project ID',
  name: 'projectId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['getProjectInfo', 'getProjectMetrics'],
    },
  },
  default: '',
  description: 'The ID of the W3bstream project',
},
{
  displayName: 'Owner Address',
  name: 'ownerAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['listProjects'],
    },
  },
  default: '',
  description: 'The address of the project owner',
},
{
  displayName: 'Project Action',
  name: 'projectAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['updateProject'],
    },
  },
  default: '{}',
  description: 'The project update action payload',
},
{
  displayName: 'Time Range',
  name: 'timeRange',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['getProjectMetrics'],
    },
  },
  default: '{}',
  description: 'The time range for metrics query',
},
{
  displayName: 'Data Action',
  name: 'dataAction',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['w3bstreamProjects'],
      operation: ['processRealWorldData'],
    },
  },
  default: '{}',
  description: 'The real-world data processing action payload',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'action':
        return [await executeActionOperations.call(this, items)];
      case 'contract':
        return [await executeContractOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      case 'delegate':
        return [await executeDelegateOperations.call(this, items)];
      case 'blockchainData':
        return [await executeBlockchainDataOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'xrcTokens':
        return [await executeXrcTokensOperations.call(this, items)];
      case 'deviceRegistry':
        return [await executeDeviceRegistryOperations.call(this, items)];
      case 'pebbleTrackers':
        return [await executePebbleTrackersOperations.call(this, items)];
      case 'w3bstreamProjects':
        return [await executeW3bstreamProjectsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAccount': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getAccount?address=${encodeURIComponent(address)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'sendRawAction': {
          const data = this.getNodeParameter('data', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/sendAction`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              data: data,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getAccountMeta': {
          const address = this.getNodeParameter('address', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getAccountMeta?address=${encodeURIComponent(address)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBlockMetas': {
          const start = this.getNodeParameter('start', i) as number;
          const count = this.getNodeParameter('count', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getBlockMetas`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              start,
              count,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChainMeta': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getChainMeta`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getBlockByHeight`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              height,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHash': {
          const blkHash = this.getNodeParameter('blkHash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getBlockByHash`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              blkHash,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeActionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('iotexApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getActions': {
					const byAddr = this.getNodeParameter('byAddr', i) as string;
					const start = this.getNodeParameter('start', i) as number;
					const count = this.getNodeParameter('count', i) as number;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/getActions`,
						headers: {
							'X-API-Key': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						qs: {
							byAddr,
							start,
							count,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getActionByHash': {
					const actionHash = this.getNodeParameter('actionHash', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/getActionByHash`,
						headers: {
							'X-API-Key': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						qs: {
							actionHash,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'estimateGas': {
					const action = this.getNodeParameter('action', i) as object;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/estimateActionGasConsumption`,
						headers: {
							'X-API-Key': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body: {
							action,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'suggestGasPrice': {
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/suggestGasPrice`,
						headers: {
							'X-API-Key': credentials.apiKey,
							'Content-Type': 'application/json',
						},
						body: {},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: {
					item: i,
				},
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: {
						item: i,
					},
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeContractOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'readContractStorage': {
          const contract = this.getNodeParameter('contract', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/readContractStorage`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              contract,
              key,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'readState': {
          const action = this.getNodeParameter('action', i) as object;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/readState`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              action,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getReceiptByAction': {
          const actionHash = this.getNodeParameter('actionHash', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/getReceiptByAction`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              actionHash,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractMeta': {
          const contract = this.getNodeParameter('contract', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getContractMeta`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            qs: {
              contract,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeAnalyticsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBuckets': {
          const epochNum = this.getNodeParameter('epochNum', i) as number;
          const count = this.getNodeParameter('count', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getAnalyticsBuckets`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              epochNum,
              count,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getRewards': {
          const epochNum = this.getNodeParameter('epochNum', i) as number;
          const delegateName = this.getNodeParameter('delegateName', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getAnalyticsRewards`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              epochNum,
              ...(delegateName && { delegateName }),
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActionAnalytics': {
          const startEpoch = this.getNodeParameter('startEpoch', i) as number;
          const epochCount = this.getNodeParameter('epochCount', i) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getAnalyticsActions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              startEpoch,
              epochCount,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChainStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/getChainStats`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }