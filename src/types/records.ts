
export interface Insight {
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
}

export interface Analysis {
  summary: string;
  insights: Insight[];
  extractedData?: {
    conditions?: string[];
    medications?: string[];
    testResults?: {
      name: string;
      value: string;
      unit: string;
      referenceRange?: string;
    }[];
    diagnosticCodes?: string[];
    vitalSigns?: {
      name: string;
      value: string;
      unit: string;
    }[];
    findings?: string[];
  };
}

export interface Prediction {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  predictedOutcomes: {
    outcome: string;
    probability: number;
    timeframe: string;
  }[];
  recommendations: string[];
}

export interface Record {
  id: string;
  title: string;
  type: "Lab Result" | "Clinical Note" | "Medical Image" | "Prescription";
  date: string;
  patientName: string;
  insights?: number;
  status: "Analyzed" | "Pending" | "Processing";
  filePath?: string;
  analysis?: Analysis;
  prediction?: Prediction;
  category?: string;
  analyzing?: boolean; // Added this property to fix the TypeScript error
}
