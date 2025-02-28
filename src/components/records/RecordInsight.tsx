
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
import { Info, AlertTriangle, CheckCircle, XCircle, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface InsightItem {
  type: "info" | "warning" | "success" | "error";
  title: string;
  description: string;
}

interface RecordInsightProps {
  title: string;
  summary: string;
  insights: InsightItem[];
}

const RecordInsight = ({ title, summary, insights }: RecordInsightProps) => {
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
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Key Insights</h4>
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordInsight;
