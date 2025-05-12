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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

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
  const [hasAPIError, setHasAPIError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

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
          setHasAPIError(true);
          setApiErrorMessage(error.message);
          toast.error("AI service is currently experiencing issues. Using fallback mode.", {
            description: "Responses will still be helpful but more general."
          });
        } else {
          console.log("Warmed up doctor-ai function successfully", data);
          
          if (data.source === "fallback") {
            setModelName("Fallback Mode");
            toast.warning("Using fallback mode", {
              description: "API key issue detected. Using reliable fallback responses."
            });
          }
        }
      } catch (error: any) {
        console.error("Exception warming up function:", error);
        setHasAPIError(true);
        setApiErrorMessage(error.message);
        toast.error("AI service connection issue", {
          description: "Using reliable fallback responses instead."
        });
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
      
      {hasAPIError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            AI service connection issue detected. Using reliable fallback responses.
            {apiErrorMessage && <div className="text-sm mt-1 text-muted-foreground">Error: {apiErrorMessage}</div>}
          </AlertDescription>
        </Alert>
      )}
      
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
          <div className="container py-8">
            <h2 className="text-2xl font-semibold mb-4">Your Health Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age and Gender */}
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age:</label>
                    <input 
                      type="number" 
                      value={userHealthContext.age}
                      onChange={(e) => setUserHealthContext(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender:</label>
                    <select
                      value={userHealthContext.gender}
                      onChange={(e) => setUserHealthContext(prev => ({ ...prev, gender: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Medical Conditions */}
              <div>
                <h3 className="text-lg font-medium mb-2">Medical History</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Conditions:</label>
                    <input 
                      type="text" 
                      value={userHealthContext.conditions.join(", ")}
                      onChange={(e) => setUserHealthContext(prev => ({ ...prev, conditions: e.target.value.split(", ") }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate conditions with commas.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Medications:</label>
                    <input 
                      type="text" 
                      value={userHealthContext.medications.join(", ")}
                      onChange={(e) => setUserHealthContext(prev => ({ ...prev, medications: e.target.value.split(", ") }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate medications with commas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={() => toast.success("Health profile updated!")} className="mt-6">
              Update Profile
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiDoctor;
