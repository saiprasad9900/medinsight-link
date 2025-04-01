
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface Patient {
  id: string;
  name: string;
  avatar?: string;
}

interface PatientListProps {
  patients: Patient[];
  activePatientId: string | null;
  onSelectPatient: (patientId: string) => void;
  selectedPatientId: string | null;
}

export const PatientList = ({
  patients,
  activePatientId,
  onSelectPatient,
  selectedPatientId
}: PatientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Card className="md:col-span-1 flex flex-col h-full">
      <CardHeader className="px-4">
        <CardTitle className="text-lg">Patient Messages</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto flex-1">
        <div className="divide-y">
          {filteredPatients.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground">
              No patients found
            </div>
          ) : (
            filteredPatients.map(patient => (
              <div
                key={patient.id}
                className={cn(
                  "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                  activePatientId === patient.id && "bg-accent"
                )}
                onClick={() => onSelectPatient(patient.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {patient.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Patient
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
