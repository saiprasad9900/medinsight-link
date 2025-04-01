
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageSquare, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: string;
  last_visit: string;
  doctor: string | null;
}

interface PatientHeaderProps {
  patient: Patient;
  onMessagePatient: (patientId: string) => void;
}

const PatientHeader = ({ patient, onMessagePatient }: PatientHeaderProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {patient.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{patient.name}</CardTitle>
            <CardDescription>
              {patient.age} years • {patient.gender} • {patient.condition}
            </CardDescription>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className={cn(
                "font-normal",
                patient.status === "Critical" ? "border-red-500 text-red-500 bg-red-500/10" :
                patient.status === "Stable" ? "border-blue-500 text-blue-500 bg-blue-500/10" :
                "border-green-500 text-green-500 bg-green-500/10"
              )}>
                {patient.status}
              </Badge>
              <Badge variant="outline" className="font-normal">
                Last Visit: {new Date(patient.last_visit).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onMessagePatient(patient.id)}>
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button size="sm" className="gap-1.5">
            <PlusCircle className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PatientHeader;
