
import { AlertCircle } from "lucide-react";

const PatientNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center p-8">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">Patient Not Found</h3>
      <p className="text-muted-foreground">
        The requested patient could not be found or you don't have permission to view this record.
      </p>
    </div>
  );
};

export default PatientNotFound;
