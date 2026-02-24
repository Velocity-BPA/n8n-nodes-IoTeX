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
        default: 'blockchainData',
      },
      // Operation dropdowns per resource
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
      // Parameter definitions
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

async function executeBlockchainDataOperations(
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
        case 'getChainMeta': {
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getChainMeta`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {},
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockMetas': {
          const byIndex = this.getNodeParameter('byIndex', i, {}) as any;
          const byHash = this.getNodeParameter('byHash', i, '') as string;
          const count = this.getNodeParameter('count', i, 1) as number;

          let requestBody: any = {};

          if (byHash) {
            requestBody.byHash = {
              blkHash: byHash,
            };
          } else if (byIndex.start) {
            requestBody.byIndex = {
              start: byIndex.start,
              count: byIndex.count || count,
            };
          } else {
            requestBody.byIndex = {
              start: 1,
              count: count,
            };
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getBlockMetas`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: requestBody,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActions': {
          const byIndex = this.getNodeParameter('byIndex', i, {}) as any;
          const byHash = this.getNodeParameter('byHash', i, '') as string;
          const byAddr = this.getNodeParameter('byAddr', i, {}) as any;

          let requestBody: any = {};

          if (byHash) {
            requestBody.byHash = {
              actionHash: byHash,
              checkPending: true,
            };
          } else if (byAddr.address) {
            requestBody.byAddr = {
              address: byAddr.address,
              start: byAddr.start || 1,
              count: byAddr.count || 10,
            };
          } else if (byIndex.start) {
            requestBody.byIndex = {
              start: byIndex.start,
              count: byIndex.count || 10,
            };
          } else {
            requestBody.byIndex = {
              start: 1,
              count: 10,
            };
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getActions`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: requestBody,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getReceiptByAction': {
          const actionHash = this.getNodeParameter('actionHash', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getReceiptByAction`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              actionHash: actionHash,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAccount': {
          const address = this.getNodeParameter('address', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getAccount`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              address: address,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActionsFromAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const start = this.getNodeParameter('start', i, 1) as number;
          const count = this.getNodeParameter('count', i, 10) as number;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getActionsFromAddress`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              address: address,
              start: start,
              count: count,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getActionsToAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const start = this.getNodeParameter('start', i, 1) as number;
          const count = this.getNodeParameter('count', i, 10) as number;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/getActionsToAddress`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': credentials.apiKey,
            },
            body: {
              address: address,
              start: start,
              count: count,
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
        throw new NodeApiError(this.getNode(), error);
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
        case 'sendAction': {
          const action = this.getNodeParameter('action', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              action: typeof action === 'string' ? JSON.parse(action) : action,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'estimateGasForAction': {
          const action = this.getNodeParameter('action', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/estimateGasForAction`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              action: typeof action === 'string' ? JSON.parse(action) : action,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'readContract': {
          const action = this.getNodeParameter('action', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {
              action: typeof action === 'string' ? JSON.parse(action) : action,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'suggestGasPrice': {
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/suggestGasPrice`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: {},
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getServerMeta': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/getServerMeta`,
            headers: {
              'X-API-KEY': credentials.apiKey,
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

async function executeXrcTokensOperations(
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
        case 'getTokenBalance': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/getAccount`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              address: address,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'readTokenContract': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const method = this.getNodeParameter('method', i) as string;
          const params = this.getNodeParameter('params', i) as any;
          
          const requestBody: any = {
            execution: {
              contract: contractAddress,
              data: '',
            },
            callerAddress: contractAddress,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'transferTokens': {
          const signedAction = this.getNodeParameter('signedAction', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              action: signedAction,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getTokenMetadata': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          
          const metadataRequests = [
            { method: 'name' },
            { method: 'symbol' },
            { method: 'decimals' },
          ];

          const results: any = {};

          for (const request of metadataRequests) {
            const options: any = {
              method: 'POST',
              url: `${credentials.baseUrl}/api/core/readContract`,
              headers: {
                'Authorization': `Bearer ${credentials.apiKey}`,
                'Content-Type': 'application/json',
              },
              body: {
                execution: {
                  contract: contractAddress,
                  data: '',
                },
                callerAddress: contractAddress,
              },
              json: true,
            };

            try {
              const response = await this.helpers.httpRequest(options) as any;
              results[request.method] = response;
            } catch (error: any) {
              results[request.method] = null;
            }
          }

          result = {
            contractAddress,
            metadata: results,
          };
          break;
        }

        case 'getTokenSupply': {
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              execution: {
                contract: contractAddress,
                data: '',
              },
              callerAddress: contractAddress,
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

async function executeDeviceRegistryOperations(
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
        case 'registerDevice': {
          const deviceAction = this.getNodeParameter('deviceAction', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': credentials.apiKey,
            },
            body: {
              action: deviceAction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeviceInfo': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const methodName = this.getNodeParameter('methodName', i, 'getDevice') as string;
          const methodParams = this.getNodeParameter('methodParams', i, [deviceId]) as any[];

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': credentials.apiKey,
            },
            body: {
              contractAddress,
              method: methodName,
              params: methodParams,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listDevices': {
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const methodName = this.getNodeParameter('methodName', i, 'getDevicesByOwner') as string;
          const methodParams = this.getNodeParameter('methodParams', i, [ownerAddress]) as any[];

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': credentials.apiKey,
            },
            body: {
              contractAddress,
              method: methodName,
              params: methodParams,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateDeviceStatus': {
          const deviceAction = this.getNodeParameter('deviceAction', i) as any;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': credentials.apiKey,
            },
            body: {
              action: deviceAction,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getDeviceMetrics': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          const contractAddress = this.getNodeParameter('contractAddress', i) as string;
          const timeRange = this.getNodeParameter('timeRange', i, {}) as any;
          const methodName = this.getNodeParameter('methodName', i, 'getDeviceMetrics') as string;
          
          const methodParams = this.getNodeParameter('methodParams', i, [
            deviceId,
            timeRange.start || 0,
            timeRange.end || Math.floor(Date.now() / 1000),
          ]) as any[];

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Content-Type': 'application/json',
              'X-API-KEY': credentials.apiKey,
            },
            body: {
              contractAddress,
              method: methodName,
              params: methodParams,
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
        json: {
          operation,
          success: true,
          data: result,
        }, 
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { 
            operation,
            success: false,
            error: error.message,
          }, 
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executePebbleTrackersOperations(
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
        case 'getPebbleData': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          const dataType = this.getNodeParameter('dataType', i) as string;
          const timeRange = this.getNodeParameter('timeRange', i) as string;
          
          const contractData = {
            contractAddress: 'pebble-data-contract',
            abi: 'getPebbleData',
            method: 'getPebbleData',
            args: [deviceId, dataType, timeRange],
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: contractData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'submitPebbleData': {
          const dataAction = this.getNodeParameter('dataAction', i) as any;
          
          const actionData = {
            action: dataAction,
            gasLimit: '100000',
            gasPrice: '1000000000',
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
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
        
        case 'getPebbleLocation': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          const timestamp = this.getNodeParameter('timestamp', i) as number;
          
          const contractData = {
            contractAddress: 'pebble-location-contract',
            abi: 'getPebbleLocation',
            method: 'getPebbleLocation',
            args: [deviceId, timestamp.toString()],
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: contractData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getPebbleRewards': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          
          const contractData = {
            contractAddress: 'pebble-rewards-contract',
            abi: 'getPebbleRewards',
            method: 'getPebbleRewards',
            args: [deviceId],
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: contractData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'validatePebbleProof': {
          const deviceId = this.getNodeParameter('deviceId', i) as string;
          const proofData = this.getNodeParameter('proofData', i) as any;
          
          const contractData = {
            contractAddress: 'pebble-proof-contract',
            abi: 'validatePebbleProof',
            method: 'validatePebbleProof',
            args: [deviceId, JSON.stringify(proofData)],
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: contractData,
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
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }
  
  return returnData;
}

async function executeW3bstreamProjectsOperations(
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
        case 'createProject': {
          const projectAction = this.getNodeParameter('projectAction', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: projectAction,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProjectInfo': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          
          const requestBody = {
            projectId,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listProjects': {
          const ownerAddress = this.getNodeParameter('ownerAddress', i) as string;
          
          const requestBody = {
            ownerAddress,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateProject': {
          const projectAction = this.getNodeParameter('projectAction', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: projectAction,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getProjectMetrics': {
          const projectId = this.getNodeParameter('projectId', i) as string;
          const timeRange = this.getNodeParameter('timeRange', i) as any;
          
          const requestBody = {
            projectId,
            timeRange,
          };
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/readContract`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: requestBody,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'processRealWorldData': {
          const dataAction = this.getNodeParameter('dataAction', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/sendAction`,
            headers: {
              'X-API-KEY': credentials.apiKey,
              'Content-Type': 'application/json',
            },
            body: dataAction,
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
