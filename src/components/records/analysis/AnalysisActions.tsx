
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
import { Share, Download, Printer } from "lucide-react";
import { MedicalRecord } from "@/types/records";

interface AnalysisActionsProps {
  record: MedicalRecord;
  onClose: () => void;
}

const AnalysisActions = ({ record, onClose }: AnalysisActionsProps) => {
  const [exportLoading, setExportLoading] = useState(false);
  
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
  
  return (
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
  );
};

export default AnalysisActions;
