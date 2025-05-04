import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Upload } from "lucide-react";
import FileUpload from "./FileUpload";
import RecordsList from "./RecordsList";
import RecordTypeSelector from "./RecordTypeSelector";
import { useRecordContext } from "./RecordContextProvider";
import RecordAnalysis from "./RecordAnalysis";
import { useAuth } from "@/contexts/AuthContext";

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

interface RecordsContentProps {
  onFileUploadComplete?: (files: File[], filePaths: string[]) => void;
}

const RecordsContent = ({ onFileUploadComplete }: RecordsContentProps) => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedRecord, 
    setSelectedRecord,
    userRecords,
    categoryFilter,
    loading,
    analyzing,
  } = useRecordContext();
  
  const { userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  const handleFileUpload = async (files: File[], filePaths: string[]) => {
    if (onFileUploadComplete) {
      onFileUploadComplete(files, filePaths);
    }
    setActiveTab("browse");
  };

  const handleRecordClick = (record: Record) => {
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
      return;
    }
    
    setSelectedRecord(record);
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
              <RecordAnalysis
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
  );
};

export default RecordsContent;
