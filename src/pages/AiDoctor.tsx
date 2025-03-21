import Layout from "@/components/Layout";
import ChatBot from "@/components/chat/ChatBot";
import { useEffect } from "react";
import { Stethoscope, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">AI Health Assistant</h1>
            <p className="text-muted-foreground mt-1">
              Get helpful health guidance and information from Dr. MediPredict
            </p>
          </div>
        </div>
        
        <div className="alert text-sm p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4 flex gap-3">
          <ShieldAlert className="h-5 w-5 text-yellow-800 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Important Medical Disclaimer:</p>
            <p className="text-yellow-700">
              This AI assistant provides general health information only and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
              questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
        
        <ChatBot />
      </div>
    </Layout>
  );
};

export default AiDoctor;
