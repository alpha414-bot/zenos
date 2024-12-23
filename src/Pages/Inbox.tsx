import { useState, useEffect } from "react";
import { queryToCreateChat, queryToFetchChatMessages, queryToSendChatMessage } from "@/Services/Queries/ChatQuery";
import { auth } from "@/firebase-config";
import UserLayout from "@/Layouts/UserLayout";
import { notify } from "@/notify";
import { Timestamp } from "firebase/firestore";

// Define AuthUserType interface inline
interface AuthUserType {
  uid: string;
  email: string;
  displayName?: string;
}

// Define Message interface
interface Message {
  text: string;
  sender_uid: string;
  recipient_uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id?: string;
}

// Define ChatData interface for the chat data returned by queryToCreateChat
interface ChatData {
  id: string;
  has_messages: boolean;
  text: string;
  unread: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  members: string[];
  sent_by_uid?: string;
}

const admin_uid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2"; // Replace with actual admin UID

const Inbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  const user = auth.currentUser as AuthUserType;
  const { uid } = user || {};

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatData = (await queryToCreateChat(admin_uid, user)) as ChatData;
        setChatId(chatData.id);
      } catch (error) {
        console.error("Error during chat creation:", error);
        notify.error({ text: "Unable to fetch or create chat" });
        setLoading(false);
      }
    };

    if (uid) {
      fetchChat();
    }
  }, [uid]);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      try {
        await queryToFetchChatMessages((data: { data: Message[] }) => {
          setMessages(data.data);
        }, admin_uid, user);
      } catch (error) {
        console.error("Error fetching messages:", error);
        notify.error({ text: "Unable to fetch chat messages" });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      await queryToSendChatMessage(
        { text: newMessage, sender_uid: uid, recipient_uid: admin_uid },
        chatId!
      );
      setNewMessage("");
    } catch (error) {
      notify.error({ text: "There was an issue sending your message" });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserLayout>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Chat with Admin</h1>

      <div className="bg-gray-100 p-4 rounded-md shadow-md max-h-[60vh] overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-2 ${
                msg.sender_uid === uid ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] ${
                  msg.sender_uid === uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md"
          placeholder="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
    </div>
    </UserLayout>
  );
};

export default Inbox;