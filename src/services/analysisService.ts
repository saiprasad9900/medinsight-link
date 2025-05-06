
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

// Advanced analysis function - detects record type and content to provide appropriate insights
export const analyzeRecord = async (record: MedicalRecord): Promise<Analysis> => {
  // In a real implementation, this would call an actual AI service or API
  console.log(`Analyzing record: ${record.title} (${record.type})`);
  
  // Simulate processing delay
  await new Promise(res => setTimeout(res, 1500));
  
  const category = record.category || categorizeRecord(record);
  const title = record.title.toLowerCase();
  
  // Generate different analyses based on the record type and content
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

// Specialized analysis generators for different medical specialties
function generateLabAnalysis(record: MedicalRecord, title: string): Analysis {
  const isBloodTest = title.includes("blood") || title.includes("cbc") || title.includes("panel");
  const isLiverTest = title.includes("liver") || title.includes("alt") || title.includes("ast");
  const isKidneyTest = title.includes("kidney") || title.includes("creatinine") || title.includes("gfr");
  const isLipidTest = title.includes("lipid") || title.includes("cholesterol") || title.includes("triglyceride");
  const isGlucoseTest = title.includes("glucose") || title.includes("a1c") || title.includes("diabetes");
  
  let summary = "This laboratory report shows the results of blood tests with some values outside the normal range.";
  let insights: Insight[] = [];
  let extractedData: any = {
    conditions: ["Regular monitoring recommended"],
    medications: [],
    testResults: []
  };
  
  if (isBloodTest) {
    summary = "Complete blood count showing red and white blood cell counts, hemoglobin levels, and platelets. Results indicate some minor abnormalities that require follow-up.";
    insights = [
      {
        type: "info",
        title: "White Blood Cell Count",
        description: "White blood cell count is slightly elevated, which may indicate an ongoing infection or inflammatory response."
      },
      {
        type: "success",
        title: "Hemoglobin Levels",
        description: "Hemoglobin levels are within normal limits, suggesting adequate oxygen-carrying capacity."
      }
    ];
    extractedData.testResults = [
      { name: "WBC", value: "11.2", unit: "K/uL", referenceRange: "4.5-11.0" },
      { name: "RBC", value: "4.8", unit: "M/uL", referenceRange: "4.5-5.5" },
      { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5-17.5" },
      { name: "Platelets", value: "265", unit: "K/uL", referenceRange: "150-450" }
    ];
  } else if (isLiverTest) {
    summary = "Liver function test results indicating enzyme levels and other markers of liver health. Some values suggest potential liver stress that should be monitored.";
    insights = [
      {
        type: "warning",
        title: "Elevated Liver Enzymes",
        description: "ALT and AST levels are moderately elevated, which may indicate some level of liver inflammation or damage."
      },
      {
        type: "info",
        title: "Bilirubin Level",
        description: "Total bilirubin is at the upper end of normal range, but not clinically significant at this time."
      }
    ];
    extractedData.testResults = [
      { name: "ALT", value: "65", unit: "U/L", referenceRange: "7-55" },
      { name: "AST", value: "48", unit: "U/L", referenceRange: "8-48" },
      { name: "ALP", value: "115", unit: "U/L", referenceRange: "40-129" },
      { name: "Bilirubin (Total)", value: "1.1", unit: "mg/dL", referenceRange: "0.1-1.2" }
    ];
  } else if (isLipidTest) {
    summary = "Lipid panel showing cholesterol levels and related markers. Results suggest moderate cardiovascular risk factors that should be addressed.";
    insights = [
      {
        type: "warning",
        title: "Elevated LDL Cholesterol",
        description: "LDL cholesterol is above recommended levels, increasing cardiovascular risk."
      },
      {
        type: "success",
        title: "HDL Cholesterol",
        description: "HDL cholesterol is in the optimal range, which helps protect against heart disease."
      }
    ];
    extractedData.testResults = [
      { name: "Total Cholesterol", value: "228", unit: "mg/dL", referenceRange: "<200" },
      { name: "LDL", value: "148", unit: "mg/dL", referenceRange: "<100" },
      { name: "HDL", value: "52", unit: "mg/dL", referenceRange: ">40" },
      { name: "Triglycerides", value: "140", unit: "mg/dL", referenceRange: "<150" }
    ];
  } else if (isGlucoseTest) {
    summary = "Glucose and diabetes-related tests indicate elevated blood sugar levels that require attention and possible intervention.";
    insights = [
      {
        type: "error",
        title: "Elevated HbA1c",
        description: "HbA1c is in the prediabetic range, indicating sustained elevated blood glucose over the past 3 months."
      },
      {
        type: "warning",
        title: "Fasting Glucose",
        description: "Fasting glucose is elevated above the normal range, consistent with impaired glucose metabolism."
      }
    ];
    extractedData.testResults = [
      { name: "Fasting Glucose", value: "118", unit: "mg/dL", referenceRange: "70-99" },
      { name: "HbA1c", value: "6.3", unit: "%", referenceRange: "<5.7" },
      { name: "Insulin", value: "14.2", unit: "uIU/mL", referenceRange: "2.6-24.9" }
    ];
  } else if (isKidneyTest) {
    summary = "Kidney function tests showing markers of renal filtration and waste elimination. Results show mild impairment requiring monitoring.";
    insights = [
      {
        type: "warning",
        title: "Elevated Creatinine",
        description: "Creatinine level is slightly elevated, which may indicate reduced kidney function."
      },
      {
        type: "info",
        title: "eGFR Calculation",
        description: "eGFR calculation shows Stage 2 Chronic Kidney Disease, which requires regular monitoring."
      }
    ];
    extractedData.testResults = [
      { name: "Creatinine", value: "1.3", unit: "mg/dL", referenceRange: "0.7-1.2" },
      { name: "eGFR", value: "68", unit: "mL/min/1.73m²", referenceRange: ">90" },
      { name: "BUN", value: "22", unit: "mg/dL", referenceRange: "7-20" },
      { name: "BUN/Creatinine Ratio", value: "16.9", unit: "", referenceRange: "10-20" }
    ];
  } else {
    summary = "Laboratory test results showing multiple parameters. Some values are outside the reference range and warrant clinical correlation.";
    insights = [
      {
        type: "info",
        title: "Test Results Overview",
        description: "Several test results are outside normal ranges, suggesting the need for clinical correlation and possibly additional testing."
      },
      {
        type: "warning",
        title: "Abnormal Values",
        description: "Specific abnormalities detected may be related to the patient's presenting symptoms and require follow-up."
      }
    ];
  }
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateRadiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  const isChestXRay = title.includes("chest") || title.includes("lung") || title.includes("thorax");
  const isBrainScan = title.includes("brain") || title.includes("head") || title.includes("cranial");
  const isAbdominalScan = title.includes("abdomen") || title.includes("abdominal") || title.includes("liver") || title.includes("kidney");
  const isMusculoskeletal = title.includes("bone") || title.includes("joint") || title.includes("spine") || title.includes("fracture");
  
  let summary = "Radiological examination reveals anatomical structures with some notable findings requiring clinical correlation.";
  let insights: Insight[] = [];
  let extractedData: any = {
    findings: []
  };
  
  if (isChestXRay) {
    summary = "Chest X-ray shows lung fields, heart silhouette, and bony structures. There are minor abnormalities that should be clinically correlated with the patient's symptoms.";
    insights = [
      {
        type: "info",
        title: "Cardiac Silhouette",
        description: "Heart size appears within normal limits. No evidence of cardiomegaly."
      },
      {
        type: isChestXRay && title.includes("opacity") ? "warning" : "success",
        title: "Lung Fields",
        description: isChestXRay && title.includes("opacity") ? 
          "Small opacity noted in the right lower lobe, which may represent early pneumonia or atelectasis." : 
          "Lung fields appear clear without evidence of consolidation, effusion, or pneumothorax."
      }
    ];
    extractedData.findings = [
      "No evidence of active pulmonary disease",
      "Heart size within normal limits",
      "No pleural effusion",
      "Bony structures intact"
    ];
    
    if (isChestXRay && title.includes("opacity")) {
      extractedData.findings = [
        "Small opacity in right lower lobe",
        "Possible early pneumonia or atelectasis",
        "Heart size within normal limits",
        "No pleural effusion"
      ];
    }
  } else if (isBrainScan) {
    summary = "Brain imaging study showing cerebral structures and surrounding tissues. Findings suggest normal anatomy with no acute abnormalities.";
    insights = [
      {
        type: "success",
        title: "Brain Parenchyma",
        description: "No evidence of acute infarction, hemorrhage, or space-occupying lesion."
      },
      {
        type: "info",
        title: "Ventricular System",
        description: "Ventricles are normal in size and configuration. No midline shift observed."
      }
    ];
    extractedData.findings = [
      "No evidence of acute intracranial hemorrhage",
      "No mass effect or midline shift",
      "Ventricles normal in size and configuration",
      "No territorial infarction"
    ];
  } else if (isAbdominalScan) {
    summary = "Abdominal imaging study showing the liver, spleen, kidneys, and other abdominal structures. Some findings require clinical correlation.";
    insights = [
      {
        type: "info",
        title: "Liver Appearance",
        description: "Liver shows normal size and contour with homogeneous parenchymal attenuation. No focal lesions identified."
      },
      {
        type: "warning",
        title: "Renal Findings",
        description: "Small non-obstructing calculus noted in the right kidney, measuring approximately 4mm."
      }
    ];
    extractedData.findings = [
      "Liver, spleen, and pancreas appear normal",
      "4mm non-obstructing calculus in right kidney",
      "No free fluid or pneumoperitoneum",
      "No lymphadenopathy"
    ];
  } else if (isMusculoskeletal) {
    summary = "Musculoskeletal imaging study showing bone and joint structures. Findings include degenerative changes consistent with the patient's age.";
    insights = [
      {
        type: title.includes("fracture") ? "error" : "warning",
        title: "Bone Structure",
        description: title.includes("fracture") ? 
          "Non-displaced fracture identified in the distal radius with minimal angulation." : 
          "Mild degenerative changes noted with small osteophyte formation."
      },
      {
        type: "info",
        title: "Joint Space",
        description: "Mild joint space narrowing consistent with early degenerative changes."
      }
    ];
    extractedData.findings = title.includes("fracture") ? [
      "Non-displaced fracture of distal radius",
      "No significant angulation or displacement",
      "Surrounding soft tissues unremarkable",
      "No additional fractures identified"
    ] : [
      "Mild degenerative changes",
      "Small osteophyte formation",
      "Joint space narrowing",
      "No acute fracture or dislocation"
    ];
  } else {
    summary = "Radiological examination shows multiple anatomical structures. No acute abnormalities identified, though there are some incidental findings.";
    insights = [
      {
        type: "info",
        title: "General Findings",
        description: "Study demonstrates normal anatomical structures without significant abnormality."
      },
      {
        type: "success",
        title: "No Acute Process",
        description: "No evidence of acute pathological process within the examined area."
      }
    ];
    extractedData.findings = [
      "No acute abnormality",
      "Normal anatomical structures",
      "Age-appropriate findings",
      "No significant pathology"
    ];
  }
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateCardiologyAnalysis(record: MedicalRecord, title: string): Analysis {
  const isEKG = title.includes("ekg") || title.includes("ecg") || title.includes("electrocardiogram");
  const isEcho = title.includes("echo") || title.includes("echocardiogram") || title.includes("cardiac ultrasound");
  const isStressTest = title.includes("stress") || title.includes("exercise") || title.includes("treadmill");
  
  let summary = "Cardiac assessment showing heart function and related parameters. Some findings suggest the need for monitoring and potential intervention.";
  let insights: Insight[] = [];
  let extractedData: any = {
    conditions: [],
    findings: []
  };
  
  if (isEKG) {
    summary = "Electrocardiogram showing cardiac electrical activity. Results show some rhythm abnormalities requiring further evaluation.";
    insights = [
      {
        type: "warning",
        title: "Rhythm Analysis",
        description: "Sinus rhythm with occasional premature ventricular complexes (PVCs)."
      },
      {
        type: "info",
        title: "Rate and Intervals",
        description: "Heart rate of 78 bpm with normal PR, QRS, and QT intervals."
      }
    ];
    extractedData.findings = [
      "Sinus rhythm at 78 bpm",
      "Occasional PVCs",
      "Normal axis",
      "No acute ischemic changes"
    ];
    extractedData.conditions = ["Premature Ventricular Complexes"];
  } else if (isEcho) {
    summary = "Echocardiogram assessing cardiac structure and function. Results show mild left ventricular hypertrophy with preserved ejection fraction.";
    insights = [
      {
        type: "warning",
        title: "Left Ventricular Function",
        description: "Mild left ventricular hypertrophy with preserved ejection fraction of 55%."
      },
      {
        type: "info",
        title: "Valvular Function",
        description: "Trace mitral regurgitation, not hemodynamically significant."
      }
    ];
    extractedData.findings = [
      "Left ventricular ejection fraction 55%",
      "Mild left ventricular hypertrophy",
      "Trace mitral regurgitation",
      "No pericardial effusion"
    ];
    extractedData.conditions = ["Left Ventricular Hypertrophy", "Mitral Regurgitation (Trace)"];
  } else if (isStressTest) {
    summary = "Exercise stress test evaluating cardiac function during physical exertion. Results show adequate exercise capacity with some ST-segment changes.";
    insights = [
      {
        type: "warning",
        title: "ST Segment Changes",
        description: "Minimal ST depression in lateral leads during peak exercise, normalizing in recovery."
      },
      {
        type: "success",
        title: "Exercise Capacity",
        description: "Patient achieved 9 minutes on Bruce protocol with appropriate heart rate response."
      }
    ];
    extractedData.findings = [
      "Bruce protocol: 9 minutes",
      "Peak heart rate: 145 bpm (85% of predicted max)",
      "Minimal ST depression in lateral leads",
      "No chest pain during testing"
    ];
    extractedData.conditions = ["Exercise-Induced ST Changes"];
  } else {
    summary = "Cardiac evaluation showing heart structure and function. Results indicate generally normal cardiac function with some minor abnormalities.";
    insights = [
      {
        type: "info",
        title: "Cardiac Function",
        description: "Overall cardiac function appears adequate with minor abnormalities noted."
      },
      {
        type: "warning",
        title: "Cardiovascular Risk",
        description: "Findings suggest moderate cardiovascular risk that should be managed with appropriate interventions."
      }
    ];
    extractedData.findings = [
      "Generally normal cardiac function",
      "Minor abnormalities noted",
      "Moderate cardiovascular risk",
      "Follow-up recommended"
    ];
  }
  
  return {
    summary,
    insights,
    extractedData
  };
}

function generateNeurologyAnalysis(record: MedicalRecord, title: string): Analysis {
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

function generateOrthopedicsAnalysis(record: MedicalRecord, title: string): Analysis {
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

function generateDermatologyAnalysis(record: MedicalRecord, title: string): Analysis {
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

function generatePharmacyAnalysis(record: MedicalRecord, title: string): Analysis {
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

function generateSurgicalAnalysis(record: MedicalRecord, title: string): Analysis {
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

function generateGeneralAnalysis(record: MedicalRecord, title: string): Analysis {
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
