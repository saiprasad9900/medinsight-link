
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Record } from "@/types/records";
import { analyzeRecord, categorizeRecord } from "@/services/analysisService";
import EnhancedRecordInsight from "@/components/records/EnhancedRecordInsight";
import PatientHeader from "./records/PatientHeader";
import NoPatientSelected from "./records/NoPatientSelected";
import PatientNotFound from "./records/PatientNotFound";
import LoadingState from "./records/LoadingState";
import MedicalRecordsList from "./records/MedicalRecordsList";
import AnalyzingState from "./records/AnalyzingState";
import RecordNotAnalyzed from "./records/RecordNotAnalyzed";

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
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} onMessagePatient={onMessagePatient} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedRecord ? "lg:col-span-1" : "lg:col-span-3"}>
          <MedicalRecordsList 
            records={records}
            onRecordClick={handleRecordClick}
            selectedRecordId={selectedRecord?.id || null}
          />
        </div>
        
        {selectedRecord && (
          <div className="lg:col-span-2">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRecordsView;
