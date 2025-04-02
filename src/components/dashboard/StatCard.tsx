
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    prefix?: string;
  };
  className?: string;
  color?: "blue" | "green" | "purple" | "orange" | "default";
}

const StatCard = ({ title, value, icon, trend, className, color = "default" }: StatCardProps) => {
  const getGradientClass = () => {
    switch (color) {
      case "blue": return "gradient-blue";
      case "green": return "gradient-green";
      case "purple": return "gradient-purple";
      case "orange": return "gradient-orange";
      default: return "";
    }
  };

  const isGradient = color !== "default";
  
  return (
    <Card 
      className={cn(
        "transition-all hover-card stagger-item slide-left", 
        isGradient ? `${getGradientClass()} text-white` : "",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn(
          "text-sm font-medium", 
          isGradient ? "text-white/90" : "text-muted-foreground"
        )}>
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center",
          isGradient ? "bg-white/10" : "bg-primary/10"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "mt-1 text-xs flex items-center",
            trend.isPositive ? "text-green-500" : "text-red-500",
            isGradient && (trend.isPositive ? "text-green-200" : "text-red-200")
          )}>
            <span className="mr-1">{trend.isPositive ? "↑" : "↓"}</span>
            {trend.value}% {trend.prefix || ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
