
import { MedicalRecord } from "@/types/records";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface SummaryTabProps {
  record: MedicalRecord;
}

const SummaryTab = ({ record }: SummaryTabProps) => {
  if (!record.analysis) return null;
  
  return (
    <div className="space-y-4 pt-4">
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex justify-between">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Summary
          </h3>
          <Badge variant="outline" className="font-normal">
            {record.date}
          </Badge>
        </div>
        <p className="text-muted-foreground">{record.analysis.summary}</p>
      </div>
      
      {record.analysis.extractedData?.conditions && (
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium mb-2">Identified Conditions</h3>
          <div className="flex flex-wrap gap-2">
            {record.analysis.extractedData.conditions.map((condition, index) => (
              <Badge key={index} variant="secondary" className="hover:bg-secondary/80 cursor-pointer transition-colors">
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {record.analysis.extractedData?.medications && (
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-medium mb-2">Medications</h3>
          <div className="flex flex-wrap gap-2">
            {record.analysis.extractedData.medications.map((medication, index) => (
              <Badge key={index} variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30">
                {medication}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryTab;
