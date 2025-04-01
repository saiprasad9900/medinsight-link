
export interface Patient {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  timestamp: Date;
  read: boolean;
}
