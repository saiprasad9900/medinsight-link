
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Eye, Download, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecordCardProps {
  record: {
    id: string;
    title: string;
    type: "Lab Result" | "Clinical Note" | "Medical Image" | "Prescription";
    date: string;
    patientName: string;
    insights?: number;
    status: "Analyzed" | "Pending" | "Processing";
  };
}

const RecordCard = ({ record }: RecordCardProps) => {
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
      case "Prescription":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <Badge variant="outline" className="font-normal flex items-center gap-1">
            {getTypeIcon(record.type)}
            {record.type}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("font-normal", getStatusColor(record.status))}
          >
            {record.status}
          </Badge>
        </div>
        
        <h3 className="font-medium text-lg mb-1 line-clamp-1">{record.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Patient: {record.patientName}
        </p>
        
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Added: {record.date}</span>
          {record.insights && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {record.insights} insights
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t border-border flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Eye className="h-4 w-4" />
          View
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Reanalyze</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RecordCard;
