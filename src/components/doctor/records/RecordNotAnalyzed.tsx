
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { MedicalRecord } from "@/types/records";

interface RecordNotAnalyzedProps {
  selectedRecord: MedicalRecord;
  onAnalyzeClick: (record: MedicalRecord) => void;
}

const RecordNotAnalyzed = ({ selectedRecord, onAnalyzeClick }: RecordNotAnalyzedProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-8 h-full flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">Record Details</h3>
        <p className="text-muted-foreground text-center mb-6">
          This record hasn't been analyzed yet. You can analyze it to get AI-powered insights.
        </p>
        <Button 
          onClick={() => onAnalyzeClick(selectedRecord)}
          className="gap-1.5"
        >
          Analyze Record
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecordNotAnalyzed;
