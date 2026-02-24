import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IoTeXApi implements ICredentialType {
	name = 'ioTeXApi';
	displayName = 'IoTeX API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'API key for IoTeX blockchain access. Some endpoints are public and don\'t require authentication.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://babel-api.mainnet.iotex.io',
			required: true,
			description: 'Base URL for IoTeX API endpoints',
		},
	];
}