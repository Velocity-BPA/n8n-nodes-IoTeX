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
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Accounts',
            value: 'accounts',
          },
          {
            name: 'Actions',
            value: 'actions',
          },
          {
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'Rewards',
            value: 'rewards',
          },
          {
            name: 'Analytics',
            value: 'analytics',
          }
        ],
        default: 'accounts',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
    },
  },
  options: [
    {
      name: 'Get Account',
      value: 'getAccount',
      description: 'Get account details and balance',
      action: 'Get account details',
    },
    {
      name: 'Get Account Actions',
      value: 'getAccountActions',
      description: 'Get account transaction history',
      action: 'Get account transaction history',
    },
    {
      name: 'Get Account Balance',
      value: 'getAccountBalance',
      description: 'Get account IOTX balance',
      action: 'Get account balance',
    },
    {
      name: 'Get Account Meta',
      value: 'getAccountMeta',
      description: 'Get account metadata from blockchain',
      action: 'Get account metadata',
    },
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
      resource: ['actions'],
    },
  },
  options: [
    {
      name: 'Get Action By Hash',
      value: 'getActionByHash',
      description: 'Get action details by hash',
      action: 'Get action by hash',
    },
    {
      name: 'Get Actions',
      value: 'getActions',
      description: 'Get list of actions with filters',
      action: 'Get actions list',
    },
    {
      name: 'Send Action',
      value: 'sendAction',
      description: 'Broadcast signed action to blockchain',
      action: 'Send action to blockchain',
    },
    {
      name: 'Get Receipt By Action',
      value: 'getReceiptByAction',
      description: 'Get action execution receipt',
      action: 'Get action receipt',
    },
    {
      name: 'Estimate Gas Consumption',
      value: 'estimateActionGasConsumption',
      description: 'Estimate gas for action',
      action: 'Estimate action gas',
    },
  ],
  default: 'getActionByHash',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Block By Height',
      value: 'getBlockByHeight',
      description: 'Get block information by block height',
      action: 'Get block by height',
    },
    {
      name: 'Get Block By Hash',
      value: 'getBlockByHash',
      description: 'Get block information by block hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get Blocks',
      value: 'getBlocks',
      description: 'Get list of blocks with pagination',
      action: 'Get blocks',
    },
    {
      name: 'Get Chain Meta',
      value: 'getChainMeta',
      description: 'Get blockchain metadata and latest block info',
      action: 'Get chain metadata',
    },
    {
      name: 'Get Block Producers',
      value: 'getBlockProducers',
      description: 'Get current block producers',
      action: 'Get block producers',
    },
  ],
  default: 'getBlockByHeight',
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
      name: 'Read Contract Storage',
      value: 'readContractStorage',
      description: 'Read contract storage data',
      action: 'Read contract storage',
    },
    {
      name: 'Read State',
      value: 'readState',
      description: 'Execute read-only contract call',
      action: 'Execute read-only contract call',
    },
    {
      name: 'Get Contract',
      value: 'getContract',
      description: 'Get contract information',
      action: 'Get contract information',
    },
    {
      name: 'Estimate Gas',
      value: 'estimateGas',
      description: 'Estimate gas for contract call',
      action: 'Estimate gas for contract call',
    },
    {
      name: 'Get Actions',
      value: 'getActions',
      description: 'Get contract actions',
      action: 'Get contract actions',
    },
  ],
  default: 'readContractStorage',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
    },
  },
  options: [
    {
      name: 'Get Epoch Rewards',
      value: 'getEpochRewards',
      description: 'Get epoch rewards for a specific address',
      action: 'Get epoch rewards',
    },
    {
      name: 'Get Unclaimed Balance',
      value: 'getUnclaimedBalance',
      description: 'Get unclaimed reward balance for an address',
      action: 'Get unclaimed balance',
    },
    {
      name: 'Get Buckets By Voter',
      value: 'getBucketsByVoter',
      description: 'Get staking buckets by voter address',
      action: 'Get buckets by voter',
    },
    {
      name: 'Get Candidates',
      value: 'getCandidates',
      description: 'Get delegate candidates and voting information',
      action: 'Get candidates',
    },
  ],
  default: 'getEpochRewards',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
    },
  },
  options: [
    {
      name: 'Get Chain Stats',
      value: 'getChainStats',
      description: 'Get chain statistics',
      action: 'Get chain stats',
    },
    {
      name: 'Get Consensus Metrics',
      value: 'getConsensusMetrics',
      description: 'Get consensus and delegate metrics',
      action: 'Get consensus metrics',
    },
    {
      name: 'Get Action Stats',
      value: 'getActionStats',
      description: 'Get action statistics by type',
      action: 'Get action stats',
    },
    {
      name: 'Get Active Accounts',
      value: 'getActiveAccounts',
      description: 'Get active account metrics',
      action: 'Get active accounts',
    },
  ],
  default: 'getChainStats',
},
      // Parameter definitions
{
  displayName: 'Account Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'getAccountActions', 'getAccountBalance'],
    },
  },
  default: '',
  description: 'The IoTeX account address to query',
  placeholder: 'io1abc123...',
},
{
  displayName: 'Account Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountMeta'],
    },
  },
  default: '',
  description: 'The IoTeX account address for metadata query',
  placeholder: 'io1abc123...',
},
{
  displayName: 'Start Index',
  name: 'start',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountActions'],
    },
  },
  default: 0,
  description: 'Starting index for action history pagination',
  typeOptions: {
    minValue: 0,
  },
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountActions'],
    },
  },
  default: 10,
  description: 'Number of actions to retrieve (max 100)',
  typeOptions: {
    minValue: 1,
    maxValue: 100,
  },
},
{
  displayName: 'Action Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActionByHash'],
    },
  },
  default: '',
  description: 'The hash of the action to retrieve',
},
{
  displayName: 'Start Index',
  name: 'start',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: 0,
  description: 'Starting index for pagination',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: 10,
  description: 'Number of actions to return',
},
{
  displayName: 'By Address',
  name: 'byAddr',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: '',
  description: 'Filter actions by address',
},
{
  displayName: 'By Block',
  name: 'byBlk',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: '',
  description: 'Filter actions by block hash or height',
},
{
  displayName: 'Serialized Action',
  name: 'serializedAction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['sendAction'],
    },
  },
  default: '',
  description: 'The serialized signed action to broadcast',
},
{
  displayName: 'Action Hash',
  name: 'actionHash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getReceiptByAction'],
    },
  },
  default: '',
  description: 'The hash of the action to get receipt for',
},
{
  displayName: 'Action Data',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['estimateActionGasConsumption'],
    },
  },
  default: '{}',
  description: 'The action object to estimate gas for',
},
{
  displayName: 'Block Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHeight'],
    },
  },
  default: 1,
  description: 'The block height to retrieve',
},
{
  displayName: 'Block Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockByHash'],
    },
  },
  default: '',
  description: 'The block hash to retrieve',
},
{
  displayName: 'Start',
  name: 'start',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: 1,
  description: 'Starting block number for pagination',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: 10,
  description: 'Number of blocks to retrieve (max 100)',
},
{
  displayName: 'Contract Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['readContractStorage', 'getContract', 'getActions'],
    },
  },
  default: '',
  description: 'The smart contract address',
},
{
  displayName: 'Storage Key',
  name: 'key',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['readContractStorage'],
    },
  },
  default: '',
  description: 'The storage key to read',
},
{
  displayName: 'Action',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['readState', 'estimateGas'],
    },
  },
  default: '{}',
  description: 'The action object for contract call or gas estimation',
},
{
  displayName: 'Start Index',
  name: 'start',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
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
  required: false,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getActions'],
    },
  },
  default: 50,
  description: 'Number of actions to retrieve',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getEpochRewards'],
    },
  },
  default: '',
  description: 'The address to get epoch rewards for',
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getEpochRewards'],
    },
  },
  default: 0,
  description: 'The epoch number to query (0 for current epoch)',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getUnclaimedBalance'],
    },
  },
  default: '',
  description: 'The address to get unclaimed balance for',
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getUnclaimedBalance'],
    },
  },
  default: 0,
  description: 'The epoch number to query (0 for current epoch)',
},
{
  displayName: 'Voter Address',
  name: 'voterAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getBucketsByVoter'],
    },
  },
  default: '',
  description: 'The voter address to get staking buckets for',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getBucketsByVoter'],
    },
  },
  default: 0,
  description: 'Pagination offset',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getBucketsByVoter'],
    },
  },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getCandidates'],
    },
  },
  default: 0,
  description: 'Block height to query (0 for latest)',
},
{
  displayName: 'Start Index',
  name: 'startIndex',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getCandidates'],
    },
  },
  default: 0,
  description: 'Start index for pagination',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['rewards'],
      operation: ['getCandidates'],
    },
  },
  default: 100,
  description: 'Maximum number of candidates to return',
},
{
  displayName: 'Epoch Number',
  name: 'epochNum',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['analytics'],
      operation: ['getActiveAccounts'],
    },
  },
  default: 0,
  description: 'The epoch number to get active account metrics for',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'actions':
        return [await executeActionsOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'rewards':
        return [await executeRewardsOperations.call(this, items)];
      case 'analytics':
        return [await executeAnalyticsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountsOperations(
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
          
          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Account address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${encodeURIComponent(address)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountActions': {
          const address = this.getNodeParameter('address', i) as string;
          const start = this.getNodeParameter('start', i, 0) as number;
          const count = this.getNodeParameter('count', i, 10) as number;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Account address is required');
          }

          const queryParams = new URLSearchParams({
            start: start.toString(),
            count: count.toString(),
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${encodeURIComponent(address)}/actions?${queryParams}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountBalance': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Account address is required');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${encodeURIComponent(address)}/balance`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountMeta': {
          const address = this.getNodeParameter('address', i) as string;

          if (!address) {
            throw new NodeOperationError(this.getNode(), 'Account address is required');
          }

          const queryParams = new URLSearchParams({
            address: address,
          });

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/meta?${queryParams}`,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error, { itemIndex: i });
        } else {
          throw new NodeOperationError(this.getNode(), error.message, { itemIndex: i });
        }
      }
    }
  }

  return returnData;
}

async function executeActionsOperations(
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
        case 'getActionByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/actions/${hash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActions': {
          const start = this.getNodeParameter('start', i) as number;
          const count = this.getNodeParameter('count', i) as number;
          const byAddr = this.getNodeParameter('byAddr', i) as string;
          const byBlk = this.getNodeParameter('byBlk', i) as string;

          const queryParams: any = {
            start: start.toString(),
            count: count.toString(),
          };

          if (byAddr) {
            queryParams.byAddr = byAddr;
          }

          if (byBlk) {
            queryParams.byBlk = byBlk;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/actions?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'sendAction': {
          const serializedAction = this.getNodeParameter('serializedAction', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/actions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              serializedAction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getReceiptByAction': {
          const actionHash = this.getNodeParameter('actionHash', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/actions/${actionHash}/receipt`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateActionGasConsumption': {
          const action = this.getNodeParameter('action', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/actions/estimate-gas`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
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

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.response) {
          throw new NodeApiError(this.getNode(), error.response.body || error.response.data || error.message);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeBlocksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotexApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = credentials.baseUrl || 'https://iotexapi.com';
      
      switch (operation) {
        case 'getBlockByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/api/blocks/${height}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlockByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          if (!hash) {
            throw new NodeOperationError(this.getNode(), 'Block hash is required');
          }
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/api/blocks/${hash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlocks': {
          const start = this.getNodeParameter('start', i, 1) as number;
          const count = this.getNodeParameter('count', i, 10) as number;
          
          if (count > 100) {
            throw new NodeOperationError(this.getNode(), 'Count cannot exceed 100');
          }
          
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/api/blocks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              start: start,
              count: count,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getChainMeta': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/api/blocks/meta`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getBlockProducers': {
          const options: any = {
            method: 'GET',
            url: `${baseUrl}/api/blocks/producers`,
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
      
      returnData.push({ json: result, pairedItem: { item: i } });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { 
            error: error.message,
            operation: operation,
            item: i 
          }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeSmartContractsOperations(
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
          const address = this.getNodeParameter('address', i) as string;
          const key = this.getNodeParameter('key', i) as string;

          const body: any = {
            address,
            key,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/contracts/read`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'readState': {
          const action = this.getNodeParameter('action', i) as any;

          const body: any = {
            action: typeof action === 'string' ? JSON.parse(action) : action,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/contracts/call`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContract': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/contracts/${address}`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'estimateGas': {
          const action = this.getNodeParameter('action', i) as any;

          const body: any = {
            action: typeof action === 'string' ? JSON.parse(action) : action,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/contracts/estimate-gas`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActions': {
          const address = this.getNodeParameter('address', i) as string;
          const start = this.getNodeParameter('start', i, 0) as number;
          const count = this.getNodeParameter('count', i, 50) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/contracts/${address}/actions`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeRewardsOperations(
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
        case 'getEpochRewards': {
          const address = this.getNodeParameter('address', i) as string;
          const epochNum = this.getNodeParameter('epochNum', i) as number;

          const queryParams = new URLSearchParams();
          if (epochNum > 0) {
            queryParams.append('epochNum', epochNum.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rewards/${address}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getUnclaimedBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const epochNum = this.getNodeParameter('epochNum', i) as number;

          const queryParams = new URLSearchParams();
          if (epochNum > 0) {
            queryParams.append('epochNum', epochNum.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rewards/unclaimed/${address}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBucketsByVoter': {
          const voterAddress = this.getNodeParameter('voterAddress', i) as string;
          const offset = this.getNodeParameter('offset', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams();
          if (offset > 0) {
            queryParams.append('offset', offset.toString());
          }
          if (limit !== 100) {
            queryParams.append('limit', limit.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rewards/buckets/${voterAddress}${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCandidates': {
          const height = this.getNodeParameter('height', i) as number;
          const startIndex = this.getNodeParameter('startIndex', i) as number;
          const limit = this.getNodeParameter('limit', i) as number;

          const queryParams = new URLSearchParams();
          if (height > 0) {
            queryParams.append('height', height.toString());
          }
          if (startIndex > 0) {
            queryParams.append('startIndex', startIndex.toString());
          }
          if (limit !== 100) {
            queryParams.append('limit', limit.toString());
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/rewards/candidates${queryParams.toString() ? '?' + queryParams.toString() : ''}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${credentials.apiKey}`,
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
        if (error.response?.body?.message) {
          throw new NodeApiError(this.getNode(), error.response.body, {
            message: error.response.body.message,
            httpCode: error.response.statusCode,
          });
        }
        throw new NodeOperationError(this.getNode(), error.message);
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
        case 'getChainStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/stats/chain`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getConsensusMetrics': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/stats/consensus`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActionStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/stats/actions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActiveAccounts': {
          const epochNum = this.getNodeParameter('epochNum', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/stats/accounts`,
            qs: {
              epochNum: epochNum,
            },
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
        if (error.httpCode === 400) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Bad request - check your parameters',
          });
        } else if (error.httpCode === 401) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Unauthorized - check your API key',
          });
        } else if (error.httpCode === 429) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Rate limit exceeded - please try again later',
          });
        }
        throw error;
      }
    }
  }

  return returnData;
}
