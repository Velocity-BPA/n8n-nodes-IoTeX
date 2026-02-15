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
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API key for IoTeX API authentication',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://iotexapi.com',
			required: true,
			description: 'Base URL for the IoTeX API',
		},
	];
}