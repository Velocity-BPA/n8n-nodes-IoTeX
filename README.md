# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with the IoTeX blockchain ecosystem, offering 6 comprehensive resources for blockchain data retrieval, smart contract interactions, XRC token management, device registry operations, Pebble tracker integration, and W3bstream project management.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IoTeX](https://img.shields.io/badge/IoTeX-Blockchain-green)
![DePIN](https://img.shields.io/badge/DePIN-Enabled-orange)
![Web3](https://img.shields.io/badge/Web3-Integration-purple)

## Features

- **Blockchain Data Access** - Query blocks, transactions, and account information from the IoTeX mainnet and testnet
- **Smart Contract Integration** - Deploy, execute, and monitor smart contracts with full ABI support
- **XRC Token Management** - Handle XRC-20 and XRC-721 tokens including transfers, balances, and metadata
- **Device Registry Operations** - Manage IoT device registration, verification, and lifecycle operations
- **Pebble Tracker Support** - Access real-world data from Pebble IoT devices and sensors
- **W3bstream Projects** - Create and manage decentralized data processing workflows
- **Multi-Network Support** - Compatible with IoTeX mainnet, testnet, and private networks
- **Real-time Monitoring** - Subscribe to blockchain events and device data streams

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-iotex`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-iotex
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-iotex.git
cd n8n-nodes-iotex
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-iotex
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your IoTeX API key for authenticated requests | Yes |
| Network | Target network (mainnet, testnet, or custom) | Yes |
| Base URL | Custom RPC endpoint (optional for private networks) | No |
| Private Key | Wallet private key for transaction signing | No |

## Resources & Operations

### 1. BlockchainData

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by height or hash |
| Get Transaction | Fetch transaction details and receipt |
| Get Account | Query account balance and transaction history |
| Get Chain Info | Retrieve blockchain metadata and statistics |
| List Transactions | Get paginated transaction lists with filters |

### 2. SmartContracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy new smart contracts to the blockchain |
| Call Method | Execute read-only contract methods |
| Send Transaction | Execute state-changing contract methods |
| Get Contract Info | Retrieve contract ABI and metadata |
| Monitor Events | Subscribe to contract event emissions |
| Estimate Gas | Calculate gas requirements for transactions |

### 3. XrcTokens

| Operation | Description |
|-----------|-------------|
| Get Balance | Check XRC-20 token balances for addresses |
| Transfer Tokens | Send XRC-20 tokens between addresses |
| Get Token Info | Retrieve token metadata and supply information |
| List Holdings | Get all token holdings for an address |
| Get NFT Metadata | Fetch XRC-721 token metadata and attributes |
| Transfer NFT | Transfer XRC-721 tokens between addresses |

### 4. DeviceRegistry

| Operation | Description |
|-----------|-------------|
| Register Device | Add new IoT devices to the registry |
| Update Device | Modify device information and status |
| Get Device Info | Retrieve device details and verification status |
| List Devices | Query devices with filters and pagination |
| Verify Device | Perform device identity verification |
| Deactivate Device | Remove or suspend device registrations |

### 5. PebbleTrackers

| Operation | Description |
|-----------|-------------|
| Get Sensor Data | Retrieve latest sensor readings from Pebble devices |
| Get Historical Data | Query historical sensor data with time ranges |
| List Active Devices | Get all active Pebble trackers in the network |
| Get Device Status | Check connectivity and health status |
| Configure Device | Update device settings and data collection parameters |
| Export Data | Download sensor data in various formats |

### 6. W3bstreamProjects

| Operation | Description |
|-----------|-------------|
| Create Project | Initialize new W3bstream data processing projects |
| Deploy Logic | Upload and deploy data processing logic |
| Get Project Status | Monitor project execution and performance |
| Update Configuration | Modify project settings and parameters |
| List Projects | Retrieve all projects with filtering options |
| Delete Project | Remove projects and associated resources |

## Usage Examples

```javascript
// Get latest block information
{
  "resource": "BlockchainData",
  "operation": "Get Block",
  "height": "latest"
}
```

```javascript
// Transfer XRC-20 tokens
{
  "resource": "XrcTokens", 
  "operation": "Transfer Tokens",
  "contractAddress": "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw",
  "to": "io1uqhmnttmv0pg8prugxxn7d8ex9angrvfjrqrcd",
  "amount": "100000000000000000000",
  "privateKey": "{{ $credentials.privateKey }}"
}
```

```javascript
// Register IoT device
{
  "resource": "DeviceRegistry",
  "operation": "Register Device",
  "deviceId": "PEBBLE_001",
  "deviceType": "environmental_sensor",
  "owner": "io1uqhmnttmv0pg8prugxxn7d8ex9angrvfjrqrcd",
  "metadata": {
    "location": "San Francisco",
    "model": "PebbleGo"
  }
}
```

```javascript
// Get Pebble sensor data
{
  "resource": "PebbleTrackers",
  "operation": "Get Sensor Data",
  "deviceId": "PEBBLE_001",
  "dataTypes": ["temperature", "humidity", "location"],
  "limit": 100
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and active |
| Insufficient Gas | Transaction failed due to low gas limit | Increase gas limit or check account balance |
| Contract Not Found | Smart contract address does not exist | Verify contract address and network |
| Device Not Registered | Attempted operation on unregistered device | Register device first or check device ID |
| Network Timeout | Request exceeded timeout limit | Check network connectivity and retry |
| Invalid Transaction | Transaction parameters are malformed | Validate all required fields and formats |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-iotex/issues)
- **IoTeX Documentation**: [docs.iotex.io](https://docs.iotex.io)
- **IoTeX Developer Portal**: [developers.iotex.io](https://developers.iotex.io)