import { Shield, Code, Database, Lock, Network, FileCode, Server, Cpu, CheckCircle, ArrowLeft } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ArchitectureDocsProps {
  onBackToHome?: () => void;
}

export function ArchitectureDocs({ onBackToHome }: ArchitectureDocsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-white">ZK-ARMOR Backend Architecture</h1>
                <p className="text-sm text-gray-400">Midnight Protocol Integration Documentation</p>
              </div>
            </div>
            {onBackToHome && (
              <Button
                onClick={onBackToHome}
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-white/10 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* System Architecture Diagram */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Network className="w-6 h-6 text-blue-400" />
            <h2 className="text-white">System Architecture Diagram</h2>
          </div>
          
          <Card className="bg-slate-800/50 border-gray-700 p-8 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Frontend Layer */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-lg blur-xl"></div>
                <div className="relative bg-slate-900/80 border-2 border-blue-500/50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="text-blue-400">Frontend Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• React 18+</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• State Management</li>
                    <li>• API Client</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">User Interface & Interactions</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-purple-500 rotate-45"></div>
                </div>
              </div>

              {/* Backend Layer */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/10 rounded-lg blur-xl"></div>
                <div className="relative bg-slate-900/80 border-2 border-purple-500/50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Server className="w-5 h-5 text-purple-400" />
                    <h3 className="text-purple-400">Backend API Layer</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Node.js/Express</li>
                    <li>• REST API</li>
                    <li>• Authentication</li>
                    <li>• Business Logic</li>
                    <li>• PostgreSQL</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">API & Data Management</p>
                  </div>
                </div>
                {/* Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-8 w-16 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500">
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-cyan-500 rotate-45"></div>
                </div>
              </div>

              {/* Blockchain Layer */}
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur-xl"></div>
                <div className="relative bg-slate-900/80 border-2 border-cyan-500/50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-cyan-400">Midnight Protocol</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• zkApps</li>
                    <li>• Compact Language</li>
                    <li>• ZK Proof Generation</li>
                    <li>• Smart Contracts</li>
                    <li>• IPFS Storage</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">Blockchain & Privacy Layer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Flow */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h4 className="text-sm text-gray-400 mb-4">Data Flow</h4>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50 text-blue-300">
                  User Request
                </Badge>
                <span className="text-gray-500">→</span>
                <Badge variant="outline" className="bg-purple-500/20 border-purple-500/50 text-purple-300">
                  API Validation
                </Badge>
                <span className="text-gray-500">→</span>
                <Badge variant="outline" className="bg-cyan-500/20 border-cyan-500/50 text-cyan-300">
                  ZK Proof Generation
                </Badge>
                <span className="text-gray-500">→</span>
                <Badge variant="outline" className="bg-green-500/20 border-green-500/50 text-green-300">
                  Blockchain Storage
                </Badge>
                <span className="text-gray-500">→</span>
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500/50 text-blue-300">
                  Certificate Return
                </Badge>
              </div>
            </div>
          </Card>
        </section>

        {/* Technical Stack */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="w-6 h-6 text-purple-400" />
            <h2 className="text-white">Technical Stack</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-blue-400 mb-4">Frontend Technologies</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">React 18+ with TypeScript</p>
                    <p className="text-sm text-gray-400">Type-safe component architecture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Tailwind CSS v4</p>
                    <p className="text-sm text-gray-400">Utility-first styling with custom design tokens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Motion/React</p>
                    <p className="text-sm text-gray-400">Smooth animations and transitions</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-purple-400 mb-4">Backend Technologies</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Node.js with Express</p>
                    <p className="text-sm text-gray-400">High-performance REST API server</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Next.js API Routes (Alternative)</p>
                    <p className="text-sm text-gray-400">Serverless API endpoints</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">JWT Authentication</p>
                    <p className="text-sm text-gray-400">Secure token-based auth</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-cyan-400 mb-4">Blockchain Layer</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Midnight Protocol</p>
                    <p className="text-sm text-gray-400">Cardano-based privacy blockchain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Compact Language</p>
                    <p className="text-sm text-gray-400">Smart contract development</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">zkSNARKs</p>
                    <p className="text-sm text-gray-400">Zero-knowledge proof system</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-green-400 mb-4">Data Storage</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">PostgreSQL</p>
                    <p className="text-sm text-gray-400">User data and metadata</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">IPFS</p>
                    <p className="text-sm text-gray-400">Decentralized model storage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white">Redis Cache</p>
                    <p className="text-sm text-gray-400">High-speed data caching</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Key Components */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FileCode className="w-6 h-6 text-blue-400" />
            <h2 className="text-white">Key Components</h2>
          </div>

          <div className="grid gap-4">
            {[
              {
                name: 'Authentication Service',
                description: 'Handles user registration, login, and JWT token management. Integrates with OAuth providers and manages session state.',
                tech: ['JWT', 'bcrypt', 'OAuth 2.0'],
                color: 'blue'
              },
              {
                name: 'AI Model Verification Service',
                description: 'Processes submitted AI models, runs adversarial tests, and generates robustness metrics without exposing model architecture.',
                tech: ['TensorFlow.js', 'ONNX', 'Python Workers'],
                color: 'purple'
              },
              {
                name: 'Zero-Knowledge Proof Generation',
                description: 'Creates cryptographic proofs of model robustness using zkSNARKs. Ensures privacy-preserving verification.',
                tech: ['Midnight SDK', 'Compact', 'zkSNARKs'],
                color: 'cyan'
              },
              {
                name: 'Blockchain Transaction Handler',
                description: 'Manages interactions with Midnight Protocol, including smart contract deployment and transaction signing.',
                tech: ['Midnight.js', 'Cardano SDK', 'Web3'],
                color: 'green'
              },
              {
                name: 'Certificate Management System',
                description: 'Generates, stores, and retrieves verifiable certificates. Provides public verification endpoints.',
                tech: ['PostgreSQL', 'IPFS', 'Digital Signatures'],
                color: 'orange'
              }
            ].map((component, index) => (
              <Card key={index} className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm hover:border-gray-600 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-${component.color}-400 mb-2`}>{component.name}</h3>
                    <p className="text-gray-300 text-sm mb-3">{component.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {component.tech.map((tech, i) => (
                        <Badge key={i} variant="outline" className={`bg-${component.color}-500/10 border-${component.color}-500/30 text-${component.color}-300 text-xs`}>
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-${component.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                    <Lock className={`w-5 h-5 text-${component.color}-400`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-6 h-6 text-purple-400" />
            <h2 className="text-white">API Endpoints</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                method: 'POST',
                endpoint: '/api/models/submit',
                description: 'Submit AI model for verification',
                params: ['model_file', 'model_type', 'test_parameters'],
                response: '{ "job_id": "uuid", "status": "processing", "estimated_time": "5m" }',
                methodColor: 'green'
              },
              {
                method: 'POST',
                endpoint: '/api/proofs/generate',
                description: 'Generate zero-knowledge proof for model robustness',
                params: ['job_id', 'verification_results', 'privacy_level'],
                response: '{ "proof_id": "uuid", "proof_hash": "0x...", "blockchain_tx": "tx_hash" }',
                methodColor: 'green'
              },
              {
                method: 'GET',
                endpoint: '/api/certificates/:id',
                description: 'Retrieve verification certificate',
                params: ['certificate_id'],
                response: '{ "certificate": {...}, "proof": {...}, "verification_url": "https://..." }',
                methodColor: 'blue'
              },
              {
                method: 'POST',
                endpoint: '/api/verify',
                description: 'Verify model robustness against attacks',
                params: ['model_id', 'attack_types', 'threshold'],
                response: '{ "robustness_score": 0.95, "attacks_tested": 10, "passed": true }',
                methodColor: 'green'
              },
              {
                method: 'GET',
                endpoint: '/api/proofs/:hash/verify',
                description: 'Verify proof on-chain',
                params: ['proof_hash'],
                response: '{ "valid": true, "timestamp": "2025-11-13T...", "block": 12345 }',
                methodColor: 'blue'
              }
            ].map((endpoint, index) => (
              <Card key={index} className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <Badge className={`${endpoint.methodColor === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-blue-500/20 text-blue-300 border-blue-500/50'} shrink-0`}>
                    {endpoint.method}
                  </Badge>
                  <div className="flex-1">
                    <code className="text-purple-300 text-sm">{endpoint.endpoint}</code>
                    <p className="text-gray-300 text-sm mt-2">{endpoint.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Parameters:</p>
                        <div className="flex flex-wrap gap-2">
                          {endpoint.params.map((param, i) => (
                            <code key={i} className="text-xs bg-slate-900/50 px-2 py-1 rounded text-cyan-300">
                              {param}
                            </code>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Response:</p>
                        <code className="text-xs bg-slate-900/50 px-3 py-2 rounded block text-gray-300 overflow-x-auto">
                          {endpoint.response}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Midnight Protocol Integration */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-white">Midnight Protocol Integration</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-cyan-400 mb-4">Smart Contract Functions</h3>
              <div className="space-y-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <code className="text-sm text-purple-300">submitProof(proofData, modelHash)</code>
                  <p className="text-xs text-gray-400 mt-2">Submits ZK proof to blockchain</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <code className="text-sm text-purple-300">verifyRobustness(certificateId)</code>
                  <p className="text-xs text-gray-400 mt-2">Verifies model robustness on-chain</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <code className="text-sm text-purple-300">issueCertificate(ownerId, metadata)</code>
                  <p className="text-xs text-gray-400 mt-2">Issues verifiable certificate NFT</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <code className="text-sm text-purple-300">revokeProof(proofId, reason)</code>
                  <p className="text-xs text-gray-400 mt-2">Revokes compromised certificates</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-cyan-400 mb-4">Proof Generation Flow</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs text-cyan-400">1</div>
                  <div>
                    <p className="text-white text-sm">Model Submission</p>
                    <p className="text-xs text-gray-400">User uploads model via IPFS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs text-cyan-400">2</div>
                  <div>
                    <p className="text-white text-sm">Adversarial Testing</p>
                    <p className="text-xs text-gray-400">Run attack simulations privately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs text-cyan-400">3</div>
                  <div>
                    <p className="text-white text-sm">ZK Proof Generation</p>
                    <p className="text-xs text-gray-400">Create cryptographic proof using Compact</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs text-cyan-400">4</div>
                  <div>
                    <p className="text-white text-sm">Blockchain Submission</p>
                    <p className="text-xs text-gray-400">Submit proof to Midnight Protocol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-xs text-cyan-400">5</div>
                  <div>
                    <p className="text-white text-sm">Certificate Issuance</p>
                    <p className="text-xs text-gray-400">Generate verifiable certificate with QR</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-cyan-400 mb-4">Transaction Management</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white">Gas Optimization</p>
                  <p className="text-xs text-gray-400">Batched transactions reduce costs by 60%</p>
                </div>
                <div>
                  <p className="text-white">Transaction Queuing</p>
                  <p className="text-xs text-gray-400">Redis-based queue for high-volume periods</p>
                </div>
                <div>
                  <p className="text-white">Error Handling</p>
                  <p className="text-xs text-gray-400">Automatic retry with exponential backoff</p>
                </div>
                <div>
                  <p className="text-white">State Monitoring</p>
                  <p className="text-xs text-gray-400">Real-time blockchain state tracking</p>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
              <h3 className="text-cyan-400 mb-4">Privacy-Preserving Computations</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-white">Zero-Knowledge Proofs</p>
                  <p className="text-xs text-gray-400">Prove robustness without revealing model</p>
                </div>
                <div>
                  <p className="text-white">Homomorphic Encryption</p>
                  <p className="text-xs text-gray-400">Compute on encrypted model data</p>
                </div>
                <div>
                  <p className="text-white">Secure Multi-Party Computation</p>
                  <p className="text-xs text-gray-400">Distributed testing across nodes</p>
                </div>
                <div>
                  <p className="text-white">Differential Privacy</p>
                  <p className="text-xs text-gray-400">Noise injection for data protection</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Code Example */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6 text-green-400" />
            <h2 className="text-white">Integration Example</h2>
          </div>

          <Card className="bg-slate-800/50 border-gray-700 p-6 backdrop-blur-sm">
            <h3 className="text-green-400 mb-4">Submitting a Model for Verification</h3>
            <pre className="bg-slate-900/80 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-gray-300">{`// Frontend API Call
import { submitModel } from './api/zkarmor';

async function verifyModel(modelFile: File) {
  const formData = new FormData();
  formData.append('model', modelFile);
  formData.append('model_type', 'image_classifier');
  formData.append('attack_types', JSON.stringify(['FGSM', 'PGD', 'CW']));
  
  const response = await submitModel(formData);
  const { job_id, status } = response;
  
  // Poll for results
  const proof = await pollJobStatus(job_id);
  return proof;
}

// Backend API Handler
router.post('/api/models/submit', async (req, res) => {
  const { model, model_type, attack_types } = req.body;
  
  // 1. Store model on IPFS
  const ipfsHash = await ipfs.add(model);
  
  // 2. Queue verification job
  const job = await queue.add('verify-model', {
    ipfsHash,
    modelType: model_type,
    attacks: attack_types
  });
  
  // 3. Generate ZK proof
  const proof = await midnightSDK.generateProof({
    modelHash: ipfsHash,
    verificationResults: await runTests(model, attack_types)
  });
  
  // 4. Submit to blockchain
  const tx = await midnightSDK.submitProof(proof);
  
  res.json({ job_id: job.id, tx_hash: tx.hash });
});`}</code>
            </pre>
          </Card>
        </section>

        {/* Security Considerations */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-red-400" />
            <h2 className="text-white">Security Considerations</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-red-900/20 border-red-700/50 p-6 backdrop-blur-sm">
              <h3 className="text-red-400 mb-3">Data Privacy</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• End-to-end encryption</li>
                <li>• No model storage on servers</li>
                <li>• IPFS content addressing</li>
                <li>• Zero-knowledge architecture</li>
              </ul>
            </Card>

            <Card className="bg-orange-900/20 border-orange-700/50 p-6 backdrop-blur-sm">
              <h3 className="text-orange-400 mb-3">API Security</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Rate limiting (100 req/min)</li>
                <li>• JWT with refresh tokens</li>
                <li>• API key rotation</li>
                <li>• CORS policies</li>
              </ul>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-700/50 p-6 backdrop-blur-sm">
              <h3 className="text-yellow-400 mb-3">Blockchain Security</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Multi-signature wallets</li>
                <li>• Audit trail on-chain</li>
                <li>• Smart contract audits</li>
                <li>• Emergency pause mechanism</li>
              </ul>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
