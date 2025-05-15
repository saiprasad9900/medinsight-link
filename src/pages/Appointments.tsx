
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { toast } from "sonner";
import { AppointmentService, Appointment } from "@/services/AppointmentService";

// Import our components
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { AppointmentCalendar } from "@/components/appointments/AppointmentCalendar";

const AppointmentsPage = () => {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  
  // Fetch appointments from the database
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const data = await AppointmentService.fetchAppointments();
      setAppointments(data);
      filterAppointmentsByDate(data, selectedDate);
      
      // Show success message when there are appointments
      if (data.length > 0) {
        toast.success(`Loaded ${data.length} appointments`, {
          description: "Your appointments are up to date"
        });
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to load appointments", {
        description: "Please try again or contact support if the problem persists."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter appointments by selected date
  const filterAppointmentsByDate = (appointmentsList: Appointment[], date: Date | undefined) => {
    if (!date) {
      setFilteredAppointments(appointmentsList);
      return;
    }
    
    const formattedDate = date.toISOString().split('T')[0];
    const filtered = appointmentsList.filter(appointment => appointment.date === formattedDate);
    setFilteredAppointments(filtered);
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    filterAppointmentsByDate(appointments, date);
    
    if (date) {
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      const count = appointments.filter(a => a.date === date.toISOString().split('T')[0]).length;
      if (count > 0) {
        toast.success(`Showing ${count} appointments for ${formattedDate}`);
      } else {
        toast.info(`No appointments on ${formattedDate}`, {
          description: "Click 'New Appointment' to schedule one."
        });
      }
    }
  };

  // Handle appointment creation success
  const handleAppointmentCreated = () => {
    toast.success("Appointment created successfully", {
      description: "The appointment has been added to your calendar"
    });
    fetchAppointments();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Update filtered appointments when selectedDate changes
    filterAppointmentsByDate(appointments, selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setIsNewAppointmentOpen(true)} className="transition-all hover:shadow-md">
            <CalendarIcon className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AppointmentList 
          appointments={selectedDate ? filteredAppointments : appointments} 
          isLoading={isLoading} 
          selectedDate={selectedDate}
        />
        <AppointmentCalendar 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

      <AppointmentForm 
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onAppointmentCreated={handleAppointmentCreated}
        initialDate={selectedDate}
      />
    </div>
  );
};

export default AppointmentsPage;
