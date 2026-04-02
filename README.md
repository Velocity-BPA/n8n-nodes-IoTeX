# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with the IoTeX blockchain platform. This node provides access to 6 core resources enabling account management, transaction monitoring, block analysis, token operations, network analytics, and staking functionality for IoTeX-based applications and DeFi workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IoTeX](https://img.shields.io/badge/IoTeX-Blockchain-green)
![DeFi](https://img.shields.io/badge/DeFi-Compatible-orange)
![IoT](https://img.shields.io/badge/IoT-Blockchain-purple)

## Features

- **Account Management** - Monitor balances, transaction history, and account metadata
- **Action Tracking** - Query and analyze blockchain transactions and smart contract interactions
- **Block Analysis** - Access block data, timestamps, and network consensus information
- **Token Operations** - Manage IOTX tokens and interact with token contracts
- **Network Analytics** - Retrieve network statistics, validator information, and performance metrics
- **Staking Integration** - Monitor delegations, rewards, and validator operations
- **Real-time Data** - Access live blockchain data and network status
- **IoT Focus** - Specialized features for Internet of Things blockchain applications

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
| API Key | Your IoTeX API key for accessing blockchain data | Yes |
| Environment | Network environment (mainnet, testnet) | Yes |
| Base URL | Custom API endpoint URL (optional) | No |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balance and token holdings |
| Get Transaction History | Fetch transaction history for an account |
| Get Account Metadata | Get account details and contract information |
| List Actions | Get all actions associated with an account |
| Get Nonce | Retrieve current account nonce |

### 2. Action

| Operation | Description |
|-----------|-------------|
| Get Action | Retrieve specific action/transaction details |
| List Actions | Get multiple actions with filtering options |
| Get Action Receipt | Fetch transaction receipt and execution status |
| Search Actions | Search actions by hash, address, or criteria |
| Get Gas Estimation | Estimate gas costs for pending actions |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get Block | Retrieve block information by height or hash |
| Get Latest Block | Fetch the most recent block |
| List Blocks | Get multiple blocks with pagination |
| Get Block Metadata | Retrieve block producer and consensus data |
| Get Chain Info | Get blockchain network information |

### 4. Token

| Operation | Description |
|-----------|-------------|
| Get Token Balance | Check token balance for specific address |
| Transfer Tokens | Execute token transfer transactions |
| Get Token Info | Retrieve token contract details and metadata |
| List Token Holders | Get addresses holding specific tokens |
| Get Token Transfers | Fetch token transfer history |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Network Stats | Retrieve network performance metrics |
| Get Validator Analytics | Analyze validator performance and rankings |
| Get Transaction Volume | Get transaction volume statistics |
| Get Address Analytics | Analyze address activity and patterns |
| Get Staking Analytics | Retrieve staking pool and delegation metrics |

### 6. Staking

| Operation | Description |
|-----------|-------------|
| Get Delegation | Retrieve delegation information |
| List Validators | Get active validators and their details |
| Get Staking Rewards | Fetch staking rewards history |
| Get Validator Info | Retrieve specific validator details |
| Calculate Rewards | Estimate staking rewards for delegation |

## Usage Examples

```javascript
// Get account balance
{
  "address": "io1nyjs526mnqcsx4twa7nptkg08eclsw5c2dywp4",
  "includeTokens": true
}
```

```javascript
// Retrieve block information
{
  "blockHeight": 15420000,
  "includeActions": true,
  "includeMetadata": false
}
```

```javascript
// Get staking rewards
{
  "delegatorAddress": "io1nyjs526mnqcsx4twa7nptkg08eclsw5c2dywp4",
  "fromEpoch": 25000,
  "toEpoch": 25100
}
```

```javascript
// Search actions by criteria
{
  "startBlock": 15400000,
  "endBlock": 15420000,
  "actionType": "transfer",
  "limit": 50
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and network settings |
| Rate Limit Exceeded | Too many requests sent to IoTeX API | Implement delays between requests or upgrade plan |
| Invalid Address Format | Blockchain address format is incorrect | Ensure address follows IoTeX format (io1...) |
| Block Not Found | Requested block height or hash doesn't exist | Verify block number is within valid range |
| Network Connection Failed | Unable to connect to IoTeX network | Check internet connection and API endpoint |
| Insufficient Gas | Transaction gas estimation or execution failed | Increase gas limit or check account balance |

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
- **IoTeX Documentation**: [IoTeX Developer Docs](https://docs.iotex.io/)
- **IoTeX Community**: [IoTeX Discord](https://discord.gg/iotex)