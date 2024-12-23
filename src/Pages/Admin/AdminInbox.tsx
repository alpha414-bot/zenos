import { useState, useEffect } from "react";
import { queryToFetchAllChats, queryToFetchChatMessages, queryToSendChatMessage } from "@/Services/Queries/ChatQuery";
import { auth } from "@/firebase-config";
import UserLayout from "@/Layouts/UserLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { notify } from "@/notify";
import { Timestamp } from "firebase/firestore";

interface Message {
  text: string;
  sender_uid: string;
  recipient_uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  id?: string;
}

interface ChatMetaListInterface {
  id: string;
  has_messages: boolean;
  text: string;
  unread: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  members: string[];
  sent_by_uid?: string;
}

const AdminInbox = () => {
  const [chats, setChats] = useState<ChatMetaListInterface[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const user = auth.currentUser; // Assuming the user is authenticated
  const admin_uid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2"; // Replace with actual admin UID

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatData = await queryToFetchAllChats(admin_uid);
        console.log("Fetched chats:", chatData.data); // Log chats fetched
        setChats(chatData.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
        notify.error({ text: "Unable to fetch chats" });
      }
    };

    if (admin_uid) {
      fetchChats();
    }
  }, [admin_uid]);

  useEffect(() => {
    if (selectedChatId) {
      console.log("Selected Chat ID:", selectedChatId);  // Log selected chat ID

      const fetchMessages = async () => {
        try {
          console.log("Starting to fetch chat messages for chat id:", selectedChatId);
          await queryToFetchChatMessages(
            (data: { data: Message[]; chat_id: string }) => {
              console.log("Fetched messages for chat:", selectedChatId, data.data);  // Log fetched messages and chat ID
              setMessages(data.data);
            },
            selectedChatId,
            user
          );
        } catch (error) {
          console.error("Error fetching messages:", error);
          notify.error({ text: "Unable to fetch chat messages" });
        }
      };

      fetchMessages();
    }
  }, [selectedChatId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedChatId) return;

    try {
      await queryToSendChatMessage(
        { text: newMessage, sender_uid: user?.uid || "", recipient_uid: admin_uid },
        selectedChatId
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      notify.error({ text: "There was an issue sending your message" });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Admin Inbox</h1>

        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
          <h2 className="text-lg font-medium mb-2">Chats</h2>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className="p-3 border-b cursor-pointer"
                onClick={() => {
                  console.log("Selected chat id: ", chat.id);  // Log selected chat ID
                  setSelectedChatId(chat.id);
                }}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{chat.text}</span>
                  <span>{chat.unread ? "Unread" : "Read"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No chats available.</p>
          )}
        </div>

        {selectedChatId && (
          <div>
            <h2 className="text-lg font-medium mb-4">Messages</h2>
            <div className="bg-gray-100 p-4 rounded-md shadow-md max-h-[60vh] overflow-y-auto mb-4">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      msg.sender_uid === user?.uid ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-[75%] ${
                        msg.sender_uid === user?.uid
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
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInbox;
