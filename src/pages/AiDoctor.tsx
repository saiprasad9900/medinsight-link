
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
import { MessageSquare, ActivitySquare, BookOpen } from "lucide-react";

const AiDoctor = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(true);
  const [activeTab, setActiveTab] = useState("chat");

  // Sample user health context - in a real app, this would come from a user profile
  const userHealthContext = {
    age: 35,
    gender: "Female",
    conditions: ["Allergies", "Mild Asthma"],
    medications: ["Albuterol inhaler", "Loratadine"]
  };

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
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
        </TabsList>
        
        <TabsContent value="chat" className="scale-in">
          <ChatBot 
            isWarmingUp={isWarmingUp} 
            includeHealthContext={true}
            userContext={userHealthContext}
          />
        </TabsContent>
        
        <TabsContent value="symptoms" className="scale-in">
          <SymptomChecker />
        </TabsContent>
        
        <TabsContent value="resources" className="scale-in">
          <MedicalResourcesCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiDoctor;
