
// Utility functions for medical record analysis

export const getSeverityColor = (type: string) => {
  switch (type) {
    case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "success": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "";
  }
};

// Helper function to determine insight severity based on content keywords
export const getInsightSeverity = (content: string) => {
  const lowercaseContent = content.toLowerCase();
  
  // Critical keywords
  if (lowercaseContent.includes("critical") || 
      lowercaseContent.includes("severe") || 
      lowercaseContent.includes("emergency") ||
      lowercaseContent.includes("immediate attention")) {
    return "error";
  }
  
  // Warning keywords
  if (lowercaseContent.includes("abnormal") || 
      lowercaseContent.includes("elevated") || 
      lowercaseContent.includes("reduced") ||
      lowercaseContent.includes("concerning") ||
      lowercaseContent.includes("monitor")) {
    return "warning";
  }
  
  // Success keywords
  if (lowercaseContent.includes("normal") || 
      lowercaseContent.includes("healthy") || 
      lowercaseContent.includes("optimal") ||
      lowercaseContent.includes("improved")) {
    return "success";
  }
  
  // Default to info
  return "info";
};

