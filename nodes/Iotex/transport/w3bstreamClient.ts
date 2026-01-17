/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * W3bstream Client Transport
 * 
 * Client for interacting with W3bstream - IoTeX's decentralized off-chain compute layer.
 * W3bstream enables verifiable compute for IoT data using WASM applets and zero-knowledge proofs.
 */

import axios, { AxiosInstance } from 'axios';
import { W3BSTREAM_ENDPOINTS } from '../constants/networks';

/**
 * W3bstream client configuration
 */
export interface W3bstreamClientConfig {
	environment: 'production' | 'staging' | 'custom';
	customEndpoint?: string;
	projectId?: string;
	apiKey?: string;
	publisherToken?: string;
}

/**
 * W3bstream project
 */
export interface W3bstreamProject {
	id: string;
	name: string;
	owner: string;
	description: string;
	status: 'active' | 'paused' | 'deleted';
	createdAt: string;
	updatedAt: string;
}

/**
 * W3bstream applet (WASM module)
 */
export interface W3bstreamApplet {
	id: string;
	projectId: string;
	name: string;
	wasmHash: string;
	status: 'running' | 'stopped' | 'error';
	createdAt: string;
	instances: number;
}

/**
 * W3bstream message
 */
export interface W3bstreamMessage {
	id: string;
	projectId: string;
	appletId: string;
	deviceId: string;
	payload: unknown;
	timestamp: string;
	processed: boolean;
	result?: unknown;
}

/**
 * W3bstream proof
 */
export interface W3bstreamProof {
	id: string;
	projectId: string;
	type: 'zk' | 'tee' | 'risc0';
	proof: string;
	publicInputs: string[];
	verified: boolean;
	timestamp: string;
}

/**
 * W3bstream publisher
 */
export interface W3bstreamPublisher {
	id: string;
	projectId: string;
	name: string;
	key: string;
	permissions: string[];
	createdAt: string;
}

/**
 * W3bstream client class
 */
export class W3bstreamClient {
	private client: AxiosInstance;
	private config: W3bstreamClientConfig;

	constructor(config: W3bstreamClientConfig) {
		this.config = config;
		
		const baseURL = config.customEndpoint || 
			W3BSTREAM_ENDPOINTS[config.environment as keyof typeof W3BSTREAM_ENDPOINTS] ||
			W3BSTREAM_ENDPOINTS.production;
		
		this.client = axios.create({
			baseURL,
			headers: {
				'Content-Type': 'application/json',
				...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
			},
		});
	}

	// ==================== Project Operations ====================

	/**
	 * Get project info
	 */
	async getProject(projectId?: string): Promise<W3bstreamProject> {
		const id = projectId || this.config.projectId;
		if (!id) {
			throw new Error('Project ID required');
		}
		
		const response = await this.client.get(`/v1/projects/${id}`);
		return response.data;
	}

	/**
	 * Create a new project
	 */
	async createProject(
		name: string,
		description: string = '',
	): Promise<W3bstreamProject> {
		const response = await this.client.post('/v1/projects', {
			name,
			description,
		});
		return response.data;
	}

	/**
	 * List projects
	 */
	async listProjects(): Promise<W3bstreamProject[]> {
		const response = await this.client.get('/v1/projects');
		return response.data.projects || [];
	}

	/**
	 * Update project
	 */
	async updateProject(
		projectId: string,
		updates: Partial<Pick<W3bstreamProject, 'name' | 'description'>>,
	): Promise<W3bstreamProject> {
		const response = await this.client.patch(`/v1/projects/${projectId}`, updates);
		return response.data;
	}

	// ==================== Applet Operations ====================

	/**
	 * Deploy an applet
	 */
	async deployApplet(
		projectId: string,
		name: string,
		wasmCode: Buffer | string,
	): Promise<W3bstreamApplet> {
		const formData = new FormData();
		formData.append('name', name);
		formData.append('wasm', new Blob([wasmCode]), 'applet.wasm');
		
		const response = await this.client.post(
			`/v1/projects/${projectId}/applets`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		);
		return response.data;
	}

	/**
	 * Get applet info
	 */
	async getApplet(projectId: string, appletId: string): Promise<W3bstreamApplet> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/applets/${appletId}`,
		);
		return response.data;
	}

	/**
	 * List applets for project
	 */
	async listApplets(projectId: string): Promise<W3bstreamApplet[]> {
		const response = await this.client.get(`/v1/projects/${projectId}/applets`);
		return response.data.applets || [];
	}

	/**
	 * Start applet
	 */
	async startApplet(projectId: string, appletId: string): Promise<W3bstreamApplet> {
		const response = await this.client.post(
			`/v1/projects/${projectId}/applets/${appletId}/start`,
		);
		return response.data;
	}

	/**
	 * Stop applet
	 */
	async stopApplet(projectId: string, appletId: string): Promise<W3bstreamApplet> {
		const response = await this.client.post(
			`/v1/projects/${projectId}/applets/${appletId}/stop`,
		);
		return response.data;
	}

	/**
	 * Delete applet
	 */
	async deleteApplet(projectId: string, appletId: string): Promise<void> {
		await this.client.delete(`/v1/projects/${projectId}/applets/${appletId}`);
	}

	/**
	 * Get applet logs
	 */
	async getAppletLogs(
		projectId: string,
		appletId: string,
		limit: number = 100,
	): Promise<string[]> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/applets/${appletId}/logs`,
			{ params: { limit } },
		);
		return response.data.logs || [];
	}

	// ==================== Message Operations ====================

	/**
	 * Send message to applet
	 */
	async sendMessage(
		projectId: string,
		appletId: string,
		deviceId: string,
		payload: unknown,
	): Promise<W3bstreamMessage> {
		const response = await this.client.post(
			`/v1/projects/${projectId}/applets/${appletId}/messages`,
			{
				deviceId,
				payload,
				timestamp: new Date().toISOString(),
			},
			{
				headers: this.config.publisherToken
					? { 'X-Publisher-Token': this.config.publisherToken }
					: {},
			},
		);
		return response.data;
	}

	/**
	 * Get message history
	 */
	async getMessages(
		projectId: string,
		appletId?: string,
		deviceId?: string,
		limit: number = 100,
	): Promise<W3bstreamMessage[]> {
		const params: Record<string, unknown> = { limit };
		if (appletId) params.appletId = appletId;
		if (deviceId) params.deviceId = deviceId;
		
		const response = await this.client.get(
			`/v1/projects/${projectId}/messages`,
			{ params },
		);
		return response.data.messages || [];
	}

	// ==================== Proof Operations ====================

	/**
	 * Get data proofs
	 */
	async getProofs(
		projectId: string,
		limit: number = 100,
	): Promise<W3bstreamProof[]> {
		const response = await this.client.get(`/v1/projects/${projectId}/proofs`, {
			params: { limit },
		});
		return response.data.proofs || [];
	}

	/**
	 * Verify a proof
	 */
	async verifyProof(
		projectId: string,
		proofId: string,
	): Promise<{ verified: boolean; details?: unknown }> {
		const response = await this.client.post(
			`/v1/projects/${projectId}/proofs/${proofId}/verify`,
		);
		return response.data;
	}

	/**
	 * Get proof by ID
	 */
	async getProof(projectId: string, proofId: string): Promise<W3bstreamProof> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/proofs/${proofId}`,
		);
		return response.data;
	}

	// ==================== Publisher Operations ====================

	/**
	 * Register publisher
	 */
	async registerPublisher(
		projectId: string,
		name: string,
		permissions: string[] = ['send'],
	): Promise<W3bstreamPublisher> {
		const response = await this.client.post(
			`/v1/projects/${projectId}/publishers`,
			{ name, permissions },
		);
		return response.data;
	}

	/**
	 * Get publisher info
	 */
	async getPublisher(
		projectId: string,
		publisherId: string,
	): Promise<W3bstreamPublisher> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/publishers/${publisherId}`,
		);
		return response.data;
	}

	/**
	 * List publishers
	 */
	async listPublishers(projectId: string): Promise<W3bstreamPublisher[]> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/publishers`,
		);
		return response.data.publishers || [];
	}

	// ==================== Metrics Operations ====================

	/**
	 * Get project metrics
	 */
	async getProjectMetrics(projectId: string): Promise<{
		messagesTotal: number;
		messagesLast24h: number;
		proofsTotal: number;
		activeDevices: number;
		appletInstances: number;
	}> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/metrics`,
		);
		return response.data;
	}

	// ==================== Strategy Operations ====================

	/**
	 * Get strategy info
	 */
	async getStrategy(projectId: string, strategyId: string): Promise<{
		id: string;
		projectId: string;
		name: string;
		type: string;
		config: unknown;
		status: string;
	}> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/strategies/${strategyId}`,
		);
		return response.data;
	}

	/**
	 * List strategies
	 */
	async listStrategies(projectId: string): Promise<unknown[]> {
		const response = await this.client.get(
			`/v1/projects/${projectId}/strategies`,
		);
		return response.data.strategies || [];
	}
}

/**
 * Create a W3bstream client instance
 */
export function createW3bstreamClient(
	config: W3bstreamClientConfig,
): W3bstreamClient {
	return new W3bstreamClient(config);
}
