import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { queryToFetchAllChats, queryToFetchChatMessages, queryToSendChatMessage } from '@/Services/Queries/ChatQuery';
import { queryToUploadFiles } from '@/Services/Queries/MediaQuery';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import { backend_url } from "../../../package.json";

// Define interfaces for type safety
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
}

const AdminInbox: React.FC = () => {
  // State declarations
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants
  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2"; // Your admin UID

  // Fetch all chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const result = await queryToFetchAllChats(adminUid);
        setChats(result.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        notify.error({ text: 'Failed to load chats' });
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [adminUid]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Set up message listener when chat is selected
  useEffect(() => {
    if (!selectedChatId) return;

    const unsubscribe = queryToFetchChatMessages((data) => {
      setMessages(data.data);
    }, selectedChatId);

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [selectedChatId]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages([]); // Clear previous messages
    messageListRef.current?.scrollTo(0, 0); // Reset scroll position
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChatId || !newMessage.trim()) return;

    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    if (!selectedChat) return;

    const recipientUid = selectedChat.members.find(id => id !== adminUid);
    if (!recipientUid) {
      notify.error({ text: 'Cannot find recipient' });
      return;
    }

    try {
      const payload = {
        text: newMessage.trim(),
        sender_uid: adminUid,
        recipient_uid: recipientUid,
      };

      await queryToSendChatMessage(payload, selectedChatId);
      setNewMessage(''); // Clear input only after successful send
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
    if (!files || !selectedChatId) return;

    try {
      setUploading(true);
      
      const uploadResult = await queryToUploadFiles(
        Array.from(files),
        '/chat_uploads',
        true
      );

      if (uploadResult) {
        const selectedChat = chats.find(chat => chat.id === selectedChatId);
        if (!selectedChat) return;

        const recipientUid = selectedChat.members.find(id => id !== adminUid);
        if (!recipientUid) {
          notify.error({ text: 'Cannot find recipient' });
          return;
        }

        // For each uploaded file, send a message
        for (const file of Array.from(files)) {
          const payload = {
            text: file.name,
            sender_uid: adminUid,
            recipient_uid: recipientUid,
            media: {
              name: file.name,
              fullPath: `chat_uploads/${file.name}`,
              type: file.type
            }
          };

          await queryToSendChatMessage(payload, selectedChatId);
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
    <AdminLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Chat List Sidebar */}
        <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Conversations</h2>
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-700">Loading chats...</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-700">No conversations yet</div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
                      selectedChatId === chat.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-lg text-white">
                            {chat.text[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {chat.text}
                        </p>
                        <p className="text-sm text-gray-700">
                          {formatTimestamp(chat.updatedAt)}
                        </p>
                        {chat.unread && chat.sent_by_uid !== adminUid && (
                          <span className="inline-block bg-blue-500 rounded-full w-2 h-2 ml-2"></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedChatId ? (
            <>
              {/* Messages Container */}
              <div 
                ref={messageListRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col-reverse"
              >
                <div className="space-y-4">
                  {[...messages].reverse().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_uid === adminUid ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_uid === adminUid
                            ? 'bg-gray-700 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        {renderMessageContent(msg)}
                        <p className={`text-xs mt-1 ${
                          msg.sender_uid === adminUid
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

              {/* Message Input */}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-700 text-lg font-medium">
                Select a conversation to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInbox;