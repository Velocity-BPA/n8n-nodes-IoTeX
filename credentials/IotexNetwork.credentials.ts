/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IotexNetwork implements ICredentialType {
	name = 'iotexNetwork';
	displayName = 'IoTeX Network';
	documentationUrl = 'https://docs.iotex.io/';
	properties: INodeProperties[] = [
		{
			displayName: 'Network',
			name: 'network',
			type: 'options',
			options: [
				{
					name: 'IoTeX Mainnet',
					value: 'mainnet',
				},
				{
					name: 'IoTeX Testnet',
					value: 'testnet',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'mainnet',
			description: 'The IoTeX network to connect to',
		},
		{
			displayName: 'HTTP Endpoint',
			name: 'httpEndpoint',
			type: 'string',
			default: '',
			placeholder: 'https://babel-api.mainnet.iotex.io',
			description: 'Custom HTTP RPC endpoint URL',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},
		{
			displayName: 'gRPC Endpoint',
			name: 'grpcEndpoint',
			type: 'string',
			default: '',
			placeholder: 'api.mainnet.iotex.one:443',
			description: 'gRPC endpoint for native IoTeX operations (optional)',
			displayOptions: {
				show: {
					network: ['custom'],
				},
			},
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: '0x...',
			description: 'Private key in hex format for signing transactions (keep this secure!)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'API key for enhanced RPC providers (optional)',
		},
	];

	// Test the connection
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.network === "mainnet" ? "https://babel-api.mainnet.iotex.io" : $credentials.network === "testnet" ? "https://babel-api.testnet.iotex.io" : $credentials.httpEndpoint}}',
			url: '',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'eth_chainId',
				params: [],
				id: 1,
			}),
		},
	};
}
