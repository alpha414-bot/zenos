import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { AuthUserType } from "@/Types/Auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  Timestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";

// Define the structure of the chat metadata
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

// Define the structure of chat messages
interface ChatMessagesInterface {
  id: string;
  text: string;
  sender_uid: string;
  recipient_uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Check or create chat
export const queryToCreateChat = (recipient_uid?: string, auth_user?: AuthUserType) =>
  new Promise((resolve, reject) => {
    try {
      if (!recipient_uid || !auth_user?.uid) {
        reject(new Error("Recipient or authenticated user not provided."));
        return;
      }

      const chatsCollection = collection(firestore, "UserMessages");

      // Check if a chat already exists
      const existingChatQuery = query(
        chatsCollection,
        where("members", "array-contains", auth_user.uid)
      );

      getDocs(existingChatQuery)
        .then((snapshot) => {
          const existingChat = snapshot.docs.find((doc) =>
            doc.data().members.includes(recipient_uid)
          );

          if (existingChat) {
            console.log("Existing chat found:", existingChat.id);
            resolve({ id: existingChat.id, ...existingChat.data() });
          } else {
            // No existing chat, create a new one
            console.log("Creating new chat...");
            addDoc(chatsCollection, {
              has_messages: false,
              text: "Start conversation",
              unread: false,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              members: [recipient_uid, auth_user?.uid],
            } as ChatMetaListInterface)
              .then((newChat) => {
                getDoc(doc(firestore, "UserMessages", newChat.id))
                  .then((chatDoc) => {
                    resolve({ id: chatDoc.id, ...chatDoc.data() });
                  })
                  .catch((error) => {
                    reject(new Error("Failed to fetch newly created chat: " + error.message));
                  });
              })
              .catch((error) => {
                reject(new Error("Failed to create chat: " + error.message));
              });
          }
        })
        .catch((error) => {
          reject(new Error("Error checking for existing chat: " + error.message));
        });
    } catch (error) {
      reject(error);
      notify.error({ text: "Error while setting up chat instance." });
    }
  });

// Fetch chat by recipient UID
export const queryToGetChat = (
  listener: any,
  recipient_uid?: string,
  auth_user?: AuthUserType
): Promise<ChatMetaListInterface> =>
  new Promise((resolve, reject) => {
    if (!recipient_uid || !auth_user) {
      return reject(new Error("Recipient or Auth User is missing"));
    }

    try {
      const chatCollection = collection(firestore, "UserMessages");
      const chatQuery = query(
        chatCollection,
        where("members", "array-contains", recipient_uid)
      );

      getDocs(chatQuery)
        .then((snapshot) => {
          const matchingChat = snapshot.docs.find((doc) =>
            doc.data().members.includes(auth_user.uid)
          );

          if (matchingChat) {
            const chatData = matchingChat.data();
            chatData.id = matchingChat.id;
            resolve(listener(chatData));
          } else {
            queryToCreateChat(recipient_uid, auth_user)
              .then((newChat) => resolve(listener(newChat)))
              .catch(reject);
          }
        })
        .catch(reject);
    } catch (error) {
      reject(error);
      notify.error({ text: "Error connecting to server. [UNABLE_TO_QUERY_CHAT]" });
    }
  });

// Fetch messages
export const queryToFetchChatMessages = (
  listener: (data: { data: ChatMessagesInterface[]; chat_id: string }) => void,
  recipient_uid?: string,
  auth_user?: AuthUserType
): Promise<ChatMessagesInterface[]> =>
  new Promise((resolve, reject) => {
    console.log("Starting to fetch chat messages...");

    queryToGetChat((chatData: ChatMetaListInterface) => chatData, recipient_uid, auth_user)
      .then((chatData) => {
        const chat_id = chatData.id;

        if (!chat_id) {
          reject("Chat ID is missing");
          return notify.error({ text: "Chat ID is missing" });
        }

        console.log("Found chat ID:", chat_id);
        const chatDocRef = doc(collection(firestore, "UserMessages"), chat_id);
        const messagesQuery = query(
          collection(chatDocRef, "Messages"),
          orderBy("createdAt")
        );

        console.log("Querying Messages Subcollection:", messagesQuery);

        onSnapshot(
          messagesQuery,
          (snapshot) => {
            console.log("Snapshot triggered");
            const messages = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            } as ChatMessagesInterface));

            console.log("Fetched messages:", messages);
            listener({ data: messages, chat_id });
            resolve(messages);
          },
          (error) => {
            console.error("Snapshot listener error:", error);
            reject(error);
            notify.error({ text: "There was a snapshot error" });
          }
        );
      })
      .catch(reject);
  });

// Send message
export const queryToSendChatMessage = (
  payload: { text: string; sender_uid: string; recipient_uid: string },
  chat_id?: string
) =>
  new Promise((resolve, reject) => {
    if (!chat_id) {
      reject(new Error("Please try refreshing the page, unable to send message"));
      return notify.error({ text: "Please try refreshing the page, unable to send message" });
    }

    try {
      console.log("Sending message for chat ID:", chat_id);
      const chatDocRef = doc(collection(firestore, "UserMessages"), chat_id);
      const messagesCollection = collection(chatDocRef, "Messages");

      console.log("Adding message to Firestore:", payload);

      addDoc(messagesCollection, {
        ...payload,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      })
        .then(() => {
          console.log("Message added to Firestore successfully");

          // Update chat metadata
          runTransaction(firestore, async (transaction) => {
            transaction.update(chatDocRef, {
              has_messages: true,
              text: payload.text,
              unread: true,
              updatedAt: Timestamp.now(),
              sent_by_uid: payload.sender_uid,
            });
          })
            .then(() => {
              console.log("Chat updated successfully");
              resolve(payload);
            })
            .catch(reject);
        })
        .catch((error) => {
          console.error("Error adding message:", error);
          reject(error);
        });
    } catch (error) {
      reject(error);
      notify.error({ text: "Error while sending message" });
    }
  });
 // Fetch all chats
// Fix the return type to match the expected structure.
// Fetch all chats
export const queryToFetchAllChats = (admin_uid?: string): Promise<{ data: ChatMetaListInterface[] }> =>
  new Promise((resolve, reject) => {
    if (!admin_uid) {
      reject(new Error("Admin UID not provided."));
      return notify.error({ text: "Error: Admin UID is missing." });
    }

    try {
      console.log("Fetching all chats for admin:", admin_uid);

      const chatsCollection = collection(firestore, "UserMessages");

      // Query to fetch all chats for the admin user
      const allChatsQuery = query(
        chatsCollection,
        where("members", "array-contains", admin_uid),
        orderBy("updatedAt", "desc") // Sort chats by the most recently updated
      );

      console.log("Query to fetch all chats:", allChatsQuery);

      getDocs(allChatsQuery)
        .then((snapshot) => {
          console.log("Snapshot fetched:", snapshot);

          const chats: ChatMetaListInterface[] = snapshot.docs.map((doc) => {
            const data = doc.data() as ChatMetaListInterface;
            return {
              ...data,  // Spread the data object
              id: doc.id, // Add the id separately
            };
          });

          // If no chats are found, return an empty array
          if (chats.length === 0) {
            resolve({ data: [] });
            console.log("No chats found for admin:", admin_uid);
          } else {
            console.log("Fetched chats:", chats);
            resolve({ data: chats }); // Return the fetched chats in the correct structure
          }
        })
        .catch((error) => {
          console.error("Error fetching all chats:", error);
          reject(error);
          notify.error({ text: "Failed to fetch chats. Please try again later." });
        });
    } catch (error) {
      console.error("Unexpected error:", error);
      reject(error);
      notify.error({ text: "Error while fetching chats." });
    }
  });






