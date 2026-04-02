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
        baseUrl: 'https://babel-api.mainnet.iotex.io' 
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

  it('should get account details successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('io1testaddress123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      accountMeta: { address: 'io1testaddress123', balance: '1000000000000000000' }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/accounts',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify({ address: 'io1testaddress123' }),
      json: true
    });
  });

  it('should get account balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountBalance')
      .mockReturnValueOnce('io1testaddress123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      balance: '1000000000000000000'
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/accounts/balance',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify({ address: 'io1testaddress123' }),
      json: true
    });
  });

  it('should get account metadata successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountMeta')
      .mockReturnValueOnce('io1testaddress123');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      accountMeta: { nonce: '1', pendingNonce: '1' }
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/accounts/meta',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify({ address: 'io1testaddress123' }),
      json: true
    });
  });

  it('should get account actions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccountActions')
      .mockReturnValueOnce('io1testaddress123')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actions: [{ hash: '0x123abc', blockHeight: '100' }]
    });

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/accounts/actions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-key'
      },
      body: JSON.stringify({ address: 'io1testaddress123', start: 0, count: 10 }),
      json: true
    });
  });

  it('should handle errors appropriately', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAccount')
      .mockReturnValueOnce('invalid-address');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address format'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid address format');
  });
});

describe('Action Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://babel-api.mainnet.iotex.io'
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

  it('should get actions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActions')
      .mockReturnValueOnce('hash123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actionInfo: [{ hash: 'hash123' }]
    });

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ actionInfo: [{ hash: 'hash123' }] });
  });

  it('should get action by hash successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActionByHash')
      .mockReturnValueOnce('hash123')
      .mockReturnValueOnce(false);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actionInfo: { hash: 'hash123', status: 'confirmed' }
    });

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.actionInfo.hash).toBe('hash123');
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getActionByHash');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get actions by address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActionsByAddress')
      .mockReturnValueOnce('io1address123')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actionInfo: [{ hash: 'action1' }, { hash: 'action2' }]
    });

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.actionInfo).toHaveLength(2);
  });

  it('should get actions by block successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getActionsByBlock')
      .mockReturnValueOnce('block123')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(5);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actionInfo: [{ hash: 'action1' }]
    });

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.actionInfo).toHaveLength(1);
  });

  it('should get unconfirmed actions by address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUnconfirmedActionsByAddress')
      .mockReturnValueOnce('io1address123')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(10);
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      actionInfo: []
    });

    const result = await executeActionOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.actionInfo).toEqual([]);
  });
});

describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://babel-api.mainnet.iotex.io',
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
    it('should get block metadata by index successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockMetas')
        .mockReturnValueOnce('byIndex')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(1);

      const mockResponse = {
        blkMetas: [{ height: 100, hash: '0x123...', timestamp: '2023-01-01T00:00:00Z' }]
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle errors when getting block metadata', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockMetas')
        .mockReturnValueOnce('byHash')
        .mockReturnValueOnce('invalid-hash');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid block hash'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Invalid block hash');
    });
  });

  describe('getBlocks operation', () => {
    it('should get raw block data successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce('byIndex')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(1);

      const mockResponse = {
        blks: [{ block: { header: { height: 100 }, body: { actions: [] } } }]
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getChainMeta operation', () => {
    it('should get chain metadata successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getChainMeta');

      const mockResponse = {
        chainMeta: { height: 1000000, numActions: 5000000, tps: 100 }
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('suggestGasPrice operation', () => {
    it('should get suggested gas price successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('suggestGasPrice');

      const mockResponse = {
        gasPrice: '1000000000000'
      };
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('suggestGasPrice');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      await expect(
        executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Network error');
    });
  });
});

describe('Token Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key',
				baseUrl: 'https://babel-api.mainnet.iotex.io'
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

	it('should get token balance successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenBalance')
			.mockReturnValueOnce('io1abc123def456')
			.mockReturnValueOnce('io1token123contract');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			balance: '1000000000000000000',
			decimals: 18
		});

		const result = await executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.balance).toBe('1000000000000000000');
	});

	it('should get token metadata successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenMetadata')
			.mockReturnValueOnce('io1token123contract');

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			name: 'Test Token',
			symbol: 'TEST',
			decimals: 18,
			totalSupply: '1000000000000000000000000'
		});

		const result = await executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.name).toBe('Test Token');
	});

	it('should get token transfers successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenTransfers')
			.mockReturnValueOnce('io1abc123def456')
			.mockReturnValueOnce('io1token123contract')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(10);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			transfers: [
				{
					from: 'io1from123',
					to: 'io1to456',
					amount: '1000000000000000000',
					txHash: '0xabc123'
				}
			]
		});

		const result = await executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.transfers).toBeDefined();
	});

	it('should get token holders successfully', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenHolders')
			.mockReturnValueOnce('io1token123contract')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(100);

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
			holders: [
				{
					address: 'io1holder123',
					balance: '1000000000000000000'
				}
			]
		});

		const result = await executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.holders).toBeDefined();
	});

	it('should handle API errors', async () => {
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenBalance')
			.mockReturnValueOnce('io1abc123def456')
			.mockReturnValueOnce('io1token123contract');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		)).rejects.toThrow('API Error');
	});

	it('should continue on fail when configured', async () => {
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getTokenBalance')
			.mockReturnValueOnce('io1abc123def456')
			.mockReturnValueOnce('io1token123contract');

		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeTokenOperations.call(
			mockExecuteFunctions, 
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('API Error');
	});
});

describe('Analytics Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://babel-api.mainnet.iotex.io',
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

	describe('getChainMeta operation', () => {
		it('should get chain statistics successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getChainMeta');

			const mockResponse = {
				result: {
					height: '12345678',
					supply: '9999999999',
					totalCirculatingSupply: '8888888888',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAnalyticsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/analytics/chain',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: {
					method: 'getChainMeta',
					params: {},
				},
				json: true,
			});
		});

		it('should handle getChainMeta errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getChainMeta');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAnalyticsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('readCandidates operation', () => {
		it('should get delegates successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('readCandidates')
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(10);

			const mockResponse = {
				result: {
					candidates: [
						{ name: 'delegate1', address: 'io1...' },
						{ name: 'delegate2', address: 'io2...' },
					],
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAnalyticsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/analytics/delegates',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: {
					method: 'readCandidates',
					params: {
						offset: 0,
						limit: 10,
					},
				},
				json: true,
			});
		});
	});

	describe('getEpochMeta operation', () => {
		it('should get epoch data successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEpochMeta')
				.mockReturnValueOnce(1234);

			const mockResponse = {
				result: {
					epochNumber: '1234',
					height: '12345',
					gravityChainStartHeight: '67890',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAnalyticsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/analytics/productivity',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: {
					method: 'getEpochMeta',
					params: {
						epochNumber: '1234',
					},
				},
				json: true,
			});
		});
	});

	describe('getAccount operation', () => {
		it('should get staking rewards successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAccount')
				.mockReturnValueOnce('io1test123456789');

			const mockResponse = {
				result: {
					address: 'io1test123456789',
					balance: '1000000000000000000000',
					nonce: '5',
					pendingNonce: '6',
				},
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAnalyticsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://babel-api.mainnet.iotex.io/v1/analytics/rewards',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer test-key',
				},
				body: {
					method: 'getAccount',
					params: {
						address: 'io1test123456789',
					},
				},
				json: true,
			});
		});
	});
});

describe('Staking Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://babel-api.mainnet.iotex.io' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get staking buckets successfully', async () => {
    const mockResponse = { buckets: [{ index: 1, candidateName: 'test', votes: '1000' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBuckets')
      .mockReturnValueOnce('io1testaddress')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/staking/buckets',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        voterAddress: 'io1testaddress',
        offset: 0,
        limit: 100,
      },
      json: true,
    });
  });

  it('should get candidates successfully', async () => {
    const mockResponse = { candidates: [{ name: 'test', votes: '1000' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCandidates')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(true);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/staking/candidates',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        offset: 0,
        limit: 50,
        includeAll: true,
      },
      json: true,
    });
  });

  it('should get voter buckets successfully', async () => {
    const mockResponse = { buckets: [{ index: 1, votes: '1000' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getVoterBuckets')
      .mockReturnValueOnce('io1testvoter');

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/staking/buckets/voter',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        voterAddress: 'io1testvoter',
      },
      json: true,
    });
  });

  it('should get candidate buckets successfully', async () => {
    const mockResponse = { buckets: [{ index: 1, voterAddress: 'io1voter' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCandidateBuckets')
      .mockReturnValueOnce('testcandidate')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(100);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/v1/staking/buckets/candidate',
      headers: {
        'X-API-Key': 'test-key',
        'Content-Type': 'application/json',
      },
      body: {
        candidateName: 'testcandidate',
        offset: 0,
        limit: 100,
      },
      json: true,
    });
  });

  it('should handle API errors gracefully', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getBuckets');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(
      executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
