
import { Brain, Heart, Activity, Stethoscope } from "lucide-react";
import InfoCard from "./InfoCard";

const HealthInfoGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 fade-in">
      <InfoCard 
        icon={Brain} 
        title="General Health" 
        description="Ask about general health topics" 
        color="purple" 
      />
      <InfoCard 
        icon={Heart} 
        title="Symptoms" 
        description="Understand your symptoms" 
        color="blue" 
      />
      <InfoCard 
        icon={Activity} 
        title="Wellness" 
        description="Lifestyle and prevention" 
        color="green" 
      />
      <InfoCard 
        icon={Stethoscope} 
        title="Medical Terms" 
        description="Explain medical terminology" 
        color="orange" 
      />
    </div>
  );
};

export default HealthInfoGrid;
