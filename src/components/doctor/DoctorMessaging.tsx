
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
  
  const activePatient = patients.find(p => p.id === activePatientId);
  
  useEffect(() => {
    if (!activePatientId || !user) return;
    
    const mockMessages: Message[] = [
      {
        id: '1',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "Good morning! How are you feeling today?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
        read: true
      },
      {
        id: '2',
        sender_id: activePatientId,
        receiver_id: user.id,
        content: "I'm feeling better today, the new medication seems to be working.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        read: true
      },
      {
        id: '3',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "That's great to hear! Any side effects so far?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11), // 11 hours ago
        read: true
      },
      {
        id: '4',
        sender_id: activePatientId,
        receiver_id: user.id,
        content: "A little dizziness in the morning, but it goes away after breakfast.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
        read: true
      },
      {
        id: '5',
        sender_id: user.id,
        receiver_id: activePatientId,
        content: "That's a common side effect. It should diminish over the next few days. Keep taking it with food.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 9), // 9 hours ago
        read: true
      }
    ];
    
    setMessages(mockMessages);
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
  };
  
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
            />
            <CardFooter className="p-4 border-t">
              <MessageInputField onSendMessage={handleSendMessage} />
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
