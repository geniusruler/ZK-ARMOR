export interface A2DConfig {
  epsilon: number;
  sapThreshold: number;
  attackIterations: number;
  alphaStep: number;
}

export interface A2DResult {
  sapScore: number;
  pass: boolean;
  confidence: number;
  details: {
    cleanAccuracy: number;
    adversarialAccuracy: number;
    accuracyDrop: number;
  };
}

export interface A2DVerificationResult {
  isPoisoned: boolean;
  sapScore: number;
  confidence: number;
  details: {
    cleanAccuracy: number;
    adversarialAccuracy: number;
    accuracyDrop: number;
  };
}

export interface ModelCertificate {
  modelHash: string;
  score: number;
  pass: boolean;
  timestamp: number;
  ownerId: string;
  algorithm: string;
  epsilon: number;
  metadata: {
    modelFormat: string;
    datasetSize: number;
    confidence: number;
  };
}

export interface VerificationResponse {
  success: boolean;
  certificate?: ModelCertificate;
  result?: {
    sapScore: number;
    pass: boolean;
    confidence: number;
    details: {
      cleanAccuracy: number;
      adversarialAccuracy: number;
      accuracyDrop: number;
    };
  };
  message: string;
  error?: string;
}
