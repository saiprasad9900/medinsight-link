import { cn } from "@/lib/utils";
import { MedicalRecord } from "@/types/records";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";

interface RecordCardProps {
  record: MedicalRecord;
  isSelected?: boolean;
}

const RecordCard = ({ record, isSelected = false }: RecordCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Analyzed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Lab Result":
        return <BarChart3 className="h-4 w-4" />;
      case "Clinical Note":
        return <FileText className="h-4 w-4" />;
      case "Medical Image":
        return <ImageIcon className="h-4 w-4" />;
      case "Prescription":
        return <FileText className="h-4 w-4" strokeWidth={1.5} />; 
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return "";
    
    switch (category) {
      case "Laboratory":
        return "from-blue-500 to-blue-600";
      case "Radiology":
        return "from-purple-500 to-purple-600";
      case "Cardiology":
        return "from-red-500 to-red-600";
      case "Pharmacy":
        return "from-green-500 to-green-600";
      case "Surgical":
        return "from-amber-500 to-amber-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
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

  const handleView = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!record.filePath) {
      toast.error("No file available for viewing");
      return;
    }

    try {
      // Get a signed URL for the file
      const { data, error } = await supabase.storage
        .from('medical_records')
        .createSignedUrl(record.filePath, 60); // 60 seconds expiry

      if (error) {
        throw error;
      }

      // Open the file in a new tab
      window.open(data.signedUrl, '_blank');
    } catch (error: any) {
      console.error("View error:", error);
      toast.error(`Failed to view file: ${error.message}`);
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover-card stagger-item slide-left",
        isHovered ? "shadow-lg" : "shadow-sm",
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {record.category && (
        <div 
          className={cn(
            "h-2 w-full bg-gradient-to-r rounded-t-md",
            getCategoryColor(record.category)
          )}
        />
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="font-normal flex items-center gap-1 interactive-element">
            {getTypeIcon(record.type)}
            {record.type}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("font-normal", getStatusColor(record.status))}
          >
            {record.status === "Processing" && (
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            )}
            {record.status === "Pending" && (
              <Clock className="mr-1.5 h-3 w-3" />
            )}
            {record.status === "Analyzed" && (
              <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500"></span>
            )}
            {record.status}
          </Badge>
        </div>
        
        <h3 className="font-medium text-lg mb-1 line-clamp-1">
          {isHovered ? (
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              {record.title}
            </span>
          ) : record.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Patient: {record.patientName}
        </p>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {record.date}
          </span>
          {record.insights && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {record.insights} insights
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-border flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 interactive-element"
          onClick={(e) => handleView(e)}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 interactive-element"
            onClick={(e) => handleDownload(e)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 interactive-element">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 animate-fade-in">
              <DropdownMenuItem className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Reanalyze
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
