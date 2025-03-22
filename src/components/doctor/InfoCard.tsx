
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "orange";
}

const InfoCard = ({ icon: Icon, title, description, color }: InfoCardProps) => {
  const getGradientClass = () => {
    switch (color) {
      case "blue": return "gradient-blue";
      case "green": return "gradient-green";
      case "purple": return "gradient-purple";
      case "orange": return "gradient-orange";
      default: return "gradient-blue";
    }
  };

  return (
    <div className={`col-span-1 md:col-span-1 p-4 rounded-xl ${getGradientClass()} text-white flex flex-col items-center justify-center text-center stagger-item slide-left`}>
      <Icon className="h-8 w-8 mb-2" />
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

export default InfoCard;
