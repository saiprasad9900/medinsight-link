
import { MedicalRecord } from "@/types/records";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Activity, ClipboardList, FileSearch, Info } from "lucide-react";

interface AnalysisHeaderProps {
  record: MedicalRecord;
}

const AnalysisHeader = ({ record }: AnalysisHeaderProps) => {
  return (
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
  );
};

export default AnalysisHeader;
