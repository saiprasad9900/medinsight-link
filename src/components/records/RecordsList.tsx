
import { useState } from "react";
import RecordCard from "./RecordCard";
import { MedicalRecord } from "@/types/records";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface RecordsListProps {
  records: MedicalRecord[];
  loading: boolean;
  onRecordClick: (record: MedicalRecord) => void;
  selectedRecordId: string | null;
  onUploadClick: () => void;
}

const RecordsList = ({ 
  records, 
  loading, 
  onRecordClick, 
  selectedRecordId, 
  onUploadClick 
}: RecordsListProps) => {
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No Records Found</h3>
        <p className="text-muted-foreground mt-2 max-w-md">
          {isDoctor 
            ? "There are no medical records available that match your criteria." 
            : "You haven't uploaded any medical records yet. Click the 'Upload' tab to add your first record."}
        </p>
        <Button 
          onClick={onUploadClick} 
          className="mt-4"
        >
          Upload Records
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {records.map((record) => (
        <div 
          key={record.id} 
          onClick={() => onRecordClick(record)}
          className="cursor-pointer"
        >
          <RecordCard 
            record={record} 
            isSelected={selectedRecordId === record.id} 
          />
        </div>
      ))}
    </div>
  );
};

export default RecordsList;
