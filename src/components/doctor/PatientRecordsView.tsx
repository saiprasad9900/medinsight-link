
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, MessageSquare, Calendar, PlusCircle, UserPlus, History, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Record } from "@/types/records";
import { analyzeRecord, categorizeRecord } from "@/services/analysisService";
import EnhancedRecordInsight from "@/components/records/EnhancedRecordInsight";

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
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  useEffect(() => {
    // Reset state when patient changes
    setSelectedRecord(null);
    
    if (!patientId) return;
    
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Fetch patient details
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', patientId)
          .single();
          
        if (patientError) throw patientError;
        setPatient(patientData);
        
        // Fetch patient records
        const { data: recordsData, error: recordsError } = await supabase
          .from('records_files')
          .select('*')
          .eq('user_id', patientId)
          .order('created_at', { ascending: false });
          
        if (recordsError) throw recordsError;
        
        if (recordsData) {
          // Convert to Record format
          const formattedRecords: Record[] = recordsData.map((file) => {
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
  
  const getFileType = (fileType: string): Record["type"] => {
    if (fileType.includes('image')) return 'Medical Image';
    if (fileType.includes('pdf')) return 'Clinical Note';
    return 'Lab Result';
  };
  
  const handleRecordClick = async (record: Record) => {
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
      return;
    }
    
    setSelectedRecord(record);
    
    // If record doesn't have analysis, generate it
    if (!record.analysis) {
      setAnalyzing(true);
      
      try {
        const analysis = await analyzeRecord(record);
        const updatedRecord = { ...record, analysis };
        
        // Update in the records list
        setRecords(prev => 
          prev.map(r => r.id === record.id ? updatedRecord : r)
        );
        
        // Update selected record
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
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Patient Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Please select a patient from the patients list to view their medical records and information.
        </p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Patient Not Found</h3>
        <p className="text-muted-foreground">
          The requested patient could not be found or you don't have permission to view this record.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedRecord ? "lg:col-span-1" : "lg:col-span-3"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medical Records</CardTitle>
              <CardDescription>
                {records.length} records found for this patient
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {records.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">No records found for this patient</p>
                    <Button size="sm" className="gap-1.5">
                      <PlusCircle className="h-4 w-4" />
                      Add First Record
                    </Button>
                  </div>
                ) : (
                  records.map((record) => (
                    <div 
                      key={record.id}
                      className={cn(
                        "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                        selectedRecord?.id === record.id && "bg-accent"
                      )}
                      onClick={() => handleRecordClick(record)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium truncate">{record.title}</h3>
                            <span className="text-xs text-muted-foreground">
                              {record.date}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {record.type}
                              </Badge>
                              {record.category && (
                                <Badge variant="outline" className="text-xs">
                                  {record.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {selectedRecord && (
          <div className="lg:col-span-2">
            {analyzing ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="p-8 text-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                  <h3 className="font-medium text-lg mb-2">Analyzing Medical Record</h3>
                  <p className="text-muted-foreground">
                    Our AI is analyzing the medical record to provide insights and recommendations.
                  </p>
                </CardContent>
              </Card>
            ) : selectedRecord.analysis ? (
              <EnhancedRecordInsight
                title={`${selectedRecord.type} Analysis - ${patient.name}`}
                analysis={selectedRecord.analysis}
              />
            ) : (
              <Card className="h-full">
                <CardContent className="p-8 h-full flex flex-col items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Record Details</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    This record hasn't been analyzed yet. You can analyze it to get AI-powered insights.
                  </p>
                  <Button 
                    onClick={() => handleRecordClick(selectedRecord)}
                    className="gap-1.5"
                  >
                    Analyze Record
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecordsView;
