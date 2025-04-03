
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "Low" | "Medium" | "High";
}

export const RiskBadge = ({ level }: RiskBadgeProps) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "High":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("font-normal", getRiskColor(level))}
    >
      {level} Risk
    </Badge>
  );
};
