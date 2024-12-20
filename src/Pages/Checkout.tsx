import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firestore } from "@/firebase-config"; // Corrected import for firestore
import UserLayout from "@/Layouts/UserLayout";
import PageMeta from "@/Layouts/PageMeta";

interface Message {
  id: string;
  message: string;
  userId: string;
  timestamp: { seconds: number };
  orderReference: string;
}

const Inbox = () => {
  const { state } = useLocation(); // Access the navigation state
  const { reference, amount, carts } = state || {}; // Destructure the passed data
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Set up an observer on the Auth object to get the current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });

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
          where("orderReference", "==", reference) // Use the passed reference
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
  }, [authUser, reference]);

  // Send a message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !authUser) return;

    const messageWithDetails = `Order Reference: ${reference}, Amount: ${amount}, Carts: ${JSON.stringify(carts)}\nMessage: ${newMessage}`;

    try {
      // Send the message to Firestore
      await addDoc(collection(firestore, "UserMessages"), {
        message: messageWithDetails,
        userId: authUser.uid,
        timestamp: serverTimestamp(),
        orderReference: reference, // Use the passed reference
      });

      // Immediately update the UI with the new message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: "temp-id", // Use a temporary ID or omit it if it's not needed for UI updates
          message: messageWithDetails,
          userId: authUser.uid,
          timestamp: { seconds: Math.floor(Date.now() / 1000) }, // Use current time
          orderReference: reference, // Replace with actual order reference
        },
      ]);
      setNewMessage(""); // Reset input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // If the reference, amount, or carts are available, send the message immediately on load
  useEffect(() => {
    if (reference && amount && carts) {
      sendMessage();
    }
  }, [reference, amount, carts]);

  return (
    <PageMeta title="User - My Inbox" description="View, Manage and place your order">
      <UserLayout>
        <div className="inbox-container">
          <h1>Inbox</h1>
          <div className="chat-box">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              <div className="messages-list">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.userId === authUser?.uid ? "user-message" : "admin-message"}`}
                  >
                    <p>{msg.message}</p>
                    <span>{new Date(msg.timestamp.seconds * 1000).toLocaleString()}</span>
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
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              Send
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
            background-color: #f1f1f1;
            color: #333;
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
      </UserLayout>
    </PageMeta>
  );
};

export default Inbox;
