
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Filter, Search } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

const AppointmentsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"upcoming" | "past" | "all">("upcoming");
  
  const form = useForm({
    defaultValues: {
      search: "",
    }
  });

  const appointments = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appointments</h2>
          <p className="text-muted-foreground">Manage and schedule patient appointments</p>
        </div>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Upcoming Appointments</CardTitle>
              <div className="flex items-center space-x-2">
                <Form {...form}>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
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
