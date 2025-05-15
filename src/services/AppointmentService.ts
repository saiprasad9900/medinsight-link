
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

// Helper function to ensure storage bucket exists
const ensureAppointmentsBucket = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'appointments');
    
    if (!bucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket('appointments', { 
        public: false,
        fileSizeLimit: 1024 * 1024 * 5, // 5MB limit per file
      });
      
      if (createError) {
        throw createError;
      }
      console.log("Created appointments bucket");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring appointments bucket:", error);
    return false;
  }
};

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
      // 1. Add the appointment to the database
      const { error: dbError, data: appointmentResult } = await supabase
        .from("appointments")
        .insert(appointmentData)
        .select();

      if (dbError) {
        throw dbError;
      }
      
      // 2. Ensure appointments bucket exists
      await ensureAppointmentsBucket();
      
      // 3. Store a JSON file with appointment details in the storage bucket for backup
      if (appointmentResult && appointmentResult[0]) {
        const appointment = appointmentResult[0];
        const appointmentId = appointment.id;
        
        // Create a JSON file with appointment details
        const jsonBlob = new Blob(
          [JSON.stringify(appointment, null, 2)], 
          { type: 'application/json' }
        );
        
        // Upload to storage
        const filePath = `${appointmentId}/${appointment.patient.replace(/\s+/g, '_')}_${appointment.date}.json`;
        
        const { error: uploadError } = await supabase.storage
          .from('appointments')
          .upload(filePath, jsonBlob);
          
        if (uploadError) {
          console.error("Error uploading appointment JSON:", uploadError);
          // Don't throw here, as the DB insertion was successful
        }
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
