import React, { useState, useEffect, useRef } from 'react';
import UserLayout from "@/Layouts/UserLayout";
import { useLocation } from 'react-router-dom';
import { queryToCreateChat, queryToGetChat, queryToFetchChatMessages, queryToSendChatMessage } from '@/Services/Queries/ChatQuery';
import { queryToUploadFiles } from '@/Services/Queries/MediaQuery';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import { backend_url } from "../../package.json";
import { auth } from '@/firebase-config';

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

interface LocationState {
  reference: string;
  amount: number;
  carts: any[]; // Replace with your cart item interface
}

const Inbox = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [initialMessageSent, setInitialMessageSent] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2";

  // Function to send initial order details to admin
  const sendOrderDetailsToAdmin = async (chatId: string) => {
    if (!auth.currentUser || !state || initialMessageSent) return;

    try {
      const orderDetailsMessage = `
New Order Details:
Reference: ${state.reference}
Amount: $${state.amount}
Number of Items: ${state.carts.length}
Order Date: ${new Date().toLocaleString()}
      `;

      await queryToSendChatMessage(
        {
          text: orderDetailsMessage,
          sender_uid: auth.currentUser.uid,
          recipient_uid: adminUid,
        },
        chatId
      );

      setInitialMessageSent(true);
    } catch (error) {
      console.error('Error sending order details:', error);
      notify.error({ text: 'Failed to send order details' });
    }
  };

  useEffect(() => {
    console.log("Initial useEffect running");
    console.log("Location state:", state);

    const initializeChat = async () => {
      if (!auth.currentUser) {
        console.log("No authenticated user found");
        return;
      }

      try {
        console.log("Attempting to get existing chat");
        const existingChat = await queryToGetChat(
          (data: any) => data,
          adminUid,
          { uid: auth.currentUser.uid }
        );

        console.log("Existing chat result:", existingChat);
        if (existingChat) {
          setChatId(existingChat.id);
          if (state) {
            await sendOrderDetailsToAdmin(existingChat.id);
          }
          return;
        }
      } catch (error) {
        console.log("Error getting chat, attempting to create new one:", error);
        try {
          const newChat = await queryToCreateChat(adminUid, {
            uid: auth.currentUser.uid
          });
          console.log("New chat created:", newChat);
          if (newChat) {
            setChatId(newChat.id);
            if (state) {
              await sendOrderDetailsToAdmin(newChat.id);
            }
          }
        } catch (createError) {
          console.error("Error creating chat:", createError);
          notify.error({ text: "Failed to create chat" });
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.uid);
      if (user) {
        initializeChat();
      } else {
        setChatId(null);
        setMessages([]);
      }
    });

    if (auth.currentUser) {
      initializeChat();
    }

    return () => unsubscribe();
  }, [state, initialMessageSent]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = queryToFetchChatMessages((data) => {
      setMessages(data.data);
    }, chatId);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [chatId]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatId || !newMessage.trim() || !auth.currentUser) return;

    try {
      const payload = {
        text: newMessage.trim(),
        sender_uid: auth.currentUser.uid,
        recipient_uid: adminUid,
      };

      await queryToSendChatMessage(payload, chatId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !chatId || !auth.currentUser) return;

    try {
      setUploading(true);
      
      const uploadResult = await queryToUploadFiles(
        Array.from(files),
        '/chat_uploads',
        true
      );

      if (uploadResult) {
        for (const file of Array.from(files)) {
          const payload = {
            text: `Sent file: ${file.name}`,
            sender_uid: auth.currentUser.uid,
            recipient_uid: adminUid,
            media: {
              name: file.name,
              fullPath: `chat_uploads/${file.name}`,
              type: file.type
            }
          };

          await queryToSendChatMessage(payload, chatId);
        }

        notify.success({ text: 'File(s) uploaded successfully' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      notify.error({ text: 'Failed to upload file' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString();
  };

  const getMediaUrl = (path: string) => {
    return `${backend_url}/media/cdn/images/original/${path}`;
  };

  const renderMessageContent = (msg: ChatMessage) => {
    if (msg.media) {
      if (msg.media.type.startsWith('image/')) {
        return (
          <a href={getMediaUrl(msg.media.fullPath)} target="_blank" rel="noopener noreferrer">
            <img 
              src={getMediaUrl(msg.media.fullPath)} 
              alt={msg.media.name} 
              className="max-w-full h-auto rounded"
              loading="lazy"
            />
          </a>
        );
      }
      return (
        <a 
          href={getMediaUrl(msg.media.fullPath)}
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
        >
          <FaPaperclip />
          <span>{msg.media.name}</span>
        </a>
      );
    }
    return <p className="text-sm font-medium break-words">{msg.text}</p>;
  };

  return (
    <UserLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
        <div 
          ref={messageListRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col-reverse"
        >
          <div className="space-y-4">
            {[...messages].reverse().map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender_uid === auth.currentUser?.uid ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender_uid === auth.currentUser?.uid
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-900'
                  }`}
                >
                  {renderMessageContent(msg)}
                  <p className={`text-xs mt-1 ${
                    msg.sender_uid === auth.currentUser?.uid
                      ? 'text-gray-300'
                      : 'text-gray-700'
                  }`}>
                    {formatTimestamp(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <div className="flex-1 flex items-center space-x-2 relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaSmile className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-gray-500 text-gray-900 placeholder-gray-600"
              />
              
              <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                <FaPaperclip className="w-5 h-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>

              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 z-50">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!newMessage.trim() || uploading}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {uploading ? 'Uploading...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default Inbox;