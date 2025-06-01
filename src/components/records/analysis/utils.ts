
export const getSeverityColor = (type: string): string => {
  switch (type) {
    case "info":
      return "border-blue-200 bg-blue-50/50 dark:bg-blue-950/10";
    case "warning":
      return "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10";
    case "success":
      return "border-green-200 bg-green-50/50 dark:bg-green-950/10";
    case "error":
      return "border-red-200 bg-red-50/50 dark:bg-red-950/10";
    default:
      return "border-gray-200 bg-gray-50/50 dark:bg-gray-950/10";
  }
};

export const getInsightSeverity = (type: string): "Low" | "Medium" | "High" => {
  switch (type) {
    case "error":
      return "High";
    case "warning":
      return "Medium";
    case "info":
    case "success":
    default:
      return "Low";
  }
};
