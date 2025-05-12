
import { useState } from "react";
import { MedicalRecord } from "@/types/records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ImageIcon, 
  BarChart3, 
  Calendar, 
  Clock, 
  ChevronRight,
  Eye,
  Download,
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PatientDisclaimer from "./PatientDisclaimer";

interface RecordsListProps {
  records: MedicalRecord[];
  selectedRecordId?: string;
  isLoading?: boolean;
  onRecordClick: (record: MedicalRecord) => void;
  onViewRecord: () => void;
}

const RecordsList = ({ 
  records, 
  selectedRecordId, 
  isLoading = false,
  onRecordClick,
  onViewRecord
}: RecordsListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRecordClick = (record: MedicalRecord) => {
    onRecordClick(record);
  };

  const handleDownload = async (record: MedicalRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!record.filePath) {
      toast.error("No file available for download");
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('medical_records')
        .download(record.filePath);

      if (error) {
        throw error;
      }

      // Create a download link and trigger the download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.title;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("File download started");
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(`Failed to download file: ${error.message}`);
    }
  };

  const handleViewClick = (record: MedicalRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    onRecordClick(record); // First select the record
    onViewRecord(); // Then open the viewer
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "Lab Result":
        return <BarChart3 className="h-5 w-5" />;
      case "Clinical Note":
        return <FileText className="h-5 w-5" />;
      case "Medical Image":
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Analyzed":
        return "bg-green-500/10 text-green-500";
      case "Pending":
        return "bg-amber-500/10 text-amber-500";
      case "Processing":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <div>
            <h3 className="font-medium">No Records Found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Upload medical records to see them here.
            </p>
          </div>
        </CardContent>
        <PatientDisclaimer />
      </Card>
    );
  }

  // Determine which records to display based on expanded state
  const displayRecords = isExpanded ? records : records.slice(0, 5);
  const hasMoreRecords = records.length > 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Records</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {displayRecords.map((record) => (
            <div
              key={record.id}
              className={cn(
                "p-4 hover:bg-muted/50 cursor-pointer transition-all",
                selectedRecordId === record.id ? "bg-muted" : ""
              )}
              onClick={() => handleRecordClick(record)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    record.status === "Analyzed" ? "bg-green-500/10" : 
                    record.status === "Processing" ? "bg-blue-500/10" : "bg-amber-500/10"
                  )}>
                    {getRecordIcon(record.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{record.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {record.type}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {record.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleViewClick(record, e)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => handleDownload(record, e)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleViewClick(record, e);
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(record, e);
                      }}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={cn("text-xs font-normal", getStatusColor(record.status))}
                >
                  {record.status === "Processing" && (
                    <span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                  )}
                  {record.status === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                  {record.status}
                </Badge>
                
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
        
        {hasMoreRecords && (
          <div className="p-3 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Show Less" : `Show ${records.length - 5} More Records`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordsList;
