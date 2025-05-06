
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ClipboardList, FileSearch, Info, Activity } from "lucide-react";
import { MedicalRecord } from "@/types/records";

import SummaryTab from "./tabs/SummaryTab";
import InsightsTab from "./tabs/InsightsTab";
import PrecautionsTab from "./tabs/PrecautionsTab";
import VisualizationTab from "./tabs/VisualizationTab";

interface AnalysisTabsProps {
  record: MedicalRecord;
  getSeverityColor: (type: string) => string;
}

const AnalysisTabs = ({ record, getSeverityColor }: AnalysisTabsProps) => {
  const [activeTab, setActiveTab] = useState<"summary" | "insights" | "precautions" | "visualization">("summary");
  
  return (
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
        
        <TabsContent value="summary">
          <SummaryTab record={record} />
        </TabsContent>
        
        <TabsContent value="insights">
          <InsightsTab record={record} getSeverityColor={getSeverityColor} />
        </TabsContent>
        
        <TabsContent value="precautions">
          <PrecautionsTab record={record} />
        </TabsContent>
        
        <TabsContent value="visualization">
          <VisualizationTab record={record} />
        </TabsContent>
      </Tabs>
      
      <Separator className="my-4" />
      
      <div className="text-xs text-muted-foreground text-center">
        This analysis is AI-generated and should not replace professional medical advice.
        Always consult with a qualified healthcare provider.
      </div>
    </>
  );
};

export default AnalysisTabs;
