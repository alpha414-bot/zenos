import { useState, useEffect, useRef } from 'react';
import UserLayout from "@/Layouts/UserLayout";
import { useLocation } from 'react-router-dom';
import { useChat } from '@/Services/Hooks/UseChat';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import { backend_url } from "../../package.json";
import { auth } from '@/firebase-config';
import Media from "@/Components/Media";
import { useForm, Control, FieldValues } from "react-hook-form";
import _ from 'lodash';

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

interface ChatFormData {
  message: string;
  attachments: any[];
}

interface LocationState {
  reference: string;
  amount: number;
  carts: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface ChatHookReturn {
  chatId: string;
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text: string, options?: Partial<ChatMessage>) => Promise<void>;
  initializeChat: (adminUid: string) => Promise<void>;
}

const AUTO_REPLIES = {
  WELCOME: (userName: string) => `Hello ${userName}! Thanks for your order. Would you like to apply a discount code before proceeding?`,
  DISCOUNT_PROMPT: "You can enter your discount code or click 'Chat with an agent' to proceed.",
  AGENT_PROMPT: "Would you like to chat with a live agent about your order?"
};

const Inbox = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2";

  // Use the chat hook with proper typing
  const { 
    chatId, 
    messages, 
    loading, 
    sendMessage, 
    initializeChat 
  } = useChat(adminUid) as ChatHookReturn;

  const { 
    control, 
    handleSubmit, 
    reset, 
    watch,
    register 
  } = useForm<ChatFormData>({
    defaultValues: {
      message: '',
      attachments: []
    }
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [orderDetailsSent, setOrderDetailsSent] = useState(false);
  const [hasInitiatedChat, setHasInitiatedChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const attachments = watch('attachments');

  useEffect(() => {
    const setup = async () => {
      if (!auth.currentUser) {
        notify.error({ text: 'Please log in to continue' });
        return;
      }

      try {
        await initializeChat(adminUid);
        if (state && !initialMessageSent) {
          await sendInitialMessages();
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        notify.error({ text: 'Failed to initialize chat' });
      }
    };

    setup();
  }, [state, initialMessageSent]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFormSubmit = async (data: ChatFormData) => {
    if (!chatId || !auth.currentUser) {
      notify.error({ text: 'Chat session not initialized' });
      return;
    }

    if (!data.message.trim() && !data.attachments?.length) {
      return;
    }

    try {
      setUploading(true);

      if (data.attachments?.length) {
        for (const file of data.attachments) {
          await sendMessage(`Sent file: ${file.media.name}`, {
            media: {
              name: file.media.name,
              fullPath: file.media.fullPath,
              type: file.media.type
            }
          });
        }
      }

      if (data.message.trim()) {
        await sendMessage(data.message.trim());
      }

      reset({ message: '', attachments: [] });
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    } finally {
      setUploading(false);
    }
  };

  const sendInitialMessages = async () => {
    if (!auth.currentUser || !state || initialMessageSent) return;

    try {
      await sendMessage(
        `Hello @Zenos, I would like to place this order`,
        { isSystemMessage: true }
      );

      await sendMessage(
        formatOrderDetails(state.carts, state.reference, state.amount),
        { isSystemMessage: true }
      );

      await sendMessage(
        AUTO_REPLIES.WELCOME(auth.currentUser.displayName || 'there'),
        { 
          isAutoReply: true,
          sender_uid: adminUid,
          recipient_uid: auth.currentUser.uid
        }
      );

      await sendMessage(
        AUTO_REPLIES.DISCOUNT_PROMPT,
        { 
          isAutoReply: true,
          sender_uid: adminUid,
          recipient_uid: auth.currentUser.uid
        }
      );

      setInitialMessageSent(true);
      setOrderDetailsSent(true);
    } catch (error) {
      console.error('Error sending initial messages:', error);
      notify.error({ text: 'Failed to send initial messages' });
    }
  };

  const formatOrderDetails = (carts: LocationState['carts'], reference: string, amount: number) => {
    if (!carts?.length) {
      return `🛍️ New Order Details\nReference: ${reference}\nTotal Amount: $${amount?.toFixed(2) || 0}`;
    }
  
    return `
  🛍️ New Order Details
  ------------------------
  Reference: ${reference}
  Total Amount: $${amount?.toFixed(2) || 0}
  
  📦 Order Items:
  ${carts.filter(item => item?.price != null).map(item => `
  - ${item.name}
    Quantity: ${item.quantity}
    Price: $${item.price?.toFixed(2)}
    Subtotal: $${(item.quantity * item.price)?.toFixed(2)}
  `).join('')}
  ------------------------
  Order Date: ${new Date().toLocaleString()}
  `;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = watch('message');
    reset({ ...watch(), message: currentMessage + emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleChatWithAgent = async () => {
    if (!chatId || hasInitiatedChat || !auth.currentUser) return;

    try {
      setHasInitiatedChat(true);

      await sendMessage(
        "You've been connected with an agent. They will respond shortly.",
        { isSystemMessage: true }
      );
    } catch (error) {
      console.error('Error connecting to agent:', error);
      notify.error({ text: 'Failed to connect with agent' });
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  const getMediaUrl = (path: string) => {
    return `${backend_url}/media/cdn/images/original/${path}`;
  };

  return (
    <UserLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-black">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-300 text-lg">Loading chat...</p>
          </div>
        ) : (
          <>
            <div ref={messageListRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {[...messages].reverse().map((msg) => (
  <div
    key={msg.id}
    className={`flex ${
      msg.isSystemMessage ? 'justify-center' :
      msg.isAutoReply ? 'justify-start' :
      msg.sender_uid === auth.currentUser?.uid ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`max-w-[70%] rounded-lg p-3 ${
        msg.isSystemMessage ? 'w-full max-w-2xl bg-gray-800 text-gray-200' :
        msg.isAutoReply || msg.sender_uid === adminUid ? 'bg-orange-500 text-white' :
        msg.sender_uid === auth.currentUser?.uid
          ? 'bg-gray-800 text-white'
          : 'bg-gray-800 text-white'
      } shadow-sm`}
    >
      {msg.media ? (
        <div>
          {msg.media.type.startsWith('image/') ? (
            <a 
              href={getMediaUrl(msg.media.fullPath)}
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <img 
                src={getMediaUrl(msg.media.fullPath)}
                alt={msg.media.name} 
                className="max-w-full h-auto rounded-lg"
                loading="lazy"
              />
            </a>
          ) : (
            <a 
              href={getMediaUrl(msg.media.fullPath)}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-orange-400 hover:text-orange-300"
            >
              <FaPaperclip />
              <span>{msg.media.name}</span>
            </a>
          )}
        </div>
      ) : (
        <p className="text-sm font-medium break-words whitespace-pre-line">
          {msg.text}
        </p>
      )}
      <p className="text-xs mt-1 text-gray-400">
        {formatTimestamp(msg.createdAt)}
      </p>
    </div>
  </div>
))}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-800 p-4 bg-gray-900">
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <Media
                  name="attachments"
                  control={control as unknown as Control<FieldValues>}
                  multiSelect={true}
                  placeholder="Drop files here or click to upload"
                  align="row"
                />
                <div className="flex space-x-4">
                  <div className="flex-1 flex items-center space-x-2 relative">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-gray-400 hover:text-orange-400"
                    >
                      <FaSmile className="w-5 h-5" />
                    </button>
                    
                    <input
                      {...register('message')}
                      placeholder="Type your message..."
                      className="flex-1 rounded-lg border border-gray-700 bg-gray-800 text-white px-4 py-2 focus:outline-none focus:border-orange-500"
                    />
                    
                    {showEmojiPicker && (
                      <div className="absolute bottom-full mb-2 z-50">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={(!watch('message')?.trim() && !attachments?.length) || uploading}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-700"
                  >
                    {uploading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </div>

            {orderDetailsSent && !hasInitiatedChat && (
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <button
                  onClick={handleChatWithAgent}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Chat with an Agent
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  );
};

export default Inbox;