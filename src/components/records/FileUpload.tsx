
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Upload, File, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface FileUploadProps {
  onUploadComplete?: (files: File[], filePaths: string[]) => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      return validTypes.includes(file.type);
    });
    
    if (newFiles.length !== fileList.length) {
      toast.error("Some files were rejected. Only PDF, JPEG, and PNG are supported.");
    }
    
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    try {
      // Create a unique file path using a timestamp and random string
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('medical_records')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Save metadata to the records_files table
      const { error: dbError } = await supabase
        .from('records_files')
        .insert({
          user_id: user?.id,
          filename: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) {
        throw dbError;
      }

      return filePath;
    } catch (error: any) {
      console.error("Error uploading file:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error("You must be logged in to upload files.");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      const filePaths: string[] = [];
      let completed = 0;

      // Upload files sequentially
      for (const file of files) {
        try {
          const filePath = await uploadFileToSupabase(file);
          filePaths.push(filePath);
          completed++;
          setProgress((completed / files.length) * 100);
        } catch (error: any) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }

      if (filePaths.length > 0) {
        if (onUploadComplete) {
          onUploadComplete(files, filePaths);
        }
        toast.success("Files uploaded successfully", {
          description: `${filePaths.length} of ${files.length} files have been uploaded and are ready for analysis.`
        });
        setFiles([]);
      } else {
        toast.error("All file uploads failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <Card 
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50",
        )}
      >
        <CardContent 
          className="p-8"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Drag & Drop Files</h3>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse from your computer
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </Button>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPEG, PNG
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border">
            <div className="p-4 border-b border-border bg-muted/50">
              <h4 className="font-medium">Selected Files ({files.length})</h4>
            </div>
            <div className="divide-y divide-border">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                      <File className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button onClick={handleUpload}>
                Upload & Analyze
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
