
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, FileText, Image } from "lucide-react";

interface MedicalRecordViewerProps {
  isOpen: boolean;
  onClose: () => void;
  filePath?: string;
  fileName?: string;
  fileType?: string;
}

const MedicalRecordViewer = ({ 
  isOpen, 
  onClose, 
  filePath, 
  fileName, 
  fileType 
}: MedicalRecordViewerProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isOpen && filePath) {
      fetchFileUrl();
    }
    
    return () => {
      // Clean up URL when component unmounts
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [isOpen, filePath]);
  
  const fetchFileUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get a signed URL that will work for 60 minutes
      const { data, error } = await supabase.storage
        .from('medical_records')
        .createSignedUrl(filePath!, 60 * 60);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setFileUrl(data.signedUrl);
      } else {
        throw new Error("Failed to get file URL");
      }
    } catch (err: any) {
      console.error("Error fetching file:", err);
      setError(err.message || "Failed to load file");
      toast.error(`Could not load the file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = async () => {
    try {
      if (!filePath) return;
      
      const { data, error } = await supabase.storage
        .from('medical_records')
        .download(filePath);
        
      if (error) {
        throw error;
      }
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'medical_record';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("File download started");
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(`Download failed: ${err.message}`);
    }
  };
  
  const renderFilePreview = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Failed to load file: {error}</p>
          <Button onClick={fetchFileUrl}>Retry</Button>
        </div>
      );
    }
    
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">No file available</p>
        </div>
      );
    }
    
    // Check if the file is an image
    if (fileType?.includes('image')) {
      return (
        <div className="flex flex-col items-center justify-center max-h-[70vh]">
          <img 
            src={fileUrl} 
            alt={fileName || "Medical Image"} 
            className="max-w-full max-h-[70vh] object-contain rounded-md"
          />
        </div>
      );
    }
    
    // For PDF files
    if (fileType?.includes('pdf')) {
      return (
        <iframe 
          src={fileUrl}
          className="w-full h-[70vh] rounded-md border"
          title={fileName || "PDF Document"}
        ></iframe>
      );
    }
    
    // For other file types, just show a download option
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg font-medium">{fileName}</p>
        <p className="text-muted-foreground mb-4">
          This file type cannot be previewed directly.
        </p>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-screen overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-medium truncate pr-8">
            {loading ? "Loading..." : fileName || "Medical Record"}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload} title="Download">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="overflow-auto">
          {renderFilePreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalRecordViewer;
