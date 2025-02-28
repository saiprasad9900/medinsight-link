
import { useState } from "react";
import Layout from "@/components/Layout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  UserPlus,
  Filter,
  MoreHorizontal,
  FileText,
  BarChart3,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const patientsData: Patient[] = [
  {
    id: "PT001",
    name: "Emma Thompson",
    age: 67,
    gender: "Female",
    condition: "Cardiac Arrhythmia",
    status: "Critical",
    lastVisit: "Today",
    doctor: "Dr. Rebecca Lee",
  },
  {
    id: "PT002",
    name: "Michael Chen",
    age: 54,
    gender: "Male",
    condition: "Type 2 Diabetes",
    status: "Stable",
    lastVisit: "Yesterday",
    doctor: "Dr. James Wilson",
  },
  {
    id: "PT003",
    name: "Sophia Rodriguez",
    age: 42,
    gender: "Female",
    condition: "Post-surgery Recovery",
    status: "Improved",
    lastVisit: "3 days ago",
    doctor: "Dr. Maria Garcia",
  },
  {
    id: "PT004",
    name: "Robert Johnson",
    age: 61,
    gender: "Male",
    condition: "Hypertension",
    status: "Stable",
    lastVisit: "1 week ago",
    doctor: "Dr. Robert Chen",
  },
  {
    id: "PT005",
    name: "Alex Thompson",
    age: 8,
    gender: "Male",
    condition: "Asthma",
    status: "Improved",
    lastVisit: "2 weeks ago",
    doctor: "Dr. Maria Garcia",
  },
  {
    id: "PT006",
    name: "Olivia Martinez",
    age: 35,
    gender: "Female",
    condition: "Migraine",
    status: "Stable",
    lastVisit: "1 month ago",
    doctor: "Dr. James Wilson",
  },
  {
    id: "PT007",
    name: "William Davis",
    age: 72,
    gender: "Male",
    condition: "Parkinson's Disease",
    status: "Critical",
    lastVisit: "2 days ago",
    doctor: "Dr. James Wilson",
  },
];

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPatients = patientsData.filter(
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
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor patient information
            </p>
          </div>
          <div className="flex gap-2 self-start">
            <Button variant="default" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Patient
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
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
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{patient.name}</span>
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
                  <TableCell>{patient.doctor}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem>Discharge Patient</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Patients;
