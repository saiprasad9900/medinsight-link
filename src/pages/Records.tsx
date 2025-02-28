
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
  FileSpreadsheet 
} from "lucide-react";
import FileUpload from "@/components/records/FileUpload";
import RecordCard from "@/components/records/RecordCard";
import RecordInsight from "@/components/records/RecordInsight";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RecordFile {
  id: string;
  filename: string;
  file_type: string;
  created_at: string;
  file_path: string;
}

interface Record {
  id: string;
  title: string;
  type: "Lab Result" | "Clinical Note" | "Medical Image" | "Prescription";
  date: string;
  patientName: string;
  insights?: number;
  status: "Analyzed" | "Pending" | "Processing";
  filePath?: string;
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
  },
  {
    id: "2",
    title: "Cardiac Assessment Report",
    type: "Clinical Note" as const,
    date: "Aug 14, 2023",
    patientName: "Michael Chen",
    insights: 3,
    status: "Analyzed" as const,
  },
  {
    id: "3",
    title: "X-Ray Imaging - Chest",
    type: "Medical Image" as const,
    date: "Aug 12, 2023",
    patientName: "Robert Johnson",
    insights: 2,
    status: "Analyzed" as const,
  },
  {
    id: "4",
    title: "Medication Prescription",
    type: "Prescription" as const,
    date: "Aug 10, 2023",
    patientName: "Sophia Rodriguez",
    status: "Pending" as const,
  },
  {
    id: "5",
    title: "Lipid Panel Results",
    type: "Lab Result" as const,
    date: "Aug 8, 2023",
    patientName: "Michael Chen",
    status: "Processing" as const,
  },
  {
    id: "6",
    title: "Post-Surgery Evaluation",
    type: "Clinical Note" as const,
    date: "Aug 5, 2023",
    patientName: "Sophia Rodriguez",
    insights: 4,
    status: "Analyzed" as const,
  },
];

const insightsData = {
  title: "Blood Test Analysis - Emma Thompson",
  summary: "The blood test results show elevated white blood cell count (12,500 cells/mcL) and C-reactive protein levels (15 mg/L), indicating an active inflammatory process. Kidney and liver function markers are within normal ranges. Further investigation recommended to identify the source of inflammation.",
  insights: [
    {
      type: "warning" as const,
      title: "Elevated WBC Count",
      description: "White blood cell count of 12,500 cells/mcL is above the normal range (4,500-11,000 cells/mcL), suggesting an inflammatory response or possible infection.",
    },
    {
      type: "warning" as const,
      title: "Increased CRP Levels",
      description: "C-reactive protein at 15 mg/L indicates significant inflammation and correlates with the elevated WBC count.",
    },
    {
      type: "info" as const,
      title: "Normal Kidney Function",
      description: "Creatinine and BUN levels are within normal ranges, indicating proper kidney function.",
    },
    {
      type: "info" as const,
      title: "Normal Liver Enzymes",
      description: "ALT, AST, and Bilirubin are within reference ranges, suggesting normal liver function.",
    },
    {
      type: "success" as const,
      title: "Improved Hemoglobin",
      description: "Hemoglobin has increased from 11.2 g/dL to 12.4 g/dL since last measurement, showing good response to iron supplementation.",
    },
  ],
};

const Records = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [userRecords, setUserRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

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
          const records: Record[] = data.map((file: RecordFile) => ({
            id: file.id,
            title: file.filename,
            type: getFileType(file.file_type),
            date: new Date(file.created_at).toLocaleDateString('en-US', {
              month: 'short', 
              day: 'numeric', 
              year: 'numeric'
            }),
            patientName: user?.user_metadata?.first_name 
              ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
              : user.email?.split('@')[0] || 'Patient',
            status: "Pending" as const,
            filePath: file.file_path
          }));

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
    const newRecords: Record[] = files.map((file, index) => ({
      id: crypto.randomUUID(),
      title: file.name,
      type: getFileType(file.type),
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
    }));

    setUserRecords(prev => [...newRecords, ...prev]);
    setActiveTab("browse");
  };

  const handleRecordClick = (recordId: string) => {
    setSelectedRecordId(recordId === selectedRecordId ? null : recordId);
  };

  // Combine demo records with user's uploaded records
  const allRecords = [...userRecords, ...recordsData];

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
                <DropdownMenuItem>All Records</DropdownMenuItem>
                <DropdownMenuItem>Recent Uploads</DropdownMenuItem>
                <DropdownMenuItem>Analyzed Records</DropdownMenuItem>
                <DropdownMenuItem>Pending Analysis</DropdownMenuItem>
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
              <div className={selectedRecordId ? "lg:col-span-2" : "lg:col-span-3"}>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allRecords.map((record) => (
                      <div 
                        key={record.id} 
                        onClick={() => handleRecordClick(record.id)}
                        className="cursor-pointer"
                      >
                        <RecordCard 
                          record={record} 
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedRecordId && (
                <div className="lg:col-span-1">
                  <RecordInsight 
                    title={insightsData.title}
                    summary={insightsData.summary}
                    insights={insightsData.insights}
                  />
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
