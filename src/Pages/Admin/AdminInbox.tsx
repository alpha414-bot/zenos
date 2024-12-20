import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import AdminLayout from "@/Layouts/AdminLayout";
import { firestore } from "@/firebase-config"; // Corrected import for firestore
import PageMeta from "@/Layouts/PageMeta";

interface Message {
  id: string;
  message: string;
  userId: string;
  timestamp: { seconds: number };
  orderReference: string;
}

const AdminInbox = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [replyToUserId, setReplyToUserId] = useState<string | null>(null); // Track the user being replied to

  // Set up an observer on the Auth object to get the current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    console.log(auth);

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  // Fetch messages from Firestore
  useEffect(() => {
    if (!authUser) return;

    const fetchMessages = async () => {
      try {
        const q = query(
          collection(firestore, "UserMessages"),
          where("orderReference", "==", "order_reference") // Replace with actual order reference
        );
        const querySnapshot = await getDocs(q);
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        setMessages(messagesList);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [authUser]);

  // Send a message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !authUser || !replyToUserId) return;

    const messageWithUserName = `From ${authUser.displayName || "Anonymous"}: ${newMessage}`;

    try {
      // Send the message to Firestore with the userId to reply to the specific user
      await addDoc(collection(firestore, "UserMessages"), {
        message: messageWithUserName,
        userId: replyToUserId, // Message is sent to the user being replied to
        timestamp: serverTimestamp(),
        orderReference: "order_reference", // Replace with actual order reference
      });

      // Immediately update the UI with the new message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "temp-id", // Use a temporary ID for UI update
          message: messageWithUserName,
          userId: authUser.uid,
          timestamp: { seconds: Math.floor(Date.now() / 1000) }, // Use current time
          orderReference: "order_reference", // Replace with actual order reference
        },
      ]);
      setNewMessage(""); // Reset input after sending
      setReplyToUserId(null); // Clear the user being replied to
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle replying to a specific user
  const handleReply = (userId: string) => {
    setReplyToUserId(userId);
  };

  return (
    <PageMeta title="Admin - Inbox" description="Manage and view user messages">
      <AdminLayout>
        <div className="inbox-container">
          <h1>Admin Inbox</h1>
          <div className="chat-box">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.userId === authUser?.uid ? "admin-message" : "user-message"}`}
                  >
                    <p>{msg.message}</p>
                    <span>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</span>
                    {msg.userId !== authUser?.uid && (
                      <button onClick={() => handleReply(msg.userId)}>Reply</button> // Set the userId to reply to
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="send-message">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
            ></textarea>
            <button onClick={sendMessage} disabled={!newMessage.trim() || !replyToUserId}>
              Send Reply
            </button>
          </div>
        </div>

        <style>{`
          .inbox-container {
            padding: 20px;
          }
          .chat-box {
            border: 1px solid #ddd;
            padding: 10px;
            max-height: 400px;
            overflow-y: scroll;
            background-color: #333;
          }
          .messages-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .message {
            padding: 10px;
            border-radius: 5px;
            color: white;
          }
          .user-message {
            background-color: #4caf50;
            align-self: flex-end;
          }
          .admin-message {
            background-color: #007bff;
            color: white;
            align-self: flex-start;
          }
          .send-message {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
          }
          textarea {
            width: 100%;
            height: 100px;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            resize: none;
            background-color: #444;
            color: white;
          }
          button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:disabled {
            background-color: #ccc;
          }
        `}</style>
      </AdminLayout>
    </PageMeta>
  );
};

export default AdminInbox;
