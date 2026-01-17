# n8n-nodes-iotex Testing Guide

Complete step-by-step instructions for building, installing, and testing the IoTeX n8n community node on your local machine.

---

## Prerequisites

- **Node.js**: v18.x or higher
- **pnpm**: `npm install -g pnpm`
- **n8n**: Local installation (`npm install -g n8n`)
- **IoTeX Testnet Account** (optional): For testing transactions

---

## Step 1: Build the Package

### Option A: Build from Source

```bash
# Navigate to the package directory
cd n8n-nodes-iotex

# Install dependencies
pnpm install

# Build the package
pnpm build

# Verify build was successful
ls -la dist/
```

Expected output:
- `dist/credentials/` - Compiled credential files
- `dist/nodes/Iotex/` - Compiled node files including icon

### Option B: Use Pre-built Zip

If you received the zip file:
```bash
unzip n8n-nodes-iotex.zip -d n8n-nodes-iotex
cd n8n-nodes-iotex
```

---

## Step 2: Install in n8n

### Method A: Link for Development (Recommended for Testing)

```bash
# From the n8n-nodes-iotex directory
pnpm link --global

# Link to your n8n installation
cd ~/.n8n
pnpm link --global n8n-nodes-iotex
```

### Method B: Manual Installation

```bash
# Create custom nodes directory
mkdir -p ~/.n8n/custom

# Copy the package
cp -r n8n-nodes-iotex ~/.n8n/custom/

# Install dependencies in the custom directory
cd ~/.n8n/custom/n8n-nodes-iotex
pnpm install --prod
```

### Method C: Direct from Built Package

```bash
# Navigate to n8n's node_modules (inside .n8n if self-hosted)
cd ~/.n8n/nodes

# Create a symlink to your package
ln -s /path/to/n8n-nodes-iotex .
```

---

## Step 3: Start n8n

```bash
# Start n8n with custom nodes enabled
n8n start

# Or with verbose logging for debugging
N8N_LOG_LEVEL=debug n8n start
```

n8n should start on http://localhost:5678

---

## Step 4: Verify Installation

1. Open n8n in your browser: http://localhost:5678
2. Create a new workflow
3. Click **Add node** (+)
4. Search for "**IoTeX**"
5. You should see:
   - **IoTeX** (Action node)
   - **IoTeX Trigger** (Trigger node)

If nodes don't appear:
- Check n8n logs for errors
- Verify the dist folder contains compiled .js files
- Restart n8n after installation

---

## Step 5: Configure Credentials

### IoTeX Network Credentials

1. Go to **Credentials** → **Add Credential**
2. Search for "**IoTeX Network**"
3. Configure:
   - **Network**: `testnet` (for testing)
   - **HTTP Endpoint**: Leave default or use custom
   - **Private Key**: (Optional) Your testnet private key for signing

### IoTeXScan API Credentials (Optional)

1. Go to https://iotexscan.io
2. Get an API key if required
3. Add credential with your API key

### W3bstream Credentials (Optional)

1. Get credentials from W3bstream Studio
2. Configure project ID and API key

---

## Step 6: Test Operations

### Test 1: Get Account Balance (No Private Key Required)

1. Add **IoTeX** node
2. Set:
   - **Credential**: Your IoTeX Network credential
   - **Resource**: `Account`
   - **Operation**: `Get Balance`
   - **Address**: `io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms` (sample)
3. Execute
4. Expected: Returns IOTX balance in Rau and formatted

### Test 2: Get Block Information

1. Add **IoTeX** node
2. Set:
   - **Resource**: `Block`
   - **Operation**: `Get Latest Block`
3. Execute
4. Expected: Returns latest block height, hash, and metadata

### Test 3: Address Conversion

1. Add **IoTeX** node
2. Set:
   - **Resource**: `Utility`
   - **Operation**: `Convert Address`
   - **Address**: `io1mflp9m6hcgm2qcghchsdqj3z3eccrnekx9p0ms`
3. Execute
4. Expected: Returns both `io` and `0x` format addresses

### Test 4: Get Token Balance (XRC-20)

1. Add **IoTeX** node
2. Set:
   - **Resource**: `Token`
   - **Operation**: `Get Token Balance`
   - **Token Address**: `io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw` (VITA)
   - **Address**: Your wallet address
3. Execute
4. Expected: Returns token balance

### Test 5: Estimate Gas

1. Add **IoTeX** node
2. Set:
   - **Resource**: `Action`
   - **Operation**: `Estimate Gas`
   - **To Address**: Any valid address
   - **Amount**: `1`
3. Execute
4. Expected: Returns gas estimation in Rau

---

## Step 7: Test Trigger Node (Polling)

1. Add **IoTeX Trigger** node
2. Set:
   - **Event**: `New Block`
   - **Poll Interval**: 30 seconds
3. Connect to another node (e.g., **Set** node)
4. Activate the workflow
5. Wait for new blocks
6. Expected: Triggers on each new block

---

## Step 8: Test with Testnet Transactions (Advanced)

### Get Testnet IOTX

1. Go to https://faucet.iotex.io
2. Enter your testnet address
3. Request test IOTX

### Send Test Transaction

1. Add **IoTeX** node
2. Configure credential with your private key
3. Set:
   - **Resource**: `Action`
   - **Operation**: `Send IOTX`
   - **Recipient**: Another testnet address
   - **Amount**: `0.1`
4. Execute
5. Expected: Returns transaction hash
6. Verify on https://testnet.iotexscan.io

---

## Troubleshooting

### Node not appearing in n8n
```bash
# Check if package is correctly linked
ls ~/.n8n/node_modules | grep iotex

# Verify dist folder exists
ls n8n-nodes-iotex/dist/nodes/Iotex/

# Clear n8n cache
rm -rf ~/.n8n/.cache
```

### Build errors
```bash
# Clean and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

### Credential errors
- Ensure HTTP endpoint is accessible
- Check network selection matches intended environment
- Verify private key format (should be hex without 0x prefix)

### API rate limits
- Consider adding your own IoTeXScan API key
- Reduce polling frequency for triggers

### Transaction failures
- Verify sufficient IOTX balance for gas
- Check recipient address format
- Ensure nonce is correct

---

## Useful Resources

- **IoTeX Mainnet**: https://iotexscan.io
- **IoTeX Testnet**: https://testnet.iotexscan.io
- **Faucet**: https://faucet.iotex.io
- **Documentation**: https://docs.iotex.io
- **W3bstream**: https://w3bstream.com
- **n8n Docs**: https://docs.n8n.io

---

## Project Structure Reference

```
n8n-nodes-iotex/
├── credentials/           # Credential definitions
│   ├── IotexNetwork.credentials.ts
│   ├── IotexScan.credentials.ts
│   └── W3bstream.credentials.ts
├── nodes/Iotex/           # Node implementations
│   ├── Iotex.node.ts      # Main action node
│   ├── IotexTrigger.node.ts
│   ├── transport/         # API clients
│   ├── utils/             # Helper functions
│   └── constants/         # Network configs
├── dist/                  # Compiled output
├── package.json           # Package manifest
└── tsconfig.json          # TypeScript config
```

---

## Quick Command Reference

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode (development)
pnpm dev

# Lint
pnpm lint

# Format
pnpm format

# Start n8n
n8n start
```

---

Created by Velocity BPA • https://velobpa.com
