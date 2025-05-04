
import { RecordContextProvider } from "@/components/records/RecordContextProvider";
import RecordsHeader from "@/components/records/RecordsHeader";
import RecordsContent from "@/components/records/RecordsContent";
import RecordsDataService from "@/components/records/RecordsDataService";
import { toast } from "sonner";
import { useRecordContext } from "@/components/records/RecordContextProvider";

const RecordsPage = () => {
  return (
    <RecordContextProvider>
      <RecordsContainer />
    </RecordContextProvider>
  );
};

const RecordsContainer = () => {
  const { setActiveTab } = useRecordContext();
  const { handleFileUpload } = RecordsDataService();

  // Handle file upload from FileUpload component
  const onFileUploadComplete = (files: File[], filePaths: string[]) => {
    // First handle the file upload like before
    handleFileUpload(files, filePaths);
    setActiveTab("browse");
    
    // Display a toast notification that files were uploaded
    toast.success(`${files.length} medical record${files.length > 1 ? 's' : ''} uploaded successfully`, {
      description: "You can view the uploaded records in the Browse tab",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RecordsHeader />
      <RecordsContent onFileUploadComplete={onFileUploadComplete} />
    </div>
  );
};

export default RecordsPage;
