# ZK-ARMOR + Midnight Protocol Integration Guide

This guide walks you through setting up the complete ZK-ARMOR infrastructure with Midnight Protocol for zero-knowledge AI model verification.

## 🏗️ Architecture Overview

```
User Interface (React + Supabase)
        ↓
ZK-ARMOR Backend API (Supabase Edge Functions)
        ↓
Midnight Protocol (zkApps + Compact Smart Contracts)
        ↓
Blockchain Storage (Midnight Testnet)
```

## 📋 Prerequisites

- Docker installed
- Node.js 18+ installed
- Supabase account (already connected via Figma Make)
- Midnight Protocol wallet (for testnet)

## 🚀 Step 1: Local Midnight Proof Server Setup

### Install and Run Midnight Node

```bash
# Pull the Midnight proof server Docker image
docker pull midnightnetwork/proof-server

# Run the Midnight local proof server on testnet
docker run -p 6300:6300 midnightnetwork/proof-server --network testnet

# Verify it's running
curl http://localhost:6300/health
```

Expected response:
```json
{
  "status": "ok",
  "network": "testnet",
  "version": "1.0.0"
}
```

## 💰 Step 2: Get Testnet Tokens

1. **Create Midnight Wallet**
   - Visit: https://wallet.midnight.network/testnet
   - Create new wallet or import existing
   - Copy your wallet address (starts with `midnight1...`)

2. **Request Test Tokens (tDUST)**
   - Visit: https://faucet.midnight.network
   - Paste your wallet address
   - Request 1000 tDUST tokens
   - Wait for confirmation (~30 seconds)

3. **Verify Balance**
   ```bash
   curl -X POST http://localhost:6300/api/wallet/balance \
     -H "Content-Type: application/json" \
     -d '{"address": "YOUR_WALLET_ADDRESS"}'
   ```

## 📝 Step 3: Write Compact Smart Contract

### Create Contract Directory

```bash
mkdir -p contracts/zkarmor
cd contracts/zkarmor
```

### Write Basic Verification Contract

Create `verification.compact`:

```compact
// ZK-ARMOR Verification Contract
// Proves AI model robustness without revealing model architecture

contract ZKArmorVerification {
  // State variables
  state mapping(bytes32 => VerificationRecord) public verifications;
  state uint256 public totalVerifications;

  // Verification record structure
  struct VerificationRecord {
    bytes32 modelHash;
    bytes32 proofHash;
    uint256 timestamp;
    uint8 robustnessScore;
    bool isValid;
  }

  // Submit verification proof
  @zk
  function submitProof(
    bytes32 modelHash,
    bytes32 proofHash,
    uint8 robustnessScore,
    bytes calldata zkProof
  ) public returns (bytes32 verificationId) {
    // Verify the zero-knowledge proof
    require(verifyZKProof(zkProof, modelHash), "Invalid ZK proof");
    require(robustnessScore >= 85, "Robustness score too low");

    // Generate unique verification ID
    verificationId = keccak256(abi.encodePacked(modelHash, proofHash, block.timestamp));

    // Store verification record
    verifications[verificationId] = VerificationRecord({
      modelHash: modelHash,
      proofHash: proofHash,
      timestamp: block.timestamp,
      robustnessScore: robustnessScore,
      isValid: true
    });

    totalVerifications++;

    emit ProofSubmitted(verificationId, modelHash, robustnessScore);
    return verificationId;
  }

  // Verify existing proof
  function verifyProof(bytes32 verificationId) public view returns (bool) {
    return verifications[verificationId].isValid;
  }

  // Get verification details
  function getVerification(bytes32 verificationId) 
    public 
    view 
    returns (VerificationRecord memory) 
  {
    return verifications[verificationId];
  }

  // Internal ZK proof verification
  @zk
  function verifyZKProof(bytes calldata proof, bytes32 modelHash) 
    internal 
    pure 
    returns (bool) 
  {
    // zkSNARK verification logic
    // This proves model robustness without revealing architecture
    return true; // Simplified for demo
  }

  // Events
  event ProofSubmitted(bytes32 indexed verificationId, bytes32 modelHash, uint8 score);
  event ProofRevoked(bytes32 indexed verificationId, string reason);
}
```

### Compile the Contract

```bash
# Install Midnight compiler
npm install -g @midnight-ntwrk/compact-compiler

# Compile contract
compact-compile verification.compact --output build/

# Expected output:
# ✓ Compiled successfully
# ✓ Generated zkCircuit.json
# ✓ Generated contract.json
```

## 🚢 Step 4: Deploy to Midnight Testnet

### Create Deployment Script

Create `deploy.js`:

```javascript
const { MidnightProvider, ContractFactory } = require('@midnight-ntwrk/midnight-js-sdk');

async function deployContract() {
  // Connect to Midnight testnet
  const provider = new MidnightProvider({
    network: 'testnet',
    rpcUrl: 'http://localhost:6300'
  });

  // Load wallet (use environment variable for security)
  const wallet = provider.createWallet(process.env.MIDNIGHT_PRIVATE_KEY);

  // Load compiled contract
  const contractJson = require('./build/contract.json');
  const zkCircuit = require('./build/zkCircuit.json');

  // Create contract factory
  const factory = new ContractFactory(contractJson, zkCircuit, wallet);

  console.log('Deploying ZK-ARMOR Verification Contract...');

  // Deploy contract
  const contract = await factory.deploy({
    gasLimit: 5000000
  });

  await contract.deployed();

  console.log('Contract deployed successfully!');
  console.log('Contract Address:', contract.address);
  console.log('Transaction Hash:', contract.deployTransaction.hash);

  return contract.address;
}

deployContract()
  .then(address => {
    console.log('\n✅ Deployment complete!');
    console.log('Update your backend with this contract address:', address);
    process.exit(0);
  })
  .catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
```

### Deploy

```bash
# Set your private key (NEVER commit this!)
export MIDNIGHT_PRIVATE_KEY="your_private_key_here"

# Deploy contract
node deploy.js
```

Expected output:
```
Deploying ZK-ARMOR Verification Contract...
Contract deployed successfully!
Contract Address: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
Transaction Hash: 0x1f3a7b2c8d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c
```

## 🔗 Step 5: Connect Backend to Midnight

### Update Environment Variables

Add to your Supabase environment variables:

```bash
MIDNIGHT_NETWORK=testnet
MIDNIGHT_RPC_URL=http://localhost:6300
MIDNIGHT_CONTRACT_ADDRESS=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
MIDNIGHT_WALLET_PRIVATE_KEY=your_private_key_here
```

### Update Backend API

The backend at `/supabase/functions/server/index.tsx` already has Midnight integration endpoints:

- `POST /api/midnight/submit-proof` - Submit proof to blockchain
- `GET /api/proofs/:hash/verify` - Verify proof on-chain

### Install Midnight SDK in Backend

In your backend, you would install:

```bash
npm install @midnight-ntwrk/midnight-js-sdk
```

Then update the Midnight integration code:

```typescript
import { MidnightProvider } from '@midnight-ntwrk/midnight-js-sdk';

const midnightProvider = new MidnightProvider({
  network: Deno.env.get('MIDNIGHT_NETWORK'),
  rpcUrl: Deno.env.get('MIDNIGHT_RPC_URL')
});

const contract = midnightProvider.getContract(
  Deno.env.get('MIDNIGHT_CONTRACT_ADDRESS'),
  contractABI
);

// Submit proof to blockchain
async function submitProofToBlockchain(proofData, modelHash) {
  const tx = await contract.submitProof(
    modelHash,
    proofData.proofHash,
    Math.floor(proofData.robustnessScore * 100),
    proofData.zkProof
  );
  
  await tx.wait();
  return tx.hash;
}
```

## 🎯 Step 6: Complete Flow Implementation

### Frontend → Backend → Midnight Flow

1. **User uploads model** via DemoWorkflow component
2. **Backend receives file** and stores in Supabase Storage
3. **Adversarial tests run** (simulated or real via Python worker)
4. **ZK proof generated** using Midnight SDK
5. **Proof submitted** to Midnight smart contract
6. **Certificate minted** on-chain
7. **Results displayed** to user with blockchain verification

### Test the Complete Flow

1. Navigate to the Demo page in ZK-ARMOR
2. Sign in with your account
3. Upload a test model file (can be any file for demo)
4. Watch the workflow progress through:
   - ✅ File upload to Supabase
   - ✅ Adversarial testing
   - ✅ ZK proof generation
   - ✅ Blockchain submission
   - ✅ Certificate issuance

## 🔍 Step 7: Verification

### Verify Proof On-Chain

```bash
# Query the blockchain for your proof
curl -X GET "http://localhost:6300/api/contract/call" \
  -H "Content-Type: application/json" \
  -d '{
    "contractAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "method": "verifyProof",
    "params": ["YOUR_VERIFICATION_ID"]
  }'
```

### Check Transaction on Explorer

Visit: https://explorer.midnight.network/testnet/tx/YOUR_TX_HASH

## 📊 Database Schema (Supabase KV Store)

The backend uses Supabase's KV store for:

```
job:{jobId} → {
  jobId, userId, modelName, modelType, 
  attackTypes, fileHash, status, createdAt
}

proof:{proofId} → {
  proofId, jobId, userId, proofHash, 
  blockchainTx, verificationResults, status
}

user:{userId}:job:{jobId} → {
  jobId, createdAt
}

midnight:tx:{txHash} → {
  transaction_hash, network, contract_address,
  proof_data_hash, submitted_at, status
}
```

## 🎨 UI Components

- **DemoWorkflow** - Complete verification flow with stepper
- **AuthModal** - User authentication
- **ArchitectureDocs** - Technical documentation
- **ZKArmorHeader** - Navigation with auth state

## 🔐 Security Considerations

1. **Private Keys**: NEVER commit private keys to version control
2. **Environment Variables**: Use Supabase secrets for sensitive data
3. **File Upload**: Validate file types and sizes
4. **Rate Limiting**: Implement on backend to prevent abuse
5. **ZK Proofs**: Ensure proofs are verified before blockchain submission

## 🚨 Troubleshooting

### Midnight Node Not Starting

```bash
# Check Docker logs
docker logs $(docker ps -q --filter ancestor=midnightnetwork/proof-server)

# Restart with verbose logging
docker run -p 6300:6300 midnightnetwork/proof-server --network testnet --log-level debug
```

### Contract Deployment Fails

- Check wallet has sufficient tDUST tokens
- Verify contract syntax with compiler
- Ensure RPC endpoint is reachable

### Backend API Errors

- Check Supabase logs in dashboard
- Verify environment variables are set
- Test endpoints individually with curl

## 📚 Additional Resources

- Midnight Protocol Docs: https://docs.midnight.network
- Compact Language Guide: https://docs.midnight.network/compact
- ZK-ARMOR Architecture: See `/components/ArchitectureDocs.tsx`
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

## 🎉 Success Checklist

- [ ] Midnight local node running on port 6300
- [ ] Wallet funded with testnet tDUST
- [ ] Smart contract compiled successfully
- [ ] Contract deployed to Midnight testnet
- [ ] Backend environment variables configured
- [ ] Supabase connected and authenticated
- [ ] Demo workflow completes end-to-end
- [ ] Proofs verifiable on blockchain explorer

---

**Need Help?**
Check the logs in:
- Supabase Dashboard → Edge Functions → Logs
- Browser Console → Network tab
- Midnight Explorer → Your transactions

Built with ❤️ by the ZK-ARMOR team
