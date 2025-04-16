
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Appointment {
  id?: string;
  patient: string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctor: string;
  created_at?: string;
}

export const AppointmentService = {
  fetchAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      toast.error(`Failed to fetch appointments: ${error.message}`);
      console.error("Error fetching appointments:", error);
      return [];
    }
  },
  
  addAppointment: async (appointmentData: Omit<Appointment, "id" | "created_at">): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("appointments")
        .insert(appointmentData);

      if (error) {
        throw error;
      }
      
      toast.success("Appointment scheduled successfully");
      return true;
    } catch (error: any) {
      toast.error(`Error scheduling appointment: ${error.message}`);
      console.error("Error adding appointment:", error);
      return false;
    }
  }
};
