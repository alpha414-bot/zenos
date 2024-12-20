
 // Import Firestore types
import { Timestamp } from "firebase/firestore";
// Chat Metadata Interface
 export interface ChatMetaListInterface {
  id: string; // Chat document ID
  has_messages: boolean; // Whether the chat has messages
  text: string; // Last message in the chat (or placeholder like "Start conversation")
  unread: boolean; // Whether there are unread messages
  createdAt: Timestamp; // Timestamp for when the chat was created
  updatedAt: Timestamp; // Timestamp for when the chat was last updated
  members: string[]; // Array of user IDs who are part of the chat
  sent_by_uid?: string; // ID of the user who sent the last message
}

// Chat Message Interface
export interface ChatMessagesInterface {
  id: string; // Message document ID
  text: string; // The message content
  sender_uid: string; // The user ID of the message sender
  recipient_uid: string; // The user ID of the message recipient
  createdAt: Timestamp; // Timestamp when the message was created
  updatedAt: Timestamp; // Timestamp when the message was last updated
  type?: string; // Optional type for the message (e.g., "text", "image", "card")
  src?: string; // Optional source for media (e.g., image URL, card ID)
}
