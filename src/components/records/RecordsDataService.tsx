
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { MedicalRecord } from "@/types/records";
import { categorizeRecord } from "@/services/analysisService";
import { useRecordContext } from './RecordContextProvider';

interface RecordFile {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
  file_path: string;
}

const RecordsDataService = () => {
  const { 
    userRecords, 
    setUserRecords, 
    setLoading, 
    setSelectedRecord 
  } = useRecordContext();
  
  const { user, userRole } = useAuth();
  const isDoctor = userRole === "doctor";

  // Function to get file type category
  const getFileType = (fileType: string): MedicalRecord["type"] => {
    if (fileType.includes('image')) return 'Medical Image';
    if (fileType.includes('pdf')) return 'Clinical Note';
    return 'Lab Result';
  };

  // Fetch records based on user role
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
        // Convert the records_files data to our MedicalRecord interface format
        const records: MedicalRecord[] = data.map((file: RecordFile) => {
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
      toast({
        title: "Error loading records",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRecords();
  }, [user, isDoctor, setLoading, setUserRecords]);

  // Handle file upload completion
  const handleFileUpload = (files: File[], filePaths: string[]) => {
    // Add newly uploaded files to the records list
    const newRecords: MedicalRecord[] = files.map((file, index) => {
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

    // Create a new array for state update
    const updatedRecords = [...newRecords, ...userRecords];
    
    // Add the new records to state
    setUserRecords(updatedRecords);
    
    // Select the first new record if available
    if (newRecords.length > 0) {
      setSelectedRecord(newRecords[0]);
    }
    
    // Refresh records from database to ensure we have the latest data
    fetchUserRecords();
    
    // Return the new records for further processing if needed
    return newRecords;
  };

  // Expose the fileUpload function and fetchUserRecords for external use
  return { handleFileUpload, fetchUserRecords };
};

export default RecordsDataService;
