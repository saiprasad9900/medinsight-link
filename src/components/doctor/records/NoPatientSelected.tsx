
import { FileText } from "lucide-react";

const NoPatientSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-8">
      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No Patient Selected</h3>
      <p className="text-muted-foreground max-w-md">
        Please select a patient from the patients list to view their medical records and information.
      </p>
    </div>
  );
};

export default NoPatientSelected;
