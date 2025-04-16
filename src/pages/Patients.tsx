
import { useState, useEffect } from "react";
import { PatientService } from "@/services/PatientService";
import { Patient } from "@/types/patients";
import { AddPatientForm } from "@/components/patients/AddPatientForm";
import PatientsHeader from "@/components/patients/PatientsHeader";
import PatientList from "@/components/patients/PatientList";
import { toast } from "sonner";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const data = await PatientService.fetchPatients();
      setPatients(data);
    } catch (error) {
      toast.error("Failed to fetch patients");
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatientSuccess = () => {
    fetchPatients();
    toast.success("Patient added successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PatientsHeader onAddPatientClick={() => setAddPatientOpen(true)} />
      
      <PatientList
        patients={patients}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
      />

      <AddPatientForm 
        open={addPatientOpen} 
        onOpenChange={setAddPatientOpen} 
        onSuccess={handleAddPatientSuccess}
      />
    </div>
  );
};

export default Patients;
