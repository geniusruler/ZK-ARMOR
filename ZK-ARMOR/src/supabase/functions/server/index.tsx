import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Health check
app.get('/make-server-1378f6b4/health', (c) => {
  return c.json({ status: 'ok', service: 'ZK-ARMOR Backend' });
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

// Sign up new user
app.post('/make-server-1378f6b4/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm email since email server isn't configured
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'User created successfully',
      user: { id: data.user.id, email: data.user.email }
    });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// ============================================
// MODEL SUBMISSION ENDPOINTS
// ============================================

// Submit AI model for verification
app.post('/make-server-1378f6b4/api/models/submit', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.log(`Auth error in model submission: ${authError?.message}`);
      return c.json({ error: 'Unauthorized - Invalid token' }, 401);
    }

    const { modelName, modelType, attackTypes, fileHash } = await c.req.json();

    // Generate unique job ID
    const jobId = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    // Store job in KV store
    const jobData = {
      jobId,
      userId: user.id,
      modelName,
      modelType,
      attackTypes,
      fileHash,
      status: 'processing',
      createdAt: timestamp,
      estimatedTime: '5m'
    };

    await kv.set(`job:${jobId}`, jobData);
    await kv.set(`user:${user.id}:job:${jobId}`, { jobId, createdAt: timestamp });

    console.log(`Model submission job created: ${jobId} for user ${user.id}`);

    return c.json({ 
      job_id: jobId,
      status: 'processing',
      estimated_time: '5m'
    });
  } catch (error) {
    console.log(`Error submitting model: ${error}`);
    return c.json({ error: 'Failed to submit model for verification' }, 500);
  }
});

// Get job status
app.get('/make-server-1378f6b4/api/jobs/:jobId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const jobId = c.req.param('jobId');
    const jobData = await kv.get(`job:${jobId}`);

    if (!jobData) {
      return c.json({ error: 'Job not found' }, 404);
    }

    // Verify job belongs to user
    if (jobData.userId !== user.id) {
      return c.json({ error: 'Unauthorized - Job does not belong to user' }, 403);
    }

    return c.json(jobData);
  } catch (error) {
    console.log(`Error fetching job status: ${error}`);
    return c.json({ error: 'Failed to fetch job status' }, 500);
  }
});

// ============================================
// PROOF GENERATION ENDPOINTS
// ============================================

// Generate zero-knowledge proof
app.post('/make-server-1378f6b4/api/proofs/generate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { jobId, verificationResults, privacyLevel } = await c.req.json();

    // Get job data
    const jobData = await kv.get(`job:${jobId}`);
    
    if (!jobData || jobData.userId !== user.id) {
      return c.json({ error: 'Job not found or unauthorized' }, 404);
    }

    // Generate proof ID and blockchain transaction hash (simulated for demo)
    const proofId = crypto.randomUUID();
    const proofHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`;
    const txHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`;

    const proofData = {
      proofId,
      jobId,
      userId: user.id,
      proofHash,
      blockchainTx: txHash,
      verificationResults,
      privacyLevel,
      status: 'verified',
      createdAt: new Date().toISOString(),
      // Midnight Protocol integration metadata
      midnight: {
        network: 'testnet',
        contractAddress: '0xMIDNIGHT_CONTRACT_ADDRESS',
        proofSystem: 'zkSNARKs'
      }
    };

    await kv.set(`proof:${proofId}`, proofData);
    await kv.set(`proof:hash:${proofHash}`, proofData);

    // Update job status
    jobData.status = 'completed';
    jobData.proofId = proofId;
    await kv.set(`job:${jobId}`, jobData);

    console.log(`ZK Proof generated: ${proofId} for job ${jobId}`);

    return c.json({ 
      proof_id: proofId,
      proof_hash: proofHash,
      blockchain_tx: txHash
    });
  } catch (error) {
    console.log(`Error generating proof: ${error}`);
    return c.json({ error: 'Failed to generate proof' }, 500);
  }
});

// Verify proof on-chain
app.get('/make-server-1378f6b4/api/proofs/:hash/verify', async (c) => {
  try {
    const proofHash = c.req.param('hash');
    const proofData = await kv.get(`proof:hash:${proofHash}`);

    if (!proofData) {
      return c.json({ 
        valid: false,
        error: 'Proof not found'
      }, 404);
    }

    return c.json({ 
      valid: true,
      timestamp: proofData.createdAt,
      blockchain_tx: proofData.blockchainTx,
      proof_id: proofData.proofId,
      status: proofData.status
    });
  } catch (error) {
    console.log(`Error verifying proof: ${error}`);
    return c.json({ error: 'Failed to verify proof' }, 500);
  }
});

// ============================================
// CERTIFICATE ENDPOINTS
// ============================================

// Get certificate by ID
app.get('/make-server-1378f6b4/api/certificates/:id', async (c) => {
  try {
    const certificateId = c.req.param('id');
    const proofData = await kv.get(`proof:${certificateId}`);

    if (!proofData) {
      return c.json({ error: 'Certificate not found' }, 404);
    }

    const jobData = await kv.get(`job:${proofData.jobId}`);

    const certificate = {
      certificate_id: certificateId,
      model_name: jobData?.modelName || 'Unknown',
      model_type: jobData?.modelType || 'Unknown',
      verification_date: proofData.createdAt,
      proof_hash: proofData.proofHash,
      blockchain_tx: proofData.blockchainTx,
      status: 'verified',
      robustness_score: proofData.verificationResults?.robustness_score || 0.95,
      attacks_tested: proofData.verificationResults?.attacks_tested || 10,
      verification_url: `https://zkarmor.io/verify/${proofData.proofHash}`
    };

    return c.json({ 
      certificate,
      proof: proofData,
      verification_url: certificate.verification_url
    });
  } catch (error) {
    console.log(`Error retrieving certificate: ${error}`);
    return c.json({ error: 'Failed to retrieve certificate' }, 500);
  }
});

// ============================================
// MODEL VERIFICATION ENDPOINT
// ============================================

// Verify model robustness against attacks
app.post('/make-server-1378f6b4/api/verify', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { modelId, attackTypes, threshold } = await c.req.json();

    // Simulate verification process (in production, this would run actual tests)
    const robustnessScore = 0.88 + Math.random() * 0.12; // Random score between 0.88-1.0
    const attacksTested = attackTypes?.length || 10;
    const passed = robustnessScore >= (threshold || 0.85);

    const verificationResult = {
      model_id: modelId,
      robustness_score: parseFloat(robustnessScore.toFixed(4)),
      attacks_tested: attacksTested,
      attack_types: attackTypes || ['FGSM', 'PGD', 'CW', 'DeepFool'],
      passed,
      threshold: threshold || 0.85,
      verified_at: new Date().toISOString(),
      details: {
        fgsm_resistance: 0.92,
        pgd_resistance: 0.89,
        cw_resistance: 0.91,
        deepfool_resistance: 0.87
      }
    };

    console.log(`Model verification completed for ${modelId}: Score ${robustnessScore.toFixed(4)}`);

    return c.json(verificationResult);
  } catch (error) {
    console.log(`Error during model verification: ${error}`);
    return c.json({ error: 'Failed to verify model' }, 500);
  }
});

// ============================================
// USER DASHBOARD ENDPOINTS
// ============================================

// Get user's jobs
app.get('/make-server-1378f6b4/api/user/jobs', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all jobs for user
    const userJobKeys = await kv.getByPrefix(`user:${user.id}:job:`);
    const jobs = await Promise.all(
      userJobKeys.map(async (jobRef) => {
        return await kv.get(`job:${jobRef.jobId}`);
      })
    );

    return c.json({ 
      jobs: jobs.filter(Boolean),
      count: jobs.length
    });
  } catch (error) {
    console.log(`Error fetching user jobs: ${error}`);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// ============================================
// MIDNIGHT PROTOCOL INTEGRATION
// ============================================

// Midnight contract interaction endpoint
app.post('/make-server-1378f6b4/api/midnight/submit-proof', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { proofData, modelHash } = await c.req.json();

    // In production, this would interact with Midnight Protocol
    // For now, we simulate the blockchain transaction
    const txHash = `0x${Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`;

    const midnightSubmission = {
      transaction_hash: txHash,
      network: 'midnight-testnet',
      contract_address: '0xMIDNIGHT_ZKARMOR_CONTRACT',
      proof_data_hash: modelHash,
      submitted_at: new Date().toISOString(),
      status: 'confirmed',
      block_number: Math.floor(Math.random() * 1000000),
      gas_used: '125000'
    };

    await kv.set(`midnight:tx:${txHash}`, midnightSubmission);

    console.log(`Proof submitted to Midnight Protocol: ${txHash}`);

    return c.json(midnightSubmission);
  } catch (error) {
    console.log(`Error submitting to Midnight Protocol: ${error}`);
    return c.json({ error: 'Failed to submit proof to blockchain' }, 500);
  }
});

console.log('🚀 ZK-ARMOR Backend Server starting...');

Deno.serve(app.fetch);
