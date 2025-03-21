
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Download, Maximize2, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  children: ReactNode;
  allowDownload?: boolean;
  className?: string;
  gradient?: "blue" | "green" | "purple" | "orange" | "none";
  animate?: boolean;
}

const AnalyticsCard = ({ 
  title, 
  children, 
  allowDownload = true, 
  className,
  gradient = "none",
  animate = true
}: AnalyticsCardProps) => {
  const getGradientClass = () => {
    switch (gradient) {
      case "blue": return "bg-gradient-to-br from-blue-500 to-cyan-600 text-white";
      case "green": return "bg-gradient-to-br from-green-500 to-emerald-600 text-white";
      case "purple": return "bg-gradient-to-br from-purple-500 to-indigo-600 text-white";
      case "orange": return "bg-gradient-to-br from-orange-500 to-amber-600 text-white";
      default: return "";
    }
  };

  return (
    <Card 
      className={cn(
        "h-full", 
        animate && "scale-in",
        gradient !== "none" && getGradientClass(),
        className
      )}
    >
      <CardHeader className={cn(
        "flex flex-row items-center justify-between pb-2",
        gradient !== "none" && "border-b border-white/10"
      )}>
        <CardTitle className={cn(
          "text-base font-medium",
          gradient !== "none" ? "text-white" : ""
        )}>
          {title}
        </CardTitle>
        <div className="flex gap-1">
          {allowDownload && (
            <Button 
              variant={gradient !== "none" ? "ghost" : "ghost"} 
              size="icon" 
              className={cn(
                "h-8 w-8 hover-card",
                gradient !== "none" && "text-white hover:bg-white/10"
              )}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant={gradient !== "none" ? "ghost" : "ghost"} 
            size="icon" 
            className={cn(
              "h-8 w-8 hover-card",
              gradient !== "none" && "text-white hover:bg-white/10"
            )}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant={gradient !== "none" ? "ghost" : "ghost"} 
            size="icon" 
            className={cn(
              "h-8 w-8 hover-card",
              gradient !== "none" && "text-white hover:bg-white/10"
            )}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={gradient !== "none" ? "ghost" : "ghost"} 
                size="icon" 
                className={cn(
                  "h-8 w-8 hover-card",
                  gradient !== "none" && "text-white hover:bg-white/10"
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-fade-in">
              <DropdownMenuItem>Refresh</DropdownMenuItem>
              <DropdownMenuItem>Set Date Range</DropdownMenuItem>
              <DropdownMenuItem>View Full Report</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Print</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className={cn(
        gradient !== "none" ? "pt-4" : ""
      )}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
