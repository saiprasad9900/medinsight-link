
import { Button } from "@/components/ui/button";
import { BarChart, FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";

const RecordTypeSelector = () => {
  return (
    <div className="bg-accent/50 p-4 rounded-lg border border-border flex items-center gap-4">
      <div className="flex gap-3 flex-wrap">
        <Button 
          variant="ghost"
          size="sm"
          className="gap-1 bg-background hover:bg-background shadow-sm"
        >
          <FileText className="h-4 w-4" />
          Documents
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="gap-1 bg-background hover:bg-background shadow-sm"
        >
          <BarChart className="h-4 w-4" />
          Lab Results
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="gap-1 bg-background hover:bg-background shadow-sm"
        >
          <ImageIcon className="h-4 w-4" />
          Medical Images
        </Button>
        <Button 
          variant="ghost"
          size="sm"
          className="gap-1 bg-background hover:bg-background shadow-sm"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Datasets
        </Button>
      </div>
    </div>
  );
};

export default RecordTypeSelector;
