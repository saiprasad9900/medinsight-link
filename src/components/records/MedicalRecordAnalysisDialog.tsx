
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MedicalRecord } from "@/types/records";
import { analyzeRecord, predictOutcomes } from "@/services/analysisService";
import { toast } from "sonner";

// Import refactored components
import AnalysisHeader from "./analysis/AnalysisHeader";
import AnalysisLoading from "./analysis/AnalysisLoading";
import AnalysisTabs from "./analysis/AnalysisTabs";
import AnalysisActions from "./analysis/AnalysisActions";
import { getSeverityColor } from "./analysis/utils";

interface MedicalRecordAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord;
}

const MedicalRecordAnalysisDialog = ({ isOpen, onClose, record }: MedicalRecordAnalysisDialogProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const handleAnalyze = async () => {
    if (analyzing) return;
    
    try {
      setAnalyzing(true);
      toast.info(`Analyzing ${record.type.toLowerCase()} for ${record.patientName}...`);
      
      // Simulate analysis progress
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Analyze the record and get predictions
      const analysis = await analyzeRecord(record);
      const prediction = await predictOutcomes(record);
      
      // Update the record with analysis and prediction
      record.analysis = analysis;
      record.prediction = prediction;
      
      clearInterval(interval);
      setAnalysisProgress(100);
      
      toast.success(`${record.type} analysis completed successfully`);
    } catch (error) {
      console.error("Error analyzing record:", error);
      toast.error("Failed to analyze record");
    } finally {
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisProgress(0);
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <AnalysisHeader record={record} />
        
        {!record.analysis ? (
          <AnalysisLoading 
            analyzing={analyzing} 
            analysisProgress={analysisProgress} 
            handleAnalyze={handleAnalyze}
            recordType={record.type}
          />
        ) : (
          <AnalysisTabs 
            record={record} 
            getSeverityColor={getSeverityColor}
          />
        )}
        
        <AnalysisActions 
          record={record} 
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordAnalysisDialog;
