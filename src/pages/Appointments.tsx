
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { AppointmentService, Appointment } from "@/services/AppointmentService";

// Import our new components
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";

const AppointmentsPage = () => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch appointments from the database
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await AppointmentService.fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Button onClick={() => setIsNewAppointmentOpen(true)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AppointmentList 
          appointments={appointments} 
          isLoading={isLoading} 
        />
        <AppointmentCalendar />
      </div>

      <AppointmentForm 
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onAppointmentCreated={fetchAppointments}
      />
    </div>
  );
};

export default AppointmentsPage;
