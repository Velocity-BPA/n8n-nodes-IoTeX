# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with IoTeX, the blockchain platform for the Internet of Trusted Things. Access 6 core resources including Accounts, Actions, Blocks, Smart Contracts, Rewards, and Analytics to build powerful IoT and blockchain automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IoTeX](https://img.shields.io/badge/IoTeX-Blockchain-green)
![IoT](https://img.shields.io/badge/IoT-Ready-orange)
![DeFi](https://img.shields.io/badge/DeFi-Compatible-purple)

## Features

- **Account Management** - Query account balances, transaction history, and nonce information
- **Action Tracking** - Monitor and analyze blockchain actions with detailed filtering options
- **Block Operations** - Access block data, metadata, and transaction details from the IoTeX blockchain
- **Smart Contract Integration** - Deploy, execute, and query smart contracts on the IoTeX network
- **Rewards Analytics** - Track staking rewards, voting rewards, and delegation information
- **Network Analytics** - Monitor network statistics, validator performance, and ecosystem metrics
- **Real-time Data** - Access live blockchain data with automatic retry and error handling
- **Flexible Authentication** - Secure API key-based authentication with multiple endpoint support

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
| API Key | Your IoTeX API key for authentication | Yes |
| Base URL | IoTeX API base URL (defaults to mainnet) | No |
| Network | Network selection (mainnet/testnet) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information including balance and nonce |
| Get Account Actions | Fetch all actions associated with an account |
| Get Account Metadata | Get extended account metadata and properties |
| List Accounts | Query multiple accounts with filtering options |

### 2. Actions

| Operation | Description |
|-----------|-------------|
| Get Action | Retrieve detailed information about a specific action |
| Get Actions by Hash | Fetch actions using transaction hash |
| Get Actions by Block | Get all actions within a specific block |
| Get Actions by Address | Query actions filtered by address |
| Get Action Receipt | Retrieve execution receipt for an action |

### 3. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block | Fetch block information by height or hash |
| Get Block Metadata | Retrieve block metadata and statistics |
| Get Latest Block | Get the most recent block information |
| Get Block Range | Query multiple blocks within a height range |
| Get Block Actions | List all actions within a specific block |

### 4. Smart Contracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract to the IoTeX network |
| Call Contract | Execute a read-only contract function call |
| Execute Contract | Send a transaction to execute contract function |
| Get Contract Code | Retrieve contract bytecode and ABI |
| Get Contract Events | Query contract event logs with filtering |

### 5. Rewards

| Operation | Description |
|-----------|-------------|
| Get Staking Rewards | Retrieve staking reward information |
| Get Voting Rewards | Fetch voting reward details |
| Get Delegate Rewards | Query delegate reward distribution |
| Get Reward History | Get historical reward data with date ranges |
| Calculate Rewards | Estimate potential rewards for staking amounts |

### 6. Analytics

| Operation | Description |
|-----------|-------------|
| Get Network Stats | Retrieve overall network statistics |
| Get Validator Analytics | Analyze validator performance metrics |
| Get Token Analytics | Query token distribution and usage statistics |
| Get Transaction Volume | Monitor transaction volume and trends |
| Get Active Addresses | Track active address metrics over time |

## Usage Examples

```javascript
// Get account balance
{
  "address": "io1qyqsyqcy8uhx9jtdc2xp5wx7nxyq3xf4c3jmxknzkuej8y",
  "operation": "getAccount"
}
```

```javascript
// Query recent actions
{
  "operation": "getActionsByAddress",
  "address": "io1qyqsyqcy8uhx9jtdc2xp5wx7nxyq3xf4c3jmxknzkuej8y",
  "start": 0,
  "count": 50
}
```

```javascript
// Execute smart contract function
{
  "operation": "executeContract",
  "contractAddress": "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw0ujql757y",
  "function": "transfer",
  "parameters": {
    "to": "io1qyqsyqcy8uhx9jtdc2xp5wx7nxyq3xf4c3jmxknzkuej8y",
    "amount": "1000000000000000000"
  }
}
```

```javascript
// Get network analytics
{
  "operation": "getNetworkStats",
  "timeRange": "24h",
  "includeValidators": true
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key in credentials configuration |
| Network Timeout | Request exceeded timeout limit | Check network connection and retry |
| Invalid Address | Blockchain address format is incorrect | Validate address format (io1...) |
| Contract Not Found | Smart contract address does not exist | Verify contract deployment and address |
| Insufficient Balance | Account lacks funds for transaction | Check account balance before operations |
| Rate Limit Exceeded | Too many requests sent to API | Implement delays between requests |

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