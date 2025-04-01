
import { AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";

interface PatientDisclaimerProps {
  isDoctor: boolean;
}

const PatientDisclaimer = ({ isDoctor }: PatientDisclaimerProps) => {
  if (isDoctor) return null;
  
  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
      <AlertCircle className="h-4 w-4 mr-2" />
      As a patient, you can only view and manage your own medical records.
    </Alert>
  );
};

export default PatientDisclaimer;
