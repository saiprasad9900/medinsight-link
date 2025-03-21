
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
import { Info, AlertTriangle, CheckCircle, XCircle, Copy, Tag, PillIcon, Activity, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Analysis } from "@/types/records";

interface EnhancedRecordInsightProps {
  title: string;
  analysis: Analysis;
}

const EnhancedRecordInsight = ({ title, analysis }: EnhancedRecordInsightProps) => {
  const { summary, insights, extractedData } = analysis;

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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">AI-powered analysis</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Summary</h4>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="insights">
          <TabsList className="w-full">
            <TabsTrigger value="insights" className="flex-1">Key Insights</TabsTrigger>
            {extractedData && <TabsTrigger value="extracted" className="flex-1">Extracted Data</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="insights" className="pt-4 space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="p-3 rounded-md border border-border bg-background"
              >
                <div className="flex items-center gap-2 mb-1">
                  {getIcon(insight.type)}
                  <h5 className="font-medium text-sm">{insight.title}</h5>
                  <Badge 
                    variant="outline" 
                    className={cn("ml-auto font-normal", getBadgeStyles(insight.type))}
                  >
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  {insight.description}
                </p>
              </div>
            ))}
          </TabsContent>
          
          {extractedData && (
            <TabsContent value="extracted" className="pt-4 space-y-4">
              {extractedData.conditions && extractedData.conditions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-500" />
                    <h5 className="font-medium text-sm">Identified Conditions</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.conditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary">{condition}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.medications && extractedData.medications.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <PillIcon className="h-4 w-4 text-purple-500" />
                    <h5 className="font-medium text-sm">Medications</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.medications.map((medication, idx) => (
                      <Badge key={idx} variant="outline" className="bg-purple-50">{medication}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {extractedData.testResults && extractedData.testResults.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <h5 className="font-medium text-sm">Test Results</h5>
                  </div>
                  <div className="pl-6">
                    {extractedData.testResults.map((test, idx) => (
                      <div key={idx} className="flex justify-between border-b border-border py-2 text-sm">
                        <span>{test.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{test.value}</span>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    <h5 className="font-medium text-sm">Diagnostic Codes</h5>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-6">
                    {extractedData.diagnosticCodes.map((code, idx) => (
                      <Badge key={idx} variant="outline" className="bg-amber-50">{code}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedRecordInsight;
