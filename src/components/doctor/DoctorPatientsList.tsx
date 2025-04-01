
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  FileText,
  MessageSquare,
  AlertCircle,
  Activity,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: "Critical" | "Stable" | "Improved";
  lastVisit: string;
  doctor: string;
}

interface DoctorPatientsListProps {
  onSelectPatient: (patientId: string) => void;
}

const DoctorPatientsList = ({ onSelectPatient }: DoctorPatientsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Format the data to match our Patient interface
          const formattedPatients = data.map((patient) => ({
            id: patient.id,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            condition: patient.condition,
            status: patient.status as "Critical" | "Stable" | "Improved",
            lastVisit: new Date(patient.last_visit).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            doctor: patient.doctor || "Unassigned",
          }));
          setPatients(formattedPatients);
        }
      } catch (error: any) {
        toast.error(`Failed to fetch patients: ${error.message}`);
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "border-red-500 text-red-500 bg-red-500/10";
      case "Stable":
        return "border-blue-500 text-blue-500 bg-blue-500/10";
      case "Improved":
        return "border-green-500 text-green-500 bg-green-500/10";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, ID, or condition..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading patients...
                </TableCell>
              </TableRow>
            ) : filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-xs text-muted-foreground">{patient.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.age} / {patient.gender}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn("font-normal", getStatusColor(patient.status))}
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onSelectPatient(patient.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Activity className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {patient.status === "Critical" && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <AlertCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorPatientsList;
