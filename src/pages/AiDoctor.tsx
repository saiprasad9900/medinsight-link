import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ChatBot from "@/components/chat/ChatBot";
import DoctorHeader from "@/components/doctor/DoctorHeader";
import MedicalDisclaimer from "@/components/doctor/MedicalDisclaimer";
import HealthInfoGrid from "@/components/doctor/HealthInfoGrid";
import SymptomChecker from "@/components/doctor/SymptomChecker";
import MedicalResourcesCard from "@/components/doctor/MedicalResourcesCard";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ActivitySquare, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MedicalSymptom } from "@/types/patients";

type HealthInfo = {
  age: number;
  gender: string;
  conditions: string[];
  medications: string[];
}

const AiDoctor = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");
  const [modelName, setModelName] = useState("GPT-4o");
  const [showHealthInfoEditor, setShowHealthInfoEditor] = useState(false);

  const [userHealthContext, setUserHealthContext] = useState<HealthInfo>({
    age: 35,
    gender: "Female",
    conditions: ["Allergies", "Mild Asthma"],
    medications: ["Albuterol inhaler", "Loratadine"]
  });

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
          
          if (data.source === "fallback") {
            setModelName("Limited Mode");
            toast.warning("Running in limited mode", {
              description: "OpenAI API key quota exceeded. Full AI features unavailable."
            });
          }
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

  const handleDiscussSymptoms = (symptoms: MedicalSymptom[]) => {
    const symptomNames = symptoms.map(s => s.name).join(", ");
    const symptomSeverities = symptoms.map(s => `${s.name} (${s.severity})`).join(", ");
    
    setActiveTab("chat");
    
    toast.info("Please describe these symptoms to the AI doctor", {
      description: `Ask about: ${symptomNames}`
    });
    
    navigator.clipboard.writeText(
      `I'm experiencing the following symptoms: ${symptomSeverities}. What could this indicate and what should I do?`
    ).then(() => {
      toast.success("Symptom description copied to clipboard", {
        description: "Paste this into the chat and modify as needed."
      });
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <DoctorHeader />
      <MedicalDisclaimer />
      <HealthInfoGrid />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat with AI Doctor</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="flex items-center gap-2">
            <ActivitySquare className="h-4 w-4" />
            <span className="hidden sm:inline">Symptom Checker</span>
            <span className="sm:hidden">Symptoms</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Medical Resources</span>
            <span className="sm:hidden">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Health Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="scale-in">
          <ChatBot 
            isWarmingUp={isWarmingUp} 
            includeHealthContext={true}
            userContext={userHealthContext}
            modelName={modelName}
          />
        </TabsContent>
        
        <TabsContent value="symptoms" className="scale-in">
          <SymptomChecker onConsultAI={handleDiscussSymptoms} />
        </TabsContent>
        
        <TabsContent value="resources" className="scale-in">
          <MedicalResourcesCard />
        </TabsContent>
        
        <TabsContent value="settings" className="scale-in">
          {/* ... keep existing code (health profile UI) */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiDoctor;
