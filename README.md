# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides comprehensive integration with the IoTeX blockchain network, offering access to 8 core resources including accounts, blocks, transactions, actions, smart contracts, delegates, staking operations, and chain metadata for building powerful IoT and Web3 automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IoTeX](https://img.shields.io/badge/IoTeX-Compatible-green)
![Web3](https://img.shields.io/badge/Web3-Enabled-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-IoT-orange)

## Features

- **Account Management** - Query account balances, transaction history, and smart contract interactions
- **Block & Transaction Data** - Access complete blockchain data including block details and transaction analysis
- **Smart Contract Integration** - Deploy, interact with, and monitor smart contracts on IoTeX network
- **Delegate Operations** - Manage delegate information, voting records, and governance participation  
- **Staking Management** - Handle staking operations, rewards tracking, and validator interactions
- **Chain Metadata** - Access network statistics, protocol information, and blockchain metrics
- **Action Monitoring** - Track and analyze all types of blockchain actions and events
- **Real-time Updates** - Get live blockchain data for automation and monitoring workflows

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
| API Key | IoTeX API key for authenticated requests | Yes |
| Network | Target network (mainnet, testnet) | Yes |
| Endpoint URL | Custom RPC endpoint (optional) | No |

## Resources & Operations

### 1. Accounts

| Operation | Description |
|-----------|-------------|
| Get Account | Retrieve account information including balance and nonce |
| Get Account Actions | Fetch all actions performed by an account |
| Get Account Metadata | Get detailed account metadata and contract information |

### 2. Blocks

| Operation | Description |
|-----------|-------------|
| Get Block by Height | Retrieve block data by block height |
| Get Block by Hash | Fetch block information using block hash |
| Get Latest Block | Get the most recent block on the chain |
| Get Block Range | Retrieve multiple blocks within a specified range |

### 3. Transactions

| Operation | Description |
|-----------|-------------|
| Get Transaction | Fetch transaction details by transaction hash |
| Get Transaction Receipt | Retrieve transaction execution receipt |
| Send Transaction | Broadcast a signed transaction to the network |
| Estimate Gas | Calculate gas estimation for transaction execution |

### 4. Actions

| Operation | Description |
|-----------|-------------|
| Get Action by Hash | Retrieve action details using action hash |
| Get Actions by Block | Fetch all actions within a specific block |
| Get Actions by Address | Get actions associated with an address |
| Search Actions | Search actions using various filters |

### 5. SmartContracts

| Operation | Description |
|-----------|-------------|
| Deploy Contract | Deploy a new smart contract to the network |
| Call Contract | Execute a read-only contract function call |
| Send Contract Transaction | Execute a state-changing contract transaction |
| Get Contract Code | Retrieve the bytecode of a deployed contract |
| Get Contract ABI | Fetch the ABI of a verified contract |

### 6. Delegates

| Operation | Description |
|-----------|-------------|
| Get Delegates | Retrieve list of all delegates |
| Get Delegate by Name | Fetch specific delegate information |
| Get Delegate Productivity | Get delegate block production statistics |
| Get Delegate Rewards | Retrieve delegate reward information |

### 7. Staking

| Operation | Description |
|-----------|-------------|
| Get Buckets | Retrieve all staking buckets |
| Get Bucket by Index | Fetch specific staking bucket details |
| Create Stake | Create a new staking bucket |
| Unstake | Withdraw stake from a bucket |
| Restake | Extend or modify existing stake |

### 8. ChainMetadata

| Operation | Description |
|-----------|-------------|
| Get Chain Info | Retrieve basic blockchain information |
| Get Server Meta | Get server and API metadata |
| Get Epoch Meta | Fetch epoch-related metadata |
| Get Node Info | Get network node information |

## Usage Examples

```javascript
// Get account balance and information
const account = await this.helpers.httpRequest({
  method: 'GET',
  url: '/accounts/io1abc123...',
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});
```

```javascript
// Retrieve latest block data
const latestBlock = await this.helpers.httpRequest({
  method: 'GET', 
  url: '/blocks/latest',
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});
```

```javascript
// Call smart contract function
const contractCall = await this.helpers.httpRequest({
  method: 'POST',
  url: '/contracts/call',
  body: {
    contractAddress: 'io1contract123...',
    functionName: 'balanceOf',
    parameters: ['io1user123...']
  },
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});
```

```javascript
// Get delegate information
const delegates = await this.helpers.httpRequest({
  method: 'GET',
  url: '/delegates',
  qs: {
    limit: 36,
    offset: 0
  },
  headers: {
    'Authorization': `Bearer ${credentials.apiKey}`
  }
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid or missing API key | Verify API key in credentials settings |
| Network Timeout | Request timed out | Check network connectivity and retry |
| Invalid Address Format | Malformed IoTeX address | Ensure address follows io1... format |
| Insufficient Gas | Transaction gas limit too low | Increase gas limit or estimate gas first |
| Contract Not Found | Smart contract doesn't exist | Verify contract address and deployment |
| Rate Limit Exceeded | Too many API requests | Implement request throttling or upgrade plan |

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
- **IoTeX Community**: [IoTeX Discord](https://discord.com/invite/iotex)