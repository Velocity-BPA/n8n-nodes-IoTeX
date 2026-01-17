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

export class W3bstream implements ICredentialType {
	name = 'w3bstream';
	displayName = 'W3bstream';
	documentationUrl = 'https://docs.w3bstream.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Staging',
					value: 'staging',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'production',
			description: 'W3bstream environment',
		},
		{
			displayName: 'W3bstream Endpoint',
			name: 'endpoint',
			type: 'string',
			default: '',
			placeholder: 'https://w3bstream.com/api',
			description: 'Custom W3bstream API endpoint',
			displayOptions: {
				show: {
					environment: ['custom'],
				},
			},
		},
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			default: '',
			description: 'Your W3bstream project ID',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'W3bstream API key for authentication',
		},
		{
			displayName: 'Publisher Token',
			name: 'publisherToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Publisher token for sending data to W3bstream',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.environment === "production" ? "https://api.w3bstream.com" : $credentials.environment === "staging" ? "https://staging-api.w3bstream.com" : $credentials.endpoint}}',
			url: '/v1/health',
			method: 'GET',
		},
	};
}
