
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecordFilters from "./RecordFilters";
import RecordsList from "./RecordsList";
import RecordDetails from "./RecordDetails";
import { useRecordContext } from "./RecordContextProvider";
import FileUpload from "./FileUpload";
import { analyzeRecord, predictOutcomes } from "@/services/analysisService";
import { toast } from "@/components/ui/use-toast";
import MedicalRecordViewer from "./MedicalRecordViewer";
import RecordsDataService from "./RecordsDataService";

interface RecordsContentProps {
  onFileUploadComplete?: (files: File[], filePaths: string[]) => void;
}

const RecordsContent = ({ onFileUploadComplete }: RecordsContentProps) => {
  const { 
    userRecords, 
    selectedRecord, 
    setSelectedRecord,
    loading, 
    activeTab, 
    setActiveTab,
    setCategoryFilter
  } = useRecordContext();
  
  const [analyzing, setAnalyzing] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const { fetchUserRecords } = RecordsDataService();
  
  const handleAnalyzeClick = async () => {
    if (!selectedRecord || selectedRecord.analysis || analyzing) return;
    
    setAnalyzing(true);
    toast({
      title: `Analyzing ${selectedRecord.type.toLowerCase()}...`,
    });
    
    try {
      // Analyze the record
      const analysis = await analyzeRecord(selectedRecord);
      const prediction = await predictOutcomes(selectedRecord);
      
      // Update the record with the analysis and prediction
      const updatedRecord = { 
        ...selectedRecord, 
        analysis,
        prediction,
        status: "Analyzed" as const,
      };
      
      // Update the selected record
      setSelectedRecord(updatedRecord);
      
      toast({
        title: "Analysis complete",
        variant: "success"
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const openRecordViewer = () => {
    if (selectedRecord?.filePath) {
      setViewerOpen(true);
    } else {
      toast({
        title: "No file available to view",
        variant: "destructive"
      });
    }
  };

  // Handle file upload complete and refresh records
  const handleFileUploadComplete = (files: File[], filePaths: string[]) => {
    // Call the parent's onFileUploadComplete if provided
    if (onFileUploadComplete) {
      onFileUploadComplete(files, filePaths);
    }
    
    // Refresh the records list to show new uploads immediately
    fetchUserRecords();
    
    toast({
      title: "Records uploaded successfully",
      description: `${files.length} ${files.length === 1 ? 'record' : 'records'} added to your medical records`,
      variant: "success"
    });
  };
  
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="browse">Browse Records</TabsTrigger>
          <TabsTrigger value="upload">Upload Records</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <RecordFilters 
                onFilterChange={setCategoryFilter}
                onUploadClick={() => setActiveTab("upload")}
                activeTab={activeTab}
              />
              
              <RecordsList 
                records={userRecords}
                isLoading={loading}
                selectedRecordId={selectedRecord?.id}
                onRecordClick={setSelectedRecord}
                onViewRecord={openRecordViewer}
              />
            </div>
            
            <div className="md:col-span-2">
              <RecordDetails
                record={selectedRecord}
                analyzing={analyzing}
                onAnalyzeClick={handleAnalyzeClick}
                onViewRecord={openRecordViewer}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <FileUpload onUploadComplete={handleFileUploadComplete} />
        </TabsContent>
      </Tabs>
      
      {selectedRecord && (
        <MedicalRecordViewer
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          filePath={selectedRecord.filePath}
          fileName={selectedRecord.title}
          fileType={selectedRecord.type === "Medical Image" ? "image/png" : 
                   selectedRecord.type === "Clinical Note" ? "application/pdf" : 
                   "application/octet-stream"}
        />
      )}
    </>
  );
};

export default RecordsContent;
