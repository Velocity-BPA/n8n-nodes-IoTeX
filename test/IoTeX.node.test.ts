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
describe('BlockchainData Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getChainMeta', () => {
    it('should get chain metadata successfully', async () => {
      const mockResponse = {
        chainMeta: {
          height: '12345',
          numActions: '67890',
          epoch: {
            num: '100',
            height: '12345',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getChainMeta';
        return {};
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://babel-api.mainnet.iotex.io/api/core/getChainMeta',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: {},
        json: true,
      });
    });
  });

  describe('getBlockMetas', () => {
    it('should get block metadata by index successfully', async () => {
      const mockResponse = {
        blkMetas: [
          {
            hash: 'test-hash',
            height: '100',
            timestamp: '2023-01-01T00:00:00Z',
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getBlockMetas';
        if (param === 'byIndex') return { start: 100, count: 1 };
        if (param === 'byHash') return '';
        if (param === 'count') return 1;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getAccount', () => {
    it('should get account information successfully', async () => {
      const mockResponse = {
        accountMeta: {
          address: 'io1test',
          balance: '1000000000000000000',
          nonce: '1',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getAccount';
        if (param === 'address') return 'io1test';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://babel-api.mainnet.iotex.io/api/core/getAccount',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key',
        },
        body: {
          address: 'io1test',
        },
        json: true,
      });
    });
  });

  describe('getReceiptByAction', () => {
    it('should get transaction receipt successfully', async () => {
      const mockResponse = {
        receiptInfo: {
          receipt: {
            status: 1,
            blkHeight: '12345',
            gasConsumed: '10000',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getReceiptByAction';
        if (param === 'actionHash') return 'test-action-hash';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      const error = new Error('API Error');
      
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getChainMeta';
        return {};
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });

    it('should throw error for unknown operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'unknownOperation';
        return {};
      });

      await expect(executeBlockchainDataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      )).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('SmartContracts Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('sendAction', () => {
    it('should successfully send action to blockchain', async () => {
      const mockAction = {
        core: {
          version: 1,
          nonce: '1',
          gasLimit: '10000',
          gasPrice: '1000000000000',
          execution: {
            contract: 'io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw',
            amount: '0',
            data: '0x123456',
          },
        },
        senderPubKey: '04abc123',
        signature: '0xdef456',
      };
      
      const mockResponse = {
        actionHash: '0x123abc456def',
        success: true,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'sendAction';
        if (paramName === 'action') return mockAction;
        return '';
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
        url: 'https://babel-api.mainnet.iotex.io/api/core/sendAction',
        headers: {
          'X-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: { action: mockAction },
        json: true,
      });
    });
  });

  describe('estimateGasForAction', () => {
    it('should successfully estimate gas for action', async () => {
      const mockAction = {
        core: {
          execution: {
            contract: 'io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw',
            amount: '0',
            data: '0x123456',
          },
        },
      };
      
      const mockResponse = {
        gas: '21000',
        intrinsicGas: '10000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'estimateGasForAction';
        if (paramName === 'action') return mockAction;
        return '';
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

  describe('readContract', () => {
    it('should successfully read contract state', async () => {
      const mockAction = {
        core: {
          execution: {
            contract: 'io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw',
            amount: '0',
            data: '0x70a08231000000000000000000000000abc123',
          },
        },
      };
      
      const mockResponse = {
        data: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000',
        receipt: {
          status: 1,
          gasConsumed: '5000',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'readContract';
        if (paramName === 'action') return mockAction;
        return '';
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

  describe('suggestGasPrice', () => {
    it('should successfully get suggested gas price', async () => {
      const mockResponse = {
        gasPrice: '1000000000000',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'suggestGasPrice';
        return '';
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
        url: 'https://babel-api.mainnet.iotex.io/api/core/suggestGasPrice',
        headers: {
          'X-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        body: {},
        json: true,
      });
    });
  });

  describe('getServerMeta', () => {
    it('should successfully get server and network information', async () => {
      const mockResponse = {
        serverMeta: {
          packageVersion: '1.0.0',
          packageCommitID: 'abc123',
          gitStatus: 'clean',
          goVersion: 'go1.18',
          buildTime: '2023-01-01T00:00:00Z',
        },
        chainMeta: {
          height: '12345678',
          numActions: '987654321',
          tps: '100',
          epoch: {
            num: '12345',
            height: '12345000',
            gravityChainStartHeight: '100000',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getServerMeta';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://babel-api.mainnet.iotex.io/api/core/getServerMeta',
        headers: {
          'X-API-KEY': 'test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors correctly', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'suggestGasPrice';
        return '';
      });

      const mockError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      await expect(executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      )).rejects.toThrow('API Error');
    });

    it('should continue on fail when configured', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'suggestGasPrice';
        return '';
      });

      const mockError = new Error('API Error');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });
  });
});

describe('XrcTokens Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  describe('getTokenBalance operation', () => {
    it('should get token balance successfully', async () => {
      const mockResponse = {
        accountMeta: {
          address: 'io1test...',
          balance: '1000000000000000000',
          nonce: 1,
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenBalance';
        if (paramName === 'address') return 'io1test...';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://babel-api.mainnet.iotex.io/api/core/getAccount',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          address: 'io1test...',
        },
        json: true,
      });
    });

    it('should handle errors when getting token balance', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenBalance';
        if (paramName === 'address') return 'io1test...';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow();
    });
  });

  describe('readTokenContract operation', () => {
    it('should read token contract successfully', async () => {
      const mockResponse = {
        receipt: {
          returnValue: 'mock_return_value',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'readTokenContract';
        if (paramName === 'contractAddress') return 'io1contract...';
        if (paramName === 'method') return 'balanceOf';
        if (paramName === 'params') return ['io1test...'];
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('transferTokens operation', () => {
    it('should transfer tokens successfully', async () => {
      const mockResponse = {
        actionHash: '0xtest_hash',
        status: 'success',
      };

      const mockSignedAction = {
        core: {
          version: 1,
          nonce: 1,
          gasLimit: '20000',
          gasPrice: '1000000000000',
        },
        signature: 'mock_signature',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'transferTokens';
        if (paramName === 'signedAction') return mockSignedAction;
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('getTokenMetadata operation', () => {
    it('should get token metadata successfully', async () => {
      const mockResponse = {
        receipt: {
          returnValue: 'mock_metadata',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenMetadata';
        if (paramName === 'contractAddress') return 'io1contract...';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.contractAddress).toBe('io1contract...');
      expect(result[0].json.metadata).toBeDefined();
    });
  });

  describe('getTokenSupply operation', () => {
    it('should get token supply successfully', async () => {
      const mockResponse = {
        receipt: {
          returnValue: '1000000000000000000000',
        },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getTokenSupply';
        if (paramName === 'contractAddress') return 'io1contract...';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeXrcTokensOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('DeviceRegistry Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  test('should register device successfully', async () => {
    const mockDeviceAction = {
      deviceId: 'device123',
      owner: '0x1234567890123456789012345678901234567890',
      metadata: { type: 'sensor', location: 'warehouse' },
      gasLimit: '100000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'registerDevice';
        case 'deviceAction':
          return mockDeviceAction;
        default:
          return undefined;
      }
    });

    const mockResponse = {
      success: true,
      txHash: '0xabcdef123456789',
      deviceId: 'device123',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDeviceRegistryOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.data).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/sendAction',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'test-api-key',
      },
      body: {
        action: mockDeviceAction,
      },
      json: true,
    });
  });

  test('should get device info successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getDeviceInfo';
        case 'deviceId':
          return 'device123';
        case 'contractAddress':
          return '0x1234567890123456789012345678901234567890';
        case 'methodName':
          return 'getDevice';
        case 'methodParams':
          return ['device123'];
        default:
          return undefined;
      }
    });

    const mockResponse = {
      deviceId: 'device123',
      owner: '0x1234567890123456789012345678901234567890',
      status: 'active',
      metadata: { type: 'sensor' },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDeviceRegistryOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.data).toEqual(mockResponse);
  });

  test('should list devices successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'listDevices';
        case 'ownerAddress':
          return '0x1234567890123456789012345678901234567890';
        case 'contractAddress':
          return '0x1234567890123456789012345678901234567890';
        case 'methodName':
          return 'getDevicesByOwner';
        case 'methodParams':
          return ['0x1234567890123456789012345678901234567890'];
        default:
          return undefined;
      }
    });

    const mockResponse = {
      devices: ['device123', 'device456', 'device789'],
      total: 3,
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDeviceRegistryOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.data).toEqual(mockResponse);
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getDeviceInfo';
        case 'deviceId':
          return 'device123';
        case 'contractAddress':
          return 'invalid-address';
        default:
          return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid contract address'));

    const result = await executeDeviceRegistryOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(false);
    expect(result[0].json.error).toBe('Invalid contract address');
  });

  test('should get device metrics with time range', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation':
          return 'getDeviceMetrics';
        case 'deviceId':
          return 'device123';
        case 'contractAddress':
          return '0x1234567890123456789012345678901234567890';
        case 'timeRange':
          return { start: 1640995200, end: 1641081600 };
        case 'methodName':
          return 'getDeviceMetrics';
        case 'methodParams':
          return ['device123', 1640995200, 1641081600];
        default:
          return undefined;
      }
    });

    const mockResponse = {
      deviceId: 'device123',
      metrics: {
        uptime: 0.99,
        dataPoints: 1500,
        lastUpdate: 1641081600,
      },
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDeviceRegistryOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.success).toBe(true);
    expect(result[0].json.data).toEqual(mockResponse);
  });
});

describe('PebbleTrackers Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  test('should get Pebble data successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getPebbleData',
        deviceId: 'pebble-001',
        dataType: 'temperature',
        timeRange: '24h',
      };
      return params[paramName];
    });

    const mockResponse = {
      deviceId: 'pebble-001',
      dataType: 'temperature',
      values: [
        { timestamp: 1640995200, value: 22.5 },
        { timestamp: 1640998800, value: 23.1 },
      ],
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/readContract',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        contractAddress: 'pebble-data-contract',
        abi: 'getPebbleData',
        method: 'getPebbleData',
        args: ['pebble-001', 'temperature', '24h'],
      },
      json: true,
    });
  });

  test('should submit Pebble data successfully', async () => {
    const dataAction = {
      deviceId: 'pebble-001',
      sensorData: { temperature: 25.3 },
      signature: 'signature-hash',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'submitPebbleData',
        dataAction: dataAction,
      };
      return params[paramName];
    });

    const mockResponse = {
      txHash: '0x123abc',
      status: 'success',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/sendAction',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: {
        action: dataAction,
        gasLimit: '100000',
        gasPrice: '1000000000',
      },
      json: true,
    });
  });

  test('should get Pebble location successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getPebbleLocation',
        deviceId: 'pebble-001',
        timestamp: 1640995200,
      };
      return params[paramName];
    });

    const mockResponse = {
      deviceId: 'pebble-001',
      latitude: 37.7749,
      longitude: -122.4194,
      timestamp: 1640995200,
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should get Pebble rewards successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getPebbleRewards',
        deviceId: 'pebble-001',
      };
      return params[paramName];
    });

    const mockResponse = {
      deviceId: 'pebble-001',
      totalRewards: '1000000000000000000',
      claimedRewards: '500000000000000000',
      pendingRewards: '500000000000000000',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should validate Pebble proof successfully', async () => {
    const proofData = {
      location: { lat: 37.7749, lng: -122.4194 },
      timestamp: 1640995200,
      signature: 'proof-signature',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'validatePebbleProof',
        deviceId: 'pebble-001',
        proofData: proofData,
      };
      return params[paramName];
    });

    const mockResponse = {
      valid: true,
      score: 95,
      verificationHash: '0xabc123',
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getPebbleData',
        deviceId: 'invalid-device',
        dataType: 'temperature',
        timeRange: '24h',
      };
      return params[paramName];
    });

    const error = new Error('Device not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    await expect(
      executePebbleTrackersOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Device not found');
  });

  test('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      const params: any = {
        operation: 'getPebbleData',
        deviceId: 'invalid-device',
        dataType: 'temperature',
        timeRange: '24h',
      };
      return params[paramName];
    });

    const error = new Error('Device not found');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);

    const result = await executePebbleTrackersOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Device not found' });
  });
});

describe('W3bstreamProjects Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
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

  test('should create project successfully', async () => {
    const mockResponse = { projectId: 'test-project-id', status: 'created' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createProject';
      if (param === 'projectAction') return { name: 'Test Project' };
      return '';
    });

    const result = await executeW3bstreamProjectsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/sendAction',
      headers: {
        'X-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: { name: 'Test Project' },
      json: true,
    });
  });

  test('should get project info successfully', async () => {
    const mockResponse = { projectId: 'test-project-id', name: 'Test Project' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getProjectInfo';
      if (param === 'projectId') return 'test-project-id';
      return '';
    });

    const result = await executeW3bstreamProjectsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/readContract',
      headers: {
        'X-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: { projectId: 'test-project-id' },
      json: true,
    });
  });

  test('should list projects successfully', async () => {
    const mockResponse = { projects: [{ id: 'project1' }, { id: 'project2' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'listProjects';
      if (param === 'ownerAddress') return '0x1234567890abcdef';
      return '';
    });

    const result = await executeW3bstreamProjectsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/readContract',
      headers: {
        'X-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: { ownerAddress: '0x1234567890abcdef' },
      json: true,
    });
  });

  test('should process real world data successfully', async () => {
    const mockResponse = { transactionId: 'tx123', status: 'processed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'processRealWorldData';
      if (param === 'dataAction') return { data: 'sensor-data', timestamp: 1234567890 };
      return '';
    });

    const result = await executeW3bstreamProjectsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://babel-api.mainnet.iotex.io/api/core/sendAction',
      headers: {
        'X-API-KEY': 'test-api-key',
        'Content-Type': 'application/json',
      },
      body: { data: 'sensor-data', timestamp: 1234567890 },
      json: true,
    });
  });

  test('should handle API error gracefully', async () => {
    const mockError = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getProjectInfo';
      if (param === 'projectId') return 'test-project-id';
      return '';
    });
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeW3bstreamProjectsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'unknownOperation';
      return '';
    });

    await expect(
      executeW3bstreamProjectsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});
});
