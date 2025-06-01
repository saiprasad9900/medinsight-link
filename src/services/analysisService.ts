import { MedicalRecord, Analysis, Prediction, Insight } from "@/types/records";

// Helper function to generate a random number within a range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
      return generateEnhancedLabAnalysis(record, title);
    case "Radiology":
      return generateEnhancedRadiologyAnalysis(record, title);
    case "Cardiology":
      return generateEnhancedCardiologyAnalysis(record, title);
    case "Neurology":
      return generateEnhancedNeurologyAnalysis(record, title);
    case "Orthopedics":
      return generateEnhancedOrthopedicsAnalysis(record, title);
    case "Dermatology":
      return generateEnhancedDermatologyAnalysis(record, title);
    case "Pharmacy":
      return generateEnhancedPharmacyAnalysis(record, title);
    case "Surgical":
      return generateEnhancedSurgicalAnalysis(record, title);
    default:
      return generateEnhancedGeneralAnalysis(record, title);
  }
};

// Generate outcome predictions based on the record and its analysis
export const predictOutcomes = async (record: MedicalRecord): Promise<Prediction> => {
  // In a real implementation, this would use machine learning or another predictive model
  console.log(`Predicting outcomes for: ${record.title}`);
  
  // Simulate processing delay
  await new Promise(res => setTimeout(res, 800));
  
  const category = record.category || categorizeRecord(record);
  
  // Risk levels based on the record category
  let riskScore = 0;
  let recommendations: string[] = [];
  
  if (category === "Cardiology") {
    riskScore = getRandomInt(50, 85);
    recommendations = [
      "Schedule a follow-up appointment within 2 weeks",
      "Monitor blood pressure daily and record readings",
      "Maintain a low-sodium diet as advised by your nutritionist",
      "Take prescribed medications at regular intervals",
      "Consider cardiac rehabilitation program"
    ];
  } else if (category === "Laboratory") {
    riskScore = getRandomInt(30, 70);
    recommendations = [
      "Follow up with your primary care physician to discuss these results",
      "Consider dietary changes based on cholesterol/glucose levels",
      "Schedule repeat testing in 3 months to monitor changes",
      "Ensure proper hydration before future blood tests"
    ];
  } else if (category === "Radiology") {
    riskScore = getRandomInt(40, 75);
    recommendations = [
      "Consult with a specialist regarding the findings",
      "Complete the recommended follow-up imaging in 6 months",
      "Avoid activities that could exacerbate the observed condition",
      "Consider physical therapy for related symptoms"
    ];
  } else {
    riskScore = getRandomInt(20, 60);
    recommendations = [
      "Schedule a follow-up appointment to discuss these findings",
      "Maintain your current medication regimen unless advised otherwise",
      "Report any new or worsening symptoms to your healthcare provider",
      "Continue with recommended lifestyle modifications"
    ];
  }
  
  // Determine risk level based on score
  let riskLevel: "Low" | "Medium" | "High";
  if (riskScore < 40) riskLevel = "Low";
  else if (riskScore < 70) riskLevel = "Medium";
  else riskLevel = "High";
  
  // Generate predictive outcomes
  const predictedOutcomes = [
    {
      outcome: "Symptom improvement",
      probability: (100 - riskScore) / 100,
      timeframe: "1-2 months"
    },
    {
      outcome: "Need for additional treatment",
      probability: riskScore / 150 + 0.1,
      timeframe: "3-6 months"
    },
    {
      outcome: "Complete resolution",
      probability: (90 - riskScore) / 100,
      timeframe: "6-12 months"
    }
  ];
  
  return {
    riskScore,
    riskLevel,
    predictedOutcomes,
    recommendations
  };
};

// Enhanced specialized analysis generators with more detailed insights
function generateEnhancedLabAnalysis(record: MedicalRecord, title: string): Analysis {
  const isBloodTest = title.includes("blood") || title.includes("cbc") || title.includes("panel");
  const isLiverTest = title.includes("liver") || title.includes("alt") || title.includes("ast");
  const isKidneyTest = title.includes("kidney") || title.includes("creatinine") || title.includes("gfr");
  const isLipidTest = title.includes("lipid") || title.includes("cholesterol") || title.includes("triglyceride");
  const isGlucoseTest = title.includes("glucose") || title.includes("a1c") || title.includes("diabetes");
  const isThyroidTest = title.includes("thyroid") || title.includes("tsh") || title.includes("t3") || title.includes("t4");
  
  let summary = "";
  let insights: Insight[] = [];
  let extractedData: any = {
    conditions: [],
    medications: [],
    testResults: [],
    recommendations: []
  };
  
  if (isBloodTest) {
    summary = "Comprehensive blood count analysis reveals cellular composition and potential hematological abnormalities. The results provide insights into immune function, oxygen transport capacity, and bleeding disorders.";
    insights = [
      {
        type: "warning",
        title: "Elevated White Blood Cell Count",
        description: "WBC count of 11.8 K/uL (normal: 4.5-11.0) suggests possible infection, inflammation, or stress response. Consider recent illness or medications that might affect immune function."
      },
      {
        type: "success",
        title: "Normal Hemoglobin and Hematocrit",
        description: "Hemoglobin levels at 14.2 g/dL indicate adequate oxygen-carrying capacity. No signs of anemia or polycythemia."
      },
      {
        type: "info",
        title: "Platelet Function Assessment",
        description: "Platelet count of 265 K/uL is within normal limits, indicating proper blood clotting function."
      },
      {
        type: "info",
        title: "Red Blood Cell Morphology",
        description: "RBC indices suggest normal cell size and hemoglobin content. No evidence of nutritional deficiencies."
      }
    ];
    extractedData = {
      conditions: ["Mild Leukocytosis"],
      testResults: [
        { name: "WBC", value: "11.8", unit: "K/uL", referenceRange: "4.5-11.0", status: "High" },
        { name: "RBC", value: "4.6", unit: "M/uL", referenceRange: "4.5-5.5", status: "Normal" },
        { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5-17.5", status: "Normal" },
        { name: "Hematocrit", value: "42.1", unit: "%", referenceRange: "41-50", status: "Normal" },
        { name: "Platelets", value: "265", unit: "K/uL", referenceRange: "150-450", status: "Normal" },
        { name: "MCV", value: "88", unit: "fL", referenceRange: "80-100", status: "Normal" }
      ],
      recommendations: [
        "Monitor WBC trend with repeat testing in 2-4 weeks",
        "Consider infection screening if symptoms present",
        "Maintain current medications unless otherwise advised"
      ]
    };
  } else if (isThyroidTest) {
    summary = "Thyroid function assessment evaluating metabolic regulation and endocrine balance. These tests help diagnose thyroid disorders that can affect energy, weight, mood, and overall health.";
    insights = [
      {
        type: "warning",
        title: "Subclinical Hypothyroidism",
        description: "TSH level of 6.2 mIU/L (normal: 0.4-4.0) with normal T4 suggests early thyroid dysfunction. This may cause fatigue, weight gain, and cold intolerance."
      },
      {
        type: "info",
        title: "Normal Free T4",
        description: "Free T4 at 1.2 ng/dL indicates adequate thyroid hormone production despite elevated TSH."
      },
      {
        type: "success",
        title: "No Thyroid Antibodies",
        description: "Negative TPO antibodies suggest non-autoimmune cause of thyroid dysfunction."
      }
    ];
    extractedData = {
      conditions: ["Subclinical Hypothyroidism"],
      testResults: [
        { name: "TSH", value: "6.2", unit: "mIU/L", referenceRange: "0.4-4.0", status: "High" },
        { name: "Free T4", value: "1.2", unit: "ng/dL", referenceRange: "0.8-1.8", status: "Normal" },
        { name: "TPO Antibodies", value: "Negative", unit: "", referenceRange: "Negative", status: "Normal" }
      ],
      recommendations: [
        "Consider thyroid hormone replacement therapy",
        "Repeat thyroid function tests in 6-8 weeks",
        "Monitor symptoms of hypothyroidism"
      ]
    };
  } else if (isLipidTest) {
    summary = "Comprehensive lipid panel assessment for cardiovascular risk stratification. These results help evaluate heart disease risk and guide preventive interventions.";
    insights = [
      {
        type: "error",
        title: "Significantly Elevated LDL Cholesterol",
        description: "LDL cholesterol at 165 mg/dL (goal: <100) represents high cardiovascular risk. This requires immediate dietary changes and possible statin therapy."
      },
      {
        type: "warning",
        title: "Low HDL Cholesterol",
        description: "HDL cholesterol of 38 mg/dL (goal: >40 for men, >50 for women) reduces cardiovascular protection. Exercise and omega-3 supplementation may help."
      },
      {
        type: "warning",
        title: "Elevated Triglycerides",
        description: "Triglycerides at 185 mg/dL (normal: <150) may indicate insulin resistance or metabolic syndrome."
      }
    ];
    extractedData = {
      conditions: ["Dyslipidemia", "Cardiovascular Risk"],
      testResults: [
        { name: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200", status: "High" },
        { name: "LDL", value: "165", unit: "mg/dL", referenceRange: "<100", status: "High" },
        { name: "HDL", value: "38", unit: "mg/dL", referenceRange: ">40", status: "Low" },
        { name: "Triglycerides", value: "185", unit: "mg/dL", referenceRange: "<150", status: "High" }
      ],
      recommendations: [
        "Start statin therapy for LDL reduction",
        "Implement Mediterranean-style diet",
        "Increase aerobic exercise to 150 min/week",
        "Consider omega-3 fatty acid supplementation"
      ]
    };
  }
  
  // ... similar enhancements for other test types
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedRadiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  const isChestXRay = title.includes("chest") || title.includes("lung") || title.includes("thorax");
  const isCTScan = title.includes("ct") || title.includes("computed");
  const isMRI = title.includes("mri") || title.includes("magnetic");
  const isUltrasound = title.includes("ultrasound") || title.includes("sonogram");
  
  let summary = "";
  let insights: Insight[] = [];
  let extractedData: any = {
    findings: [],
    recommendations: [],
    followUp: []
  };
  
  if (isChestXRay) {
    summary = "Chest radiograph evaluation of pulmonary parenchyma, cardiac silhouette, and thoracic structures. Advanced AI analysis identifies subtle abnormalities and provides differential diagnoses.";
    insights = [
      {
        type: "warning",
        title: "Right Lower Lobe Opacity",
        description: "3.2 cm opacity in right lower lobe with air bronchograms suggests consolidation. Differential includes pneumonia, atelectasis, or less likely malignancy."
      },
      {
        type: "success",
        title: "Normal Cardiac Silhouette",
        description: "Cardiothoracic ratio within normal limits at 45%. No evidence of cardiomegaly or pericardial effusion."
      },
      {
        type: "info",
        title: "Clear Left Lung Field",
        description: "Left lung shows normal pulmonary vasculature without infiltrates, nodules, or pleural abnormalities."
      },
      {
        type: "info",
        title: "Osseous Structures",
        description: "Visible ribs and thoracic spine show age-appropriate changes without acute fractures."
      }
    ];
    extractedData = {
      findings: [
        "3.2 cm right lower lobe consolidation",
        "Normal cardiac size and contour",
        "Clear left lung field",
        "No pleural effusion or pneumothorax",
        "Age-appropriate osseous changes"
      ],
      recommendations: [
        "Clinical correlation with symptoms and physical exam",
        "Consider antibiotic therapy if infectious pneumonia suspected",
        "Follow-up chest X-ray in 6-8 weeks to ensure resolution"
      ],
      followUp: [
        "Repeat imaging in 6-8 weeks",
        "CT chest if no improvement",
        "Pulmonology consultation if persistent"
      ]
    };
  } else if (isCTScan) {
    summary = "High-resolution computed tomography with advanced 3D reconstruction and AI-assisted lesion detection. Provides detailed cross-sectional anatomy with precise measurements.";
    insights = [
      {
        type: "info",
        title: "High-Resolution Imaging",
        description: "CT demonstrates excellent visualization of soft tissue structures with 1mm slice thickness providing optimal diagnostic accuracy."
      },
      {
        type: "success",
        title: "No Acute Abnormalities",
        description: "Systematic review of all anatomical structures reveals no acute pathology or emergent findings."
      },
      {
        type: "warning",
        title: "Incidental Findings",
        description: "Small hepatic cyst (8mm) noted incidentally. This is benign and requires no immediate intervention but should be documented."
      }
    ];
  }
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedCardiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  const isEKG = title.includes("ekg") || title.includes("ecg") || title.includes("electrocardiogram");
  const isEcho = title.includes("echo") || title.includes("echocardiogram");
  const isStressTest = title.includes("stress") || title.includes("exercise");
  const isHolter = title.includes("holter") || title.includes("monitor");
  
  let summary = "";
  let insights: Insight[] = [];
  let extractedData: any = {
    conditions: [],
    findings: [],
    recommendations: []
  };
  
  if (isEKG) {
    summary = "12-lead electrocardiogram with advanced rhythm analysis and automated interpretation. AI-powered detection of arrhythmias, ischemic changes, and conduction abnormalities.";
    insights = [
      {
        type: "warning",
        title: "First-Degree AV Block",
        description: "PR interval prolonged at 220ms (normal: 120-200ms). Suggests delayed conduction through AV node. Usually benign but requires monitoring."
      },
      {
        type: "info",
        title: "Sinus Rhythm with Occasional PACs",
        description: "Baseline sinus rhythm at 72 bpm with rare premature atrial contractions. PACs are common and usually benign."
      },
      {
        type: "success",
        title: "No ST-Segment Changes",
        description: "No evidence of acute ischemia or injury pattern. ST segments and T waves within normal limits."
      },
      {
        type: "info",
        title: "Left Axis Deviation",
        description: "QRS axis at -35 degrees suggests mild left axis deviation, possibly related to left anterior fascicular block."
      }
    ];
    extractedData = {
      conditions: ["First-degree AV Block", "Rare PACs", "Left Axis Deviation"],
      findings: [
        "Sinus rhythm, rate 72 bpm",
        "PR interval 220ms (prolonged)",
        "QRS width 88ms (normal)",
        "Left axis deviation (-35 degrees)",
        "No acute ST-T changes"
      ],
      recommendations: [
        "Routine cardiology follow-up in 6 months",
        "Monitor for progression of AV block",
        "No activity restrictions needed",
        "Consider echo if not done recently"
      ]
    };
  }
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedNeurologyAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Neurological assessment showing brain and nervous system function. Results indicate some abnormalities requiring follow-up.";
  let insights: Insight[] = [
    {
      type: "warning",
      title: "Neurological Findings",
      description: "Assessment shows some abnormalities in neurological function that warrant further investigation."
    },
    {
      type: "info",
      title: "Cognitive Status",
      description: "Cognitive assessment reveals mild impairment in short-term memory but preserved long-term memory and executive function."
    }
  ];
  let extractedData: any = {
    conditions: ["Mild Cognitive Impairment"],
    findings: [
      "Mild short-term memory impairment",
      "Preserved long-term memory",
      "Normal motor function",
      "Intact sensory function"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedOrthopedicsAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Orthopedic assessment showing bone and joint structure and function. Results indicate some abnormalities requiring treatment.";
  let insights: Insight[] = [
    {
      type: "warning",
      title: "Joint Assessment",
      description: "Moderate osteoarthritic changes in the knee joint with reduced cartilage space."
    },
    {
      type: "info",
      title: "Functional Status",
      description: "Mild limitation in range of motion but adequate functional capacity for activities of daily living."
    }
  ];
  let extractedData: any = {
    conditions: ["Knee Osteoarthritis"],
    findings: [
      "Reduced joint space in medial compartment",
      "Osteophyte formation",
      "Mild effusion",
      "No acute fracture or dislocation"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedDermatologyAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Dermatological assessment showing skin findings. Results indicate some abnormalities requiring treatment.";
  let insights: Insight[] = [
    {
      type: "warning",
      title: "Skin Lesion",
      description: "Irregular pigmented lesion with asymmetric borders measuring 6mm in diameter."
    },
    {
      type: "info",
      title: "Surrounding Skin",
      description: "Surrounding skin shows normal characteristics without additional concerning lesions."
    }
  ];
  let extractedData: any = {
    conditions: ["Atypical Nevus"],
    findings: [
      "Irregular pigmented lesion",
      "Asymmetric borders",
      "6mm diameter",
      "No ulceration"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedPharmacyAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Medication prescription and analysis. Several medications prescribed with potential interactions noted.";
  let insights: Insight[] = [
    {
      type: "warning",
      title: "Medication Interactions",
      description: "Potential mild interaction between prescribed medications that should be monitored."
    },
    {
      type: "info",
      title: "Dosing Schedule",
      description: "Complex medication schedule that may benefit from simplification to improve adherence."
    }
  ];
  let extractedData: any = {
    medications: ["Lisinopril 10mg", "Atorvastatin 20mg", "Aspirin 81mg", "Metformin 500mg"],
    findings: [
      "Multiple medications for chronic conditions",
      "Complex dosing schedule",
      "Potential mild drug interactions",
      "Generally appropriate prescribing"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedSurgicalAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Surgical report detailing procedure, findings, and outcomes. Results indicate successful intervention with expected post-operative course.";
  let insights: Insight[] = [
    {
      type: "success",
      title: "Surgical Outcome",
      description: "Procedure completed successfully with expected outcomes achieved."
    },
    {
      type: "info",
      title: "Recovery Expectations",
      description: "Expected recovery timeline of 4-6 weeks with gradual return to normal activities."
    }
  ];
  let extractedData: any = {
    findings: [
      "Procedure completed successfully",
      "No intraoperative complications",
      "Estimated blood loss: minimal",
      "Expected recovery: 4-6 weeks"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateEnhancedGeneralAnalysis(record: MedicalRecord, title: string): Analysis {
  let summary = "Medical record showing patient health status and clinical findings. Results indicate generally stable condition with some areas requiring monitoring.";
  let insights: Insight[] = [
    {
      type: "info",
      title: "General Assessment",
      description: "Patient in stable condition with chronic health issues being appropriately managed."
    },
    {
      type: "warning",
      title: "Areas of Concern",
      description: "Some parameters require ongoing monitoring and potential adjustment of treatment plan."
    }
  ];
  let extractedData: any = {
    conditions: ["Hypertension", "Hyperlipidemia"],
    findings: [
      "Stable vital signs",
      "Chronic conditions under management",
      "Follow-up recommended in 3 months",
      "Lifestyle modifications encouraged"
    ]
  };
  
  return {
    summary,
    insights,
    extractedData
  };
}
