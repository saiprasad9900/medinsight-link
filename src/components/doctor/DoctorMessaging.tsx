
import { useState, useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PatientList } from "./messaging/PatientList";
import { MessageHeader } from "./messaging/MessageHeader";
import { ConversationView } from "./messaging/ConversationView";
import { MessageInputField } from "./messaging/MessageInputField";
import { EmptyConversation } from "./messaging/EmptyConversation";
import { Message, Patient } from "./messaging/types";

interface DoctorMessagingProps {
  selectedPatientId: string | null;
}

const DoctorMessaging = ({ selectedPatientId }: DoctorMessagingProps) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
    }
  }, [selectedPatientId]);
  
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setPatients(data);
          if (!activePatientId && data.length > 0 && !selectedPatientId) {
            setActivePatientId(data[0].id);
          }
        }
      } catch (error: any) {
        console.error('Error fetching patients:', error);
        toast.error(`Error loading patients: ${error.message}`);
      }
    };
    
    fetchPatients();
  }, []);
  
  useEffect(() => {
    if (!activePatientId || !user) return;
    
    setIsLoading(true);
    
    // In a real app, we'd fetch real messages from a database
    // For demo purposes, we'll generate some mock messages with timestamps
    const generateMockMessages = () => {
      const now = new Date();
      const mockMessages: Message[] = [];
      
      // Doctor's first message
      mockMessages.push({
        id: '1',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "Good morning! How are you feeling today?",
        timestamp: new Date(now.getTime() - 86400000), // yesterday
        read: true
      });
      
      // Patient's response
      mockMessages.push({
        id: '2',
        sender_id: activePatientId,
        receiver_id: user.id,
        content: "I'm feeling better today, the new medication seems to be working.",
        timestamp: new Date(now.getTime() - 43200000), // 12 hours ago
        read: true
      });
      
      // Doctor's follow-up
      mockMessages.push({
        id: '3',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "That's great to hear! Any side effects so far?",
        timestamp: new Date(now.getTime() - 39600000), // 11 hours ago
        read: true
      });
      
      // Patient's detailed response
      mockMessages.push({
        id: '4',
        sender_id: activePatientId,
        receiver_id: user.id,
        content: "A little dizziness in the morning, but it goes away after breakfast.",
        timestamp: new Date(now.getTime() - 36000000), // 10 hours ago
        read: true
      });
      
      // Doctor's advice
      mockMessages.push({
        id: '5',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "That's a common side effect. It should diminish over the next few days. Keep taking it with food.",
        timestamp: new Date(now.getTime() - 32400000), // 9 hours ago
        read: true
      });
      
      return mockMessages;
    };
    
    // Simulate loading time for realism
    const timer = setTimeout(() => {
      setMessages(generateMockMessages());
      setIsLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
    };
  }, [activePatientId, user]);
  
  const handleSendMessage = (newMessage: string) => {
    if (!user || !activePatientId) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_id: user.id,
      receiver_id: activePatientId,
      content: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Simulate patient response after a short delay
    setTimeout(() => {
      const patientResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender_id: activePatientId,
        receiver_id: user.id,
        content: getPatientAutoResponse(newMessage),
        timestamp: new Date(),
        read: false
      };
      
      setMessages(prev => [...prev, patientResponse]);
    }, 2000 + Math.random() * 3000); // Random delay between 2-5 seconds
  };
  
  // Function to generate automatic responses from patients based on keywords
  const getPatientAutoResponse = (doctorMessage: string) => {
    const lowerCaseMsg = doctorMessage.toLowerCase();
    
    if (lowerCaseMsg.includes('pain') || lowerCaseMsg.includes('hurt')) {
      return "The pain has decreased since yesterday, but it's still there when I move too quickly.";
    }
    
    if (lowerCaseMsg.includes('medication') || lowerCaseMsg.includes('medicine')) {
      return "I've been taking the medication as prescribed, three times daily with meals.";
    }
    
    if (lowerCaseMsg.includes('sleep') || lowerCaseMsg.includes('rest')) {
      return "My sleep has improved a little. I'm getting about 6 hours now, up from 4-5 hours before.";
    }
    
    if (lowerCaseMsg.includes('appointment') || lowerCaseMsg.includes('visit')) {
      return "I can come in for an appointment next week. Would Tuesday morning work?";
    }
    
    if (lowerCaseMsg.includes('test') || lowerCaseMsg.includes('lab') || lowerCaseMsg.includes('result')) {
      return "I haven't received any results from the lab yet. Should I call them directly?";
    }
    
    // Default responses if no keywords match
    const defaultResponses = [
      "Thank you for checking in. I'm doing a bit better today.",
      "I'll follow your advice. When should I schedule a follow-up?",
      "That makes sense. I'll keep monitoring my symptoms as you suggested.",
      "Thank you for the information. Is there anything else I should be aware of?",
      "I appreciate your help. I'll continue with the current treatment plan."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const activePatient = patients.find(p => p.id === activePatientId);
  
  if (!user) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-22rem)]">
      <PatientList 
        patients={patients}
        activePatientId={activePatientId}
        onSelectPatient={setActivePatientId}
        selectedPatientId={selectedPatientId}
      />
      
      <Card className="md:col-span-3 flex flex-col h-full">
        {activePatient ? (
          <>
            <MessageHeader patient={activePatient} />
            <ConversationView 
              messages={messages} 
              activePatientName={activePatient.name}
              activePatientAvatar={activePatient.avatar}
              isLoading={isLoading}
            />
            <CardFooter className="p-4 border-t">
              <MessageInputField 
                onSendMessage={handleSendMessage} 
                disabled={isLoading}
              />
            </CardFooter>
          </>
        ) : (
          <EmptyConversation />
        )}
      </Card>
    </div>
  );
};

export default DoctorMessaging;
