
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, Upload } from "lucide-react";

interface RecordFiltersProps {
  onFilterChange: (category: string | null) => void;
  onUploadClick: () => void;
  activeTab: string;
}

const RecordFilters = ({ 
  onFilterChange, 
  onUploadClick, 
  activeTab 
}: RecordFiltersProps) => {
  return (
    <div className="flex gap-2 self-start">
      <Button 
        variant={activeTab === "upload" ? "default" : "outline"} 
        className="gap-2"
        onClick={onUploadClick}
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
          <DropdownMenuItem onClick={() => onFilterChange(null)}>
            All Categories
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("Laboratory")}>
            Laboratory
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("Radiology")}>
            Radiology
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("Cardiology")}>
            Cardiology
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("Pharmacy")}>
            Pharmacy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("Surgical")}>
            Surgical
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="icon">
        <SlidersHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default RecordFilters;
