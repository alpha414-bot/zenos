import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthUser } from "@/Services/Hooks"; // Custom hook for fetching auth user
import AdminLayout from "@/Layouts/AdminLayout";
import { firestore } from "@/firebase-config";
import PageMeta from "@/Layouts/PageMeta";

interface Message {
  id: string;
  message: string;
  userId: string;
  timestamp: { seconds: number };
  orderReference: string;
}

interface UserSummary {
  userId: string;
  latestMessage: string;
  latestTimestamp: number;
}

const AdminInbox = () => {
  const { data: authUser, isLoading: authUserLoading } = useAuthUser(); // Use custom hook for auth user
  const [messages, setMessages] = useState<Message[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authUserLoading || !authUser) return;

    const fetchMessages = async () => {
      try {
        const q = query(collection(firestore, "UserMessages"));
        const querySnapshot = await getDocs(q);
        const allMessages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        // Group messages by userId
        const groupedMessages = allMessages.reduce((acc, msg) => {
          if (!acc[msg.userId]) acc[msg.userId] = [];
          acc[msg.userId].push(msg);
          return acc;
        }, {} as Record<string, Message[]>);

        // Create summaries for each user
        const summaries = Object.entries(groupedMessages).map(([userId, messages]) => {
          const latestMessage = messages[messages.length - 1];
          return {
            userId,
            latestMessage: latestMessage.message,
            latestTimestamp: latestMessage.timestamp.seconds,
          };
        });

        setMessages(allMessages);
        setUserSummaries(summaries);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authUser, authUserLoading]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || !authUser || !selectedUserId) return;

    try {
      await addDoc(collection(firestore, "UserMessages"), {
        message: newMessage,
        userId: selectedUserId,
        timestamp: serverTimestamp(),
        orderReference: "order_reference", // Replace with actual order reference
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "temp-id",
          message: newMessage,
          userId: authUser.uid,
          timestamp: { seconds: Math.floor(Date.now() / 1000) },
          orderReference: "order_reference", // Replace with actual order reference
        },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchChatMessages = () => {
    return messages.filter((msg) => msg.userId === selectedUserId);
  };

  return (
    <PageMeta title="Admin - Inbox" description="Manage and view user messages">
      <AdminLayout>
        <div className="inbox-container">
          <h1>Admin Inbox</h1>
          <div className="user-list">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              userSummaries.map((summary) => (
                <div
                  key={summary.userId}
                  className="user-summary"
                  onClick={() => handleUserSelect(summary.userId)}
                >
                  <h3>User {summary.userId}</h3>
                  <p>{summary.latestMessage}</p>
                  <span>{new Date(summary.latestTimestamp * 1000).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedUserId && (
          <div className="chat-container">
            <h1>Chat with User {selectedUserId}</h1>
            <div className="messages">
              {fetchChatMessages().map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.userId === authUser?.uid ? "admin-message" : "user-message"}`}
                >
                  <p>{msg.message}</p>
                  <span>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            ></textarea>
            <button onClick={sendMessage}>Send</button>
          </div>
        )}

        <style>{`
          .inbox-container {
            padding: 20px;
          }
          .user-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .user-summary {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            background-color: #f9f9f9;
          }
          .user-summary:hover {
            background-color: #e0e0e0;
          }
          .chat-container {
            padding: 20px;
          }
          .messages {
            max-height: 400px;
            overflow-y: scroll;
            background-color: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            white-space: pre-wrap; /* Ensure line breaks in messages are respected */
          }
          .message {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
          .user-message {
            background-color: #4caf50;
            color: white;
            text-align: right;
          }
          .admin-message {
            background-color: #007bff;
            color: white;
          }
          textarea {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
          }
          button {
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
          }
        `}</style>
      </AdminLayout>
    </PageMeta>
  );
};

export default AdminInbox;
