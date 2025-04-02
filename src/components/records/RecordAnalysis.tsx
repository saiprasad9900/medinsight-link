
import { useState } from "react";
import { Record } from "@/types/records";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers } from "lucide-react";
import EnhancedRecordInsight from "./EnhancedRecordInsight";
import PredictiveInsights from "./PredictiveInsights";
import AnalyzingState from "@/components/doctor/records/AnalyzingState";

interface RecordAnalysisProps {
  record: Record;
  analyzing: boolean;
  onAnalyzeClick: () => void;
}

const RecordAnalysis = ({ 
  record, 
  analyzing, 
  onAnalyzeClick 
}: RecordAnalysisProps) => {
  const [activeView, setActiveView] = useState<"analysis" | "prediction">("analysis");

  return (
    <div>
      <div className="mb-4">
        <TabsList className="w-full grid grid-cols-2">
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
      </div>
      
      {analyzing ? (
        <AnalyzingState />
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
              <button 
                onClick={onAnalyzeClick}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Analyze Now
              </button>
            </div>
          )}
          
          {activeView === "prediction" && !record.prediction && (
            <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
              <Layers className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="font-medium">No Predictions Available</h3>
                <p className="text-sm text-muted-foreground mt-1">Generate predictions to see future health insights.</p>
              </div>
              <button 
                onClick={onAnalyzeClick}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Generate Predictions
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordAnalysis;
