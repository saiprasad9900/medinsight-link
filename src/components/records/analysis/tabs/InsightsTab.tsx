
import { MedicalRecord } from "@/types/records";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface InsightsTabProps {
  record: MedicalRecord;
  getSeverityColor: (type: string) => string;
}

const InsightsTab = ({ record, getSeverityColor }: InsightsTabProps) => {
  if (!record.analysis?.insights) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No insights available for this record</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getBadgeStyles = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  return (
    <div className="space-y-4 pt-4">
      {record.analysis.insights.map((insight, index) => (
        <div 
          key={index}
          className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${getSeverityColor(insight.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{insight.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`ml-auto font-normal text-xs ${getBadgeStyles(insight.type)}`}
                >
                  {insight.type.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      {record.analysis.insights.length === 0 && (
        <div className="text-center py-8">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No specific insights generated for this record</p>
          <p className="text-sm text-muted-foreground mt-2">
            The analysis may not have identified any notable findings
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsTab;
