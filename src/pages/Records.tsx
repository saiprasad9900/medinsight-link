
import { RecordContextProvider, useRecordContext } from "@/components/records/RecordContextProvider";
import RecordsHeader from "@/components/records/RecordsHeader";
import RecordsContent from "@/components/records/RecordsContent";
import RecordsDataService from "@/components/records/RecordsDataService";

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
    handleFileUpload(files, filePaths);
    setActiveTab("browse");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RecordsHeader />
      <RecordsContent />
    </div>
  );
};

export default RecordsPage;
