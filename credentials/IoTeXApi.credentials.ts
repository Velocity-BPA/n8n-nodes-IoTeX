import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IoTeXApi implements ICredentialType {
	name = 'ioTeXApi';

	displayName = 'IoTeX API';

	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://iotexapi.com',
			required: true,
			description: 'The base URL for the IoTeX API',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: false,
			description: 'API key for authenticated requests. Leave empty for public endpoints.',
		},
	];
}