import { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { FileText, Upload } from "lucide-react";
import FileUpload from "@/components/records/FileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Record } from "@/types/records";
import { analyzeRecord, predictOutcomes, categorizeRecord } from "@/services/analysisService";
import RecordsList from "@/components/records/RecordsList";
import RecordDetails from "@/components/records/RecordDetails";
import RecordFilters from "@/components/records/RecordFilters";
import RecordTypeSelector from "@/components/records/RecordTypeSelector";
import PatientDisclaimer from "@/components/records/PatientDisclaimer";

interface RecordFile {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
  file_path: string;
}

// Sample data for doctors
const recordsData = [
  {
    id: "1",
    title: "Complete Blood Count Results",
    type: "Lab Result" as const,
    date: "Aug 15, 2023",
    patientName: "Emma Thompson",
    insights: 5,
    status: "Analyzed" as const,
    category: "Laboratory",
  },
  {
    id: "2",
    title: "Cardiac Assessment Report",
    type: "Clinical Note" as const,
    date: "Aug 14, 2023",
    patientName: "Michael Chen",
    insights: 3,
    status: "Analyzed" as const,
    category: "Cardiology",
  },
  {
    id: "3",
    title: "X-Ray Imaging - Chest",
    type: "Medical Image" as const,
    date: "Aug 12, 2023",
    patientName: "Robert Johnson",
    insights: 2,
    status: "Analyzed" as const,
    category: "Radiology",
  },
  {
    id: "4",
    title: "Medication Prescription",
    type: "Prescription" as const,
    date: "Aug 10, 2023",
    patientName: "Sophia Rodriguez",
    status: "Pending" as const,
    category: "Pharmacy",
  },
  {
    id: "5",
    title: "Lipid Panel Results",
    type: "Lab Result" as const,
    date: "Aug 8, 2023",
    patientName: "Michael Chen",
    status: "Processing" as const,
    category: "Laboratory",
  },
  {
    id: "6",
    title: "Post-Surgery Evaluation",
    type: "Clinical Note" as const,
    date: "Aug 5, 2023",
    patientName: "Sophia Rodriguez",
    insights: 4,
    status: "Analyzed" as const,
    category: "Surgical",
  },
];

const Records = () => {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [userRecords, setUserRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const isDoctor = userRole === "doctor";

  // Function to get file type category
  const getFileType = (fileType: string): Record["type"] => {
    if (fileType.includes('image')) return 'Medical Image';
    if (fileType.includes('pdf')) return 'Clinical Note';
    return 'Lab Result';
  };

  // Fetch records based on user role
  useEffect(() => {
    const fetchUserRecords = async () => {
      if (!user) return;

      try {
        setLoading(true);
        let query = supabase
          .from('records_files')
          .select('*')
          .order('created_at', { ascending: false });
          
        // If user is not a doctor, only fetch their own records
        if (!isDoctor) {
          query = query.eq('user_id', user.id);
        }
        
        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          // Convert the records_files data to our Record interface format
          const records: Record[] = data.map((file: RecordFile) => {
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
              patientName: user?.user_metadata?.first_name 
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                : user.email?.split('@')[0] || 'Patient',
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

          setUserRecords(records);
        }
      } catch (error: any) {
        console.error('Error fetching records:', error);
        toast.error(`Error loading records: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecords();
  }, [user, isDoctor]);

  const handleFileUpload = async (files: File[], filePaths: string[]) => {
    // Add newly uploaded files to the records list
    const newRecords: Record[] = files.map((file, index) => {
      const type = getFileType(file.type);
      const record = {
        id: crypto.randomUUID(),
        title: file.name,
        type,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short', 
          day: 'numeric', 
          year: 'numeric'
        }),
        patientName: user?.user_metadata?.first_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
          : user?.email?.split('@')[0] || 'Patient',
        status: "Pending" as const,
        filePath: filePaths[index]
      };
      
      return {
        ...record,
        category: categorizeRecord(record)
      };
    });

    setUserRecords(prev => [...newRecords, ...prev]);
    setActiveTab("browse");
  };

  const handleRecordClick = async (record: Record) => {
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
      return;
    }
    
    setSelectedRecord(record);
    
    // If record doesn't have analysis or prediction yet, generate them
    if (!record.analysis || !record.prediction) {
      setAnalyzing(true);
      
      try {
        // Run NLP analysis and predictive modeling in parallel
        const [analysis, prediction] = await Promise.all([
          analyzeRecord(record),
          predictOutcomes(record)
        ]);
        
        // Update the record with analysis and prediction results
        const updatedRecord = { ...record, analysis, prediction };
        
        // Update in the records list
        if (record.id.startsWith('user-')) {
          setUserRecords(prev => 
            prev.map(r => r.id === record.id ? updatedRecord : r)
          );
        }
        
        // Update selected record
        setSelectedRecord(updatedRecord);
        
        // In a real implementation, save results to database
        // await saveAnalysisResults(record.id, analysis, prediction);
        
      } catch (error: any) {
        console.error("Analysis error:", error);
        toast.error(`Error analyzing record: ${error.message}`);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  // Get records based on user role
  const getRecordsBasedOnRole = () => {
    // For doctors, show all records including sample data
    if (isDoctor) {
      return categoryFilter 
        ? [...userRecords, ...recordsData].filter(record => record.category === categoryFilter)
        : [...userRecords, ...recordsData];
    }
    
    // For patients, show only their records
    return categoryFilter 
      ? userRecords.filter(record => record.category === categoryFilter)
      : userRecords;
  };

  const filteredRecords = getRecordsBasedOnRole();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">
            {isDoctor 
              ? "Upload, analyze, and manage all patient medical records" 
              : "Upload, analyze, and manage your medical records"}
          </p>
        </div>
        <RecordFilters 
          onFilterChange={setCategoryFilter} 
          onUploadClick={() => setActiveTab("upload")} 
          activeTab={activeTab}
        />
      </div>
      
      <PatientDisclaimer isDoctor={isDoctor} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="browse" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            Browse Records
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex gap-2 items-center">
            <Upload className="h-4 w-4" />
            Upload New Records
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={selectedRecord ? "lg:col-span-2" : "lg:col-span-3"}>
              <RecordsList 
                records={filteredRecords}
                loading={loading}
                onRecordClick={handleRecordClick}
                selectedRecordId={selectedRecord?.id || null}
                onUploadClick={() => setActiveTab("upload")}
              />
            </div>
            
            {selectedRecord && (
              <div className="lg:col-span-1">
                <RecordDetails 
                  record={selectedRecord}
                  analyzing={analyzing}
                  onAnalyzeClick={() => handleRecordClick(selectedRecord)}
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6 max-w-3xl mx-auto">
          <div className="space-y-6">
            <RecordTypeSelector />
            <FileUpload onUploadComplete={handleFileUpload} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Records;
