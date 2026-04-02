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
describe('Account Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://babel-api.mainnet.iotex.io/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAccount operation', () => {
    it('should get account information successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('io1abc123def456');
      
      const mockResponse = { 
        balance: '1000000000000000000',
        nonce: 42,
        pendingNonce: 43 
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://babel-api.mainnet.iotex.io/v1/getAccount?address=io1abc123def456',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getAccount errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccount')
        .mockReturnValueOnce('invalid-address');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));

      await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid address');
    });
  });

  describe('sendRawAction operation', () => {
    it('should send raw action successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendRawAction')
        .mockReturnValueOnce('0x1234567890abcdef');
      
      const mockResponse = { 
        actionHash: '0xabc123def456',
        success: true 
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://babel-api.mainnet.iotex.io/v1/sendAction',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: {
          data: '0x1234567890abcdef',
        },
        json: true,
      });
    });

    it('should handle sendRawAction errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendRawAction')
        .mockReturnValueOnce('invalid-data');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid transaction data'));

      await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid transaction data');
    });
  });

  describe('getAccountMeta operation', () => {
    it('should get account metadata successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountMeta')
        .mockReturnValueOnce('io1abc123def456');
      
      const mockResponse = { 
        address: 'io1abc123def456',
        isContract: false,
        codeHash: '0x...' 
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://babel-api.mainnet.iotex.io/v1/getAccountMeta?address=io1abc123def456',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle getAccountMeta errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAccountMeta')
        .mockReturnValueOnce('invalid-address');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Account not found'));

      await expect(executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Account not found');
    });
  });
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://babel-api.mainnet.iotex.io/v1'
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

  describe('getBlockMetas operation', () => {
    it('should retrieve block metadata successfully', async () => {
      const mockResponse = { blockMetas: [] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockMetas')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(10);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://babel-api.mainnet.iotex.io/v1/getBlockMetas',
          qs: { start: 1, count: 10 },
        })
      );
    });

    it('should handle errors in getBlockMetas', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockMetas');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getChainMeta operation', () => {
    it('should retrieve chain metadata successfully', async () => {
      const mockResponse = { chainMeta: {} };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainMeta');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://babel-api.mainnet.iotex.io/v1/getChainMeta',
        })
      );
    });

    it('should handle errors in getChainMeta', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getChainMeta');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getBlockByHeight operation', () => {
    it('should retrieve block by height successfully', async () => {
      const mockResponse = { block: {} };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockByHeight')
        .mockReturnValueOnce(100);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://babel-api.mainnet.iotex.io/v1/getBlockByHeight',
          qs: { height: 100 },
        })
      );
    });

    it('should handle errors in getBlockByHeight', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockByHeight');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Block not found'));

      await expect(
        executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Block not found');
    });
  });

  describe('getBlockByHash operation', () => {
    it('should retrieve block by hash successfully', async () => {
      const mockResponse = { block: {} };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockByHash')
        .mockReturnValueOnce('0x1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: 'https://babel-api.mainnet.iotex.io/v1/getBlockByHash',
          qs: { blkHash: '0x1234567890abcdef' },
        })
      );
    });

    it('should handle errors in getBlockByHash', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getBlockByHash');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid hash'));

      await expect(
        executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid hash');
    });
  });
});

describe('Action Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://babel-api.mainnet.iotex.io/v1',
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

	describe('getActions operation', () => {
		it('should get actions successfully', async () => {
			const mockResponse = { actions: [], totalCount: 0 };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getActions')
				.mockReturnValueOnce('io1testaddress')
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(10);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://babel-api.mainnet.iotex.io/v1/getActions',
				headers: {
					'X-API-Key': 'test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					byAddr: 'io1testaddress',
					start: 0,
					count: 10,
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getActions error', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getActions')
				.mockReturnValueOnce('io1testaddress')
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(10);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result[0].json).toEqual({ error: 'API Error' });
		});
	});

	describe('getActionByHash operation', () => {
		it('should get action by hash successfully', async () => {
			const mockResponse = { actionInfo: {} };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getActionByHash')
				.mockReturnValueOnce('0x123hash');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://babel-api.mainnet.iotex.io/v1/getActionByHash',
				headers: {
					'X-API-Key': 'test-key',
					'Content-Type': 'application/json',
				},
				qs: {
					actionHash: '0x123hash',
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('estimateGas operation', () => {
		it('should estimate gas successfully', async () => {
			const mockResponse = { gas: 21000 };
			const actionData = { core: { transfer: { amount: '1000000000000000000' } } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('estimateGas')
				.mockReturnValueOnce(actionData);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/estimateActionGasConsumption',
				headers: {
					'X-API-Key': 'test-key',
					'Content-Type': 'application/json',
				},
				body: {
					action: actionData,
				},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('suggestGasPrice operation', () => {
		it('should suggest gas price successfully', async () => {
			const mockResponse = { gasPrice: '1000000000000' };
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('suggestGasPrice');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/suggestGasPrice',
				headers: {
					'X-API-Key': 'test-key',
					'Content-Type': 'application/json',
				},
				body: {},
				json: true,
			});
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('Contract Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://babel-api.mainnet.iotex.io/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should read contract storage successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('readContractStorage')
      .mockReturnValueOnce('0x1234567890abcdef')
      .mockReturnValueOnce('0xabcdef1234567890');

    const mockResponse = { data: '0x123456' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/readContractStorage',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
      body: {
        contract: '0x1234567890abcdef',
        key: '0xabcdef1234567890',
      },
      json: true,
    });
  });

  it('should read state successfully', async () => {
    const mockAction = { method: 'balanceOf', params: ['0x123'] };
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('readState')
      .mockReturnValueOnce(mockAction);

    const mockResponse = { result: '1000000000000000000' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/readState',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
      body: {
        action: mockAction,
      },
      json: true,
    });
  });

  it('should get receipt by action successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getReceiptByAction')
      .mockReturnValueOnce('0xabcdef1234567890abcdef1234567890abcdef12');

    const mockResponse = { receipt: { status: 1, gasUsed: '21000' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/getReceiptByAction',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
      body: {
        actionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      },
      json: true,
    });
  });

  it('should get contract meta successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getContractMeta')
      .mockReturnValueOnce('0x1234567890abcdef');

    const mockResponse = { meta: { name: 'TestContract', version: '1.0.0' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://babel-api.mainnet.iotex.io/v1/getContractMeta',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'test-key',
      },
      qs: {
        contract: '0x1234567890abcdef',
      },
      json: true,
    });
  });

  it('should handle errors and continue on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('readContractStorage');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeContractOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeContractOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Analytics Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://babel-api.mainnet.iotex.io/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should get staking buckets successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBuckets')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce(50);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ buckets: [] });

    const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { buckets: [] }, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://babel-api.mainnet.iotex.io/v1/getAnalyticsBuckets',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { epochNum: 100, count: 50 },
      json: true,
    });
  });

  it('should get rewards successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRewards')
      .mockReturnValueOnce(100)
      .mockReturnValueOnce('delegate1');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ rewards: [] });

    const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { rewards: [] }, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://babel-api.mainnet.iotex.io/v1/getAnalyticsRewards',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { epochNum: 100, delegateName: 'delegate1' },
      json: true,
    });
  });

  it('should get action analytics successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActionAnalytics')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(10);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ actions: [] });

    const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { actions: [] }, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://babel-api.mainnet.iotex.io/v1/getAnalyticsActions',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      qs: { startEpoch: 1000, epochCount: 10 },
      json: true,
    });
  });

  it('should get chain stats successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getChainStats');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ stats: {} });

    const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { stats: {} }, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://babel-api.mainnet.iotex.io/v1/getChainStats',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getBuckets');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAnalyticsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Delegate Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://babel-api.mainnet.iotex.io/v1'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should get candidates successfully', async () => {
    const mockResponse = { candidates: [{ name: 'delegate1' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCandidates')
      .mockReturnValueOnce('candidates');

    const result = await executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/readState',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ method: 'candidates' }),
      json: true
    });
  });

  it('should get buckets by candidate successfully', async () => {
    const mockResponse = { buckets: [] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBucketsByCandidate')
      .mockReturnValueOnce('delegate1');

    const result = await executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get buckets by voter successfully', async () => {
    const mockResponse = { buckets: [] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBucketsByVoter')
      .mockReturnValueOnce('io1abc123');

    const result = await executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get delegate buckets successfully', async () => {
    const mockResponse = { analytics: {} };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getDelegateBuckets')
      .mockReturnValueOnce('delegate1')
      .mockReturnValueOnce(100);

    const result = await executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCandidates');

    const result = await executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getCandidates');

    await expect(executeDelegateOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});
});
