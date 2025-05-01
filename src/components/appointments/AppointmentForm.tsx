import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppointmentService } from "@/services/AppointmentService";

// Form schema for appointment validation
const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name is required" }),
  date: z.date({ required_error: "Appointment date is required" }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  type: z.string().min(1, { message: "Appointment type is required" }),
  doctor: z.string().min(1, { message: "Doctor name is required" }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: () => void;
  initialDate?: Date; // Added initialDate prop
}

export const AppointmentForm = ({ isOpen, onClose, onAppointmentCreated, initialDate }: AppointmentFormProps) => {
  // Form for new appointment
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: "",
      date: initialDate || new Date(), // Use initialDate if provided
      time: "",
      type: "",
      doctor: "",
    },
  });

  // Reset form with initialDate when dialog opens
  useEffect(() => {
    if (isOpen) {
      appointmentForm.reset({
        patientName: "",
        date: initialDate || new Date(),
        time: "",
        type: "",
        doctor: "",
      });
    }
  }, [isOpen, initialDate, appointmentForm]);

  const onSubmitAppointment = async (data: AppointmentFormValues) => {
    // Format date for database
    const formattedDate = data.date.toISOString().split('T')[0];
    
    // Save appointment to database
    const success = await AppointmentService.addAppointment({
      patient: data.patientName,
      date: formattedDate,
      time: data.time,
      type: data.type,
      status: "Pending",
      doctor: data.doctor
    });
    
    if (success) {
      // Refresh appointments list
      onAppointmentCreated();
      
      // Close dialog and reset form
      onClose();
      appointmentForm.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Fill out the form below to schedule a new patient appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...appointmentForm}>
          <form onSubmit={appointmentForm.handleSubmit(onSubmitAppointment)} className="space-y-4">
            <FormField
              control={appointmentForm.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={appointmentForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      className="rounded-md border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={appointmentForm.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={appointmentForm.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Check-up">Check-up</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Procedure">Procedure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={appointmentForm.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Dr. Jane Smith">Dr. Jane Smith</SelectItem>
                      <SelectItem value="Dr. John Johnson">Dr. John Johnson</SelectItem>
                      <SelectItem value="Dr. Patel">Dr. Patel</SelectItem>
                      <SelectItem value="Dr. Wilson">Dr. Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create Appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
