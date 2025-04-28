
import { useState } from "react";
import { Filter, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Appointment } from "@/services/AppointmentService";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  selectedDate?: Date;
}

export const AppointmentList = ({ appointments, isLoading, selectedDate }: AppointmentListProps) => {
  const [view, setView] = useState<"upcoming" | "past" | "all">("upcoming");
  
  const searchForm = useForm({
    defaultValues: {
      search: "",
    }
  });

  // Get the title based on the selected date and view
  const getTitle = () => {
    if (selectedDate) {
      return `Appointments for ${format(selectedDate, 'MMMM d, yyyy')}`;
    }
    
    switch (view) {
      case "upcoming":
        return "Upcoming Appointments";
      case "past":
        return "Past Appointments";
      default:
        return "All Appointments";
    }
  };

  // Get status badge styling based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200">Confirmed</Badge>;
      case 'Completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200">Completed</Badge>;
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200">Pending</Badge>;
      case 'Cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="col-span-1 lg:col-span-3 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {selectedDate && <Calendar className="h-5 w-5 text-primary" />}
            {getTitle()}
            {selectedDate && (
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
              </Badge>
            )}
          </CardTitle>
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
            {!selectedDate && (
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
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader className="bg-muted/30">
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                    <p className="text-muted-foreground">Loading appointments...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium">No appointments found</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedDate 
                        ? `No appointments scheduled for ${format(selectedDate, 'MMMM d, yyyy')}` 
                        : "No appointments match your current filters"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{appointment.patient}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/10">
                      {appointment.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>
                    {getStatusBadge(appointment.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit appointment details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {appointments.length > 0 && (
        <CardFooter className="border-t flex justify-between text-sm text-muted-foreground p-4">
          <p>Showing {appointments.length} appointments</p>
          <Button variant="ghost" size="sm" className="text-xs">View All</Button>
        </CardFooter>
      )}
    </Card>
  );
};
