
import Layout from "@/components/Layout";
import ChatBot from "@/components/chat/ChatBot";
import { useEffect } from "react";
import { Stethoscope, ShieldAlert, Brain, Heart, Lungs } from "lucide-react";
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
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4 slide-left">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center pulse-animation">
            <Stethoscope className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              AI Health Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Get helpful health guidance and information from Dr. MediPredict
            </p>
          </div>
        </div>
        
        <div className="alert text-sm p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-md mb-6 flex gap-4 shadow-md slide-right">
          <ShieldAlert className="h-10 w-10 text-yellow-600 flex-shrink-0 mt-0.5 float-animation" />
          <div>
            <p className="font-semibold text-yellow-800 text-lg mb-2">Important Medical Disclaimer:</p>
            <p className="text-yellow-700 leading-relaxed">
              This AI assistant provides general health information only and is not a substitute for professional medical advice, 
              diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any 
              questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 fade-in">
          <div className="col-span-1 md:col-span-1 p-4 rounded-xl gradient-purple text-white flex flex-col items-center justify-center text-center stagger-item slide-left">
            <Brain className="h-8 w-8 mb-2" />
            <h3 className="font-medium">General Health</h3>
            <p className="text-sm opacity-90">Ask about general health topics</p>
          </div>
          <div className="col-span-1 md:col-span-1 p-4 rounded-xl gradient-blue text-white flex flex-col items-center justify-center text-center stagger-item slide-left">
            <Heart className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Symptoms</h3>
            <p className="text-sm opacity-90">Understand your symptoms</p>
          </div>
          <div className="col-span-1 md:col-span-1 p-4 rounded-xl gradient-green text-white flex flex-col items-center justify-center text-center stagger-item slide-left">
            <Lungs className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Wellness</h3>
            <p className="text-sm opacity-90">Lifestyle and prevention</p>
          </div>
          <div className="col-span-1 md:col-span-1 p-4 rounded-xl gradient-orange text-white flex flex-col items-center justify-center text-center stagger-item slide-left">
            <Stethoscope className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Medical Terms</h3>
            <p className="text-sm opacity-90">Explain medical terminology</p>
          </div>
        </div>
        
        <div className="scale-in">
          <ChatBot />
        </div>
      </div>
    </Layout>
  );
};

export default AiDoctor;
