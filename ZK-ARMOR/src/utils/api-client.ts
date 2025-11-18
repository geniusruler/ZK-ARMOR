import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-1378f6b4`;

export class APIClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Use access token if available, otherwise use public anon key
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async signup(email: string, password: string, name: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // Model Submission
  async submitModel(data: {
    modelName: string;
    modelType: string;
    attackTypes: string[];
    fileHash: string;
  }) {
    return this.request<{ job_id: string; status: string; estimated_time: string }>(
      '/api/models/submit',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // Job Status
  async getJobStatus(jobId: string) {
    return this.request(`/api/jobs/${jobId}`, {
      method: 'GET',
    });
  }

  // Generate Proof
  async generateProof(data: {
    jobId: string;
    verificationResults: any;
    privacyLevel: string;
  }) {
    return this.request<{
      proof_id: string;
      proof_hash: string;
      blockchain_tx: string;
    }>('/api/proofs/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verify Proof
  async verifyProof(proofHash: string) {
    return this.request<{
      valid: boolean;
      timestamp: string;
      blockchain_tx: string;
      proof_id: string;
      status: string;
    }>(`/api/proofs/${proofHash}/verify`, {
      method: 'GET',
    });
  }

  // Get Certificate
  async getCertificate(certificateId: string) {
    return this.request(`/api/certificates/${certificateId}`, {
      method: 'GET',
    });
  }

  // Verify Model
  async verifyModel(data: {
    modelId: string;
    attackTypes: string[];
    threshold: number;
  }) {
    return this.request<{
      robustness_score: number;
      attacks_tested: number;
      passed: boolean;
    }>('/api/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Get User Jobs
  async getUserJobs() {
    return this.request<{ jobs: any[]; count: number }>('/api/user/jobs', {
      method: 'GET',
    });
  }

  // Midnight Protocol Integration
  async submitToMidnight(data: { proofData: any; modelHash: string }) {
    return this.request('/api/midnight/submit-proof', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();
