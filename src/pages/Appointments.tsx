
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Filter, Search, Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Form schema for appointment validation
const appointmentFormSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name is required" }),
  date: z.date({ required_error: "Appointment date is required" }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  type: z.string().min(1, { message: "Appointment type is required" }),
  doctor: z.string().min(1, { message: "Doctor name is required" }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"upcoming" | "past" | "all">("upcoming");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Emma Thompson",
      date: "2025-04-11",
      time: "09:00 AM",
      type: "Check-up",
      status: "Confirmed",
      doctor: "Dr. Jane Smith"
    },
    {
      id: 2,
      patient: "Michael Chen",
      date: "2025-04-10",
      time: "11:30 AM",
      type: "Follow-up",
      status: "Completed",
      doctor: "Dr. John Johnson"
    },
    {
      id: 3,
      patient: "Sarah Wilson",
      date: "2025-04-12",
      time: "02:15 PM",
      type: "Consultation",
      status: "Pending",
      doctor: "Dr. Jane Smith"
    },
    {
      id: 4,
      patient: "Robert Davis",
      date: "2025-04-14",
      time: "10:45 AM",
      type: "Check-up",
      status: "Confirmed",
      doctor: "Dr. Patel"
    }
  ]);
  
  const searchForm = useForm({
    defaultValues: {
      search: "",
    }
  });

  // Form for new appointment
  const appointmentForm = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: "",
      date: new Date(),
      time: "",
      type: "",
      doctor: "",
    },
  });

  const onSubmitAppointment = (data: AppointmentFormValues) => {
    // Create new appointment object
    const newAppointment = {
      id: appointments.length + 1,
      patient: data.patientName,
      date: data.date.toISOString().split('T')[0],
      time: data.time,
      type: data.type,
      status: "Pending",
      doctor: data.doctor
    };
    
    // Add to appointments array
    setAppointments([...appointments, newAppointment]);
    
    // Close dialog and reset form
    setIsNewAppointmentOpen(false);
    appointmentForm.reset();
    
    // Show success notification
    toast.success("New appointment created successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <CalendarIcon className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
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
                  <Button variant="outline" type="button" onClick={() => setIsNewAppointmentOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Appointment</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <div className="flex items-center space-x-2">
                <Form {...searchForm}>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={searchForm.control}
                      name="search"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                placeholder="Search patients..."
                                className="pl-8 w-[200px]"
                                {...field}
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <div className="flex rounded-md border border-input">
                  <Button 
                    variant={view === "upcoming" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="rounded-l-md rounded-r-none" 
                    onClick={() => setView("upcoming")}
                  >
                    Upcoming
                  </Button>
                  <Button 
                    variant={view === "past" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="rounded-none border-x"
                    onClick={() => setView("past")}
                  >
                    Past
                  </Button>
                  <Button 
                    variant={view === "all" ? "secondary" : "ghost"} 
                    size="sm" 
                    className="rounded-r-md rounded-l-none"
                    onClick={() => setView("all")}
                  >
                    All
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patient}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>{appointment.doctor}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                        appointment.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {appointment.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select dates to view appointments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-3"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsPage;
