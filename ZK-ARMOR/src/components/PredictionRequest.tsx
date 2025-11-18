import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Shield, Loader2, Sparkles } from 'lucide-react';

interface PredictionRequestProps {
  onAnalyze: (data: AnalysisData) => void;
  onBack: () => void;
  fileName: string;
}

export interface AnalysisData {
  patientId: string;
  targetProtein: string;
  analysisType: string;
  notes: string;
}

export function PredictionRequest({ onAnalyze, onBack, fileName }: PredictionRequestProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState<AnalysisData>({
    patientId: '',
    targetProtein: '',
    analysisType: 'structure',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Simulate analysis process
    setTimeout(() => {
      onAnalyze(formData);
      setIsAnalyzing(false);
    }, 3000);
  };

  const isFormValid = formData.patientId && formData.targetProtein;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4" disabled={isAnalyzing}>
            ← Back
          </Button>
          <h2 className="mb-2 text-blue-900">Configure Protein Analysis</h2>
          <p className="text-gray-600">
            Set up your AlphaFold 3 prediction parameters
          </p>
        </div>

        {/* File Info */}
        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-green-900">Encrypted File Ready</p>
                <p className="text-xs text-green-700">{fileName}</p>
              </div>
            </div>
            <span className="text-xs text-green-700 bg-green-100 px-3 py-1 rounded-full">
              ✓ Secured
            </span>
          </div>
        </Card>

        {/* Analysis Form */}
        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Patient ID */}
              <div>
                <Label htmlFor="patientId">Patient ID *</Label>
                <Input
                  id="patientId"
                  type="text"
                  placeholder="e.g., PT-2024-001"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  disabled={isAnalyzing}
                  required
                  className="mt-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  This ID is hashed and never stored in plaintext
                </p>
              </div>

              {/* Target Protein/Gene */}
              <div>
                <Label htmlFor="targetProtein">Target Protein or Gene *</Label>
                <Input
                  id="targetProtein"
                  type="text"
                  placeholder="e.g., BRCA1, TP53, CFTR"
                  value={formData.targetProtein}
                  onChange={(e) => setFormData({ ...formData, targetProtein: e.target.value })}
                  disabled={isAnalyzing}
                  required
                  className="mt-2"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Enter the gene or protein name for structure prediction
                </p>
              </div>

              {/* Analysis Type */}
              <div>
                <Label htmlFor="analysisType">Analysis Type</Label>
                <Select
                  value={formData.analysisType}
                  onValueChange={(value) => setFormData({ ...formData, analysisType: value })}
                  disabled={isAnalyzing}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="structure">Protein Structure Prediction</SelectItem>
                    <SelectItem value="binding">Binding Affinity Analysis</SelectItem>
                    <SelectItem value="mutation">Mutation Impact Assessment</SelectItem>
                    <SelectItem value="interaction">Protein-Protein Interaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Clinical Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant clinical context or specific areas of interest..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  disabled={isAnalyzing}
                  className="mt-2 min-h-[100px]"
                />
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <Card className="p-4 mb-6 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 mb-1">Secure Processing</p>
                <p className="text-blue-700 text-xs">
                  Your analysis will be processed using privacy-preserving computation. 
                  All results will include zero-knowledge compliance proofs.
                </p>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={!isFormValid || isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Secure Analysis...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Processing Indicator */}
        {isAnalyzing && (
          <Card className="mt-6 p-6 border-blue-300 bg-blue-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-900">Encrypting analysis request...</span>
                <span className="text-xs text-blue-700">✓ Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-900">Running AlphaFold 3 prediction...</span>
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-sm">Generating compliance proof...</span>
                <span className="text-xs">Pending</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
