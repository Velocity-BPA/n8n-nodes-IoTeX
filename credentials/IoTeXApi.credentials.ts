import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IoTeXApi implements ICredentialType {
	name = 'ioTeXApi';
	displayName = 'IoTeX API';
	documentationUrl = 'https://docs.iotex.io/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your IoTeX API key from the developer portal',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://babel-api.mainnet.iotex.io',
			description: 'The base URL for the IoTeX API',
		},
	];
}