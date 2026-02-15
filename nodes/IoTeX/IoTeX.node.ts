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
            name: 'Blocks',
            value: 'blocks',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Actions',
            value: 'actions',
          },
          {
            name: 'SmartContracts',
            value: 'smartContracts',
          },
          {
            name: 'Delegates',
            value: 'delegates',
          },
          {
            name: 'Staking',
            value: 'staking',
          },
          {
            name: 'ChainMetadata',
            value: 'chainMetadata',
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
      description: 'Get account details by address',
      action: 'Get account details',
    },
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get account balance',
      action: 'Get account balance',
    },
    {
      name: 'Get Account Transactions',
      value: 'getAccountTransactions',
      description: 'Get transactions for account',
      action: 'Get account transactions',
    },
    {
      name: 'Get Account Actions',
      value: 'getAccountActions',
      description: 'Get actions performed by account',
      action: 'Get account actions',
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
      resource: ['blocks'],
    },
  },
  options: [
    {
      name: 'Get Block by Height',
      value: 'getBlockByHeight',
      description: 'Get block information by block height',
      action: 'Get block by height',
    },
    {
      name: 'Get Block by Hash',
      value: 'getBlockByHash',
      description: 'Get block information by block hash',
      action: 'Get block by hash',
    },
    {
      name: 'Get Blocks',
      value: 'getBlocks',
      description: 'Get a list of blocks with pagination',
      action: 'Get blocks',
    },
    {
      name: 'Get Latest Block',
      value: 'getLatestBlock',
      description: 'Get the latest block information',
      action: 'Get latest block',
    },
    {
      name: 'Get Block Transactions',
      value: 'getBlockTransactions',
      description: 'Get all transactions in a specific block',
      action: 'Get block transactions',
    },
  ],
  default: 'getLatestBlock',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get transaction by hash',
      action: 'Get transaction by hash',
    },
    {
      name: 'Get Transactions',
      value: 'getTransactions',
      description: 'Get list of transactions',
      action: 'Get list of transactions',
    },
    {
      name: 'Send Transaction',
      value: 'sendTransaction',
      description: 'Broadcast a transaction',
      action: 'Send transaction',
    },
    {
      name: 'Get Transaction Receipt',
      value: 'getTransactionReceipt',
      description: 'Get transaction receipt by hash',
      action: 'Get transaction receipt',
    },
  ],
  default: 'getTransaction',
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
      name: 'Get Action',
      value: 'getAction',
      description: 'Get action by hash',
      action: 'Get action by hash',
    },
    {
      name: 'Get Actions',
      value: 'getActions',
      description: 'Get list of actions',
      action: 'Get list of actions',
    },
    {
      name: 'Send Action',
      value: 'sendAction',
      description: 'Send an action to the blockchain',
      action: 'Send action to blockchain',
    },
    {
      name: 'Get Action Receipt',
      value: 'getActionReceipt',
      description: 'Get action execution receipt',
      action: 'Get action execution receipt',
    },
  ],
  default: 'getAction',
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
      name: 'Call Contract',
      value: 'callContract',
      description: 'Execute a read-only contract call',
      action: 'Call contract',
    },
    {
      name: 'Execute Contract',
      value: 'executeContract',
      description: 'Execute a contract transaction',
      action: 'Execute contract',
    },
    {
      name: 'Get Contract',
      value: 'getContract',
      description: 'Get contract information',
      action: 'Get contract',
    },
    {
      name: 'Get Contract ABI',
      value: 'getContractABI',
      description: 'Get contract ABI',
      action: 'Get contract ABI',
    },
  ],
  default: 'callContract',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['delegates'],
    },
  },
  options: [
    {
      name: 'Get Delegates',
      value: 'getDelegates',
      description: 'Get list of delegates',
      action: 'Get delegates',
    },
    {
      name: 'Get Delegate',
      value: 'getDelegate',
      description: 'Get delegate by name',
      action: 'Get delegate by name',
    },
    {
      name: 'Get Delegate Votes',
      value: 'getDelegateVotes',
      description: 'Get votes for delegate',
      action: 'Get delegate votes',
    },
    {
      name: 'Get Delegate Rankings',
      value: 'getDelegateRankings',
      description: 'Get delegate rankings',
      action: 'Get delegate rankings',
    },
  ],
  default: 'getDelegates',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['staking'],
    },
  },
  options: [
    {
      name: 'Get Staking Buckets',
      value: 'getStakingBuckets',
      description: 'Retrieve all staking buckets with optional filters',
      action: 'Get staking buckets',
    },
    {
      name: 'Get Staking Bucket',
      value: 'getStakingBucket',
      description: 'Get a specific staking bucket by ID',
      action: 'Get staking bucket by ID',
    },
    {
      name: 'Create Stake',
      value: 'createStake',
      description: 'Create a new staking transaction',
      action: 'Create stake transaction',
    },
    {
      name: 'Unstake',
      value: 'unstake',
      description: 'Create an unstaking transaction',
      action: 'Create unstake transaction',
    },
  ],
  default: 'getStakingBuckets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['chainMetadata'],
    },
  },
  options: [
    {
      name: 'Get Chain Metadata',
      value: 'getChainMetadata',
      description: 'Get chain metadata information',
      action: 'Get chain metadata',
    },
    {
      name: 'Get Chain Statistics',
      value: 'getChainStats',
      description: 'Get blockchain statistics',
      action: 'Get chain statistics',
    },
    {
      name: 'Get Network Information',
      value: 'getNetworkInfo',
      description: 'Get network information',
      action: 'Get network information',
    },
    {
      name: 'Get Current Epoch',
      value: 'getCurrentEpoch',
      description: 'Get current epoch information',
      action: 'Get current epoch',
    },
  ],
  default: 'getChainMetadata',
},
      // Parameter definitions
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccount', 'getBalance', 'getAccountTransactions', 'getAccountActions'],
    },
  },
  default: '',
  description: 'The IoTeX account address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions', 'getAccountActions'],
    },
  },
  default: 100,
  description: 'Maximum number of results to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['accounts'],
      operation: ['getAccountTransactions', 'getAccountActions'],
    },
  },
  default: 0,
  description: 'Number of results to skip',
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
  description: 'The height of the block to retrieve',
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
  description: 'The hash of the block to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: 10,
  description: 'Maximum number of blocks to return (default: 10)',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: 0,
  description: 'Number of blocks to skip (default: 0)',
},
{
  displayName: 'Start Height',
  name: 'start',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: undefined,
  description: 'Starting block height for the range',
},
{
  displayName: 'End Height',
  name: 'end',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlocks'],
    },
  },
  default: undefined,
  description: 'Ending block height for the range',
},
{
  displayName: 'Block Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blocks'],
      operation: ['getBlockTransactions'],
    },
  },
  default: 1,
  description: 'The height of the block to get transactions from',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction'],
    },
  },
  default: '',
  description: 'The hash of the transaction to retrieve',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: 50,
  description: 'Maximum number of transactions to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: 0,
  description: 'Number of transactions to skip',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactions'],
    },
  },
  default: '',
  description: 'Filter transactions by address',
},
{
  displayName: 'Signed Transaction',
  name: 'signedTransaction',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendTransaction'],
    },
  },
  default: '',
  description: 'The signed transaction data to broadcast',
},
{
  displayName: 'Transaction Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransactionReceipt'],
    },
  },
  default: '',
  description: 'The hash of the transaction to get receipt for',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getAction'],
    },
  },
  default: '',
  description: 'The action hash',
},
{
  displayName: 'Hash',
  name: 'hash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActionReceipt'],
    },
  },
  default: '',
  description: 'The action hash',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: 10,
  description: 'Maximum number of actions to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['getActions'],
    },
  },
  default: 0,
  description: 'Number of actions to skip',
},
{
  displayName: 'Address',
  name: 'address',
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
  displayName: 'Action Data',
  name: 'action',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['actions'],
      operation: ['sendAction'],
    },
  },
  default: '{}',
  description: 'The action data to send to the blockchain',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract'],
    },
  },
  default: '',
  description: 'The contract address to call',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract'],
    },
  },
  default: '',
  description: 'The contract method to call',
},
{
  displayName: 'Parameters',
  name: 'params',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['callContract'],
    },
  },
  default: '[]',
  description: 'Method parameters as JSON array',
},
{
  displayName: 'Contract Address',
  name: 'contractAddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['executeContract'],
    },
  },
  default: '',
  description: 'The contract address to execute',
},
{
  displayName: 'Method',
  name: 'method',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['executeContract'],
    },
  },
  default: '',
  description: 'The contract method to execute',
},
{
  displayName: 'Parameters',
  name: 'params',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['executeContract'],
    },
  },
  default: '[]',
  description: 'Method parameters as JSON array',
},
{
  displayName: 'Gas Limit',
  name: 'gasLimit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['executeContract'],
    },
  },
  default: 1000000,
  description: 'Gas limit for the transaction',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContract'],
    },
  },
  default: '',
  description: 'The contract address',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['smartContracts'],
      operation: ['getContractABI'],
    },
  },
  default: '',
  description: 'The contract address',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegates'],
      operation: ['getDelegates'],
    },
  },
  default: 50,
  description: 'Maximum number of delegates to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegates'],
      operation: ['getDelegates'],
    },
  },
  default: 0,
  description: 'Number of delegates to skip',
},
{
  displayName: 'Delegate Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['delegates'],
      operation: ['getDelegate', 'getDelegateVotes'],
    },
  },
  default: '',
  description: 'The name of the delegate',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['delegates'],
      operation: ['getDelegateRankings'],
    },
  },
  default: 50,
  description: 'Maximum number of rankings to return',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakingBuckets'],
    },
  },
  default: 100,
  description: 'Maximum number of staking buckets to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakingBuckets'],
    },
  },
  default: 0,
  description: 'Number of staking buckets to skip',
},
{
  displayName: 'Voter',
  name: 'voter',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakingBuckets'],
    },
  },
  default: '',
  description: 'Filter by voter address',
},
{
  displayName: 'Bucket ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['getStakingBucket'],
    },
  },
  default: '',
  description: 'The ID of the staking bucket to retrieve',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: '',
  description: 'The amount to stake (in IOTX)',
},
{
  displayName: 'Candidate',
  name: 'candidate',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: '',
  description: 'The candidate address to stake to',
},
{
  displayName: 'Duration',
  name: 'duration',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['createStake'],
    },
  },
  default: 91,
  description: 'The staking duration in days',
},
{
  displayName: 'Bucket ID',
  name: 'bucketId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['staking'],
      operation: ['unstake'],
    },
  },
  default: '',
  description: 'The ID of the staking bucket to unstake',
},
// No additional parameters - all operations require no parameters,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'accounts':
        return [await executeAccountsOperations.call(this, items)];
      case 'blocks':
        return [await executeBlocksOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'actions':
        return [await executeActionsOperations.call(this, items)];
      case 'smartContracts':
        return [await executeSmartContractsOperations.call(this, items)];
      case 'delegates':
        return [await executeDelegatesOperations.call(this, items)];
      case 'staking':
        return [await executeStakingOperations.call(this, items)];
      case 'chainMetadata':
        return [await executeChainMetadataOperations.call(this, items)];
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
      const address = this.getNodeParameter('address', i) as string;

      switch (operation) {
        case 'getAccount': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${address}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBalance': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${address}/balance`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountTransactions': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${address}/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccountActions': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/accounts/${address}/actions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
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
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
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

      switch (operation) {
        case 'getBlockByHeight': {
          const height = this.getNodeParameter('height', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/blocks/${height}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockByHash': {
          const hash = this.getNodeParameter('hash', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/blocks/${hash}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlocks': {
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          const start = this.getNodeParameter('start', i, undefined) as number | undefined;
          const end = this.getNodeParameter('end', i, undefined) as number | undefined;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (start !== undefined) {
            queryParams.start = start.toString();
          }
          if (end !== undefined) {
            queryParams.end = end.toString();
          }

          const queryString = new URLSearchParams(queryParams).toString();
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/blocks?${queryString}`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getLatestBlock': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/blocks/latest`,
            headers: {
              'X-API-Key': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockTransactions': {
          const height = this.getNodeParameter('height', i) as number;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/blocks/${height}/transactions`,
            headers: {
              'X-API-Key': credentials.apiKey,
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
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
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
        case 'getTransaction': {
          const hash = this.getNodeParameter('hash', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/transactions/${hash}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransactions': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const address = this.getNodeParameter('address', i) as string;
          
          const queryParams: any = {};
          if (limit) queryParams.limit = limit.toString();
          if (offset) queryParams.offset = offset.toString();
          if (address) queryParams.address = address;
          
          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/transactions${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'sendTransaction': {
          const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/transactions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              signedTransaction: signedTransaction,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransactionReceipt': {
          const hash = this.getNodeParameter('hash', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/transactions/${hash}/receipt`,
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
          json: { error: error.message }, 
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
        case 'getAction': {
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
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const address = this.getNodeParameter('address', i) as string;
          
          const queryParams: any = {};
          if (limit) queryParams.limit = limit;
          if (offset) queryParams.offset = offset;
          if (address) queryParams.address = address;
          
          const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString()
            : '';
            
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/actions${queryString}`,
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
          const actionData = this.getNodeParameter('action', i) as any;
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/actions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: actionData,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getActionReceipt': {
          const hash = this.getNodeParameter('hash', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/actions/${hash}/receipt`,
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
          json: { error: error.message || 'Unknown error occurred' }, 
          pairedItem: { item: i } 
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message || 'Unknown error occurred');
        }
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
        case 'callContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const params = this.getNodeParameter('params', i) as string;
          
          let parsedParams: any[] = [];
          try {
            parsedParams = JSON.parse(params);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in params parameter');
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/contracts/call`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              contractAddress,
              method,
              params: parsedParams,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'executeContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const params = this.getNodeParameter('params', i) as string;
          const gasLimit = this.getNodeParameter('gasLimit', i) as number;
          
          let parsedParams: any[] = [];
          try {
            parsedParams = JSON.parse(params);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in params parameter');
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/contracts/execute`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              contractAddress,
              method,
              params: parsedParams,
              gasLimit,
            },
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
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getContractABI': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/contracts/${address}/abi`,
            headers: {
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
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        } else {
          throw new NodeOperationError(this.getNode(), error.message);
        }
      }
    }
  }

  return returnData;
}

async function executeDelegatesOperations(
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
        case 'getDelegates': {
          const limit = this.getNodeParameter('limit', i, 50) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/delegates`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
              offset,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getDelegate': {
          const name = this.getNodeParameter('name', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/delegates/${encodeURIComponent(name)}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getDelegateVotes': {
          const name = this.getNodeParameter('name', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/delegates/${encodeURIComponent(name)}/votes`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getDelegateRankings': {
          const limit = this.getNodeParameter('limit', i, 50) as number;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/delegates/rankings`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              limit,
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
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }
  
  return returnData;
}

async function executeStakingOperations(
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
        case 'getStakingBuckets': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          const voter = this.getNodeParameter('voter', i) as string;

          const queryParams: any = {
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (voter) {
            queryParams.voter = voter;
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/staking/buckets?${queryString}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStakingBucket': {
          const id = this.getNodeParameter('id', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/staking/buckets/${id}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createStake': {
          const amount = this.getNodeParameter('amount', i) as string;
          const candidate = this.getNodeParameter('candidate', i) as string;
          const duration = this.getNodeParameter('duration', i) as number;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/staking/stake`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              amount,
              candidate,
              duration,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unstake': {
          const bucketId = this.getNodeParameter('bucketId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/staking/unstake`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
            body: {
              bucketId,
            },
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeChainMetadataOperations(
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
        case 'getChainMetadata': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/chainmeta`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getChainStats': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/stats`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNetworkInfo': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/network`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCurrentEpoch': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/epoch`,
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
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}
