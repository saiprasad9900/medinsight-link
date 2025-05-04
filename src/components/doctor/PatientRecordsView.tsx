import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MedicalRecord } from "@/types/records";
import { analyzeRecord, categorizeRecord } from "@/services/analysisService";
import EnhancedRecordInsight from "@/components/records/EnhancedRecordInsight";
import PatientHeader from "./records/PatientHeader";
import NoPatientSelected from "./records/NoPatientSelected";
import PatientNotFound from "./records/PatientNotFound";
import LoadingState from "./records/LoadingState";
import MedicalRecordsList from "./records/MedicalRecordsList";
import AnalyzingState from "./records/AnalyzingState";
import RecordNotAnalyzed from "./records/RecordNotAnalyzed";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, Calendar, FileText, Activity, Pill, CloudUpload, Download, Share2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientRecordsViewProps {
  patientId: string | null;
  onMessagePatient: (patientId: string) => void;
}

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

const PatientRecordsView = ({ patientId, onMessagePatient }: PatientRecordsViewProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("records");
  
  useEffect(() => {
    setSelectedRecord(null);
    
    if (!patientId) return;
    
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
          
        if (patientError) throw patientError;
        setPatient(patientData);
        
        const { data: recordsData, error: recordsError } = await supabase
          .from('records_files')
          .select('*')
          .eq('user_id', patientId)
          .order('created_at', { ascending: false });
          
        if (recordsError) throw recordsError;
        
        if (recordsData) {
          const formattedRecords: MedicalRecord[] = recordsData.map((file) => {
            const type = getFileType(file.file_type);
            return {
              id: file.id,
              title: file.filename,
              type,
              date: new Date(file.created_at).toLocaleDateString('en-US', {
                month: 'short', 
                day: 'numeric', 
                year: 'numeric'
              }),
              patientName: patient?.name || 'Patient',
              status: "Pending" as const,
              filePath: file.file_path,
              category: categorizeRecord({ 
                id: file.id, 
                title: file.filename, 
                type, 
                date: '', 
                patientName: '', 
                status: "Pending" 
              })
            };
          });
          
          setRecords(formattedRecords);
        }
      } catch (error: any) {
        console.error("Error fetching patient data:", error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
  }, [patientId]);
  
  const getFileType = (fileType: string): MedicalRecord["type"] => {
    if (fileType.includes('image')) return 'Medical Image';
    if (fileType.includes('pdf')) return 'Clinical Note';
    return 'Lab Result';
  };
  
  const handleRecordClick = async (record: MedicalRecord) => {
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
      return;
    }
    
    setSelectedRecord(record);
    
    if (!record.analysis) {
      setAnalyzing(true);
      
      try {
        const analysis = await analyzeRecord(record);
        const updatedRecord = { ...record, analysis };
        
        setRecords(prev => 
          prev.map(r => r.id === record.id ? updatedRecord : r)
        );
        
        setSelectedRecord(updatedRecord);
        
      } catch (error: any) {
        console.error("Analysis error:", error);
        toast.error(`Error analyzing record: ${error.message}`);
      } finally {
        setAnalyzing(false);
      }
    }
  };
  
  if (!patientId) {
    return <NoPatientSelected />;
  }
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (!patient) {
    return <PatientNotFound />;
  }

  const mockVitals = {
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6°F",
    oxygenSaturation: "98%",
    respiratoryRate: "16/min",
    lastUpdated: "2023-04-09"
  };

  const mockMedications = [
    { name: "Atorvastatin", dosage: "10mg", frequency: "Once daily", startDate: "2023-01-15" },
    { name: "Lisinopril", dosage: "5mg", frequency: "Once daily", startDate: "2023-02-10" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily", startDate: "2023-01-05" }
  ];

  const mockAppointments = [
    { date: "2023-04-15", time: "10:00 AM", type: "Follow-up", doctor: "Dr. Jane Smith" },
    { date: "2023-05-02", time: "2:30 PM", type: "Lab Work", doctor: "Dr. Robert Chen" }
  ];
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} onMessagePatient={onMessagePatient} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="records" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Medical Records
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Vitals & History
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={selectedRecord ? "lg:col-span-1" : "lg:col-span-3"}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">Medical Records</CardTitle>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <CloudUpload className="h-4 w-4" />
                    Upload New
                  </Button>
                </CardHeader>
                <CardContent>
                  <MedicalRecordsList 
                    records={records}
                    onRecordClick={handleRecordClick}
                    selectedRecordId={selectedRecord?.id || null}
                  />
                </CardContent>
              </Card>
            </div>
            
            {selectedRecord && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-md font-medium">
                      {selectedRecord.title} ({selectedRecord.type})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {analyzing ? (
                      <AnalyzingState />
                    ) : selectedRecord.analysis ? (
                      <EnhancedRecordInsight
                        title={`${selectedRecord.type} Analysis - ${patient.name}`}
                        analysis={selectedRecord.analysis}
                      />
                    ) : (
                      <RecordNotAnalyzed 
                        selectedRecord={selectedRecord} 
                        onAnalyzeClick={handleRecordClick}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Current Vitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Blood Pressure</div>
                      <div className="font-medium">{mockVitals.bloodPressure}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Heart Rate</div>
                      <div className="font-medium">{mockVitals.heartRate}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Temperature</div>
                      <div className="font-medium">{mockVitals.temperature}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Oxygen Saturation</div>
                      <div className="font-medium">{mockVitals.oxygenSaturation}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Respiratory Rate</div>
                      <div className="font-medium">{mockVitals.respiratoryRate}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Last updated: {mockVitals.lastUpdated}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md font-medium">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {mockAppointments.map((appointment, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{appointment.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </div>
                          <div className="text-xs">{appointment.doctor}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    No upcoming appointments
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-md font-medium">Medical History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Chronic Conditions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{patient.condition}</Badge>
                      {patient.condition === "Type 2 Diabetes" && (
                        <>
                          <Badge variant="outline">Hypertension</Badge>
                          <Badge variant="outline">Hyperlipidemia</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Allergies</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Penicillin</Badge>
                      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">Shellfish</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Previous Surgeries</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <div className="text-sm">Appendectomy</div>
                          <div className="text-xs text-muted-foreground">May 2018</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important Note</AlertTitle>
                    <AlertDescription>
                      Patient has reported adverse reactions to NSAIDs in the past.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Current Medications</CardTitle>
            </CardHeader>
            <CardContent>
              {mockMedications.length > 0 ? (
                <div className="space-y-4">
                  {mockMedications.map((med, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Pill className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm">
                          {med.dosage} • {med.frequency}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Started: {med.startDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-6">
                  No medications on record
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Medication History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-6">
                No previous medications on record
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-md font-medium">Prescription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">Write New Prescription</Button>
                <Button variant="outline" className="w-full">Request Refill Authorization</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientRecordsView;
