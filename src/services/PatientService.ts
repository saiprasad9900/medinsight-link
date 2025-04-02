
import { supabase } from "@/integrations/supabase/client";
import { Patient } from "@/types/patients";
import { toast } from "sonner";

export const PatientService = {
  fetchPatients: async (): Promise<Patient[]> => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedPatients = data.map((patient) => ({
          id: patient.id,
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          condition: patient.condition,
          status: patient.status as "Critical" | "Stable" | "Improved",
          lastVisit: new Date(patient.last_visit).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          doctor: patient.doctor || "Unassigned",
        }));
        return formattedPatients;
      }
      return [];
    } catch (error: any) {
      toast.error(`Failed to fetch patients: ${error.message}`);
      console.error("Error fetching patients:", error);
      return [];
    }
  }
};
