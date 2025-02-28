
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Upload, 
  Filter, 
  SlidersHorizontal, 
  FileText, 
  BarChart, 
  Image as ImageIcon, 
  FileSpreadsheet,
  Brain,
  Layers
} from "lucide-react";
import FileUpload from "@/components/records/FileUpload";
import RecordCard from "@/components/records/RecordCard";
import EnhancedRecordInsight from "@/components/records/EnhancedRecordInsight";
import PredictiveInsights from "@/components/records/PredictiveInsights";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Record } from "@/types/records";
import { analyzeRecord, predictOutcomes, categorizeRecord } from "@/services/analysisService";

interface RecordFile {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
  file_path: string;
}

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [userRecords, setUserRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<"analysis" | "prediction">("analysis");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Function to get file type category
  const getFileType = (fileType: string): Record["type"] => {
    if (fileType.includes('image')) return 'Medical Image';
    if (fileType.includes('pdf')) return 'Clinical Note';
    return 'Lab Result';
  };

  // Fetch user's uploaded files on component mount
  useEffect(() => {
    const fetchUserRecords = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('records_files')
          .select('*')
          .order('created_at', { ascending: false });

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
  }, [user]);

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

  // Filter records by category if a filter is selected
  const filteredRecords = categoryFilter 
    ? [...userRecords, ...recordsData].filter(record => record.category === categoryFilter)
    : [...userRecords, ...recordsData];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Medical Records</h1>
            <p className="text-muted-foreground mt-1">
              Upload, analyze, and manage patient medical records
            </p>
          </div>
          <div className="flex gap-2 self-start">
            <Button 
              variant={activeTab === "upload" ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setActiveTab("upload")}
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("Laboratory")}>
                  Laboratory
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("Radiology")}>
                  Radiology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("Cardiology")}>
                  Cardiology
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("Pharmacy")}>
                  Pharmacy
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("Surgical")}>
                  Surgical
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
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
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredRecords.map((record) => (
                      <div 
                        key={record.id} 
                        onClick={() => handleRecordClick(record)}
                        className="cursor-pointer"
                      >
                        <RecordCard record={record} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedRecord && (
                <div className="lg:col-span-1">
                  <div className="mb-4">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger 
                        value="analysis" 
                        className="flex gap-1 items-center"
                        onClick={() => setActiveView("analysis")}
                        data-state={activeView === "analysis" ? "active" : ""}
                      >
                        <Brain className="h-4 w-4" />
                        Analysis
                      </TabsTrigger>
                      <TabsTrigger 
                        value="prediction" 
                        className="flex gap-1 items-center"
                        onClick={() => setActiveView("prediction")}
                        data-state={activeView === "prediction" ? "active" : ""}
                      >
                        <Layers className="h-4 w-4" />
                        Predictions
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  {analyzing ? (
                    <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                      <p className="text-sm text-muted-foreground">Analyzing record...</p>
                    </div>
                  ) : (
                    <>
                      {activeView === "analysis" && selectedRecord.analysis && (
                        <EnhancedRecordInsight 
                          title={`${selectedRecord.type} Analysis - ${selectedRecord.patientName}`}
                          analysis={selectedRecord.analysis}
                        />
                      )}
                      
                      {activeView === "prediction" && selectedRecord.prediction && (
                        <PredictiveInsights 
                          patientName={selectedRecord.patientName}
                          prediction={selectedRecord.prediction}
                        />
                      )}
                      
                      {activeView === "analysis" && !selectedRecord.analysis && (
                        <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
                          <Brain className="h-16 w-16 text-muted-foreground" />
                          <div className="text-center">
                            <h3 className="font-medium">No Analysis Available</h3>
                            <p className="text-sm text-muted-foreground mt-1">This record hasn't been analyzed yet.</p>
                          </div>
                          <Button onClick={() => handleRecordClick(selectedRecord)}>
                            Analyze Now
                          </Button>
                        </div>
                      )}
                      
                      {activeView === "prediction" && !selectedRecord.prediction && (
                        <div className="p-8 border rounded-lg flex flex-col items-center justify-center space-y-4">
                          <Layers className="h-16 w-16 text-muted-foreground" />
                          <div className="text-center">
                            <h3 className="font-medium">No Predictions Available</h3>
                            <p className="text-sm text-muted-foreground mt-1">Generate predictions to see future health insights.</p>
                          </div>
                          <Button onClick={() => handleRecordClick(selectedRecord)}>
                            Generate Predictions
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6 max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-accent/50 p-4 rounded-lg border border-border flex items-center gap-4">
                <div className="flex gap-3 flex-wrap">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="gap-1 bg-background hover:bg-background shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="gap-1 bg-background hover:bg-background shadow-sm"
                  >
                    <BarChart className="h-4 w-4" />
                    Lab Results
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="gap-1 bg-background hover:bg-background shadow-sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Medical Images
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="gap-1 bg-background hover:bg-background shadow-sm"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    Datasets
                  </Button>
                </div>
              </div>
              
              <FileUpload onUploadComplete={handleFileUpload} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Records;
