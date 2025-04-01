
import { MessageSquare } from "lucide-react";

export const EmptyConversation = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center p-6">
        <div className="h-12 w-12 text-muted-foreground mb-4 mx-auto">
          <MessageSquare className="h-full w-full" />
        </div>
        <h3 className="font-medium text-lg mb-2">No Conversation Selected</h3>
        <p className="text-muted-foreground max-w-md">
          Select a patient from the list to view and send messages.
        </p>
      </div>
    </div>
  );
};
