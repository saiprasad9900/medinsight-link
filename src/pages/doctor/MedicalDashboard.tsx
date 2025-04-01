
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Bell, Calendar, FileText, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DoctorPatientsList from "@/components/doctor/DoctorPatientsList";
import PatientRecordsView from "@/components/doctor/PatientRecordsView";
import DoctorMessaging from "@/components/doctor/DoctorMessaging";
import { toast } from "sonner";

const MedicalDashboard = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("patients");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [patientsCount, setPatientsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch patients count
        const { count: patientsCount, error: patientsError } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true });
          
        if (patientsError) throw patientsError;
        if (patientsCount !== null) setPatientsCount(patientsCount);
        
        // Mock unread messages count for now
        setUnreadMessagesCount(Math.floor(Math.random() * 10));
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Could not load dashboard data");
      }
    };
    
    if (userRole === "doctor") {
      fetchCounts();
    }
  }, [userRole]);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Medical Staff Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage patients, records, and communications
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Patients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patientsCount}</div>
              <p className="text-xs text-muted-foreground">
                Active patient cases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unread Messages
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadMessagesCount}</div>
              <p className="text-xs text-muted-foreground">
                From patients and colleagues
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="patients" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="records" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              Records
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex gap-2 items-center">
              <MessageSquare className="h-4 w-4" />
              Messaging
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients" className="space-y-4 animate-fade-in">
            <DoctorPatientsList 
              onSelectPatient={(id) => {
                setSelectedPatientId(id);
                setActiveTab("records");
              }}
            />
          </TabsContent>
          
          <TabsContent value="records" className="space-y-4 animate-fade-in">
            <PatientRecordsView 
              patientId={selectedPatientId} 
              onMessagePatient={(patientId) => {
                setSelectedPatientId(patientId);
                setActiveTab("messages");
              }}
            />
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4 animate-fade-in">
            <DoctorMessaging selectedPatientId={selectedPatientId} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MedicalDashboard;
