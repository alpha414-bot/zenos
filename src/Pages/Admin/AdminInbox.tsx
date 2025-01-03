import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { notify } from '@/notify';
import { Timestamp } from 'firebase/firestore';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { FaSmile, FaPaperclip } from 'react-icons/fa';
import { backend_url } from "../../../package.json";
import Media from "@/Components/Media";
import { useForm, Control, FieldValues } from "react-hook-form";
import { useAdminChat } from '@/Services/Hooks/useAdminChat';

interface ChatFormData {
  message: string;
  attachments: any[];
}

const AdminInbox: React.FC = () => {
  const { control, handleSubmit, reset, watch } = useForm<ChatFormData>({
    defaultValues: {
      message: '',
      attachments: []
    }
  });

  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2";
  
  const {
    chats,
    messages,
    loading,
    selectedChatId,
    setSelectedChatId,
    sendMessage,
  } = useAdminChat(adminUid);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const attachments = watch('attachments');

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatSelect = (chatId: string): void => {
    setSelectedChatId(chatId);
    reset({ message: '', attachments: [] });
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, 0);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = watch('message');
    reset({ ...watch(), message: currentMessage + emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const onSubmit = async (data: ChatFormData) => {
    if (!selectedChatId || (!data.message.trim() && !data.attachments?.length)) return;

    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    if (!selectedChat) return;

    const recipientUid = selectedChat.members.find(id => id !== adminUid);
    if (!recipientUid) {
      notify.error({ text: 'Cannot find recipient' });
      return;
    }

    try {
      setUploading(true);

      // Handle attachments first
      if (data.attachments?.length) {
        for (const file of data.attachments) {
          await sendMessage(file.name, recipientUid, {
            media: {
              name: file.name,
              fullPath: file.path,
              type: file.type
            }
          });
        }
      }

      // Handle text message
      if (data.message.trim()) {
        await sendMessage(data.message.trim(), recipientUid);
      }

      // Reset form after successful send
      reset({ message: '', attachments: [] });
    } catch (error) {
      console.error('Error sending message:', error);
      notify.error({ text: 'Failed to send message' });
    } finally {
      setUploading(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString();
  };

  const getMediaUrl = (path: string) => {
    return `${backend_url}/media/cdn/images/original/${path}`;
  };

  const renderMessageContent = (msg: any) => {
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
          className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
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
      <div className="flex h-[calc(100vh-64px)] bg-gray-900">
        {/* Chat List Sidebar */}
        <div className="w-1/4 border-r border-gray-700 bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Conversations</h2>
          </div>
          
          {loading ? (
            <div className="p-4 text-center text-gray-400">Loading chats...</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No conversations yet</div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${
                      selectedChatId === chat.id ? 'bg-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                          <span className="text-lg text-gray-900">
                            {chat.userData?.first_name?.[0]?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {chat.userData ? `${chat.userData.first_name} ${chat.userData.last_name}` : 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatTimestamp(chat.updatedAt)}
                        </p>
                        {chat.unread && chat.sent_by_uid !== adminUid && (
                          <span className="inline-block bg-orange-500 rounded-full w-2 h-2 ml-2"></span>
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
        <div className="flex-1 flex flex-col bg-gray-900">
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
                            ? 'bg-orange-500 text-gray-900'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        {renderMessageContent(msg)}
                        <p className={`text-xs mt-1 ${
                          msg.sender_uid === adminUid
                            ? 'text-gray-800'
                            : 'text-gray-400'
                        }`}>
                          {formatTimestamp(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input with Media Component */}
              <div className="border-t border-gray-700 p-4 bg-gray-800">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        className="text-gray-400 hover:text-orange-500"
                      >
                        <FaSmile className="w-5 h-5" />
                      </button>
                      
                      <input
                        {...control.register('message')}
                        placeholder="Type your message..."
                        className="flex-1 rounded-lg bg-gray-700 border border-gray-600 px-4 py-2 focus:outline-none focus:border-orange-500 text-white placeholder-gray-400"
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
                      className="bg-orange-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-600 disabled:text-gray-400"
                    >
                      {uploading ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-lg font-medium">
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