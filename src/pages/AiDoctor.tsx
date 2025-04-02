import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ChatBot from "@/components/chat/ChatBot";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import MedicalDisclaimer from "@/components/doctor/MedicalDisclaimer";
import HealthInfoGrid from "@/components/doctor/HealthInfoGrid";
import { toast } from "sonner";

const AiDoctor = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(true);

  useEffect(() => {
    const pingFunction = async () => {
      setIsWarmingUp(true);
      try {
        console.log("Warming up doctor-ai function...");
        const { data, error } = await supabase.functions.invoke('doctor-ai', {
          body: { message: "ping", chatHistory: [] }
        });
        
        if (error) {
          console.error("Error warming up function:", error);
          toast.error("AI service is currently experiencing issues. Some features may be limited.");
        } else {
          console.log("Warmed up doctor-ai function successfully", data);
        }
      } catch (error) {
        console.error("Exception warming up function:", error);
        toast.error("Failed to connect to AI service. Please try again later.");
      } finally {
        setIsWarmingUp(false);
      }
    };
    
    pingFunction();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <DoctorHeader />
      <MedicalDisclaimer />
      <HealthInfoGrid />
      
      <div className="scale-in">
        <ChatBot isWarmingUp={isWarmingUp} />
      </div>
    </div>
  );
};

export default AiDoctor;
