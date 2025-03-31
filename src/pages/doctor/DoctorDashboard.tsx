
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Users, FileText, MessagesSquare, Calendar } from "lucide-react";
import { RecordCard } from "@/components/records/RecordCard";
import { Record } from "@/types/records";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch patients (in a real app, this would query a patients table)
        // For now, we'll use mock data
        const mockPatients = [
          {
            id: "1",
            name: "Emma Thompson",
            age: 42,
            email: "emma.thompson@example.com",
            lastVisit: "2023-08-15",
            conditions: ["Hypertension", "Type 2 Diabetes"]
          },
          {
            id: "2",
            name: "Michael Chen",
            age: 35,
            email: "michael.chen@example.com",
            lastVisit: "2023-08-10",
            conditions: ["Asthma"]
          },
          {
            id: "3",
            name: "Sophia Rodriguez",
            age: 28,
            email: "sophia.rodriguez@example.com",
            lastVisit: "2023-08-05",
            conditions: ["Anxiety", "Migraines"]
          }
        ];
        
        setPatients(mockPatients);
        
        // Fetch records (in a real implementation, filter by doctor assignment)
        const { data: recordsData, error } = await supabase
          .from('records_files')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (recordsData) {
          // Convert to Record type
          const formattedRecords: Record[] = recordsData.map((file: any) => ({
            id: file.id,
            title: file.filename,
            type: file.file_type.includes('image') ? 'Medical Image' : 'Clinical Note',
            date: new Date(file.created_at).toLocaleDateString('en-US', {
              month: 'short', 
              day: 'numeric', 
              year: 'numeric'
            }),
            patientName: mockPatients[Math.floor(Math.random() * mockPatients.length)].name,
            status: "Analyzed" as const,
            category: ["Laboratory", "Radiology", "Cardiology"][Math.floor(Math.random() * 3)]
          }));
          
          setRecords(formattedRecords);
        }
        
      } catch (error: any) {
        console.error("Error fetching doctor dashboard data:", error);
        toast.error(`Failed to load dashboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Dr. {user?.user_metadata?.last_name || "Doctor"}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          <Button asChild>
            <Link to="/doctor/messages" className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4" />
              Patient Messages
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/doctor/appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointments
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+5 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">Next: Today at 2:00 PM</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Recent Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
              <CardDescription>
                View and manage your patient list
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {patients.map((patient) => (
                  <div key={patient.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{patient.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {patient.age} years old • Last visit: {patient.lastVisit}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {patient.conditions.map((condition: string, i: number) => (
                          <span 
                            key={i} 
                            className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="records" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record) => (
              <div key={record.id} className="cursor-pointer">
                <RecordCard record={record} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorDashboard;
