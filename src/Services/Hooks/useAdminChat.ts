// src/hooks/useAdminChat.ts

import { useState, useEffect, useRef } from 'react';
import { firestore } from '@/firebase-config';
import { notify } from '@/notify';
import { Timestamp, collection, getDocs, query, where } from 'firebase/firestore';
import { 
  queryToFetchAllChats, 
  queryToFetchChatMessages, 
  queryToSendChatMessage 
} from '@/Services/Queries/ChatQuery';

interface UserData {
  displayName: string;
  first_name: string;
  last_name: string;
  email: string;
  uid: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender_uid: string;
  recipient_uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  media?: {
    name: string;
    fullPath: string;
    type: string;
  };
}

interface Chat {
  id: string;
  text: string;
  has_messages: boolean;
  unread: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  members: string[];
  sent_by_uid?: string;
  userData?: UserData;
}

interface UseAdminChatReturn {
  chats: Chat[];
  messages: ChatMessage[];
  loading: boolean;
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string) => void;
  sendMessage: (text: string, recipientUid: string, options?: {
    media?: any;
  }) => Promise<void>;
  refreshChats: () => Promise<void>;
}

export const useAdminChat = (adminUid: string): UseAdminChatReturn => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messageListenerCleanup = useRef<(() => void) | null>(null);

  // Fetch user data for a chat
  const fetchUserData = async (chat: Chat): Promise<Chat> => {
    const recipientUid = chat.members.find(id => id !== adminUid);
    if (!recipientUid) return chat;

    try {
      const usersCollection = collection(firestore, "Users");
      const q = query(usersCollection, where("uid", "==", recipientUid));
      const userSnapshot = await getDocs(q);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data() as UserData;
        return { ...chat, userData };
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return chat;
  };

  // Fetch all chats
  const fetchChats = async () => {
    try {
      setLoading(true);
      const result = await queryToFetchAllChats(adminUid);
      const chatsWithUserData = await Promise.all(
        result.data.map(fetchUserData)
      );
      setChats(chatsWithUserData);
    } catch (error) {
      console.error('Error fetching chats:', error);
      notify.error({ text: 'Failed to load chats' });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of chats
  useEffect(() => {
    fetchChats();
  }, [adminUid]);

  // Setup message listener when selectedChatId changes
  useEffect(() => {
    if (!selectedChatId) {
      if (messageListenerCleanup.current) {
        messageListenerCleanup.current();
        messageListenerCleanup.current = null;
      }
      return;
    }

    const setupMessageListener = () => {
      try {
        const cleanup = queryToFetchChatMessages((data: { data: ChatMessage[] }) => {
          setMessages(data.data);
        }, selectedChatId);

        if (typeof cleanup === 'function') {
          messageListenerCleanup.current = cleanup;
        }
      } catch (error) {
        console.error('Error setting up message listener:', error);
      }
    };

    setupMessageListener();

    return () => {
      if (messageListenerCleanup.current) {
        messageListenerCleanup.current();
        messageListenerCleanup.current = null;
      }
    };
  }, [selectedChatId]);

  const sendMessage = async (text: string, recipientUid: string, options: { media?: any } = {}) => {
    if (!selectedChatId) {
      notify.error({ text: 'No chat selected' });
      return;
    }
  
    // Ensure text is not undefined
    const messageText = text?.trim();
    if (!messageText && !options.media) {
      notify.error({ text: 'Cannot send empty message' });
      return;
    }
  
    // Validate media object if present
    if (options.media) {
      const { name, fullPath, type } = options.media;
      if (!name || !fullPath || !type) {
        notify.error({ text: 'Invalid media object' });
        return;
      }
    }
  
    try {
      const payload: any = {
        text: messageText || "",  // Ensure text is at least an empty string
        sender_uid: adminUid,
        recipient_uid: recipientUid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
  
      if (options.media) {
        payload.media = options.media;
      }
  
      await queryToSendChatMessage(payload, selectedChatId);
      
      // Refresh chats to update last message
      await fetchChats();
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    }
  };

  return {
    chats,
    messages,
    loading,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
    refreshChats: fetchChats
  };
};