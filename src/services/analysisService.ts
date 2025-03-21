
import { Analysis, Prediction, Record as MedicalRecord } from "@/types/records";
import { supabase } from "@/integrations/supabase/client";

// Enhanced sample data for more comprehensive analysis
const mockedAnalysisResults: Record<string, Analysis> = {
  labResult: {
    summary: "The blood test results show elevated white blood cell count (12,500 cells/mcL) and C-reactive protein levels (15 mg/L), indicating an active inflammatory process. Kidney and liver function markers are within normal ranges. Further investigation recommended to identify the source of inflammation. The pattern suggests a possible bacterial infection.",
    insights: [
      {
        type: "warning",
        title: "Elevated WBC Count",
        description: "White blood cell count of 12,500 cells/mcL is above the normal range (4,500-11,000 cells/mcL), suggesting an inflammatory response or possible infection. Neutrophil percentage is particularly elevated at 78%.",
      },
      {
        type: "warning",
        title: "Increased CRP Levels",
        description: "C-reactive protein at 15 mg/L indicates significant inflammation and correlates with the elevated WBC count. This is often seen in bacterial infections and inflammatory conditions.",
      },
      {
        type: "info",
        title: "Normal Kidney Function",
        description: "Creatinine and BUN levels are within normal ranges, indicating proper kidney function. Electrolyte balance appears stable.",
      },
      {
        type: "info",
        title: "Normal Liver Enzymes",
        description: "ALT, AST, and Bilirubin are within reference ranges, suggesting normal liver function. No evidence of hepatocellular damage.",
      },
      {
        type: "success",
        title: "Improved Hemoglobin",
        description: "Hemoglobin has increased from 11.2 g/dL to 12.4 g/dL since last measurement, showing good response to iron supplementation. Continues to approach normal range.",
      },
    ],
    extractedData: {
      conditions: ["Bacterial Inflammation", "Possible Infection", "Anemia (Improving)"],
      testResults: [
        { name: "White Blood Cell Count", value: "12,500", unit: "cells/mcL", referenceRange: "4,500-11,000" },
        { name: "Neutrophils", value: "78", unit: "%", referenceRange: "40-60" },
        { name: "C-Reactive Protein", value: "15", unit: "mg/L", referenceRange: "<5" },
        { name: "Hemoglobin", value: "12.4", unit: "g/dL", referenceRange: "12.0-15.5" },
        { name: "Creatinine", value: "0.9", unit: "mg/dL", referenceRange: "0.7-1.3" },
        { name: "ALT", value: "28", unit: "U/L", referenceRange: "7-55" },
        { name: "Ferritin", value: "85", unit: "ng/mL", referenceRange: "12-300" },
      ],
      diagnosticCodes: ["R70.0", "D64.9", "R50.9"]
    }
  },
  clinicalNote: {
    summary: "Patient presents with recurring chest pain, shortness of breath, and fatigue for the past 3 weeks. Physical examination reveals elevated blood pressure (145/92 mmHg) and mild tachycardia (105 BPM). ECG shows T-wave inversions in leads V3-V6, suggesting possible myocardial ischemia. Cardiac enzyme panel shows slight elevation in troponin levels. Recommended cardiac enzyme panel and stress test to rule out coronary artery disease.",
    insights: [
      {
        type: "error",
        title: "Potential Cardiac Issue",
        description: "ECG abnormalities combined with chest pain, shortness of breath, and elevated troponin are concerning for possible myocardial ischemia or coronary artery disease. This requires immediate attention.",
      },
      {
        type: "warning",
        title: "Hypertension",
        description: "Blood pressure reading of 145/92 mmHg indicates Stage 1 hypertension, requiring monitoring and possible treatment. Patient reports inconsistent medication adherence.",
      },
      {
        type: "warning",
        title: "Tachycardia",
        description: "Resting heart rate of 105 BPM indicates mild tachycardia, which may be related to cardiac issues, anxiety, or other underlying conditions. Correlates with patient's reported palpitations.",
      },
      {
        type: "info",
        title: "Further Testing Needed",
        description: "Cardiac enzyme panel and stress test are appropriate next steps to evaluate for coronary artery disease. Consider echocardiogram to assess cardiac function and structure.",
      },
      {
        type: "warning",
        title: "Medication Adherence Issues",
        description: "Patient reports taking medications inconsistently. This may be contributing to uncontrolled hypertension and symptom progression. Medication reconciliation recommended.",
      },
    ],
    extractedData: {
      conditions: ["Chest Pain", "Dyspnea", "Fatigue", "Hypertension", "Tachycardia", "Possible Myocardial Ischemia", "Elevated Troponin"],
      medications: ["Aspirin 81mg daily", "Atorvastatin 20mg daily", "Lisinopril 10mg daily"],
      diagnosticCodes: ["R07.9", "I10", "R00.0", "I25.9", "R06.0"],
      vitalSigns: [
        { name: "Blood Pressure", value: "145/92", unit: "mmHg" },
        { name: "Heart Rate", value: "105", unit: "BPM" },
        { name: "Respiratory Rate", value: "18", unit: "breaths/min" },
        { name: "Temperature", value: "98.6", unit: "°F" },
        { name: "Oxygen Saturation", value: "97", unit: "%" },
      ]
    }
  },
  prescription: {
    summary: "Prescription for diabetes management includes Metformin 1000mg twice daily, Glipizide 5mg before breakfast, and instructions for blood glucose monitoring. Recent HbA1c of 8.2% indicates suboptimal glycemic control. Patient also prescribed Lisinopril 10mg daily for hypertension management and Atorvastatin 20mg daily for dyslipidemia.",
    insights: [
      {
        type: "warning",
        title: "Elevated HbA1c",
        description: "HbA1c of 8.2% is above the target range of <7.0%, indicating suboptimal diabetes control over the past 3 months. This puts the patient at increased risk for microvascular complications.",
      },
      {
        type: "info",
        title: "Dual Oral Therapy",
        description: "Combination of Metformin (biguanide) and Glipizide (sulfonylurea) is appropriate for patients with persistent hyperglycemia despite monotherapy. Monitor for hypoglycemia risk.",
      },
      {
        type: "info",
        title: "Monitoring Recommendation",
        description: "Blood glucose monitoring 2-3 times daily is recommended to track glycemic patterns and adjust treatment accordingly. Special attention to post-prandial glucose levels.",
      },
      {
        type: "warning",
        title: "Cardiovascular Risk Management",
        description: "Patient is receiving appropriate medications (Lisinopril, Atorvastatin) for cardiovascular risk reduction, which is essential in diabetic patients. Continue to monitor blood pressure and lipid levels.",
      },
      {
        type: "info",
        title: "Lifestyle Modifications",
        description: "Prescription includes recommendations for dietary changes, regular physical activity, and weight management, which are critical components of diabetes management.",
      },
    ],
    extractedData: {
      conditions: ["Type 2 Diabetes Mellitus", "Hyperglycemia", "Hypertension", "Dyslipidemia"],
      medications: [
        "Metformin 1000mg twice daily", 
        "Glipizide 5mg before breakfast", 
        "Lisinopril 10mg daily", 
        "Atorvastatin 20mg daily"
      ],
      testResults: [
        { name: "HbA1c", value: "8.2", unit: "%", referenceRange: "<7.0%" },
        { name: "Fasting Blood Glucose", value: "165", unit: "mg/dL", referenceRange: "70-100" },
        { name: "Total Cholesterol", value: "195", unit: "mg/dL", referenceRange: "<200" },
        { name: "LDL", value: "115", unit: "mg/dL", referenceRange: "<100" },
      ],
      diagnosticCodes: ["E11.9", "I10", "E78.5"],
    }
  },
  medicalImage: {
    summary: "Chest X-ray shows patchy opacities in the right lower lobe consistent with pneumonia. No pleural effusion or pneumothorax is observed. Heart size appears normal. Incidental finding of mild degenerative changes in the thoracic spine. The distribution pattern suggests community-acquired pneumonia, most likely bacterial in origin.",
    insights: [
      {
        type: "warning",
        title: "Right Lower Lobe Pneumonia",
        description: "Patchy opacities in the right lower lobe are consistent with bacterial pneumonia, requiring antibiotic treatment. The consolidation pattern suggests moderate severity.",
      },
      {
        type: "success",
        title: "Normal Heart Size",
        description: "Cardiac silhouette is within normal limits, suggesting no cardiac enlargement. No evidence of congestive heart failure or pericardial effusion.",
      },
      {
        type: "info",
        title: "Spinal Degeneration",
        description: "Incidental finding of mild degenerative changes in the thoracic spine, which are likely age-related and clinically insignificant. No acute fractures or dislocations noted.",
      },
      {
        type: "info",
        title: "Clear Upper Lobes",
        description: "Upper lobes are clear without evidence of infiltrates, masses, or nodules. No signs of tuberculosis or other chronic infections.",
      },
      {
        type: "info",
        title: "No Pleural Abnormalities",
        description: "No evidence of pleural effusion, pneumothorax, or pleural thickening. Costophrenic angles are sharp bilaterally.",
      },
    ],
    extractedData: {
      conditions: ["Pneumonia (Right Lower Lobe)", "Degenerative Disc Disease"],
      diagnosticCodes: ["J18.9", "M51.9"],
      findings: [
        "Patchy opacities in right lower lobe",
        "Normal cardiac silhouette",
        "No pleural effusion",
        "No pneumothorax",
        "Mild degenerative changes in thoracic spine"
      ]
    }
  }
};

// Enhanced predictive models
const mockedPredictions: Record<string, Prediction> = {
  default: {
    riskScore: 45,
    riskLevel: "Medium",
    predictedOutcomes: [
      { outcome: "Hospitalization", probability: 0.35, timeframe: "3 months" },
      { outcome: "Disease Progression", probability: 0.28, timeframe: "6 months" },
      { outcome: "Complication", probability: 0.15, timeframe: "12 months" },
    ],
    recommendations: [
      "Schedule follow-up appointment within 2 weeks",
      "Increase medication adherence monitoring",
      "Consider lifestyle modifications including diet and exercise",
      "Monitor blood pressure weekly",
      "Undergo comprehensive metabolic panel in 1 month"
    ]
  },
  high: {
    riskScore: 78,
    riskLevel: "High",
    predictedOutcomes: [
      { outcome: "Hospitalization", probability: 0.72, timeframe: "1 month" },
      { outcome: "Major Cardiac Event", probability: 0.65, timeframe: "3 months" },
      { outcome: "Mortality Risk", probability: 0.38, timeframe: "6 months" },
    ],
    recommendations: [
      "Immediate referral to cardiology specialist",
      "Consider adjustment of current medication regimen",
      "Daily monitoring of vital signs",
      "Stress test within 1 week",
      "Evaluate for hospital admission if symptoms worsen",
      "Implement home health monitoring program",
      "Schedule follow-up within 48-72 hours"
    ]
  },
  low: {
    riskScore: 22,
    riskLevel: "Low",
    predictedOutcomes: [
      { outcome: "Complete Recovery", probability: 0.85, timeframe: "1 month" },
      { outcome: "Minor Complication", probability: 0.12, timeframe: "3 months" },
      { outcome: "Recurrence", probability: 0.08, timeframe: "12 months" },
    ],
    recommendations: [
      "Routine follow-up in 3 months",
      "Continue current treatment plan",
      "Self-monitor for any new or worsening symptoms",
      "Maintain healthy lifestyle habits",
      "Consider preventive health screenings appropriate for age and gender"
    ]
  }
};

// This function simulates NLP analysis of medical documents
export const analyzeRecord = async (record: MedicalRecord): Promise<Analysis> => {
  // In a real implementation, this would call an actual NLP service or API
  console.log(`Analyzing record: ${record.title}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get appropriate mock result based on record type and content
  if (record.type === "Lab Result") {
    return mockedAnalysisResults.labResult;
  } else if (record.type === "Clinical Note") {
    return mockedAnalysisResults.clinicalNote;
  } else if (record.type === "Prescription") {
    return mockedAnalysisResults.prescription;
  } else if (record.type === "Medical Image") {
    return mockedAnalysisResults.medicalImage;
  }
  
  // Default fallback
  return mockedAnalysisResults.clinicalNote;
};

// This function simulates predictive modeling with enhanced logic
export const predictOutcomes = async (record: MedicalRecord, patientHistory?: MedicalRecord[]): Promise<Prediction> => {
  // In a real implementation, this would use ML models to generate predictions
  console.log(`Generating predictions for: ${record.title}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // More sophisticated logic for determining risk level based on record content
  const title = record.title.toLowerCase();
  
  if (record.type === "Clinical Note" && 
      (title.includes("cardiac") || title.includes("chest pain") || title.includes("heart"))) {
    return mockedPredictions.high;
  } 
  else if (record.type === "Lab Result" && 
           (title.includes("abnormal") || title.includes("elevated"))) {
    return mockedPredictions.high;
  }
  else if ((record.type === "Medical Image" && title.includes("x-ray")) || 
           (record.type === "Lab Result" && title.includes("normal"))) {
    return mockedPredictions.low;
  }
  
  // Default medium risk prediction
  return mockedPredictions.default;
};

// Function to categorize medical records based on content
export const categorizeRecord = (record: MedicalRecord): string => {
  // Enhanced categorization logic
  const title = record.title.toLowerCase();
  
  if (title.includes("blood") || title.includes("lab") || title.includes("test") || 
      title.includes("panel") || title.includes("count") || title.includes("level")) {
    return "Laboratory";
  } 
  else if (title.includes("x-ray") || title.includes("mri") || title.includes("ct") || 
           title.includes("scan") || title.includes("imaging") || title.includes("ultrasound")) {
    return "Radiology";
  } 
  else if (title.includes("prescription") || title.includes("medication") || 
           title.includes("drug") || title.includes("dose")) {
    return "Pharmacy";
  } 
  else if (title.includes("assessment") || title.includes("evaluation") || 
           title.includes("exam") || title.includes("consultation")) {
    return "Assessment";
  } 
  else if (title.includes("surgery") || title.includes("operation") || 
           title.includes("procedure") || title.includes("post-op")) {
    return "Surgical";
  }
  else if (title.includes("heart") || title.includes("cardiac") || 
           title.includes("ecg") || title.includes("ekg")) {
    return "Cardiology";
  }
  else if (title.includes("respiratory") || title.includes("lung") || 
           title.includes("breathing") || title.includes("pulmonary")) {
    return "Pulmonology";
  }
  
  return "General";
};

// Function to save analysis results to the database
export const saveAnalysisResults = async (recordId: string, analysis: Analysis, prediction: Prediction) => {
  try {
    // In a real implementation, this would save to your database
    // For now, we'll just log the action
    console.log(`Saving analysis results for record ${recordId}`);
    
    // This would be your actual database call
    // const { data, error } = await supabase
    //   .from('record_analyses')
    //   .upsert({
    //     record_id: recordId,
    //     analysis_data: analysis,
    //     prediction_data: prediction,
    //     analyzed_at: new Date()
    //   });
    
    // if (error) throw error;
    // return data;
    
    return { success: true };
  } catch (error) {
    console.error("Error saving analysis results:", error);
    throw error;
  }
};

// In a real implementation, you would have additional functions for:
// - Training and updating ML models
// - Processing different types of medical data
// - Integration with other healthcare systems
// - Verification and validation of predictions
