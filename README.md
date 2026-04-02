# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for IoTeX blockchain interactions. Provides 6 core resources with full support for account management, block exploration, action tracking, smart contract interactions, analytics queries, and delegate operations on the IoTeX network.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IoTeX](https://img.shields.io/badge/IoTeX-Blockchain-green)
![Web3](https://img.shields.io/badge/Web3-Integration-orange)
![DeFi](https://img.shields.io/badge/DeFi-Ready-purple)

## Features

- **Account Management** - Query account balances, transaction history, and metadata
- **Block Exploration** - Retrieve block information, transactions, and chain statistics
- **Action Tracking** - Monitor and query blockchain actions and transactions
- **Smart Contract Integration** - Execute contract calls and retrieve contract data
- **Analytics & Metrics** - Access comprehensive blockchain analytics and statistics
- **Delegate Operations** - Interact with IoTeX consensus delegates and staking
- **Real-time Data** - Live blockchain data with automatic updates
- **Error Resilience** - Comprehensive error handling with retry mechanisms

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
| API Key | IoTeX API access key for authenticated requests | Yes |
| Network | IoTeX network (mainnet/testnet) | Yes |
| Endpoint URL | Custom RPC endpoint (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account IOTX balance and token holdings |
| Get Metadata | Fetch account information and transaction counts |
| List Actions | Get transaction history for specific account |
| Get Nonce | Retrieve current account nonce for transactions |

### 2. Block

| Operation | Description |
|-----------|-------------|
| Get by Height | Retrieve block information by block number |
| Get by Hash | Fetch block details using block hash |
| Get Latest | Get the most recent block information |
| List Blocks | Retrieve multiple blocks with pagination |
| Get Transactions | List all transactions within a specific block |

### 3. Action

| Operation | Description |
|-----------|-------------|
| Get by Hash | Retrieve action details by transaction hash |
| List by Address | Get actions associated with specific address |
| List by Block | Fetch all actions within a block range |
| Get Receipt | Retrieve transaction receipt and execution results |
| Search Actions | Query actions with advanced filtering options |

### 4. Contract

| Operation | Description |
|-----------|-------------|
| Call Method | Execute read-only contract method calls |
| Get ABI | Retrieve contract Application Binary Interface |
| Get Code | Fetch deployed contract bytecode |
| List Events | Query contract event logs with filtering |
| Get Storage | Access contract storage state variables |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Chain Stats | Retrieve overall blockchain statistics |
| Get Market Data | Fetch IOTX price and market information |
| Get Network Health | Monitor network performance metrics |
| Get Validator Stats | Access validator and consensus statistics |
| Get Token Metrics | Analyze token distribution and economics |

### 6. Delegate

| Operation | Description |
|-----------|-------------|
| List All | Retrieve all consensus delegates and candidates |
| Get by Name | Fetch specific delegate information |
| Get Rewards | Query delegate rewards and distribution |
| Get Voters | List delegate voters and voting power |
| Get Rankings | Access delegate performance rankings |

## Usage Examples

```javascript
// Get account balance
{
  "resource": "Account",
  "operation": "Get Balance",
  "address": "io1qyqsyqcy8uhx9jtdc2xp5wx7nxyq3xf4c3jmxknzkuej8y"
}
```

```javascript
// Query latest block information
{
  "resource": "Block",
  "operation": "Get Latest",
  "includeTransactions": true
}
```

```javascript
// Execute smart contract call
{
  "resource": "Contract",
  "operation": "Call Method",
  "contractAddress": "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw0lcctu9c",
  "method": "balanceOf",
  "parameters": ["io1qyqsyqcy8uhx9jtdc2xp5wx7nxyq3xf4c3jmxknzkuej8y"]
}
```

```javascript
// Get delegate rankings
{
  "resource": "Delegate",
  "operation": "Get Rankings",
  "limit": 50,
  "offset": 0
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and network configuration |
| Rate Limit Exceeded | Too many requests sent to IoTeX API | Implement request delays or upgrade API plan |
| Invalid Address Format | Provided address doesn't match IoTeX format | Ensure address starts with 'io1' and has correct length |
| Block Not Found | Requested block height or hash doesn't exist | Verify block number is within valid range |
| Contract Call Failed | Smart contract execution returned error | Check contract address, method name, and parameters |
| Network Timeout | Request timed out waiting for response | Retry request or check network connectivity |

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
- **IoTeX Documentation**: [IoTeX Developer Portal](https://docs.iotex.io/)
- **IoTeX Community**: [IoTeX Discord](https://discord.gg/iotex)