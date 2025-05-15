
import { RecordContextProvider } from "@/components/records/RecordContextProvider";
import RecordsHeader from "@/components/records/RecordsHeader";
import RecordsContent from "@/components/records/RecordsContent";
import RecordsDataService from "@/components/records/RecordsDataService";
import { toast } from "sonner";
import { useRecordContext } from "@/components/records/RecordContextProvider";
import { useEffect } from "react";
import { ensureStorageBucket, listUserMedicalRecords } from "@/services/storageService";
import { useAuth } from "@/contexts/AuthContext";

const RecordsPage = () => {
  const { user } = useAuth();
  
  // Initialize storage bucket when the page loads
  useEffect(() => {
    const initializeStorage = async () => {
      await ensureStorageBucket();
      
      // Also verify we can list files to confirm bucket is accessible
      if (user) {
        const { error } = await listUserMedicalRecords(user.id);
        if (error) {
          console.error("Error accessing medical records bucket:", error);
        } else {
          console.log("Medical records bucket is accessible");
        }
      }
    };
    
    initializeStorage().catch(console.error);
  }, [user]);

  return (
    <RecordContextProvider>
      <RecordsContainer />
    </RecordContextProvider>
  );
};

const RecordsContainer = () => {
  const { setActiveTab, setUserRecords, setLoading } = useRecordContext();
  const { handleFileUpload } = RecordsDataService();
  const { user } = useAuth();

  // Refresh records when component mounts or user changes
  useEffect(() => {
    if (user) {
      refreshRecords();
    }
  }, [user]);

  // Function to refresh the records list
  const refreshRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await listUserMedicalRecords(user.id);
    
    if (error) {
      toast.error("Failed to refresh medical records");
      console.error("Error refreshing records:", error);
    } else {
      console.log("Records refreshed successfully", data);
    }
    setLoading(false);
  };

  // Handle file upload from FileUpload component
  const onFileUploadComplete = async (files: File[], filePaths: string[]) => {
    // First handle the file upload like before
    handleFileUpload(files, filePaths);
    setActiveTab("browse");
    
    // Display a toast notification that files were uploaded
    toast.success(`${files.length} medical record${files.length > 1 ? 's' : ''} uploaded successfully`, {
      description: "You can view the uploaded records in the Browse tab",
      duration: 3000
    });
    
    // Force refresh the records list to ensure immediate visibility
    setTimeout(() => {
      refreshRecords();
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <RecordsHeader />
      <RecordsContent onFileUploadComplete={onFileUploadComplete} />
    </div>
  );
};

export default RecordsPage;
