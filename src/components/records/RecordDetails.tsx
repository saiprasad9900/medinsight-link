
import { useState } from "react";
import { MedicalRecord } from "@/types/records";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Layers, FileSearch } from "lucide-react";
import EnhancedRecordInsight from "./EnhancedRecordInsight";
import PredictiveInsights from "./PredictiveInsights";
import MedicalRecordAnalysisDialog from "./MedicalRecordAnalysisDialog";

interface RecordDetailsProps {
  record: MedicalRecord | null;
  analyzing: boolean;
  onAnalyzeClick: () => void;
}

const RecordDetails = ({ 
  record, 
  analyzing, 
  onAnalyzeClick 
}: RecordDetailsProps) => {
  const [activeView, setActiveView] = useState<"analysis" | "prediction">("analysis");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

  if (!record) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger 
            value="analysis" 
            className="flex gap-1 items-center"
            onClick={() => setActiveView("analysis")}
            data-state={activeView === "analysis" ? "active" : ""}
          >
            <Brain className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="prediction" 
            className="flex gap-1 items-center"
            onClick={() => setActiveView("prediction")}
            data-state={activeView === "prediction" ? "active" : ""}
          >
            <Layers className="h-4 w-4" />
            Predictions
          </TabsTrigger>
        </TabsList>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnalysisDialog(true)}
          className="gap-1"
        >
          <FileSearch className="h-4 w-4" />
          Full Analysis
        </Button>
      </div>
      
      {analyzing ? (
        <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Analyzing record...</p>
        </div>
      ) : (
        <>
          {activeView === "analysis" && record.analysis && (
            <EnhancedRecordInsight 
              title={`${record.type} Analysis - ${record.patientName}`}
              analysis={record.analysis}
            />
          )}
          
          {activeView === "prediction" && record.prediction && (
            <PredictiveInsights 
              patientName={record.patientName}
              prediction={record.prediction}
            />
          )}
          
          {activeView === "analysis" && !record.analysis && (
            <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
              <Brain className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-medium">No Analysis Available</h3>
                <p className="text-sm text-muted-foreground mt-1">This record hasn't been analyzed yet.</p>
              </div>
              <Button onClick={onAnalyzeClick}>
                Analyze Now
              </Button>
            </div>
          )}
          
          {activeView === "prediction" && !record.prediction && (
            <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
              <Layers className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-medium">No Predictions Available</h3>
                <p className="text-sm text-muted-foreground mt-1">Generate predictions to see future health insights.</p>
              </div>
              <Button onClick={onAnalyzeClick}>
                Generate Predictions
              </Button>
            </div>
          )}
        </>
      )}

      <MedicalRecordAnalysisDialog
        isOpen={showAnalysisDialog}
        onClose={() => setShowAnalysisDialog(false)}
        record={record}
      />
    </div>
  );
};

export default RecordDetails;
