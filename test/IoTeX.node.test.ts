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

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
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

  test('should get account details successfully', async () => {
    const mockAccountData = {
      address: 'io1test123',
      balance: '1000000000000000000',
      nonce: 10,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getAccount';
      if (paramName === 'address') return 'io1test123';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockAccountData);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockAccountData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/accounts/io1test123',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get account balance successfully', async () => {
    const mockBalanceData = {
      balance: '1000000000000000000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBalance';
      if (paramName === 'address') return 'io1test123';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBalanceData);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBalanceData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/accounts/io1test123/balance',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get account transactions with pagination', async () => {
    const mockTransactionsData = {
      transactions: [
        { hash: 'tx1', amount: '100' },
        { hash: 'tx2', amount: '200' },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
      if (paramName === 'operation') return 'getAccountTransactions';
      if (paramName === 'address') return 'io1test123';
      if (paramName === 'limit') return 50;
      if (paramName === 'offset') return 10;
      return defaultValue;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactionsData);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockTransactionsData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/accounts/io1test123/transactions',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        limit: 50,
        offset: 10,
      },
      json: true,
    });
  });

  test('should get account actions with pagination', async () => {
    const mockActionsData = {
      actions: [
        { actionHash: 'action1', actionType: 'transfer' },
        { actionHash: 'action2', actionType: 'execution' },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
      if (paramName === 'operation') return 'getAccountActions';
      if (paramName === 'address') return 'io1test123';
      if (paramName === 'limit') return 25;
      if (paramName === 'offset') return 5;
      return defaultValue;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockActionsData);

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockActionsData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/accounts/io1test123/actions',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        limit: 25,
        offset: 5,
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getAccount';
      if (paramName === 'address') return 'invalid-address';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue({
      httpCode: 404,
      message: 'Account not found',
    });

    const items = [{ json: {} }];

    await expect(executeAccountsOperations.call(mockExecuteFunctions, items)).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getAccount';
      if (paramName === 'address') return 'invalid-address';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeAccountsOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
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
      height: 1000,
      hash: '0x123abc',
      timestamp: '2023-01-01T00:00:00Z',
      transactions: [],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockByHeight';
      if (paramName === 'height') return 1000;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockData);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlockData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/1000',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get block by hash successfully', async () => {
    const mockBlockData = {
      height: 1000,
      hash: '0x123abc',
      timestamp: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockByHash';
      if (paramName === 'hash') return '0x123abc';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockData);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlockData);
  });

  test('should get blocks list with pagination', async () => {
    const mockBlocksData = {
      blocks: [
        { height: 1000, hash: '0x123' },
        { height: 999, hash: '0x456' },
      ],
      total: 100,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, index: number, defaultValue?: any) => {
      if (paramName === 'operation') return 'getBlocks';
      if (paramName === 'limit') return 10;
      if (paramName === 'offset') return 0;
      return defaultValue;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocksData);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockBlocksData);
  });

  test('should get latest block successfully', async () => {
    const mockLatestBlock = {
      height: 2000,
      hash: '0xlatest',
      timestamp: '2023-12-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getLatestBlock';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockLatestBlock);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockLatestBlock);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/blocks/latest',
      headers: {
        'X-API-Key': 'test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get block transactions successfully', async () => {
    const mockTransactions = {
      transactions: [
        { hash: '0xtx1', type: 'transfer' },
        { hash: '0xtx2', type: 'execution' },
      ],
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockTransactions';
      if (paramName === 'height') return 1500;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactions);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockTransactions);
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getLatestBlock';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  test('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(
      executeBlocksOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transactions Resource', () => {
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

  describe('getTransaction operation', () => {
    it('should get transaction by hash successfully', async () => {
      const mockTransaction = {
        hash: '0x123abc',
        from: '0xfrom',
        to: '0xto',
        value: '1000',
        status: 'confirmed',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getTransaction';
        if (paramName === 'hash') return '0x123abc';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransaction);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/transactions/0x123abc',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockTransaction, pairedItem: { item: 0 } }]);
    });

    it('should handle error when getting transaction', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getTransaction';
        if (paramName === 'hash') return '0xinvalid';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));

      await expect(executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Transaction not found');
    });
  });

  describe('getTransactions operation', () => {
    it('should get list of transactions with parameters', async () => {
      const mockTransactions = {
        transactions: [
          { hash: '0x123', from: '0xfrom1', to: '0xto1' },
          { hash: '0x456', from: '0xfrom2', to: '0xto2' },
        ],
        total: 2,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getTransactions';
        if (paramName === 'limit') return 10;
        if (paramName === 'offset') return 0;
        if (paramName === 'address') return '0xaddress';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockTransactions);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/transactions?limit=10&offset=0&address=0xaddress',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockTransactions, pairedItem: { item: 0 } }]);
    });
  });

  describe('sendTransaction operation', () => {
    it('should send transaction successfully', async () => {
      const mockResponse = {
        txHash: '0x789def',
        status: 'pending',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'sendTransaction';
        if (paramName === 'signedTransaction') return '0xsignedtx';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/transactions',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          signedTransaction: '0xsignedtx',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('getTransactionReceipt operation', () => {
    it('should get transaction receipt successfully', async () => {
      const mockReceipt = {
        transactionHash: '0x123abc',
        status: 1,
        gasUsed: '21000',
        logs: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getTransactionReceipt';
        if (paramName === 'hash') return '0x123abc';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockReceipt);

      const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/transactions/0x123abc/receipt',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{ json: mockReceipt, pairedItem: { item: 0 } }]);
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

  test('should get action by hash successfully', async () => {
    const mockActionData = {
      hash: 'test-hash',
      blockHeight: 123456,
      timestamp: '2023-01-01T00:00:00Z',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAction';
      if (param === 'hash') return 'test-hash';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockActionData);

    const result = await executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockActionData);
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

  test('should get actions list successfully', async () => {
    const mockActionsData = {
      actions: [
        { hash: 'hash1', blockHeight: 123456 },
        { hash: 'hash2', blockHeight: 123457 },
      ],
      total: 2,
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getActions';
      if (param === 'limit') return 10;
      if (param === 'offset') return 0;
      if (param === 'address') return 'test-address';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockActionsData);

    const result = await executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockActionsData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/actions?limit=10&offset=0&address=test-address',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should send action successfully', async () => {
    const mockActionData = { type: 'transfer', amount: '1000' };
    const mockResponse = { txHash: 'new-tx-hash', success: true };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'sendAction';
      if (param === 'action') return mockActionData;
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://iotexapi.com/api/actions',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      body: mockActionData,
      json: true,
    });
  });

  test('should get action receipt successfully', async () => {
    const mockReceiptData = {
      hash: 'test-hash',
      status: 'success',
      gasUsed: '21000',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getActionReceipt';
      if (param === 'hash') return 'test-hash';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockReceiptData);

    const result = await executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockReceiptData);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/actions/test-hash/receipt',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    (mockError as any).httpCode = 404;

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAction';
      if (param === 'hash') return 'invalid-hash';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    )).rejects.toThrow('API Error');
  });

  test('should continue on fail when configured', async () => {
    const mockError = new Error('Network Error');
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getAction';
      if (param === 'hash') return 'test-hash';
      return null;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    const result = await executeActionsOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network Error' });
    expect(result[0].pairedItem).toEqual({ item: 0 });
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

  describe('callContract operation', () => {
    it('should call contract successfully', async () => {
      const mockResponse = {
        success: true,
        result: '0x123',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'callContract';
          case 'contractAddress': return '0xabcd1234';
          case 'method': return 'balanceOf';
          case 'params': return '["0x5678"]';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/contracts/call',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          contractAddress: '0xabcd1234',
          method: 'balanceOf',
          params: ['0x5678'],
        },
        json: true,
      });
    });

    it('should handle invalid JSON params', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'callContract';
          case 'contractAddress': return '0xabcd1234';
          case 'method': return 'balanceOf';
          case 'params': return 'invalid-json';
          default: return '';
        }
      });

      await expect(
        executeSmartContractsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid JSON in params parameter');
    });
  });

  describe('executeContract operation', () => {
    it('should execute contract successfully', async () => {
      const mockResponse = {
        success: true,
        transactionHash: '0xabc123',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'executeContract';
          case 'contractAddress': return '0xabcd1234';
          case 'method': return 'transfer';
          case 'params': return '["0x5678", "100"]';
          case 'gasLimit': return 500000;
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/contracts/execute',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          contractAddress: '0xabcd1234',
          method: 'transfer',
          params: ['0x5678', '100'],
          gasLimit: 500000,
        },
        json: true,
      });
    });
  });

  describe('getContract operation', () => {
    it('should get contract information successfully', async () => {
      const mockResponse = {
        address: '0xabcd1234',
        name: 'TestContract',
        bytecode: '0x608060405234801561001057600080fd5b50',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getContract';
          case 'address': return '0xabcd1234';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/contracts/0xabcd1234',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });

  describe('getContractABI operation', () => {
    it('should get contract ABI successfully', async () => {
      const mockResponse = {
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getContractABI';
          case 'address': return '0xabcd1234';
          default: return '';
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSmartContractsOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 }
        }
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/contracts/0xabcd1234/abi',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        json: true,
      });
    });
  });
});

describe('Delegates Resource', () => {
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

  test('should get delegates successfully', async () => {
    const mockResponse = {
      delegates: [
        { name: 'delegate1', votes: '1000000' },
        { name: 'delegate2', votes: '2000000' }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegates';
      if (param === 'limit') return 50;
      if (param === 'offset') return 0;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/delegates',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        limit: 50,
        offset: 0,
      },
      json: true,
    });
  });

  test('should get delegate by name successfully', async () => {
    const mockResponse = {
      name: 'test-delegate',
      votes: '5000000',
      rank: 1
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegate';
      if (param === 'name') return 'test-delegate';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/delegates/test-delegate',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get delegate votes successfully', async () => {
    const mockResponse = {
      votes: [
        { voter: 'voter1', amount: '100000' },
        { voter: 'voter2', amount: '200000' }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegateVotes';
      if (param === 'name') return 'test-delegate';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/delegates/test-delegate/votes',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });
  });

  test('should get delegate rankings successfully', async () => {
    const mockResponse = {
      rankings: [
        { rank: 1, name: 'delegate1', votes: '10000000' },
        { rank: 2, name: 'delegate2', votes: '9000000' }
      ]
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegateRankings';
      if (param === 'limit') return 50;
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(mockResponse);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://iotexapi.com/api/delegates/rankings',
      headers: {
        'Authorization': 'Bearer test-api-key',
        'Content-Type': 'application/json',
      },
      qs: {
        limit: 50,
      },
      json: true,
    });
  });

  test('should handle API errors', async () => {
    const mockError = new Error('API Error');
    (mockError as any).httpCode = 404;

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegates';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

    await expect(
      executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('API Error');
  });

  test('should continue on fail when enabled', async () => {
    const mockError = new Error('Network Error');

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDelegates';
      return undefined;
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeDelegatesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'Network Error' });
  });
});

describe('Staking Resource', () => {
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

  describe('getStakingBuckets', () => {
    it('should get staking buckets successfully', async () => {
      const mockResponse = {
        buckets: [
          { id: '1', amount: '1000', voter: '0x123...', candidate: '0x456...', duration: 91 },
          { id: '2', amount: '2000', voter: '0x789...', candidate: '0xabc...', duration: 182 }
        ],
        total: 2
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'getStakingBuckets';
          case 'limit':
            return 100;
          case 'offset':
            return 0;
          case 'voter':
            return '';
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/staking/buckets?limit=100&offset=0',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle error when getting staking buckets fails', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'getStakingBuckets';
        return param === 'limit' ? 100 : param === 'offset' ? 0 : '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getStakingBucket', () => {
    it('should get staking bucket by ID successfully', async () => {
      const mockResponse = {
        id: '12345',
        amount: '1000',
        voter: '0x123...',
        candidate: '0x456...',
        duration: 91,
        createdAt: '2024-01-01T00:00:00Z'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        return param === 'operation' ? 'getStakingBucket' : param === 'id' ? '12345' : null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://iotexapi.com/api/staking/buckets/12345',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('createStake', () => {
    it('should create stake successfully', async () => {
      const mockResponse = {
        transactionHash: '0xabc123...',
        bucketId: '67890',
        status: 'pending'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation':
            return 'createStake';
          case 'amount':
            return '1000';
          case 'candidate':
            return '0x456...';
          case 'duration':
            return 91;
          default:
            return null;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/staking/stake',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          amount: '1000',
          candidate: '0x456...',
          duration: 91,
        },
      });
    });
  });

  describe('unstake', () => {
    it('should unstake successfully', async () => {
      const mockResponse = {
        transactionHash: '0xdef456...',
        bucketId: '12345',
        status: 'pending'
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        return param === 'operation' ? 'unstake' : param === 'bucketId' ? '12345' : null;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeStakingOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://iotexapi.com/api/staking/unstake',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
        body: {
          bucketId: '12345',
        },
      });
    });
  });
});

describe('ChainMetadata Resource', () => {
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

  describe('getChainMetadata', () => {
    it('should get chain metadata successfully', async () => {
      const mockResponse = {
        chainId: 4689,
        networkName: 'IoTeX Mainnet',
        blockTime: 5,
        consensusScheme: 'RPOS',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainMetadata';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getChainMetadata error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainMetadata';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeChainMetadataOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getChainStats', () => {
    it('should get chain statistics successfully', async () => {
      const mockResponse = {
        totalBlocks: 1000000,
        totalTransactions: 5000000,
        totalAccounts: 250000,
        tps: 100,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getChainStats error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getChainStats';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Stats API Error'));

      await expect(
        executeChainMetadataOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Stats API Error');
    });
  });

  describe('getNetworkInfo', () => {
    it('should get network information successfully', async () => {
      const mockResponse = {
        networkId: 4689,
        protocolVersion: '1.0.0',
        nodeCount: 100,
        peers: 50,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getNetworkInfo';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getNetworkInfo error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getNetworkInfo';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network API Error'));

      await expect(
        executeChainMetadataOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Network API Error');
    });
  });

  describe('getCurrentEpoch', () => {
    it('should get current epoch information successfully', async () => {
      const mockResponse = {
        epochNumber: 12345,
        height: 1000000,
        gravityChainStartHeight: 999950,
        validators: 36,
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCurrentEpoch';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeChainMetadataOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle getCurrentEpoch error', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getCurrentEpoch';
        return undefined;
      });
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Epoch API Error'));

      await expect(
        executeChainMetadataOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Epoch API Error');
    });
  });

  it('should handle unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'unknownOperation';
      return undefined;
    });

    await expect(
      executeChainMetadataOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });

  it('should continue on fail when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getChainMetadata';
      return undefined;
    });
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeChainMetadataOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toEqual([
      {
        json: { error: 'API Error' },
        pairedItem: { item: 0 },
      },
    ]);
  });
});
});
