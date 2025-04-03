
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: "Critical" | "Stable" | "Improved";
  lastVisit: string;
  doctor: string;
}

export interface MedicalSymptom {
  id: string;
  name: string;
  description: string;
  bodyArea: string;
  severity: "Mild" | "Moderate" | "Severe";
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  commonTreatments: string[];
  riskFactors: string[];
}
