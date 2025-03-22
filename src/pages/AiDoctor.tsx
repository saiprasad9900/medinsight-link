
import Layout from "@/components/Layout";
import ChatBot from "@/components/chat/ChatBot";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import MedicalDisclaimer from "@/components/doctor/MedicalDisclaimer";
import HealthInfoGrid from "@/components/doctor/HealthInfoGrid";

const AiDoctor = () => {
  useEffect(() => {
    const pingFunction = async () => {
      try {
        await supabase.functions.invoke('doctor-ai', {
          body: { message: "ping", chatHistory: [] }
        });
        console.log("Warmed up doctor-ai function");
      } catch (error) {
        console.error("Error warming up function:", error);
      }
    };
    
    pingFunction();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <DoctorHeader />
        <MedicalDisclaimer />
        <HealthInfoGrid />
        
        <div className="scale-in">
          <ChatBot />
        </div>
      </div>
    </Layout>
  );
};

export default AiDoctor;
