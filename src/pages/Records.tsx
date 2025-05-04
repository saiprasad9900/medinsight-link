
import { RecordContextProvider, useRecordContext } from "@/components/records/RecordContextProvider";
import RecordsHeader from "@/components/records/RecordsHeader";
import RecordsContent from "@/components/records/RecordsContent";
import RecordsDataService from "@/components/records/RecordsDataService";
import { toast } from "sonner";
import { analyzeRecord, predictOutcomes } from "@/services/analysisService";

const RecordsPage = () => {
  return (
    <RecordContextProvider>
      <RecordsContainer />
    </RecordContextProvider>
  );
};

const RecordsContainer = () => {
  const { setActiveTab, setUserRecords, userRecords, setSelectedRecord } = useRecordContext();
  const { handleFileUpload } = RecordsDataService();

  // Handle file upload from FileUpload component
  const onFileUploadComplete = async (files: File[], filePaths: string[]) => {
    // First handle the file upload like before
    const newRecords = handleFileUpload(files, filePaths);
    setActiveTab("browse");
    
    // Display a toast notification that analysis has started
    toast.info(`Analyzing ${files.length} new medical record${files.length > 1 ? 's' : ''}...`, {
      description: "This may take a moment to process",
      duration: 3000
    });

    // For each of the newly uploaded files, immediately start analysis
    // (The useEffect in RecordsContent will detect these new records and analyze them)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RecordsHeader />
      <RecordsContent onFileUploadComplete={onFileUploadComplete} />
    </div>
  );
};

export default RecordsPage;
