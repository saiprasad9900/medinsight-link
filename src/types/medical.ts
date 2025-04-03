
export interface MedicalCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatments: string[];
  preventionMeasures: string[];
  severity: "Low" | "Medium" | "High";
  prevalence: "Rare" | "Uncommon" | "Common" | "Very Common";
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  description: string;
  dosageForm: string;
  usedFor: string[];
  interactions: string[];
  sideEffects: string[];
}

export interface SymptomAnalysis {
  possibleConditions: {
    conditionName: string;
    probability: number;
    severity: "Low" | "Medium" | "High";
  }[];
  recommendedActions: string[];
  urgencyLevel: "Non-urgent" | "Follow-up" | "Seek Care Soon" | "Urgent";
}

export interface MedicalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "Article" | "Video" | "Guide" | "Research";
  topics: string[];
  credibility: "High" | "Medium" | "Low";
}

export interface MedicalQuery {
  intent: "Diagnosis" | "Treatment" | "Prevention" | "Information";
  entities: {
    symptoms?: string[];
    conditions?: string[];
    medications?: string[];
    bodyParts?: string[];
    timeframes?: string[];
  };
  sentiment: "Concerned" | "Neutral" | "Urgent";
  language: "Technical" | "Layman";
}
