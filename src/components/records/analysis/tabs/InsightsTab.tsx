
import { MedicalRecord } from "@/types/records";
import { cn } from "@/lib/utils";

interface InsightsTabProps {
  record: MedicalRecord;
  getSeverityColor: (type: string) => string;
}

const InsightsTab = ({ record, getSeverityColor }: InsightsTabProps) => {
  if (!record.analysis) return null;
  
  return (
    <div className="space-y-4 pt-4">
      {record.analysis.insights.map((insight, index) => (
        <div 
          key={index}
          className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${getSeverityColor(insight.type)}`}
        >
          <h3 className="font-medium mb-1">{insight.title}</h3>
          <p className="text-sm">{insight.description}</p>
        </div>
      ))}
    </div>
  );
};

export default InsightsTab;
