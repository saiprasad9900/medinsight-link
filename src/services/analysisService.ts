
import { MedicalRecord, Analysis, Prediction, Insight } from "@/types/records";

// Helper function to generate a random number within a range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Categorize medical records based on their type and title
export const categorizeRecord = (record: MedicalRecord): string => {
  const title = record.title.toLowerCase();
  const type = record.type.toLowerCase();
  
  if (title.includes("blood") || title.includes("hematology") || title.includes("cbc") || title.includes("hemoglobin")) {
    return "Blood Test";
  } else if (title.includes("urine") || title.includes("urinalysis") || title.includes("kidney") || title.includes("bladder")) {
    return "Urine Test";
  } else if (title.includes("x-ray") || title.includes("radiograph") || title.includes("chest x-ray") || title.includes("bone")) {
    return "X-Ray";
  } else if (title.includes("mri") || title.includes("magnetic") || title.includes("brain") || title.includes("spine")) {
    return "MRI";
  } else if (title.includes("ct") || title.includes("computed tomography") || title.includes("scan")) {
    return "CT Scan";
  } else if (title.includes("ultrasound") || title.includes("sonogram") || title.includes("echo")) {
    return "Ultrasound";
  } else if (title.includes("ecg") || title.includes("ekg") || title.includes("electrocardiogram") || title.includes("heart")) {
    return "ECG/EKG";
  } else if (title.includes("liver") || title.includes("hepatic") || title.includes("bilirubin") || title.includes("alt") || title.includes("ast")) {
    return "Liver Function";
  } else if (title.includes("lipid") || title.includes("cholesterol") || title.includes("triglyceride")) {
    return "Lipid Profile";
  } else if (title.includes("thyroid") || title.includes("tsh") || title.includes("t3") || title.includes("t4")) {
    return "Thyroid Function";
  } else if (title.includes("glucose") || title.includes("diabetes") || title.includes("hba1c") || title.includes("sugar")) {
    return "Diabetes Panel";
  } else if (title.includes("vitamin") || title.includes("b12") || title.includes("d3") || title.includes("folate")) {
    return "Vitamin Panel";
  } else if (type === "lab result" || title.includes("lab") || title.includes("test")) {
    return "Laboratory";
  } else if (type === "medical image" || title.includes("imaging")) {
    return "Medical Imaging";
  } else {
    return "General";
  }
};

// Enhanced analysis function with more detailed and varied insights
export const analyzeRecord = async (record: MedicalRecord): Promise<Analysis> => {
  console.log(`Analyzing record: ${record.title} (${record.type})`);
  
  // Simulate realistic processing delay
  await new Promise(res => setTimeout(res, 2000));
  
  const category = categorizeRecord(record);
  console.log(`Record categorized as: ${category}`);
  
  // Generate specific analyses based on record category
  switch (category) {
    case "Blood Test":
      return generateBloodTestAnalysis(record);
    case "Urine Test":
      return generateUrineTestAnalysis(record);
    case "X-Ray":
      return generateXRayAnalysis(record);
    case "MRI":
      return generateMRIAnalysis(record);
    case "CT Scan":
      return generateCTScanAnalysis(record);
    case "Ultrasound":
      return generateUltrasoundAnalysis(record);
    case "ECG/EKG":
      return generateECGAnalysis(record);
    case "Liver Function":
      return generateLiverFunctionAnalysis(record);
    case "Lipid Profile":
      return generateLipidProfileAnalysis(record);
    case "Thyroid Function":
      return generateThyroidFunctionAnalysis(record);
    case "Diabetes Panel":
      return generateDiabetesPanelAnalysis(record);
    case "Vitamin Panel":
      return generateVitaminPanelAnalysis(record);
    default:
      return generateGeneralAnalysis(record);
  }
};

// Generate outcome predictions based on the record and its analysis
export const predictOutcomes = async (record: MedicalRecord): Promise<Prediction> => {
  console.log(`Predicting outcomes for: ${record.title}`);
  
  await new Promise(res => setTimeout(res, 800));
  
  const category = categorizeRecord(record);
  
  return generatePredictionByCategory(category);
};

// Blood Test Analysis
function generateBloodTestAnalysis(record: MedicalRecord): Analysis {
  const bloodTestTypes = [
    {
      summary: "Complete Blood Count (CBC) analysis reveals comprehensive information about blood cell populations, immune system status, and potential hematological conditions.",
      insights: [
        {
          type: "warning" as const,
          title: "Elevated White Blood Cell Count",
          description: "WBC count of 12,800/μL is above normal range (4,500-11,000), suggesting possible infection, inflammation, or immune system activation requiring further evaluation."
        },
        {
          type: "success" as const,
          title: "Normal Hemoglobin Levels",
          description: "Hemoglobin at 14.5 g/dL is within healthy range, indicating good oxygen-carrying capacity and no signs of anemia."
        },
        {
          type: "info" as const,
          title: "Platelet Count Assessment",
          description: "Platelet count of 280,000/μL is normal, indicating proper blood clotting function and no bleeding disorders."
        }
      ],
      extractedData: {
        conditions: ["Leukocytosis", "Possible Infection"],
        testResults: [
          { name: "WBC", value: "12.8", unit: "K/μL", referenceRange: "4.5-11.0" },
          { name: "RBC", value: "4.6", unit: "M/μL", referenceRange: "4.2-5.4" },
          { name: "Hemoglobin", value: "14.5", unit: "g/dL", referenceRange: "12.0-15.5" },
          { name: "Hematocrit", value: "42.3", unit: "%", referenceRange: "36-46" },
          { name: "Platelets", value: "280", unit: "K/μL", referenceRange: "150-450" }
        ]
      }
    },
    {
      summary: "Blood chemistry panel showing metabolic status, organ function, and electrolyte balance with several key findings requiring attention.",
      insights: [
        {
          type: "error" as const,
          title: "Elevated Blood Glucose",
          description: "Fasting glucose of 145 mg/dL is significantly elevated, indicating poor glycemic control and potential diabetes requiring immediate intervention."
        },
        {
          type: "warning" as const,
          title: "Kidney Function Concern",
          description: "Creatinine level of 1.4 mg/dL is slightly elevated, suggesting possible kidney function impairment that needs monitoring."
        },
        {
          type: "success" as const,
          title: "Normal Liver Enzymes",
          description: "ALT and AST levels are within normal range, indicating healthy liver function."
        }
      ],
      extractedData: {
        conditions: ["Hyperglycemia", "Mild Kidney Impairment"],
        testResults: [
          { name: "Glucose", value: "145", unit: "mg/dL", referenceRange: "70-100" },
          { name: "Creatinine", value: "1.4", unit: "mg/dL", referenceRange: "0.6-1.2" },
          { name: "BUN", value: "22", unit: "mg/dL", referenceRange: "7-20" },
          { name: "ALT", value: "28", unit: "U/L", referenceRange: "7-56" },
          { name: "AST", value: "32", unit: "U/L", referenceRange: "10-40" }
        ]
      }
    }
  ];
  
  return getRandomElement(bloodTestTypes);
}

// Urine Test Analysis
function generateUrineTestAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive urinalysis revealing kidney function, urinary tract health, and metabolic indicators with important findings for clinical correlation.",
    insights: [
      {
        type: "warning",
        title: "Proteinuria Detected",
        description: "Protein levels of 2+ in urine suggest possible kidney damage or urinary tract inflammation requiring further nephrology evaluation."
      },
      {
        type: "error",
        title: "Bacterial Infection Indicated",
        description: "High white blood cell count and nitrites positive suggest urinary tract infection requiring antibiotic treatment."
      },
      {
        type: "info",
        title: "Glucose Presence",
        description: "Trace glucose in urine may indicate poor diabetic control or stress-induced glycosuria."
      }
    ],
    extractedData: {
      conditions: ["Urinary Tract Infection", "Proteinuria", "Glycosuria"],
      testResults: [
        { name: "Protein", value: "2+", unit: "", referenceRange: "Negative" },
        { name: "Glucose", value: "Trace", unit: "", referenceRange: "Negative" },
        { name: "WBC", value: "15-20", unit: "/hpf", referenceRange: "0-5" },
        { name: "RBC", value: "3-5", unit: "/hpf", referenceRange: "0-2" },
        { name: "Nitrites", value: "Positive", unit: "", referenceRange: "Negative" }
      ],
      findings: [
        "Cloudy appearance",
        "Positive nitrites indicating bacterial infection",
        "Elevated protein suggesting kidney involvement",
        "Microscopic hematuria present"
      ]
    }
  };
}

// X-Ray Analysis
function generateXRayAnalysis(record: MedicalRecord): Analysis {
  const xrayTypes = [
    {
      summary: "Chest X-ray evaluation demonstrating pulmonary parenchyma, cardiac silhouette, and thoracic structures with notable radiographic findings.",
      insights: [
        {
          type: "warning" as const,
          title: "Pulmonary Infiltrate",
          description: "Right lower lobe opacity consistent with pneumonia or consolidation requiring clinical correlation and possible antibiotic therapy."
        },
        {
          type: "success" as const,
          title: "Normal Cardiac Size",
          description: "Cardiothoracic ratio within normal limits with no evidence of cardiomegaly or heart failure."
        },
        {
          type: "info" as const,
          title: "Clear Lung Fields",
          description: "Left lung shows clear parenchyma with no evidence of pneumothorax or pleural effusion."
        }
      ],
      extractedData: {
        conditions: ["Right Lower Lobe Pneumonia"],
        findings: [
          "Right lower lobe consolidation",
          "Normal cardiac silhouette",
          "No pleural effusion",
          "Clear left lung fields",
          "Normal mediastinal contours"
        ]
      }
    },
    {
      summary: "Bone X-ray showing skeletal integrity and joint alignment with orthopedic findings requiring clinical assessment.",
      insights: [
        {
          type: "error" as const,
          title: "Fracture Identified",
          description: "Displaced fracture of the distal radius with angulation requiring immediate orthopedic consultation and reduction."
        },
        {
          type: "warning" as const,
          title: "Joint Space Narrowing",
          description: "Degenerative changes in adjacent joints suggesting early osteoarthritis development."
        },
        {
          type: "info" as const,
          title: "Bone Density",
          description: "Overall bone density appears adequate for age with no obvious osteoporotic changes."
        }
      ],
      extractedData: {
        conditions: ["Distal Radius Fracture", "Early Osteoarthritis"],
        findings: [
          "Displaced fracture with 15-degree angulation",
          "No intra-articular extension",
          "Mild joint space narrowing",
          "No subluxation",
          "Adequate bone mineralization"
        ]
      }
    }
  ];
  
  return getRandomElement(xrayTypes);
}

// MRI Analysis
function generateMRIAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Advanced MRI imaging providing detailed soft tissue evaluation with high-resolution anatomical assessment and pathological findings.",
    insights: [
      {
        type: "warning",
        title: "Disc Herniation",
        description: "L4-L5 disc herniation with nerve root compression causing radiculopathy symptoms requiring neurosurgical evaluation."
      },
      {
        type: "info",
        title: "Spinal Alignment",
        description: "Overall spinal alignment maintained with no evidence of spondylolisthesis or instability."
      },
      {
        type: "success",
        title: "No Cord Compression",
        description: "Spinal cord appears normal with no evidence of myelopathy or significant compression."
      }
    ],
    extractedData: {
      conditions: ["L4-L5 Disc Herniation", "Radiculopathy"],
      findings: [
        "Central disc herniation at L4-L5",
        "Mild nerve root compression",
        "Preserved spinal canal diameter",
        "No significant stenosis",
        "Normal signal intensity in vertebral bodies"
      ]
    }
  };
}

// CT Scan Analysis
function generateCTScanAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "High-resolution CT imaging demonstrating detailed anatomical structures with cross-sectional analysis revealing important diagnostic findings.",
    insights: [
      {
        type: "error",
        title: "Mass Lesion Detected",
        description: "3.2 cm heterogeneous mass in the right upper lobe concerning for malignancy requiring urgent oncological consultation."
      },
      {
        type: "warning",
        title: "Lymph Node Enlargement",
        description: "Multiple enlarged mediastinal lymph nodes suggesting possible metastatic spread or inflammatory process."
      },
      {
        type: "info",
        title: "Vascular Structures",
        description: "Great vessels appear normal with no evidence of aneurysm or significant atherosclerotic disease."
      }
    ],
    extractedData: {
      conditions: ["Lung Mass", "Lymphadenopathy", "Possible Malignancy"],
      findings: [
        "3.2 cm right upper lobe mass",
        "Enlarged hilar lymph nodes",
        "No pleural effusion",
        "Normal vascular anatomy",
        "No bone destruction"
      ]
    }
  };
}

// Ultrasound Analysis
function generateUltrasoundAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Real-time ultrasound imaging providing dynamic assessment of organ structure and function with Doppler flow evaluation.",
    insights: [
      {
        type: "warning",
        title: "Gallbladder Stones",
        description: "Multiple echogenic foci with posterior acoustic shadowing consistent with cholelithiasis requiring surgical consultation."
      },
      {
        type: "success",
        title: "Normal Liver Echogenicity",
        description: "Liver parenchyma shows normal echogenicity with no evidence of fatty infiltration or mass lesions."
      },
      {
        type: "info",
        title: "Kidney Function",
        description: "Both kidneys show normal size and echogenicity with no evidence of hydronephrosis or stones."
      }
    ],
    extractedData: {
      conditions: ["Cholelithiasis"],
      findings: [
        "Multiple gallstones identified",
        "No gallbladder wall thickening",
        "Normal liver size and texture",
        "No biliary ductal dilatation",
        "Normal renal echogenicity"
      ]
    }
  };
}

// ECG Analysis
function generateECGAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "12-lead electrocardiogram analysis showing cardiac rhythm, conduction, and electrical activity with important cardiological findings.",
    insights: [
      {
        type: "warning",
        title: "Atrial Fibrillation",
        description: "Irregularly irregular rhythm consistent with atrial fibrillation requiring anticoagulation and rate control management."
      },
      {
        type: "info",
        title: "Ventricular Rate",
        description: "Ventricular response rate of 88 bpm is within acceptable range for controlled atrial fibrillation."
      },
      {
        type: "success",
        title: "No Ischemic Changes",
        description: "No ST-segment depression or T-wave inversions suggesting absence of acute coronary syndrome."
      }
    ],
    extractedData: {
      conditions: ["Atrial Fibrillation"],
      vitalSigns: [
        { name: "Heart Rate", value: "88", unit: "bpm" },
        { name: "PR Interval", value: "Variable", unit: "ms" },
        { name: "QRS Duration", value: "92", unit: "ms" },
        { name: "QT Interval", value: "420", unit: "ms" }
      ],
      findings: [
        "Irregularly irregular rhythm",
        "Absent P waves",
        "Normal QRS morphology",
        "No acute ST changes",
        "Controlled ventricular response"
      ]
    }
  };
}

// Liver Function Analysis
function generateLiverFunctionAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive liver function panel assessing hepatocellular integrity, synthetic function, and metabolic capacity with clinical correlation.",
    insights: [
      {
        type: "error",
        title: "Severe Liver Dysfunction",
        description: "Markedly elevated ALT (180 U/L) and AST (220 U/L) indicating significant hepatocellular damage requiring immediate intervention."
      },
      {
        type: "warning",
        title: "Impaired Synthetic Function",
        description: "Low albumin and prolonged PT suggest decreased synthetic capacity and possible liver failure."
      },
      {
        type: "info",
        title: "Bilirubin Elevation",
        description: "Total bilirubin of 3.8 mg/dL indicates impaired hepatic excretion and possible cholestasis."
      }
    ],
    extractedData: {
      conditions: ["Acute Hepatitis", "Liver Dysfunction"],
      testResults: [
        { name: "ALT", value: "180", unit: "U/L", referenceRange: "7-56" },
        { name: "AST", value: "220", unit: "U/L", referenceRange: "10-40" },
        { name: "Total Bilirubin", value: "3.8", unit: "mg/dL", referenceRange: "0.3-1.2" },
        { name: "Albumin", value: "2.8", unit: "g/dL", referenceRange: "3.5-5.0" },
        { name: "PT", value: "18", unit: "sec", referenceRange: "11-13" }
      ]
    }
  };
}

// Lipid Profile Analysis
function generateLipidProfileAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive lipid assessment evaluating cardiovascular risk factors and cholesterol metabolism with therapeutic implications.",
    insights: [
      {
        type: "error",
        title: "Severe Dyslipidemia",
        description: "LDL cholesterol of 185 mg/dL is significantly elevated, placing patient at high risk for cardiovascular events requiring statin therapy."
      },
      {
        type: "warning",
        title: "Low HDL Cholesterol",
        description: "HDL of 32 mg/dL is below protective levels, reducing cardiovascular protection and requiring lifestyle modifications."
      },
      {
        type: "warning",
        title: "Elevated Triglycerides",
        description: "Triglyceride level of 298 mg/dL indicates metabolic dysfunction and increased pancreatitis risk."
      }
    ],
    extractedData: {
      conditions: ["Severe Dyslipidemia", "Cardiovascular Risk"],
      testResults: [
        { name: "Total Cholesterol", value: "268", unit: "mg/dL", referenceRange: "<200" },
        { name: "LDL", value: "185", unit: "mg/dL", referenceRange: "<100" },
        { name: "HDL", value: "32", unit: "mg/dL", referenceRange: ">40" },
        { name: "Triglycerides", value: "298", unit: "mg/dL", referenceRange: "<150" },
        { name: "Non-HDL", value: "236", unit: "mg/dL", referenceRange: "<130" }
      ]
    }
  };
}

// Thyroid Function Analysis
function generateThyroidFunctionAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Thyroid function evaluation assessing hormonal balance, metabolic regulation, and endocrine system integrity with clinical implications.",
    insights: [
      {
        type: "warning",
        title: "Hypothyroidism Detected",
        description: "Elevated TSH (12.4 mIU/L) with low Free T4 indicates primary hypothyroidism requiring thyroid hormone replacement therapy."
      },
      {
        type: "info",
        title: "Autoimmune Component",
        description: "Elevated TPO antibodies suggest Hashimoto's thyroiditis as the underlying cause of thyroid dysfunction."
      },
      {
        type: "success",
        title: "No Thyroid Nodules",
        description: "Physical examination and imaging show no palpable nodules or structural abnormalities."
      }
    ],
    extractedData: {
      conditions: ["Primary Hypothyroidism", "Hashimoto's Thyroiditis"],
      testResults: [
        { name: "TSH", value: "12.4", unit: "mIU/L", referenceRange: "0.4-4.0" },
        { name: "Free T4", value: "0.6", unit: "ng/dL", referenceRange: "0.8-1.8" },
        { name: "Free T3", value: "2.1", unit: "pg/mL", referenceRange: "2.3-4.2" },
        { name: "TPO Ab", value: "156", unit: "IU/mL", referenceRange: "<35" }
      ]
    }
  };
}

// Diabetes Panel Analysis
function generateDiabetesPanelAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive diabetes assessment evaluating glycemic control, insulin function, and diabetic complications with management recommendations.",
    insights: [
      {
        type: "error",
        title: "Poor Glycemic Control",
        description: "HbA1c of 9.8% indicates severely uncontrolled diabetes with high risk of complications requiring immediate intervention."
      },
      {
        type: "warning",
        title: "Diabetic Nephropathy",
        description: "Elevated microalbumin suggests early kidney damage from diabetes requiring ACE inhibitor therapy and monitoring."
      },
      {
        type: "info",
        title: "Insulin Resistance",
        description: "Elevated C-peptide levels indicate ongoing insulin production but significant insulin resistance."
      }
    ],
    extractedData: {
      conditions: ["Type 2 Diabetes", "Diabetic Nephropathy", "Poor Glycemic Control"],
      testResults: [
        { name: "HbA1c", value: "9.8", unit: "%", referenceRange: "<7.0" },
        { name: "Fasting Glucose", value: "198", unit: "mg/dL", referenceRange: "70-100" },
        { name: "C-Peptide", value: "3.2", unit: "ng/mL", referenceRange: "1.1-4.4" },
        { name: "Microalbumin", value: "85", unit: "mg/g", referenceRange: "<30" }
      ]
    }
  };
}

// Vitamin Panel Analysis
function generateVitaminPanelAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive vitamin and micronutrient assessment revealing deficiencies and metabolic status affecting overall health and wellbeing.",
    insights: [
      {
        type: "error",
        title: "Severe Vitamin D Deficiency",
        description: "25-OH Vitamin D level of 12 ng/mL indicates severe deficiency requiring high-dose supplementation and bone health monitoring."
      },
      {
        type: "warning",
        title: "B12 Deficiency",
        description: "Low vitamin B12 may explain fatigue and neurological symptoms, requiring intramuscular supplementation."
      },
      {
        type: "success",
        title: "Normal Folate Levels",
        description: "Folate levels are adequate with no evidence of megaloblastic anemia risk."
      }
    ],
    extractedData: {
      conditions: ["Vitamin D Deficiency", "Vitamin B12 Deficiency"],
      testResults: [
        { name: "Vitamin D", value: "12", unit: "ng/mL", referenceRange: "30-100" },
        { name: "Vitamin B12", value: "180", unit: "pg/mL", referenceRange: "300-900" },
        { name: "Folate", value: "8.5", unit: "ng/mL", referenceRange: "3.0-20.0" },
        { name: "Iron", value: "65", unit: "μg/dL", referenceRange: "60-170" }
      ]
    }
  };
}

// General Analysis
function generateGeneralAnalysis(record: MedicalRecord): Analysis {
  return {
    summary: "Comprehensive medical evaluation showing overall health status with identification of key areas for health maintenance and improvement.",
    insights: [
      {
        type: "info",
        title: "General Health Assessment",
        description: "Overall health parameters within acceptable ranges with some areas identified for optimization and preventive care."
      },
      {
        type: "warning",
        title: "Risk Factor Identification",
        description: "Several modifiable risk factors identified that could benefit from lifestyle interventions and medical management."
      },
      {
        type: "success",
        title: "Preventive Care Compliance",
        description: "Appropriate preventive care measures in place with good adherence to recommended screening guidelines."
      }
    ],
    extractedData: {
      conditions: ["Hypertension", "Prediabetes"],
      findings: [
        "Stable vital signs",
        "Weight management needed",
        "Blood pressure control improving",
        "Regular exercise recommended",
        "Dietary modifications beneficial"
      ]
    }
  };
}

// Generate predictions based on category
function generatePredictionByCategory(category: string): Prediction {
  let riskScore = 0;
  let recommendations: string[] = [];
  let predictedOutcomes: { outcome: string; probability: number; timeframe: string; }[] = [];

  switch (category) {
    case "Blood Test":
      riskScore = getRandomInt(25, 65);
      recommendations = [
        "Follow up with hematologist for blood count abnormalities",
        "Repeat blood work in 2-4 weeks to monitor trends",
        "Consider antibiotic therapy if infection suspected",
        "Maintain adequate hydration and rest"
      ];
      predictedOutcomes = [
        { outcome: "Blood count normalization", probability: 0.75, timeframe: "2-4 weeks" },
        { outcome: "Need for further testing", probability: 0.35, timeframe: "1-2 weeks" },
        { outcome: "Complete recovery", probability: 0.85, timeframe: "4-8 weeks" }
      ];
      break;

    case "Urine Test":
      riskScore = getRandomInt(30, 70);
      recommendations = [
        "Complete prescribed antibiotic course",
        "Increase fluid intake to flush urinary system",
        "Follow up urine culture after treatment",
        "Consider urological evaluation if recurrent"
      ];
      predictedOutcomes = [
        { outcome: "UTI resolution", probability: 0.90, timeframe: "3-7 days" },
        { outcome: "Symptom improvement", probability: 0.95, timeframe: "24-48 hours" },
        { outcome: "Recurrent infection", probability: 0.15, timeframe: "1-3 months" }
      ];
      break;

    case "X-Ray":
      riskScore = getRandomInt(40, 80);
      recommendations = [
        "Orthopedic consultation for fracture management",
        "Physical therapy after initial healing",
        "Pain management with prescribed medications",
        "Activity modification during recovery"
      ];
      predictedOutcomes = [
        { outcome: "Bone healing", probability: 0.85, timeframe: "6-8 weeks" },
        { outcome: "Return to normal activity", probability: 0.80, timeframe: "8-12 weeks" },
        { outcome: "Complications", probability: 0.10, timeframe: "2-4 weeks" }
      ];
      break;

    case "MRI":
      riskScore = getRandomInt(35, 75);
      recommendations = [
        "Neurosurgical consultation for disc herniation",
        "Physical therapy and pain management",
        "Activity modification to prevent worsening",
        "Consider epidural injection for pain relief"
      ];
      predictedOutcomes = [
        { outcome: "Pain improvement", probability: 0.70, timeframe: "4-6 weeks" },
        { outcome: "Functional recovery", probability: 0.65, timeframe: "2-3 months" },
        { outcome: "Need for surgery", probability: 0.25, timeframe: "3-6 months" }
      ];
      break;

    case "CT Scan":
      riskScore = getRandomInt(60, 90);
      recommendations = [
        "Urgent oncology consultation",
        "Tissue biopsy for definitive diagnosis",
        "Staging studies if malignancy confirmed",
        "Multidisciplinary team approach"
      ];
      predictedOutcomes = [
        { outcome: "Definitive diagnosis", probability: 0.95, timeframe: "1-2 weeks" },
        { outcome: "Treatment initiation", probability: 0.90, timeframe: "2-4 weeks" },
        { outcome: "Disease progression", probability: 0.40, timeframe: "1-3 months" }
      ];
      break;

    default:
      riskScore = getRandomInt(20, 50);
      recommendations = [
        "Regular follow-up with primary care physician",
        "Continue current treatment plan",
        "Monitor for symptom changes",
        "Maintain healthy lifestyle modifications"
      ];
      predictedOutcomes = [
        { outcome: "Stable condition", probability: 0.80, timeframe: "3-6 months" },
        { outcome: "Improvement", probability: 0.60, timeframe: "1-3 months" },
        { outcome: "Need for intervention", probability: 0.20, timeframe: "1-6 months" }
      ];
      break;
  }

  let riskLevel: "Low" | "Medium" | "High";
  if (riskScore < 35) riskLevel = "Low";
  else if (riskScore < 65) riskLevel = "Medium";
  else riskLevel = "High";

  return {
    riskScore,
    riskLevel,
    predictedOutcomes,
    recommendations: recommendations.slice(0, 4)
  };
}
