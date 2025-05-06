
import { MedicalRecord } from "@/types/records";

interface PrecautionsTabProps {
  record: MedicalRecord;
}

const PrecautionsTab = ({ record }: PrecautionsTabProps) => {
  if (!record.prediction) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No prediction data available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pt-4">
      <div className="p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-2">Risk Assessment</h3>
        <div className="flex items-center gap-2">
          <div 
            className="h-4 w-4 rounded-full" 
            style={{
              backgroundColor: record.prediction.riskLevel === "Low" 
                ? "#22c55e" 
                : record.prediction.riskLevel === "Medium" 
                ? "#f59e0b" 
                : "#ef4444"
            }}
          />
          <span>{record.prediction.riskLevel} Risk ({record.prediction.riskScore}/100)</span>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Risk Score</h4>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${record.prediction.riskScore}%`, 
                backgroundColor: record.prediction.riskLevel === "Low" 
                  ? "#22c55e" 
                  : record.prediction.riskLevel === "Medium" 
                  ? "#f59e0b" 
                  : "#ef4444"
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Low Risk</span>
            <span>High Risk</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 border rounded-lg bg-card">
        <h3 className="font-medium mb-2">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {record.prediction.recommendations.map((rec, index) => (
            <li key={index} className="text-muted-foreground">{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PrecautionsTab;
