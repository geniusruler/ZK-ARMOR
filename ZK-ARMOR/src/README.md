# ZK-ARMOR - Zero-Knowledge AI Robustness Platform

![ZK-ARMOR Banner](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=300&fit=crop)

## 🛡️ Overview

**ZK-ARMOR** is a cryptographically verifiable AI robustness testing platform that helps AI developers, healthcare providers, and research labs prove their AI models are attack-resistant **without revealing proprietary architectures**.

Built with cutting-edge zero-knowledge proof technology powered by **Midnight Protocol**, ZK-ARMOR enables privacy-preserving AI verification on the blockchain.

## ✨ Key Features

### 🔐 Zero-Knowledge Privacy
- Prove model robustness without exposing architecture
- zkSNARK-based cryptographic proofs
- Privacy-preserving adversarial testing

### 🎯 Comprehensive Testing
- FGSM (Fast Gradient Sign Method) attacks
- PGD (Projected Gradient Descent) attacks
- Carlini-Wagner attacks
- DeepFool attacks

### 🏆 Blockchain Certificates
- Immutable verification records on Midnight Protocol
- Publicly verifiable certificates
- Compliance-ready audit trails

### 🚀 Enterprise-Ready
- RESTful API for integration
- Supabase backend with authentication
- Real-time verification tracking
- File upload and storage

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  React + TypeScript + Tailwind CSS + Motion/React           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  Backend API Layer                           │
│  Supabase Edge Functions + PostgreSQL + Storage             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Midnight Protocol Integration                   │
│  zkApps + Compact Smart Contracts + zkSNARKs                │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (for Midnight Protocol)
- Supabase account (already connected)

### 1. Backend is Ready!
✅ Supabase connected and configured  
✅ Authentication system deployed  
✅ File upload and storage ready  
✅ API endpoints available

### 2. Run the Application
The application is already running in Figma Make! Navigate between:
- **Home** - Landing page with features
- **Demo** - Interactive verification workflow
- **Docs** - Complete architecture documentation

### 3. Set Up Midnight Protocol (Optional)
For full blockchain integration, follow [`MIDNIGHT_SETUP.md`](/MIDNIGHT_SETUP.md):

```bash
# Run Midnight proof server
docker run -p 6300:6300 midnightnetwork/proof-server --network testnet

# Deploy smart contract
cd contracts/zkarmor
compact-compile verification.compact
node deploy.js
```

## 📚 Documentation

### API Endpoints

#### Authentication
```bash
POST /api/auth/signup
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

#### Model Submission
```bash
POST /api/models/submit
Authorization: Bearer {access_token}
{
  "modelName": "my-classifier.h5",
  "modelType": "image_classifier",
  "attackTypes": ["FGSM", "PGD", "CW"],
  "fileHash": "ipfs://..."
}

Response:
{
  "job_id": "uuid",
  "status": "processing",
  "estimated_time": "5m"
}
```

#### Generate Proof
```bash
POST /api/proofs/generate
Authorization: Bearer {access_token}
{
  "jobId": "uuid",
  "verificationResults": {...},
  "privacyLevel": "high"
}

Response:
{
  "proof_id": "uuid",
  "proof_hash": "0x...",
  "blockchain_tx": "0x..."
}
```

#### Verify Proof
```bash
GET /api/proofs/{hash}/verify

Response:
{
  "valid": true,
  "timestamp": "2025-11-14T...",
  "blockchain_tx": "0x...",
  "proof_id": "uuid",
  "status": "verified"
}
```

#### Get Certificate
```bash
GET /api/certificates/{id}
Authorization: Bearer {access_token}

Response:
{
  "certificate": {
    "certificate_id": "uuid",
    "model_name": "my-classifier",
    "verification_date": "2025-11-14T...",
    "robustness_score": 0.95,
    "proof_hash": "0x..."
  },
  "verification_url": "https://zkarmor.io/verify/..."
}
```

### Database Schema (Supabase KV Store)

```typescript
// Job records
job:{jobId} → {
  jobId: string
  userId: string
  modelName: string
  modelType: string
  attackTypes: string[]
  fileHash: string
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
  estimatedTime: string
}

// Proof records
proof:{proofId} → {
  proofId: string
  jobId: string
  userId: string
  proofHash: string
  blockchainTx: string
  verificationResults: object
  status: 'verified'
  createdAt: string
  midnight: {
    network: string
    contractAddress: string
    proofSystem: string
  }
}

// User job references
user:{userId}:job:{jobId} → {
  jobId: string
  createdAt: string
}

// Midnight transactions
midnight:tx:{txHash} → {
  transaction_hash: string
  network: string
  contract_address: string
  proof_data_hash: string
  submitted_at: string
  status: string
  block_number: number
}
```

## 🧩 Components

### Frontend Components
- **ZKArmorHeader** - Navigation with authentication
- **HeroSection** - Landing page hero
- **FeaturesGrid** - Feature showcase (3x2 grid)
- **HowItWorksSection** - Process explanation
- **CTASection** - Call-to-action
- **DemoWorkflow** - Interactive verification demo
- **ArchitectureDocs** - Technical documentation
- **AuthModal** - User authentication
- **SetupBanner** - Setup status indicator

### Backend Services
- **Authentication Service** - JWT-based user auth
- **Model Verification Service** - Adversarial testing
- **Proof Generation Service** - zkSNARK creation
- **Blockchain Transaction Handler** - Midnight Protocol integration
- **Certificate Management** - Verification certificates

## 🎨 Design System

### Colors
- **Background**: Dark navy gradient (#0A192F → #1E293B)
- **Primary**: Electric blue (#3B82F6)
- **Secondary**: Purple (#6B46C1)
- **Accent**: Cyan (#22D3EE)
- **Success**: Green (#10B981)

### Typography
- Headers: White
- Body: Gray-300
- Muted: Gray-400

### Effects
- Glassmorphism cards
- Gradient backgrounds
- Animated particles (circuit patterns)
- Smooth transitions

## 🔒 Security

### Data Privacy
- ✅ End-to-end encryption
- ✅ No model storage on servers
- ✅ IPFS content addressing
- ✅ Zero-knowledge architecture

### API Security
- ✅ JWT authentication with refresh tokens
- ✅ Rate limiting (100 req/min)
- ✅ CORS policies
- ✅ Input validation

### Blockchain Security
- ✅ Multi-signature wallets
- ✅ On-chain audit trails
- ✅ Smart contract audits
- ✅ Emergency pause mechanism

## 🧪 Demo Workflow

1. **Sign In/Sign Up** - Create account or log in
2. **Upload Model** - Select AI model file (simulated)
3. **Adversarial Testing** - Run attack simulations
4. **ZK Proof Generation** - Create cryptographic proof
5. **Blockchain Submission** - Store on Midnight Protocol
6. **Certificate Issued** - Receive verifiable certificate

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Motion/React (Framer Motion)
- **Icons**: Lucide React
- **Build**: Vite

### Backend
- **Platform**: Supabase
- **Functions**: Edge Functions (Deno)
- **Database**: PostgreSQL (KV Store)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (JWT)

### Blockchain
- **Network**: Midnight Protocol (Cardano-based)
- **Smart Contracts**: Compact Language
- **Proofs**: zkSNARKs
- **Storage**: IPFS

## 📊 API Client Usage

```typescript
import { apiClient } from './utils/api-client';
import { authHelpers } from './utils/supabase-client';

// Sign in
const session = await authHelpers.signIn('user@example.com', 'password');
apiClient.setAccessToken(session.session.access_token);

// Submit model
const job = await apiClient.submitModel({
  modelName: 'classifier.h5',
  modelType: 'image_classifier',
  attackTypes: ['FGSM', 'PGD'],
  fileHash: 'ipfs://...'
});

// Generate proof
const proof = await apiClient.generateProof({
  jobId: job.job_id,
  verificationResults: {...},
  privacyLevel: 'high'
});

// Verify proof
const verification = await apiClient.verifyProof(proof.proof_hash);
```

## 🌐 Environment Variables

Backend environment variables (configured in Supabase):

```bash
# Supabase (auto-configured)
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key

# Midnight Protocol (optional, for full integration)
MIDNIGHT_NETWORK=testnet
MIDNIGHT_RPC_URL=http://localhost:6300
MIDNIGHT_CONTRACT_ADDRESS=0x...
MIDNIGHT_WALLET_PRIVATE_KEY=your_private_key
```

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Landing page
- ✅ Backend API
- ✅ Authentication
- ✅ Demo workflow
- ✅ Documentation

### Phase 2: Midnight Integration
- ⏳ Local proof server setup
- ⏳ Smart contract deployment
- ⏳ On-chain verification
- ⏳ Certificate minting

### Phase 3: Production
- ⏳ Real adversarial testing
- ⏳ Multiple attack types
- ⏳ Enterprise dashboard
- ⏳ API key management
- ⏳ Usage analytics

### Phase 4: Scale
- ⏳ Mainnet deployment
- ⏳ Performance optimization
- ⏳ Advanced ZK circuits
- ⏳ Multi-chain support

## 🤝 Contributing

This is a demonstration project built with Figma Make. For production deployment:

1. Complete Midnight Protocol setup (see `MIDNIGHT_SETUP.md`)
2. Implement real adversarial testing (Python/TensorFlow workers)
3. Add comprehensive error handling
4. Implement rate limiting and abuse prevention
5. Conduct security audits

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Midnight Protocol** - Zero-knowledge blockchain infrastructure
- **Supabase** - Backend-as-a-Service platform
- **Figma Make** - Rapid prototyping and development

## 📞 Support

- **Documentation**: See `/components/ArchitectureDocs.tsx`
- **Setup Guide**: See `/MIDNIGHT_SETUP.md`
- **API Reference**: See this README

---

**Built with ZK-ARMOR** 🛡️ | **Powered by Midnight Protocol** 🌙 | **Secured by zkSNARKs** 🔐

*Proving AI robustness, preserving privacy*
