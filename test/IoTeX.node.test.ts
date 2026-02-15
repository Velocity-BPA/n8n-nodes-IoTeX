/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { IoTeX } from '../nodes/IoTeX/IoTeX.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('IoTeX Node', () => {
  let node: IoTeX;

  beforeAll(() => {
    node = new IoTeX();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('IoTeX');
      expect(node.description.name).toBe('iotex');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Accounts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account details successfully', async () => {
      const mockResponse = {
        address: 'io1abc123def456',
        balance: '1000000000000000000',
        nonce: 5,
        pendingNonce: 6,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getAccount';
        if (paramName === 'address') return 'io1abc123def456';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/accounts/io1abc123def456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle missing address error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccount';
        if (paramName === 'address') return '';
        return '';
      });

      await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Account address is required');
    });
  });

  describe('getAccountActions operation', () => {
    it('should get account actions successfully', async () => {
      const mockResponse = {
        actions: [
          { hash: 'action1', timestamp: '2023-01-01T00:00:00Z' },
          { hash: 'action2', timestamp: '2023-01-02T00:00:00Z' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'getAccountActions';
        if (paramName === 'address') return 'io1abc123def456';
        if (paramName === 'start') return defaultValue || 0;
        if (paramName === 'count') return defaultValue || 10;
        return defaultValue || '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/accounts/io1abc123def456/actions?start=0&count=10',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getAccountBalance operation', () => {
    it('should get account balance successfully', async () => {
      const mockResponse = {
        address: 'io1abc123def456',
        balance: '1000000000000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccountBalance';
        if (paramName === 'address') return 'io1abc123def456';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getAccountMeta operation', () => {
    it('should get account metadata successfully', async () => {
      const mockResponse = {
        address: 'io1abc123def456',
        meta: {
          name: 'Test Account',
          isContract: false,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccountMeta';
        if (paramName === 'address') return 'io1abc123def456';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/accounts/meta?address=io1abc123def456',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAccount';
        if (paramName === 'address') return 'io1abc123def456';
        return '';
      });

      const error = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

      const result = await executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });

    it('should throw unknown operation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

      await expect(executeAccountsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Actions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getActionByHash', () => {
    it('should get action by hash successfully', async () => {
      const mockResponse = {
        actionInfo: {
          action: { core: { version: 1, nonce: 123 } },
          actHash: 'test-hash',
          blkHash: 'block-hash',
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getActionByHash')
        .mockReturnValueOnce('test-hash');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeActionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/actions/test-hash',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle errors when getting action by hash', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getActionByHash')
        .mockReturnValueOnce('invalid-hash');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Action not found'),
      );

      await expect(
        executeActionsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Action not found');
    });
  });

  describe('getActions', () => {
    it('should get actions list successfully', async () => {
      const mockResponse = {
        actionInfo: [
          { action: { core: { version: 1 } }, actHash: 'hash1' },
          { action: { core: { version: 1 } }, actHash: 'hash2' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getActions')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(10)
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeActionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('sendAction', () => {
    it('should send action successfully', async () => {
      const mockResponse = {
        actionHash: 'new-action-hash',
        status: 'success',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendAction')
        .mockReturnValueOnce('serialized-action-data');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeActionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/actions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          serializedAction: 'serialized-action-data',
        },
        json: true,
      });
    });
  });

  describe('getReceiptByAction', () => {
    it('should get action receipt successfully', async () => {
      const mockResponse = {
        receiptInfo: {
          receipt: { status: 1, blkHeight: 123 },
          blkHash: 'block-hash',
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getReceiptByAction')
        .mockReturnValueOnce('action-hash');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeActionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('estimateActionGasConsumption', () => {
    it('should estimate gas consumption successfully', async () => {
      const mockResponse = {
        gas: 21000,
        gasPrice: '1000000000000',
      };

      const actionData = {
        core: {
          version: 1,
          nonce: 123,
          gasLimit: 21000,
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('estimateActionGasConsumption')
        .mockReturnValueOnce(actionData);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeActionsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/actions/estimate-gas',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          action: actionData,
        },
        json: true,
      });
    });
  });
});

describe('Blocks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get block by height successfully', async () => {
    const mockBlockData = {
      block: {
        header: {
          height: '12345',
          timestamp: '1234567890',
        },
        body: {
          actions: [],
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlockByHeight';
        case 'height':
          return 12345;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockData);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlockData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/12345',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get block by hash successfully', async () => {
    const mockBlockData = {
      block: {
        header: {
          hash: 'test-hash-123',
          height: '12345',
        },
        body: {
          actions: [],
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlockByHash';
        case 'hash':
          return 'test-hash-123';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockData);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlockData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/test-hash-123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get blocks list successfully', async () => {
    const mockBlocksData = {
      blocks: [
        { header: { height: '10' } },
        { header: { height: '11' } },
      ],
      total: 100,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlocks';
        case 'start':
          return 10;
        case 'count':
          return 2;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocksData);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlocksData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        start: 10,
        count: 2,
      },
      json: true,
    });
  });

  test('should get chain metadata successfully', async () => {
    const mockMetaData = {
      chainMeta: {
        height: '12345',
        numActions: '54321',
        tps: '100',
        epoch: {
          num: '123',
          height: '12000',
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getChainMeta';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMetaData);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockMetaData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/meta',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get block producers successfully', async () => {
    const mockProducersData = {
      blockProducers: [
        {
          address: 'producer1',
          votes: '1000000',
        },
        {
          address: 'producer2',
          votes: '900000',
        },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlockProducers';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockProducersData);

    const items = [{ json: {} }];
    const result = await executeBlocksOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockProducersData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/producers',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlockByHeight';
        case 'height':
          return 99999999;
        default:
          return undefined;
      }
    });

    const apiError = new Error('Block not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(apiError);

    const items = [{ json: {} }];

    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Block not found');
  });

  test('should handle missing block hash parameter', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlockByHash';
        case 'hash':
          return '';
        default:
          return undefined;
      }
    });

    const items = [{ json: {} }];

    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Block hash is required');
  });

  test('should handle count limit validation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBlocks';
        case 'start':
          return 1;
        case 'count':
          return 150;
        default:
          return undefined;
      }
    });

    const items = [{ json: {} }];

    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, items)
    ).rejects.toThrow('Count cannot exceed 100');
  });
});

describe('SmartContracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('readContractStorage', () => {
    it('should read contract storage successfully', async () => {
      const mockResponse = { data: 'storage_value' };
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'readContractStorage';
          case 'address':
            return 'io1234567890abcdef';
          case 'key':
            return 'storage_key';
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/contracts/read',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: {
          address: 'io1234567890abcdef',
          key: 'storage_key',
        },
        json: true,
      });
    });
  });

  describe('readState', () => {
    it('should execute read-only contract call successfully', async () => {
      const mockResponse = { result: 'call_result' };
      const mockAction = { method: 'balanceOf', params: ['address'] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'readState';
          case 'action':
            return mockAction;
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getContract', () => {
    it('should get contract information successfully', async () => {
      const mockResponse = { contract: { address: 'io1234567890abcdef', abi: [] } };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getContract';
          case 'address':
            return 'io1234567890abcdef';
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('estimateGas', () => {
    it('should estimate gas for contract call successfully', async () => {
      const mockResponse = { gasEstimate: '21000' };
      const mockAction = { method: 'transfer', params: ['address', '1000'] };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'estimateGas';
          case 'action':
            return mockAction;
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getActions', () => {
    it('should get contract actions successfully', async () => {
      const mockResponse = { actions: [], totalCount: 0 };
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
        switch (paramName) {
          case 'operation':
            return 'getActions';
          case 'address':
            return 'io1234567890abcdef';
          case 'start':
            return defaultValue !== undefined ? defaultValue : 0;
          case 'count':
            return defaultValue !== undefined ? defaultValue : 10;
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getContract';
          case 'address':
            return 'invalid_address';
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));

      await expect(
        executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Invalid address');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getContract';
          case 'address':
            return 'invalid_address';
          default:
            return '';
        }
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Invalid address' });
    });
  });
});

describe('Rewards Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get epoch rewards successfully', async () => {
    const mockResponse = {
      address: 'io1234567890abcdef',
      epochNumber: 100,
      blockReward: '1000000000000000000',
      epochReward: '2000000000000000000',
      foundationBonus: '500000000000000000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getEpochRewards';
        case 'address':
          return 'io1234567890abcdef';
        case 'epochNum':
          return 100;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/rewards/io1234567890abcdef?epochNum=100',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get unclaimed balance successfully', async () => {
    const mockResponse = {
      address: 'io1234567890abcdef',
      unclaimedBalance: '5000000000000000000',
      availableBalance: '3000000000000000000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getUnclaimedBalance';
        case 'address':
          return 'io1234567890abcdef';
        case 'epochNum':
          return 0;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/rewards/unclaimed/io1234567890abcdef',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get buckets by voter successfully', async () => {
    const mockResponse = {
      buckets: [
        {
          index: 1,
          candidateName: 'delegate1',
          stakedAmount: '10000000000000000000',
          stakedDuration: 91,
          autoStake: true,
        },
        {
          index: 2,
          candidateName: 'delegate2',
          stakedAmount: '5000000000000000000',
          stakedDuration: 365,
          autoStake: false,
        },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getBucketsByVoter';
        case 'voterAddress':
          return 'io1234567890abcdef';
        case 'offset':
          return 0;
        case 'limit':
          return 100;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/rewards/buckets/io1234567890abcdef',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should get candidates successfully', async () => {
    const mockResponse = {
      candidates: [
        {
          name: 'delegate1',
          address: 'io1delegate1address',
          totalWeightedVotes: '50000000000000000000',
          selfStakingTokens: '1200000000000000000000',
          operatorAddress: 'io1operator1address',
        },
        {
          name: 'delegate2',
          address: 'io1delegate2address',
          totalWeightedVotes: '45000000000000000000',
          selfStakingTokens: '1100000000000000000000',
          operatorAddress: 'io1operator2address',
        },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getCandidates';
        case 'height':
          return 1000000;
        case 'startIndex':
          return 0;
        case 'limit':
          return 50;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/rewards/candidates?height=1000000&limit=50',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-api-key',
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    const mockError = {
      response: {
        statusCode: 404,
        body: {
          message: 'Address not found',
        },
      },
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getEpochRewards';
        case 'address':
          return 'invalid_address';
        case 'epochNum':
          return 0;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    const mockError = new Error('Network error');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getEpochRewards';
        case 'address':
          return 'io1234567890abcdef';
        case 'epochNum':
          return 0;
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeRewardsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network error' });
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://iotexapi.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getChainStats', () => {
    it('should get chain statistics successfully', async () => {
      const mockResponse = {
        height: 21000000,
        supply: '9000000000',
        transfers: 500000,
        votes: 200000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getChainStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/stats/chain',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle chain stats error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getChainStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getConsensusMetrics', () => {
    it('should get consensus metrics successfully', async () => {
      const mockResponse = {
        totalDelegates: 36,
        activeDelegates: 24,
        consensusMetrics: {
          blockTime: 5,
          tps: 1000,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getConsensusMetrics';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/stats/consensus',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getActionStats', () => {
    it('should get action statistics successfully', async () => {
      const mockResponse = {
        totalActions: 1000000,
        actionsByType: {
          transfer: 600000,
          execution: 300000,
          staking: 100000,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getActionStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/stats/actions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('getActiveAccounts', () => {
    it('should get active accounts successfully', async () => {
      const mockResponse = {
        epochNum: 12345,
        activeAccounts: 50000,
        newAccounts: 1000,
        totalAccounts: 500000,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getActiveAccounts';
        if (param === 'epochNum') return 12345;
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/stats/accounts',
        qs: {
          epochNum: 12345,
        },
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle active accounts error with continue on fail', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number) => {
        if (param === 'operation') return 'getActiveAccounts';
        if (param === 'epochNum') return 12345;
        return undefined;
      });
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network Error'));

      const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'Network Error' });
    });
  });

  describe('error handling', () => {
    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return undefined;
      });

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });

    it('should handle 401 authentication error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getChainStats';
        return undefined;
      });
      
      const authError = new Error('Unauthorized');
      (authError as any).httpCode = 401;
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(authError);

      await expect(
        executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });
});
});
