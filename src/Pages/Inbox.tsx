import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import UserLayout from "@/Layouts/UserLayout";
import { useLocation } from 'react-router-dom';
import { 
  queryToCreateChat, 
  queryToGetChat, 
  queryToFetchChatMessages, 
  queryToSendChatMessage 
} from '@/Services/Queries/ChatQuery';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import { backend_url } from "../../package.json";
import { auth } from '@/firebase-config';
import Media from "@/Components/Media";
import { Modal, InstanceOptions } from 'flowbite';
import { useForm, Control, FieldValues } from "react-hook-form";
import _ from 'lodash';
interface ChatMessagePayload {
  text: string;
  sender_uid: string;
  recipient_uid: string;
  media?: {
    name: string;
    fullPath: string;
    type: string;
  };
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
  isAutoReply?: boolean;
  isSystemMessage?: boolean;
}
interface ChatMessagesResponse {
  data: ChatMessage[];
}

interface ChatFormData {
  message: string;
  attachments: Array<{
    media: {
      name: string;
      fullPath: string;
      type: string;
    };
  }>;
}
interface ChatResponse {
  id: string;
  [key: string]: any;
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

const AUTO_REPLIES = {
  WELCOME: (userName: string) => `Hello ${userName}! Thanks for your order. Would you like to apply a discount code before proceeding?`,
  DISCOUNT_PROMPT: "You can enter your discount code or click 'Chat with an agent' to proceed.",
  AGENT_PROMPT: "Would you like to chat with a live agent about your order?"
};
const Inbox = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  const { control, handleSubmit, reset, watch, register } = useForm<ChatFormData>({
    defaultValues: {
      message: '',
      attachments: []
    }
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [showAgentButton, setShowAgentButton] = useState(true);
  const [hasInitiatedChat, setHasInitiatedChat] = useState(false);
  const [uploadModal, setUploadModal] = useState<Modal | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2";
  const attachments = watch('attachments');

  useLayoutEffect(() => {
    const $targetEl = document.getElementById('upload-modal');
    if (!$targetEl) return;

    const instanceOptions: InstanceOptions = {
      id: 'upload-modal',
      override: true
    };

    const modalInstance = new Modal(
      $targetEl,
      {
        placement: "bottom-right",
        backdrop: "dynamic",
        closable: true,
        onHide: () => {
          reset();
        },
      },
      instanceOptions
    );

    setUploadModal(modalInstance);

    return () => {
      modalInstance.hide();
    };
  }, [reset]);

  useEffect(() => {
    const initializeChat = async () => {
      if (!auth.currentUser) return;
  
      try {
        const existingChat = await queryToGetChat(
          (data: ChatResponse) => data, // Add type here
          auth.currentUser.uid,
          { uid: adminUid }
        );
  
        if (existingChat && typeof existingChat === 'object' && 'id' in existingChat) {
          console.log('Found existing chat:', existingChat.id);
          setChatId(existingChat.id);
          if (state && !initialMessageSent) {
            await sendInitialMessages(existingChat.id);
          }
          return;
        }
  
        const newChat = await queryToCreateChat(auth.currentUser.uid, {
          uid: adminUid
        }) as ChatResponse; // Add type assertion here
  
        if (newChat && typeof newChat === 'object' && 'id' in newChat) {
          console.log('Created new chat:', newChat.id);
          setChatId(newChat.id);
          if (state) {
            await sendInitialMessages(newChat.id);
          }
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        notify.error({ text: 'Failed to initialize chat' });
      }
    };
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initializeChat();
      } else {
        setChatId(null);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [state, initialMessageSent]);
  useEffect(() => {
    if (!chatId) return;
  
    const setupMessageListener = () => {
      const unsubscribe = queryToFetchChatMessages((data: ChatMessagesResponse) => {
        setMessages(data.data);
      }, chatId);
  
      if (typeof unsubscribe === 'function') {
        unsubscribeRef.current = unsubscribe;
      }
    };
  
    setupMessageListener();
  
    return () => {
      if (typeof unsubscribeRef.current === 'function') {
        unsubscribeRef.current();
      }
    };
  }, [chatId]);
  const sendInitialMessages = async (chatId: string) => {
    if (!auth.currentUser || !state || initialMessageSent) return;
  
    try {
      const messages: ChatMessagePayload[] = [
        {
          text: `Hello @Zenos, I would like to place this order`,
          sender_uid: auth.currentUser.uid,
          recipient_uid: adminUid
        },
        {
          text: formatOrderDetails(state.carts, state.reference, state.amount),
          sender_uid: auth.currentUser.uid,
          recipient_uid: adminUid
        },
        {
          text: AUTO_REPLIES.WELCOME(auth.currentUser.displayName || 'there'),
          sender_uid: adminUid,
          recipient_uid: auth.currentUser.uid
        },
        {
          text: AUTO_REPLIES.DISCOUNT_PROMPT,
          sender_uid: adminUid,
          recipient_uid: auth.currentUser.uid
        }
      ];
  
      for (const message of messages) {
        await queryToSendChatMessage(message, chatId);
      }
  
      setInitialMessageSent(true);
    } catch (error) {
      console.error('Error sending initial messages:', error);
      notify.error({ text: 'Failed to send initial messages' });
    }
  };
  

  const formatOrderDetails = (
    carts: LocationState['carts'],
    reference: string,
    amount: number
  ): string => {
    const items = carts.map(item => `
• ${item.name}
  Quantity: ${item.quantity}
  Price: $${item.price.toFixed(2)}
  Subtotal: $${(item.quantity * item.price).toFixed(2)}
`).join('');

    return `
🛍️ New Order Details
------------------------
Reference: ${reference}
Total Amount: $${amount.toFixed(2)}

📦 Order Items:
${items}
------------------------
Order Date: ${new Date().toLocaleString()}
`;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = watch('message');
    reset({ ...watch(), message: currentMessage + emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const onSubmit = async (data: ChatFormData) => {
    if (!chatId || !auth.currentUser || (!data.message.trim() && !data.attachments?.length)) {
      return;
    }

    try {
      setUploading(true);

      if (data.message.trim()) {
        await queryToSendChatMessage({
          text: data.message.trim(),
          sender_uid: auth.currentUser.uid,
          recipient_uid: adminUid,
        }, chatId);
      }

      reset({ message: '', attachments: [] });
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (data: ChatFormData) => {
    if (!chatId || !auth.currentUser || !data.attachments?.length) return;

    try {
      setUploading(true);

      const files = data.attachments.map((item) => ({
        name: item.media.name,
        fullPath: item.media.fullPath,
        type: item.media.type
      }));

      for (const file of files) {
        await queryToSendChatMessage({
          text: `Sent file: ${file.name}`,
          sender_uid: auth.currentUser.uid,
          recipient_uid: adminUid,
          media: file
        }, chatId);
      }

      notify.success({ text: 'File(s) uploaded successfully' });
      uploadModal?.hide();
      reset({ message: '', attachments: [] });
    } catch (error) {
      console.error('Error uploading files:', error);
      notify.error({ text: 'Failed to upload files' });
    } finally {
      setUploading(false);
    }
  };
  const handleChatWithAgent = async () => {
    if (!chatId || hasInitiatedChat || !auth.currentUser) return;
  
    try {
      setHasInitiatedChat(true);
      setShowAgentButton(false);
  
      const message: ChatMessagePayload = {
        text: "You've been connected with an agent. They will respond shortly.",
        sender_uid: adminUid,
        recipient_uid: auth.currentUser.uid
      };
  
      await queryToSendChatMessage(message, chatId);
    } catch (error) {
      console.error('Error connecting to agent:', error);
      notify.error({ text: 'Failed to connect with agent' });
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <UserLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
        <div 
          ref={messageListRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
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
                  msg.isSystemMessage ? 'w-full max-w-2xl bg-gray-100' :
                  msg.isAutoReply ? 'bg-blue-50' :
                  msg.sender_uid === auth.currentUser?.uid
                    ? 'bg-gray-700 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                {msg.media ? (
                  <div>
                    {msg.media.type.startsWith('image/') ? (
                      <a 
                        href={`${backend_url}/media/cdn/images/original/${msg.media.fullPath}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={`${backend_url}/media/cdn/images/w1280/${msg.media.fullPath}`}
                          alt={msg.media.name} 
                          className="max-w-full h-auto rounded-lg"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <a 
                        href={`${backend_url}/media/cdn/images/original/${msg.media.fullPath}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                      >
                        <FaPaperclip />
                        <span>{msg.media.name}</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium break-words">{msg.text}</p>
                )}
                <p className="text-xs mt-1 opacity-75">
                  {formatTimestamp(msg.createdAt)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat with Agent Button */}
        {showAgentButton && (
          <div className="border-t border-gray-200 bg-white p-4">
            <button
              onClick={handleChatWithAgent}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 transition-colors"
              type="button"
            >
              Chat with an Agent
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 flex items-center space-x-2 relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaSmile className="w-5 h-5" />
                </button>
                
                <input
                  {...register('message')}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-500"
                />
                
                <button
                  type="button"
                  onClick={() => uploadModal?.show()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaPaperclip className="w-5 h-5" />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={!watch('message')?.trim() && !attachments?.length || uploading}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {uploading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        {/* Upload Modal */}
        <div
          id="upload-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">
                  Upload Files
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={() => uploadModal?.hide()}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form onSubmit={handleSubmit(handleFileUpload)} className="space-y-4">
                  <Media
                    control={control as unknown as Control<FieldValues>}
                    name="attachments"
                    placeholder="Drop files here or click to upload"
                    align="col"
                    multiSelect
                    rules={{ required: "Please select at least one file" }}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!attachments?.length || uploading}
                      className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Inbox;