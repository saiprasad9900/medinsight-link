
import { useState, useEffect } from "react";
import ContactList from "@/components/messages/ContactList";
import MessageThread from "@/components/messages/MessageThread";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline";
  lastMessage: {
    text: string;
    time: string;
    unread: boolean;
  };
}

const Messages = () => {
  const [contactsData, setContactsData] = useState<Contact[]>([
    {
      id: "1",
      name: "Dr. James Wilson",
      role: "Neurologist",
      avatar: "",
      status: "online" as const,
      lastMessage: {
        text: "I've reviewed the lab results for Emma Thompson. The cardiac enzyme levels are concerning.",
        time: "10:32 AM",
        unread: true,
      },
    },
    {
      id: "2",
      name: "Nurse Sarah Kim",
      role: "Head Nurse",
      avatar: "",
      status: "offline" as const,
      lastMessage: {
        text: "Patient in room 302 is requesting pain medication.",
        time: "Yesterday",
        unread: false,
      },
    },
    {
      id: "3",
      name: "Dr. Maria Garcia",
      role: "Pediatrician",
      avatar: "",
      status: "online" as const,
      lastMessage: {
        text: "Could you review the growth chart for Alex Thompson?",
        time: "Yesterday",
        unread: false,
      },
    },
    {
      id: "4",
      name: "Dr. Robert Chen",
      role: "Cardiologist",
      avatar: "",
      status: "offline" as const,
      lastMessage: {
        text: "The new ECG machine is now available in the cardiology department.",
        time: "Aug 10",
        unread: false,
      },
    },
  ]);
  
  const [activeContactId, setActiveContactId] = useState(contactsData[0].id);
  
  const activeContact = contactsData.find(
    (contact) => contact.id === activeContactId
  );
  
  const updateLastMessage = (contactId: string, text: string) => {
    setContactsData(prevContacts => 
      prevContacts.map(contact => 
        contact.id === contactId 
          ? {
              ...contact,
              lastMessage: {
                text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: contact.id !== activeContactId
              }
            }
          : contact
      )
    );
  };

  const handleSendMessage = (message: string) => {
    if (activeContact) {
      updateLastMessage(activeContact.id, message);
      toast.success("Message sent successfully");
    }
  };

  useEffect(() => {
    // Mark messages as read when selecting a contact
    if (activeContact?.lastMessage.unread) {
      setContactsData(prevContacts =>
        prevContacts.map(contact =>
          contact.id === activeContactId
            ? {
                ...contact,
                lastMessage: {
                  ...contact.lastMessage,
                  unread: false
                }
              }
            : contact
        )
      );
    }
  }, [activeContactId, activeContact]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Secure Messaging</h1>
        <p className="text-muted-foreground mt-1">
          Communicate securely with other healthcare professionals
        </p>
      </div>
      
      <div className="flex h-full overflow-hidden border border-border rounded-lg shadow-sm">
        <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
          <ContactList 
            contacts={contactsData} 
            activeContactId={activeContactId}
            onSelectContact={setActiveContactId} 
          />
        </div>
        <div className="hidden md:flex flex-1">
          {activeContact && (
            <MessageThread 
              contact={activeContact} 
              onSendMessage={handleSendMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
