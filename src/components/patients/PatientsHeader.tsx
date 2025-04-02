
import { Button } from "@/components/ui/button";
import { Filter, UserPlus } from "lucide-react";

interface PatientsHeaderProps {
  onAddPatientClick: () => void;
}

const PatientsHeader = ({ onAddPatientClick }: PatientsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Patients</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor patient information
        </p>
      </div>
      <div className="flex gap-2 self-start">
        <Button 
          variant="default" 
          className="gap-2"
          onClick={onAddPatientClick}
        >
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};

export default PatientsHeader;
