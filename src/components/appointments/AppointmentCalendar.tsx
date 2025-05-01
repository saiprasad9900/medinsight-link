
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Info } from "lucide-react";
import { toast } from "sonner";
import { AppointmentService, Appointment } from "@/services/AppointmentService";

interface AppointmentCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date | undefined) => void;
}

export const AppointmentCalendar = ({ 
  selectedDate, 
  onDateSelect 
}: AppointmentCalendarProps) => {
  const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [busyDays, setBusyDays] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch appointments to highlight busy days
  useEffect(() => {
    const fetchAppointmentDays = async () => {
      setIsLoading(true);
      try {
        const data = await AppointmentService.fetchAppointments();
        setAppointments(data);
        
        // Extract unique dates for highlighting
        const days = data.map(appointment => {
          const [year, month, day] = appointment.date.split('-').map(Number);
          return new Date(year, month - 1, day);
        });
        
        // Remove duplicates (if multiple appointments on same day)
        setBusyDays(days.filter((date, i, self) => 
          self.findIndex(d => d.toDateString() === date.toDateString()) === i
        ));
      } catch (error) {
        console.error("Error fetching appointment days:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentDays();
  }, []);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    
    if (onDateSelect) {
      onDateSelect(newDate);
    }
    
    // Show appointments for the selected date
    if (newDate) {
      const formattedDate = newDate.toISOString().split('T')[0];
      const dayAppointments = appointments.filter(appt => appt.date === formattedDate);
      
      if (dayAppointments.length > 0) {
        toast.info(`${dayAppointments.length} appointments on ${newDate.toLocaleDateString()}`, {
          description: dayAppointments.map(a => `${a.time} - ${a.patient}`).join(', ')
        });
      }
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Calendar
            </CardTitle>
            <CardDescription>Select dates to view appointments</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Highlighted dates have scheduled appointments.
                  Click a date to view details.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md p-3"
              classNames={{
                day_today: "bg-secondary/30 text-foreground",
                day: "relative"
              }}
              components={{
                Day: ({ date: dayDate, ...props }: React.HTMLAttributes<HTMLDivElement> & { date?: Date }) => {
                  // For non-day components or undefined date
                  if (!dayDate) {
                    return <div {...props} />;
                  }
                  
                  // Add a small indicator dot for days with appointments
                  const hasAppointments = busyDays.some(
                    busyDay => busyDay.toDateString() === dayDate.toDateString()
                  );
                  
                  // Combine classNames properly - using type assertion since we know props structure
                  const className = `${(props as any).className || ""} ${hasAppointments ? "bg-primary/20 font-bold" : ""}`;
                  
                  return (
                    <div className="relative">
                      <div 
                        {...props}
                        className={className}
                      />
                      {hasAppointments && (
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></span>
                      )}
                    </div>
                  );
                },
              }}
            />
            <div className="p-3 border-t">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {date ? date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'No date selected'}
                </p>
                {date && (
                  <Badge variant="outline" className="bg-primary/10">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
