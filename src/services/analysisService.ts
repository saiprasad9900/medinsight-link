
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
  
  if (type === "lab result" || title.includes("lab") || title.includes("blood") || title.includes("test")) {
    return "Laboratory";
  } else if (type === "medical image" || title.includes("x-ray") || title.includes("scan") || title.includes("mri") || title.includes("ct")) {
    return "Radiology";
  } else if (title.includes("heart") || title.includes("cardiac") || title.includes("ecg") || title.includes("ekg") || title.includes("cardio")) {
    return "Cardiology";
  } else if (title.includes("prescription") || title.includes("medication") || title.includes("drug")) {
    return "Pharmacy";
  } else if (title.includes("surgery") || title.includes("operation") || title.includes("post-op") || title.includes("pre-op")) {
    return "Surgical";
  } else if (title.includes("neuro") || title.includes("brain") || title.includes("spinal") || title.includes("nerve")) {
    return "Neurology";
  } else if (title.includes("ortho") || title.includes("bone") || title.includes("joint") || title.includes("fracture")) {
    return "Orthopedics";
  } else if (title.includes("derma") || title.includes("skin")) {
    return "Dermatology";
  } else {
    return "General";
  }
};

// Enhanced analysis function with more detailed and varied insights
export const analyzeRecord = async (record: MedicalRecord): Promise<Analysis> => {
  console.log(`Analyzing record: ${record.title} (${record.type})`);
  
  // Simulate more realistic processing delay with progress updates
  await new Promise(res => setTimeout(res, 2000));
  
  const category = record.category || categorizeRecord(record);
  const title = record.title.toLowerCase();
  
  // Generate more detailed analyses based on record type and content
  switch (category) {
    case "Laboratory":
      return generateLabAnalysis(record, title);
    case "Radiology":
      return generateRadiologyAnalysis(record, title);
    case "Cardiology":
      return generateCardiologyAnalysis(record, title);
    case "Neurology":
      return generateNeurologyAnalysis(record, title);
    case "Orthopedics":
      return generateOrthopedicsAnalysis(record, title);
    case "Dermatology":
      return generateDermatologyAnalysis(record, title);
    case "Pharmacy":
      return generatePharmacyAnalysis(record, title);
    case "Surgical":
      return generateSurgicalAnalysis(record, title);
    default:
      return generateGeneralAnalysis(record, title);
  }
};

// Generate outcome predictions based on the record and its analysis
export const predictOutcomes = async (record: MedicalRecord): Promise<Prediction> => {
  console.log(`Predicting outcomes for: ${record.title}`);
  
  await new Promise(res => setTimeout(res, 800));
  
  const category = record.category || categorizeRecord(record);
  
  let riskScore = 0;
  let recommendations: string[] = [];
  
  if (category === "Cardiology") {
    riskScore = getRandomInt(40, 80);
    recommendations = [
      "Schedule follow-up with cardiologist within 2-4 weeks",
      "Monitor blood pressure daily and maintain log",
      "Follow heart-healthy diet with reduced sodium intake",
      "Take prescribed cardiac medications as directed",
      "Engage in light cardiovascular exercise as approved by doctor",
      "Avoid excessive caffeine and alcohol consumption"
    ];
  } else if (category === "Laboratory") {
    riskScore = getRandomInt(20, 60);
    recommendations = [
      "Discuss abnormal results with primary care physician",
      "Consider dietary modifications based on lipid/glucose levels",
      "Schedule repeat testing in 8-12 weeks to monitor progress",
      "Maintain proper hydration before future blood draws",
      "Continue current medications unless advised otherwise",
      "Monitor for symptoms related to identified conditions"
    ];
  } else if (category === "Radiology") {
    riskScore = getRandomInt(30, 70);
    recommendations = [
      "Consult with specialist regarding imaging findings",
      "Schedule follow-up imaging as recommended by physician",
      "Avoid activities that may worsen identified conditions",
      "Consider physical therapy for musculoskeletal findings",
      "Monitor for new or worsening symptoms",
      "Maintain current treatment regimen"
    ];
  } else if (category === "Neurology") {
    riskScore = getRandomInt(35, 75);
    recommendations = [
      "Follow up with neurologist for detailed evaluation",
      "Implement cognitive exercises and brain training activities",
      "Maintain regular sleep schedule and stress management",
      "Consider occupational therapy if functional impairment present",
      "Monitor neurological symptoms closely",
      "Ensure medication compliance for neurological conditions"
    ];
  } else {
    riskScore = getRandomInt(15, 50);
    recommendations = [
      "Schedule routine follow-up appointment",
      "Continue current treatment plan as prescribed",
      "Monitor for any new or worsening symptoms",
      "Maintain healthy lifestyle modifications",
      "Adhere to medication schedule",
      "Report significant changes to healthcare provider"
    ];
  }
  
  let riskLevel: "Low" | "Medium" | "High";
  if (riskScore < 35) riskLevel = "Low";
  else if (riskScore < 65) riskLevel = "Medium";
  else riskLevel = "High";
  
  const predictedOutcomes = [
    {
      outcome: "Symptom improvement",
      probability: Math.max(0.1, (100 - riskScore) / 100),
      timeframe: "2-6 weeks"
    },
    {
      outcome: "Need for additional treatment",
      probability: Math.min(0.9, riskScore / 100 + 0.1),
      timeframe: "1-3 months"
    },
    {
      outcome: "Complete resolution",
      probability: Math.max(0.1, (90 - riskScore) / 120),
      timeframe: "3-12 months"
    }
  ];
  
  return {
    riskScore,
    riskLevel,
    predictedOutcomes,
    recommendations: recommendations.slice(0, 4) // Limit to 4 recommendations
  };
};

// Specialized analysis generators
function generateLabAnalysis(record: MedicalRecord, title: string): Analysis {
  const labTypes = {
    blood: {
      summary: "Comprehensive blood panel analysis reveals important insights about your overall health status, immune function, and potential areas requiring attention.",
      insights: [
        {
          type: "warning" as const,
          title: "Elevated White Blood Cell Count",
          description: "WBC count shows elevation suggesting possible infection, inflammation, or immune system activation. This requires monitoring and potential follow-up testing."
        },
        {
          type: "success" as const,
          title: "Normal Hemoglobin Levels",
          description: "Hemoglobin and red blood cell counts are within healthy ranges, indicating good oxygen-carrying capacity and no signs of anemia."
        },
        {
          type: "info" as const,
          title: "Platelet Function",
          description: "Platelet count and function appear normal, indicating proper blood clotting mechanisms are functioning well."
        }
      ],
      extractedData: {
        conditions: ["Mild Leukocytosis"],
        testResults: [
          { name: "WBC", value: "12.5", unit: "K/uL", referenceRange: "4.5-11.0" },
          { name: "RBC", value: "4.8", unit: "M/uL", referenceRange: "4.5-5.5" },
          { name: "Hemoglobin", value: "14.8", unit: "g/dL", referenceRange: "13.5-17.5" },
          { name: "Platelets", value: "285", unit: "K/uL", referenceRange: "150-450" }
        ]
      }
    },
    lipid: {
      summary: "Lipid panel assessment showing cardiovascular risk factors and cholesterol management status. Results indicate areas for dietary and lifestyle modifications.",
      insights: [
        {
          type: "error" as const,
          title: "Elevated LDL Cholesterol",
          description: "LDL cholesterol levels are significantly above recommended ranges, increasing cardiovascular disease risk. Immediate dietary changes and possible medication needed."
        },
        {
          type: "warning" as const,
          title: "Low HDL Cholesterol",
          description: "HDL cholesterol is below optimal levels, reducing cardiovascular protection. Exercise and omega-3 supplementation may help improve levels."
        },
        {
          type: "info" as const,
          title: "Triglyceride Levels",
          description: "Triglyceride levels are within acceptable range but should continue to be monitored with dietary modifications."
        }
      ],
      extractedData: {
        conditions: ["Dyslipidemia", "Cardiovascular Risk"],
        testResults: [
          { name: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200" },
          { name: "LDL", value: "168", unit: "mg/dL", referenceRange: "<100" },
          { name: "HDL", value: "38", unit: "mg/dL", referenceRange: ">40" },
          { name: "Triglycerides", value: "142", unit: "mg/dL", referenceRange: "<150" }
        ]
      }
    },
    thyroid: {
      summary: "Thyroid function evaluation showing metabolic regulation status. These results help assess energy levels, weight management, and overall endocrine health.",
      insights: [
        {
          type: "warning" as const,
          title: "Subclinical Hypothyroidism",
          description: "TSH levels are elevated while T4 remains normal, suggesting early thyroid dysfunction. This may explain fatigue, weight changes, or mood symptoms."
        },
        {
          type: "success" as const,
          title: "Normal Free T4",
          description: "Free T4 levels are within normal range, indicating adequate thyroid hormone production at this time."
        },
        {
          type: "info" as const,
          title: "Thyroid Antibodies",
          description: "Thyroid antibody levels help determine if thyroid dysfunction is autoimmune in nature."
        }
      ],
      extractedData: {
        conditions: ["Subclinical Hypothyroidism"],
        testResults: [
          { name: "TSH", value: "6.8", unit: "mIU/L", referenceRange: "0.4-4.0" },
          { name: "Free T4", value: "1.3", unit: "ng/dL", referenceRange: "0.8-1.8" },
          { name: "T3", value: "3.2", unit: "pg/mL", referenceRange: "2.3-4.2" }
        ]
      }
    }
  };

  // Determine lab type based on title
  if (title.includes("lipid") || title.includes("cholesterol")) {
    return labTypes.lipid;
  } else if (title.includes("thyroid") || title.includes("tsh")) {
    return labTypes.thyroid;
  } else {
    return labTypes.blood;
  }
}

function generateRadiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  const radiologyTypes = {
    chest: {
      summary: "Chest imaging evaluation shows pulmonary and cardiac structures. Advanced AI analysis has identified key findings requiring clinical correlation.",
      insights: [
        {
          type: "warning" as const,
          title: "Pulmonary Opacity",
          description: "Small opacity noted in right lower lobe consistent with early consolidation. Clinical correlation needed to determine if infectious or inflammatory."
        },
        {
          type: "success" as const,
          title: "Normal Cardiac Silhouette",
          description: "Heart size and shape appear normal with no evidence of enlargement or structural abnormalities."
        },
        {
          type: "info" as const,
          title: "Clear Airways",
          description: "Bronchial tree appears clear with no evidence of obstruction or significant inflammation."
        }
      ],
      extractedData: {
        findings: [
          "Small right lower lobe opacity",
          "Normal cardiac silhouette",
          "Clear bilateral lung fields otherwise",
          "No pleural effusion",
          "Normal mediastinal contours"
        ]
      }
    },
    brain: {
      summary: "Brain imaging demonstrates cerebral structure and function. Detailed analysis reveals age-appropriate changes with some areas requiring attention.",
      insights: [
        {
          type: "info" as const,
          title: "Age-Related Changes",
          description: "Mild cerebral atrophy consistent with normal aging process. No acute abnormalities detected."
        },
        {
          type: "warning" as const,
          title: "Small Vessel Disease",
          description: "Scattered T2 hyperintensities suggesting mild small vessel ischemic changes. Common in adults but should be monitored."
        },
        {
          type: "success" as const,
          title: "No Mass Effect",
          description: "No evidence of space-occupying lesions, hemorrhage, or midline shift."
        }
      ],
      extractedData: {
        findings: [
          "Mild cerebral volume loss",
          "Scattered periventricular T2 hyperintensities",
          "Normal ventricular size",
          "No acute infarct",
          "Preserved gray-white differentiation"
        ]
      }
    }
  };

  if (title.includes("brain") || title.includes("head") || title.includes("mri")) {
    return radiologyTypes.brain;
  } else {
    return radiologyTypes.chest;
  }
}

function generateCardiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Cardiac evaluation demonstrates heart rhythm, electrical conduction, and structural function. Analysis reveals important findings for cardiovascular health management.",
    insights: [
      {
        type: "warning",
        title: "Mild Conduction Delay",
        description: "First-degree AV block noted with prolonged PR interval. Usually benign but requires monitoring for progression."
      },
      {
        type: "info",
        title: "Sinus Rhythm",
        description: "Regular sinus rhythm maintained with occasional premature atrial contractions. Rate within normal limits."
      },
      {
        type: "success",
        title: "No Ischemic Changes",
        description: "No evidence of acute coronary syndrome or significant ischemic changes on current evaluation."
      }
    ],
    extractedData: {
      conditions: ["First-degree AV Block", "Premature Atrial Contractions"],
      vitalSigns: [
        { name: "Heart Rate", value: "68", unit: "bpm" },
        { name: "PR Interval", value: "210", unit: "ms" },
        { name: "QRS Duration", value: "88", unit: "ms" }
      ],
      findings: [
        "Regular sinus rhythm",
        "First-degree AV block",
        "Rare PACs",
        "Normal axis",
        "No ST-T abnormalities"
      ]
    }
  };
}

function generateNeurologyAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Neurological assessment evaluating cognitive function, motor skills, and nervous system integrity. Results show areas requiring monitoring and intervention.",
    insights: [
      {
        type: "warning",
        title: "Mild Cognitive Changes",
        description: "Subtle changes in short-term memory and processing speed noted. May benefit from cognitive rehabilitation strategies."
      },
      {
        type: "success",
        title: "Preserved Motor Function",
        description: "Motor strength and coordination remain intact with no evidence of significant neurological deficits."
      },
      {
        type: "info",
        title: "Sensory Function",
        description: "Sensory testing reveals normal function in all major modalities with appropriate responses."
      }
    ],
    extractedData: {
      conditions: ["Mild Cognitive Impairment"],
      findings: [
        "Mild short-term memory changes",
        "Normal motor examination",
        "Intact sensory function",
        "Appropriate reflexes",
        "Normal gait and balance"
      ]
    }
  };
}

function generateOrthopedicsAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Orthopedic evaluation of musculoskeletal system reveals joint health, bone integrity, and functional capacity. Findings suggest targeted intervention strategies.",
    insights: [
      {
        type: "warning",
        title: "Joint Degeneration",
        description: "Moderate osteoarthritic changes in weight-bearing joints with cartilage thinning and osteophyte formation."
      },
      {
        type: "info",
        title: "Range of Motion",
        description: "Mild limitation in joint mobility but functional range preserved for activities of daily living."
      },
      {
        type: "success",
        title: "Bone Density",
        description: "Bone mineral density within acceptable range for age group with no evidence of significant osteoporosis."
      }
    ],
    extractedData: {
      conditions: ["Osteoarthritis", "Joint Stiffness"],
      findings: [
        "Moderate joint space narrowing",
        "Osteophyte formation",
        "Preserved bone alignment",
        "No acute fractures",
        "Mild synovial thickening"
      ]
    }
  };
}

function generateDermatologyAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Dermatological examination reveals skin health status and identifies lesions requiring attention. Advanced imaging analysis provides detailed characterization.",
    insights: [
      {
        type: "warning",
        title: "Atypical Pigmented Lesion",
        description: "Irregular pigmented lesion with asymmetric features requiring dermatological evaluation and possible biopsy."
      },
      {
        type: "success",
        title: "Overall Skin Health",
        description: "Surrounding skin appears healthy with good texture and color uniformity."
      },
      {
        type: "info",
        title: "UV Damage Assessment",
        description: "Mild solar damage noted consistent with age and sun exposure history."
      }
    ],
    extractedData: {
      conditions: ["Atypical Nevus", "Solar Damage"],
      findings: [
        "Irregular pigmented lesion 6mm",
        "Asymmetric borders",
        "Color variation present",
        "No ulceration",
        "Surrounding skin normal"
      ]
    }
  };
}

function generatePharmacyAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Medication review and pharmaceutical analysis showing current prescriptions, interactions, and optimization opportunities for better health outcomes.",
    insights: [
      {
        type: "warning",
        title: "Drug Interaction Alert",
        description: "Potential moderate interaction identified between current medications. Monitor for side effects and consider timing adjustments."
      },
      {
        type: "info",
        title: "Dosing Optimization",
        description: "Current dosing appears appropriate but may benefit from consolidation to improve medication adherence."
      },
      {
        type: "success",
        title: "Therapeutic Efficacy",
        description: "Medication regimen appears well-tolerated with expected therapeutic benefits being achieved."
      }
    ],
    extractedData: {
      medications: [
        "Lisinopril 10mg daily",
        "Atorvastatin 20mg evening",
        "Metformin 500mg twice daily",
        "Aspirin 81mg daily"
      ],
      conditions: ["Hypertension", "Dyslipidemia", "Type 2 Diabetes"],
      findings: [
        "Appropriate medication selection",
        "Potential drug interaction",
        "Complex dosing schedule",
        "Good therapeutic coverage"
      ]
    }
  };
}

function generateSurgicalAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Surgical procedure documentation showing operative findings, technique, and post-operative care recommendations for optimal recovery.",
    insights: [
      {
        type: "success",
        title: "Successful Procedure",
        description: "Surgery completed without complications. All objectives achieved with excellent technical execution."
      },
      {
        type: "info",
        title: "Recovery Timeline",
        description: "Expected recovery period of 4-6 weeks with gradual return to normal activities as tolerated."
      },
      {
        type: "warning",
        title: "Post-Op Monitoring",
        description: "Close monitoring required for signs of infection, bleeding, or other complications during initial recovery phase."
      }
    ],
    extractedData: {
      findings: [
        "Procedure completed successfully",
        "No intraoperative complications",
        "Minimal blood loss",
        "Good hemostasis achieved",
        "Expected healing response"
      ]
    }
  };
}

function generateGeneralAnalysis(record: MedicalRecord, title: string): Analysis {
  return {
    summary: "Comprehensive medical evaluation showing overall health status with identification of key areas for health maintenance and improvement.",
    insights: [
      {
        type: "info",
        title: "General Health Status",
        description: "Overall health parameters within acceptable ranges with some areas identified for optimization."
      },
      {
        type: "warning",
        title: "Risk Factor Management",
        description: "Several modifiable risk factors identified that could benefit from lifestyle interventions and medical management."
      },
      {
        type: "success",
        title: "Preventive Care",
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
