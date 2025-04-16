
import { useState } from "react";
import { Filter, Search } from "lucide-react";
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
  CardTitle 
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Appointment } from "@/services/AppointmentService";

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
}

export const AppointmentList = ({ appointments, isLoading }: AppointmentListProps) => {
  const [view, setView] = useState<"upcoming" | "past" | "all">("upcoming");
  
  const searchForm = useForm({
    defaultValues: {
      search: "",
    }
  });

  return (
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Loading appointments...</TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">No appointments found</TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
