# n8n-nodes-iotex

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the IoTeX blockchain, providing 16 resources and 80+ operations for DePIN (Decentralized Physical Infrastructure Network) applications, IoT device management, W3bstream off-chain compute, and MachineFi operations.

![IoTeX](https://img.shields.io/badge/IoTeX-DePIN-00D4AA?style=for-the-badge)
![n8n](https://img.shields.io/badge/n8n-Community%20Node-FF6D5A?style=for-the-badge)
![License](https://img.shields.io/badge/license-BSL--1.1-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)

---

## Features

### Core Blockchain Operations
- **Account Management**: Get balances, nonces, token holdings, and create accounts
- **Actions (Transactions)**: Send IOTX, estimate gas, track transaction status
- **Smart Contracts**: Read, execute, and deploy contracts with ABI encoding/decoding
- **Block & Epoch**: Query blocks, chain metadata, and epoch information

### DePIN & IoT
- **Device Management**: Register devices, manage DIDs, submit device data
- **Pebble Tracker**: Full integration with IoTeX's hardware tracker
- **MachineFi**: Machine registration, earnings tracking, reward claiming
- **W3bstream**: Off-chain compute with WASM applets and ZK proofs

### Staking & Governance
- **Native Staking**: Create buckets, manage stakes, claim rewards
- **Delegate Operations**: Query validators, voting, delegation management
- **Epoch Rewards**: Track and claim staking rewards

### Token Operations
- **XRC-20 Tokens**: Transfer, approve, check balances and allowances
- **XRC-721 NFTs**: Transfer, mint, query ownership and metadata

### Cross-Chain
- **Hermes Bridge**: Bridge tokens to/from other chains
- **ioTube Integration**: Cross-chain token transfers

---

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-iotex`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Create custom nodes directory if it doesn't exist
mkdir -p custom

# Install the package
cd custom
npm install n8n-nodes-iotex

# Restart n8n
n8n start
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-iotex.zip
cd n8n-nodes-iotex

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-iotex

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-iotex %CD%

# 5. Restart n8n
n8n start
```

---

## Credentials Setup

### IoTeX Network Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Network | Mainnet, Testnet, or Custom | Yes |
| HTTP Endpoint | RPC endpoint URL | Auto-filled for mainnet/testnet |
| gRPC Endpoint | gRPC endpoint URL | Optional |
| Private Key | Wallet private key (hex format) | For write operations |
| API Key | Provider API key | Optional |

**Default Endpoints:**
- Mainnet: `https://babel-api.mainnet.iotex.io`
- Testnet: `https://babel-api.testnet.iotex.io`

### IoTeXScan API Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Endpoint | IoTeXScan API URL | Yes |
| API Key | Your API key | Optional |

### W3bstream Credentials

| Field | Description | Required |
|-------|-------------|----------|
| Environment | Production, Staging, or Custom | Yes |
| Endpoint | W3bstream API URL | Auto-filled |
| Project ID | Your project identifier | Yes |
| API Key | Authentication key | Yes |
| Publisher Token | For message publishing | Optional |

---

## Resources & Operations

### IoTeX Action Node

The main node for blockchain interactions with 16 resource categories:

| Resource | Operations | Description |
|----------|------------|-------------|
| **Account** | 12 | Get info, balance, nonce, token balances, create account |
| **Action** | 13 | Send IOTX, get action/receipt, estimate gas, gas price |
| **Token (XRC-20)** | 10 | Get info, balance, transfer, approve, allowance |
| **NFT (XRC-721)** | 10 | Get info, owner, transfer, approve, collection info |
| **Contract** | 10 | Read, execute, deploy, encode/decode calls, get code |
| **Staking** | 16 | Create bucket, add deposit, unstake, withdraw, restake |
| **Delegate** | 11 | Get delegates, info, voters, consensus delegates |
| **Device** | 12 | Register, get info, submit data, manage DID |
| **W3bstream** | 16 | Project management, applet deployment, messaging |
| **DID** | 12 | Create, resolve, update, deactivate DIDs |
| **Pebble** | 11 | Register, get data, parse sensors, verify data |
| **MachineFi** | 12 | Register machine, earnings, claim rewards |
| **Block** | 8 | Get by height/hash, latest block, chain meta |
| **Epoch** | 5 | Current epoch, delegates, rewards |
| **Bridge** | 8 | Bridge tokens, get status, supported tokens |
| **Utility** | 11 | Convert units, sign/verify messages, generate keypair |

---

## Trigger Node

The IoTeX Trigger node monitors blockchain events in real-time using polling:

| Category | Events |
|----------|--------|
| **Action** | Confirmed, IOTX received/sent, large transactions |
| **Block** | New block, new epoch |
| **Token** | Transfer, approval |
| **NFT** | Transfer, minted, burned |
| **Contract** | Event emitted |
| **Staking** | Rewards available |
| **W3bstream** | Message received, proof generated |

---

## Usage Examples

### Send IOTX Transfer

```json
{
  "resource": "action",
  "operation": "sendIotx",
  "recipient": "io1qyqsyqcy8uhx9jtqr3k97k8r4lgu4zq5e6p89t",
  "amount": "10",
  "unit": "IOTX"
}
```

### Check Token Balance

```json
{
  "resource": "token",
  "operation": "getBalance",
  "tokenAddress": "io1hp6y4eqr90j7tmul4w2wa8e9ldxvnp57eg29k4",
  "walletAddress": "io1qyqsyqcy8uhx9jtqr3k97k8r4lgu4zq5e6p89t"
}
```

### Create Staking Bucket

```json
{
  "resource": "staking",
  "operation": "createBucket",
  "candidate": "metanyx",
  "amount": "1000",
  "duration": 91,
  "autoStake": true
}
```

### Register IoT Device

```json
{
  "resource": "device",
  "operation": "registerDevice",
  "deviceId": "device_001",
  "deviceType": "sensor",
  "metadata": {
    "manufacturer": "IoTeX",
    "model": "Pebble"
  }
}
```

### Send Data to W3bstream

```json
{
  "resource": "w3bstream",
  "operation": "sendMessage",
  "projectId": "my-project",
  "payload": {
    "temperature": 25.5,
    "humidity": 60,
    "timestamp": 1702500000
  }
}
```

### Monitor Large Transactions (Trigger)

```json
{
  "eventCategory": "action",
  "event": "largeTransaction",
  "threshold": 10000
}
```

---

## IoTeX Concepts

### Addresses

IoTeX uses two address formats:
- **io-address**: Native bech32 format (e.g., `io1qyqsyqcy...`)
- **0x-address**: EVM-compatible hex format (e.g., `0x04f9...`)

Both formats represent the same account and can be converted using the Utility resource.

### Actions

"Actions" is IoTeX terminology for transactions. Types include:
- **Transfer**: Send IOTX between accounts
- **Execution**: Smart contract interactions
- **Staking**: Bucket operations

### Staking Buckets

Flexible staking containers with:
- Minimum stake: 100 IOTX
- Lock duration: 0-1050 days
- Bonus rewards for longer locks
- Auto-stake option for compounding

### Roll-DPoS Consensus

IoTeX uses Randomized Delegated Proof of Stake:
- 36 consensus delegates per epoch
- Epoch = 8,640 blocks (≈1 day)
- Rewards distributed per epoch

### Units

| Unit | Value | Description |
|------|-------|-------------|
| Rau | 1 | Smallest unit |
| Qev | 10³ | Thousand Rau |
| Jing | 10⁶ | Million Rau |
| IOTX | 10¹⁸ | Standard unit |

### W3bstream

Decentralized off-chain compute layer:
- **Applets**: WASM modules for processing
- **Messages**: Device data submissions
- **Proofs**: ZK proofs for verification

### MachineFi

Machines as financial entities:
- Devices earn rewards for data
- Proof-of-work for machines
- NFT representation of devices

---

## Networks

| Network | Chain ID | HTTP Endpoint | Description |
|---------|----------|---------------|-------------|
| Mainnet | 1 | `https://babel-api.mainnet.iotex.io` | Production network |
| Testnet | 2 | `https://babel-api.testnet.iotex.io` | Testing network |

---

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid address format | Address doesn't start with `io1` or `0x` | Verify address format |
| Insufficient balance | Not enough IOTX for transfer + gas | Check balance first |
| Transaction failed | Gas limit or nonce issues | Verify gas and nonce |
| Connection timeout | Network issues | Check endpoint URL |
| Staking bucket not found | Invalid bucket index | Verify bucket ownership |

### Debug Mode

Enable debug output in your workflow by including raw data in responses:

```json
{
  "options": {
    "includeRawData": true
  }
}
```

---

## Security Best Practices

1. **Never log private keys** - Private keys are sensitive and should never appear in logs
2. **Use testnet for development** - Always test with testnet before mainnet
3. **Validate addresses** - Use the utility functions to validate address formats
4. **Secure credentials** - Store credentials securely in n8n's credential manager
5. **Monitor gas costs** - Set appropriate gas limits to avoid failed transactions
6. **Verify contracts** - Always verify contract ABIs before interaction

---

## Development

### Commands

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode
pnpm dev

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run integration tests
pnpm test:integration

# Lint
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Testing the Node

1. Build and link the package locally
2. Start n8n: `n8n start`
3. Open http://localhost:5678
4. Create a workflow and add the IoTeX node
5. Configure credentials (use testnet for testing)
6. Test operations

---

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

---

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-iotex/issues)
- **Documentation**: [IoTeX Docs](https://docs.iotex.io)
- **Community**: [IoTeX Discord](https://discord.gg/iotex)

---

## Acknowledgments

- [IoTeX Foundation](https://iotex.io) for the blockchain infrastructure
- [n8n](https://n8n.io) for the workflow automation platform
- The IoTeX community for DePIN innovation
