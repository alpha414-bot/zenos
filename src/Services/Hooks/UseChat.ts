import { useState, useEffect, useRef } from 'react';
import { auth } from '@/firebase-config';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import { 
  queryToGetChat, 
  queryToFetchChatMessages, 
  queryToSendChatMessage 
} from '@/Services/Queries/ChatQuery';

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
  isAutoReply?: boolean;
  isSystemMessage?: boolean;
}

interface UseChatsReturn {
    chatId: string | null;
    messages: ChatMessage[];
    loading: boolean;
    sendMessage: (text: string, options?: {
      isAutoReply?: boolean;
      isSystemMessage?: boolean;
      media?: any;
      sender_uid?: string;
      recipient_uid?: string;
    }) => Promise<void>;
    initializeChat: (adminUid: string) => Promise<void>;
  }

export const useChat = (recipientUid: string): UseChatsReturn => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitializing = useRef(false);
  const chatInitialized = useRef(false);

  const initializeChat = async (adminUid: string) => {
    if (!auth.currentUser) {
      notify.error({ text: 'Please log in to continue' });
      return;
    }

    // Prevent concurrent initialization and re-initialization
    if (isInitializing.current || chatInitialized.current) {
      console.log('Chat initialization skipped:', {
        isInitializing: isInitializing.current,
        chatInitialized: chatInitialized.current
      });
      return;
    }

    try {
      isInitializing.current = true;
      setLoading(true);
      console.log('Initializing chat:', { adminUid, currentUser: auth.currentUser.uid });
      
      const chat = await queryToGetChat(
        (data: any) => data,
        auth.currentUser.uid,
        { uid: adminUid }
      );
      
      console.log('Chat successfully initialized:', chat.id);
      setChatId(chat.id);
      chatInitialized.current = true;
    } catch (error) {
      console.error('Error initializing chat:', error);
      notify.error({ text: 'Failed to initialize chat' });
    } finally {
      isInitializing.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!chatId) return;

    let unsubscribe: (() => void) | null = null;

    const setupMessageListener = () => {
      try {
        const cleanup = queryToFetchChatMessages((data: { data: ChatMessage[] }) => {
          setMessages(data.data);
        }, chatId);

        if (typeof cleanup === 'function') {
          unsubscribe = cleanup;
        }
      } catch (error) {
        console.error('Error setting up message listener:', error);
      }
    };

    setupMessageListener();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      // Reset initialization flags on cleanup
      isInitializing.current = false;
      chatInitialized.current = false;
    };
  }, [chatId]);

  const sendMessage = async (text: string, options: {
    isAutoReply?: boolean;
    isSystemMessage?: boolean;
    media?: any;
  } = {}) => {
    if (!chatId || !auth.currentUser) {
      notify.error({ text: 'Chat session not initialized' });
      return;
    }

    try {
      const payload = {
        text,
        sender_uid: auth.currentUser.uid,
        recipient_uid: recipientUid,
        ...options
      };

      await queryToSendChatMessage(payload, chatId);
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    }
  };

  return {
    chatId,
    messages,
    loading,
    sendMessage,
    initializeChat
  };
};