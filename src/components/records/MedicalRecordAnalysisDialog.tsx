
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MedicalRecord } from "@/types/records";
import { analyzeRecord, predictOutcomes } from "@/services/analysisService";
import { ClipboardList, FileSearch, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MedicalRecordAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord;
}

const MedicalRecordAnalysisDialog = ({ isOpen, onClose, record }: MedicalRecordAnalysisDialogProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "insights" | "precautions">("summary");
  
  const handleAnalyze = async () => {
    if (analyzing) return;
    
    try {
      setAnalyzing(true);
      toast.info("Analyzing medical record...");
      
      // Analyze the record and get predictions
      const analysis = await analyzeRecord(record);
      const prediction = await predictOutcomes(record);
      
      // Update the record with analysis and prediction
      record.analysis = analysis;
      record.prediction = prediction;
      
      toast.success("Analysis completed successfully");
    } catch (error) {
      console.error("Error analyzing record:", error);
      toast.error("Failed to analyze record");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityColor = (type: string) => {
    switch (type) {
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "success": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medical Record Analysis</DialogTitle>
          <DialogDescription>
            AI-powered analysis of {record.type} for {record.patientName}
          </DialogDescription>
        </DialogHeader>
        
        {!record.analysis ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {analyzing ? (
              <>
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-muted-foreground">Analyzing medical record...</p>
              </>
            ) : (
              <>
                <FileSearch className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-medium text-lg">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-4">Analyze this record to get insights and recommendations</p>
                  <Button onClick={handleAnalyze} disabled={analyzing}>
                    Analyze Record
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Tabs defaultValue="summary" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary" className="flex gap-1 items-center">
                  <ClipboardList className="h-4 w-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex gap-1 items-center">
                  <FileSearch className="h-4 w-4" />
                  Key Insights
                </TabsTrigger>
                <TabsTrigger value="precautions" className="flex gap-1 items-center">
                  <Info className="h-4 w-4" />
                  Precautions
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <p className="text-muted-foreground">{record.analysis.summary}</p>
                </div>
                
                {record.analysis.extractedData?.conditions && (
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Identified Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      {record.analysis.extractedData.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4 pt-4">
                {record.analysis.insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg ${getSeverityColor(insight.type)}`}
                  >
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="precautions" className="space-y-4 pt-4">
                {record.prediction && (
                  <>
                    <div className="p-4 border rounded-lg">
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
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {record.prediction.recommendations.map((rec, index) => (
                          <li key={index} className="text-muted-foreground">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
                  
                {!record.prediction && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No prediction data available</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4" />
            
            <div className="text-xs text-muted-foreground text-center">
              This analysis is AI-generated and should not replace professional medical advice.
              Always consult with a qualified healthcare provider.
            </div>
          </>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {record.analysis && (
            <Button onClick={() => window.print()}>Print Report</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordAnalysisDialog;
