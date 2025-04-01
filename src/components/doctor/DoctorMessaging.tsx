
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PaperclipIcon, SendIcon, PhoneIcon, VideoIcon, InfoIcon, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Patient {
  id: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageDisplayProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  senderName: string;
  senderAvatar?: string;
}

interface DoctorMessagingProps {
  selectedPatientId: string | null;
}

// Message component
const MessageDisplay = ({ content, timestamp, isCurrentUser, senderName, senderAvatar }: MessageDisplayProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isCurrentUser ? "ml-auto flex-row-reverse" : ""
      )}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={senderAvatar} />
        <AvatarFallback>
          {senderName.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div
          className={cn(
            "p-3 rounded-lg",
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          {content}
        </div>
        <p className="text-xs text-muted-foreground px-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

const DoctorMessaging = ({ selectedPatientId }: DoctorMessagingProps) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Set active patient based on prop
  useEffect(() => {
    if (selectedPatientId) {
      setActivePatientId(selectedPatientId);
    }
  }, [selectedPatientId]);
  
  // Fetch patients list
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
          // If no active patient and we have patients, select the first one
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
  
  // Filter patients based on search
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get active patient details
  const activePatient = patients.find(p => p.id === activePatientId);
  
  // Fetch messages when active patient changes
  useEffect(() => {
    if (!activePatientId || !user) return;
    
    // In a real app, fetch actual messages from database
    // For now, generate some mock messages
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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user || !activePatientId) return;
    
    // In a real app, save message to database
    const newMsg: Message = {
      id: Date.now().toString(),
      sender_id: user.id,
      receiver_id: activePatientId,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-22rem)]">
      <Card className="md:col-span-1 flex flex-col h-full">
        <CardHeader className="px-4">
          <CardTitle className="text-lg">Patient Messages</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          <div className="divide-y">
            {filteredPatients.length === 0 ? (
              <div className="px-4 py-6 text-center text-muted-foreground">
                No patients found
              </div>
            ) : (
              filteredPatients.map(patient => (
                <div
                  key={patient.id}
                  className={cn(
                    "p-4 hover:bg-accent/50 cursor-pointer transition-colors",
                    activePatientId === patient.id && "bg-accent"
                  )}
                  onClick={() => setActivePatientId(patient.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {patient.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Patient
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3 flex flex-col h-full">
        {activePatient ? (
          <>
            <CardHeader className="px-6 py-4 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {activePatient.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{activePatient.name}</CardTitle>
                  <CardDescription>Patient</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <PhoneIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <VideoIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 overflow-auto flex-1">
              <div className="space-y-6">
                {messages.map(message => (
                  <MessageDisplay
                    key={message.id}
                    content={message.content}
                    timestamp={message.timestamp}
                    isCurrentUser={message.sender_id === user.id}
                    senderName={message.sender_id === user.id ? "Me" : activePatient.name}
                    senderAvatar={message.sender_id === user.id ? "" : activePatient.avatar}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="flex gap-2 w-full">
                <Button variant="ghost" size="icon">
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <SendIcon className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              <MessageDisplay className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
              <h3 className="font-medium text-lg mb-2">No Conversation Selected</h3>
              <p className="text-muted-foreground max-w-md">
                Select a patient from the list to view and send messages.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorMessaging;
