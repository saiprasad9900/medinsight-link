
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
import { ClipboardList, FileSearch, Info, Share, Download, Printer, Activity, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface MedicalRecordAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord;
}

// Chart colors for visualizations
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

const MedicalRecordAnalysisDialog = ({ isOpen, onClose, record }: MedicalRecordAnalysisDialogProps) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "insights" | "precautions" | "visualization">("summary");
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

  const getSeverityColor = (type: string) => {
    switch (type) {
      case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "success": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "error": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "";
    }
  };

  const handleExportPDF = async () => {
    setExportLoading(true);
    toast.info("Preparing PDF export...");
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("PDF report generated successfully");
      // In a real implementation, this would trigger the download of a generated PDF
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export report");
    } finally {
      setExportLoading(false);
    }
  };
  
  const handleShareAnalysis = () => {
    if (!record.analysis) return;
    
    // Generate a shareable summary
    const summary = `Medical Analysis for ${record.patientName}'s ${record.type}:\n${record.analysis.summary}\n\nGenerated on ${new Date().toLocaleDateString()}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(summary).then(() => {
      toast.success("Analysis summary copied to clipboard", {
        description: "You can now share it via email or messaging"
      });
    });
  };
  
  // Generate data for visualization if we have analysis results
  const generateVisualizationData = () => {
    if (!record.analysis || !record.analysis.extractedData) return null;
    
    // Chart data for conditions
    const conditionData = record.analysis.extractedData.conditions?.map(condition => ({
      name: condition,
      value: Math.floor(Math.random() * 40) + 10 // In a real app, this would be actual relevance data
    })) || [];
    
    // Chart data for trends (simulated)
    const trendData = [
      { name: 'Jan', value: 30 },
      { name: 'Feb', value: 25 },
      { name: 'Mar', value: 35 },
      { name: 'Apr', value: 40 },
      { name: 'May', value: 28 }
    ];
    
    return { conditionData, trendData };
  };
  
  const visualizationData = generateVisualizationData();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="bg-primary/10 p-1.5 rounded text-primary">
              {record.type === "Lab Result" ? <Activity className="h-5 w-5" /> :
               record.type === "Clinical Note" ? <ClipboardList className="h-5 w-5" /> :
               record.type === "Medical Image" ? <FileSearch className="h-5 w-5" /> :
               <Info className="h-5 w-5" />}
            </span>
            <span>Medical Record Analysis</span>
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of {record.type} for {record.patientName}
          </DialogDescription>
        </DialogHeader>
        
        {!record.analysis ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {analyzing ? (
              <>
                <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div className="w-full max-w-md space-y-2">
                  <p className="text-center text-muted-foreground">Analyzing {record.type.toLowerCase()}...</p>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">{analysisProgress}% complete</p>
                </div>
              </>
            ) : (
              <>
                <FileSearch className="h-16 w-16 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-medium text-lg">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-4">Analyze this record to get insights and recommendations</p>
                  <Button onClick={handleAnalyze} disabled={analyzing} className="gap-2">
                    <Activity className="h-4 w-4" />
                    Analyze Record
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Tabs defaultValue="summary" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
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
                <TabsTrigger value="visualization" className="flex gap-1 items-center">
                  <Activity className="h-4 w-4" />
                  Visualize
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4 pt-4">
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
              </TabsContent>
              
              <TabsContent value="insights" className="space-y-4 pt-4">
                {record.analysis.insights.map((insight, index) => (
                  <div 
                    key={index}
                    className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${getSeverityColor(insight.type)}`}
                  >
                    <h3 className="font-medium mb-1">{insight.title}</h3>
                    <p className="text-sm">{insight.description}</p>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="precautions" className="space-y-4 pt-4">
                {record.prediction && (
                  <>
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
                  </>
                )}
                  
                {!record.prediction && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No prediction data available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visualization" className="space-y-6 pt-4">
                {visualizationData ? (
                  <>
                    <div className="p-4 border rounded-lg bg-card">
                      <h3 className="font-medium mb-4">Condition Distribution</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={visualizationData.conditionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {visualizationData.conditionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-card">
                      <h3 className="font-medium mb-4">Historical Trend Analysis</h3>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={visualizationData.trendData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                borderRadius: 'var(--radius)'
                              }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="var(--primary)" 
                              strokeWidth={2}
                              dot={{ r: 4 }} 
                              activeDot={{ r: 6 }} 
                              name="Value"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No visualization data available</p>
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
        
        <DialogFooter className="mt-4 flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-initial">Close</Button>
            {record.analysis && (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleShareAnalysis} 
                  className="flex-1 sm:flex-initial gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button 
                  onClick={handleExportPDF} 
                  disabled={exportLoading} 
                  className="flex-1 sm:flex-initial gap-2"
                >
                  {exportLoading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Export PDF</span>
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => window.print()} 
                  variant="secondary" 
                  className="flex-1 sm:flex-initial gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordAnalysisDialog;
