
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Tag, 
  PillIcon, 
  Activity, 
  FileText,
  Share,
  Printer,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Analysis } from "@/types/records";
import { useState } from "react";

interface EnhancedRecordInsightProps {
  title: string;
  analysis: Analysis;
}

const EnhancedRecordInsight = ({ title, analysis }: EnhancedRecordInsightProps) => {
  const { summary, insights, extractedData } = analysis;
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

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
        return null;
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
        return "";
    }
  };

  const handleCopy = () => {
    const text = `${title}\n\n${summary}\n\nInsights:\n${insights
      .map((insight) => `- ${insight.title}: ${insight.description}`)
      .join("\n")}`;
    
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <Card className="h-full overflow-hidden scale-in border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            <CardDescription className="mt-1">AI-powered analysis</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 interactive-element" 
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 interactive-element" 
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 interactive-element" 
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="fade-in">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="bg-primary/20 text-primary p-1 rounded">Summary</span>
          </h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        
        <Separator className="my-4" />
        
        <Tabs defaultValue="insights" className="fade-in">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="insights" className="flex-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Key Insights
              </div>
            </TabsTrigger>
            {extractedData && (
              <TabsTrigger value="extracted" className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Activity className="h-4 w-4" />
                  Extracted Data
                </div>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="insights" className="pt-4 space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-4 rounded-md border transition-all duration-300 stagger-item slide-right cursor-pointer hover:shadow-md",
                  selectedInsight === index ? "border-primary bg-primary/5" : "border-border bg-background",
                  getBadgeStyles(insight.type)
                )}
                onClick={() => setSelectedInsight(selectedInsight === index ? null : index)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getIcon(insight.type)}
                  <h5 className="font-medium text-sm">{insight.title}</h5>
                  <Badge 
                    variant="outline" 
                    className={cn("ml-auto font-normal", getBadgeStyles(insight.type))}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <p className={cn(
                  "text-sm text-muted-foreground pl-6 transition-all duration-300",
                  selectedInsight === index ? "opacity-100" : "opacity-85"
                )}>
                  {insight.description}
                </p>
              </div>
            ))}
          </TabsContent>
          
          {extractedData && (
            <TabsContent value="extracted" className="pt-4 space-y-4">
              {extractedData.conditions && extractedData.conditions.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-blue-200 bg-blue-50/50 dark:bg-blue-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <h5 className="font-medium text-sm text-blue-700 dark:text-blue-400">Identified Conditions</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.conditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 interactive-element">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.medications && extractedData.medications.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-purple-200 bg-purple-50/50 dark:bg-purple-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <PillIcon className="h-4 w-4 text-purple-500" />
                    <h5 className="font-medium text-sm text-purple-700 dark:text-purple-400">Medications</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.medications.map((medication, idx) => (
                      <Badge key={idx} variant="outline" className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 interactive-element">
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.testResults && extractedData.testResults.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-green-200 bg-green-50/50 dark:bg-green-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <h5 className="font-medium text-sm text-green-700 dark:text-green-400">Test Results</h5>
                  </div>
                  <div className="pl-6">
                    {extractedData.testResults.map((test, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between border-b border-green-200 py-2 text-sm hover:bg-green-100/50 transition-colors px-2 rounded-sm"
                      >
                        <span className="font-medium text-green-800">{test.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{test.value}</span>
                          <span className="text-muted-foreground">{test.unit}</span>
                          {test.referenceRange && (
                            <span className="text-xs text-muted-foreground">
                              (Ref: {test.referenceRange})
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.diagnosticCodes && extractedData.diagnosticCodes.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <h5 className="font-medium text-sm text-amber-700 dark:text-amber-400">Diagnostic Codes</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.diagnosticCodes.map((code, idx) => (
                      <Badge key={idx} variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 interactive-element">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.vitalSigns && extractedData.vitalSigns.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-red-200 bg-red-50/50 dark:bg-red-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-red-500" />
                    <h5 className="font-medium text-sm text-red-700 dark:text-red-400">Vital Signs</h5>
                  </div>
                  <div className="pl-6 grid grid-cols-2 gap-2">
                    {extractedData.vitalSigns.map((vital, idx) => (
                      <div 
                        key={idx} 
                        className="flex justify-between items-center p-2 bg-white dark:bg-red-900/10 rounded-md shadow-sm"
                      >
                        <span className="text-xs text-muted-foreground">{vital.name}</span>
                        <span className="font-bold text-sm flex items-center gap-1">
                          {vital.value}
                          <span className="text-xs font-normal text-muted-foreground">{vital.unit}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.findings && extractedData.findings.length > 0 && (
                <div className="space-y-2 p-4 rounded-md border border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/10 stagger-item fade-in">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-500" />
                    <h5 className="font-medium text-sm text-indigo-700 dark:text-indigo-400">Key Findings</h5>
                  </div>
                  <div className="pl-6">
                    <ul className="space-y-1 list-disc list-inside">
                      {extractedData.findings.map((finding, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">{finding}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
        
        <div className="pt-4 flex justify-end gap-2 fade-in">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-1.5">
            <Share className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecordInsight;
