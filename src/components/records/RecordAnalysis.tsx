
import { useState } from "react";
import { Record } from "@/types/records";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Layers, AlertTriangle, ArrowRight } from "lucide-react";
import EnhancedRecordInsight from "./EnhancedRecordInsight";
import PredictiveInsights from "./PredictiveInsights";
import AnalyzingState from "@/components/doctor/records/AnalyzingState";
import { Card } from "@/components/ui/card";

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
            <div className="space-y-4 animate-fade-in">
              <Card className="p-6 border-l-4 border-l-blue-500">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500" />
                  Summary of Medical Report
                </h3>
                <p className="text-muted-foreground">{record.analysis.summary}</p>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-amber-500">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Key Concerns or Alerts
                </h3>
                <div className="space-y-2">
                  {record.analysis.insights
                    .filter(insight => insight.type === "warning" || insight.type === "error")
                    .map((insight, index) => (
                      <div key={index} className="pl-4 border-l-2 border-amber-200">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    ))}
                  {record.analysis.insights.filter(insight => insight.type === "warning" || insight.type === "error").length === 0 && (
                    <p className="text-sm text-muted-foreground">No critical concerns detected in this report.</p>
                  )}
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-l-green-500">
                <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-green-500" />
                  Next Steps and Precautions
                </h3>
                <div className="space-y-2">
                  {record.analysis.extractedData?.conditions && (
                    <div>
                      <h4 className="font-medium text-sm">Conditions Identified:</h4>
                      <p className="text-sm text-muted-foreground">{record.analysis.extractedData.conditions.join(", ")}</p>
                    </div>
                  )}
                  
                  {record.prediction && (
                    <div>
                      <h4 className="font-medium text-sm">Recommended Actions:</h4>
                      <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {record.prediction.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(!record.prediction || record.prediction.recommendations.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      Schedule a follow-up appointment with your doctor to discuss these results. 
                      Continue with any prescribed treatments and monitor your symptoms.
                    </p>
                  )}
                </div>
              </Card>
              
              <div className="pt-2 text-xs text-muted-foreground">
                <p>This analysis is generated by an AI to help understand your medical report. 
                Always consult with a healthcare professional for proper medical advice.</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="text-sm text-primary underline hover:text-primary/80"
                  onClick={() => document.getElementById('detailed-analysis')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View detailed analysis
                </button>
              </div>
              
              <div id="detailed-analysis" className="pt-8">
                <h3 className="text-lg font-medium mb-4">Detailed Analysis</h3>
                <EnhancedRecordInsight 
                  title={`${record.type} Analysis - ${record.patientName}`}
                  analysis={record.analysis}
                />
              </div>
            </div>
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
