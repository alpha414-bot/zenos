import { auth, firestore } from "@/firebase-config";
import { notify } from "@/notify";
import { AuthUserType } from "@/Types/Auth";
import { ChatMessagesInterface } from "@/Types/Chat";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, runTransaction, Timestamp, query, orderBy, where } from "firebase/firestore";

// Assuming `ChatMetaListInterface` has the necessary fields for the chat metadata
interface ChatMetaListInterface {
  id: string; // Chat document ID
  has_messages: boolean; // Whether the chat has messages
  text: string; // Last message in the chat (or placeholder like "Start conversation")
  unread: boolean; // Whether there are unread messages
  createdAt: Timestamp; // Timestamp for when the chat was created
  updatedAt: Timestamp; // Timestamp for when the chat was last updated
  members: string[]; // Array of user IDs who are part of the chat
  sent_by_uid?: string;
}

// Create chat function
export const queryToCreateChat = (recipient_uid?: string, auth_user?: AuthUserType) =>
  new Promise((resolve, reject) => {
    try {
      // Ensure recipient_uid and auth_user are provided
      if (!recipient_uid || !auth_user?.uid) {
        reject(new Error("Recipient or authenticated user not provided."));
        console.log("Recipient or authenticated user not provided.");
        return;
      }

      const chatsCollection = collection(firestore, "UserMessages");

      // Create the chat document
      addDoc(chatsCollection, {
        has_messages: false,
        text: "Start conversation",
        unread: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        members: [recipient_uid, auth_user?.uid], // Ensure members are correctly set
      } as ChatMetaListInterface)
        .then((data) => {
          // After creating the chat, fetch the document to return it with the ID
          getDoc(doc(firestore, "UserMessages", data.id))
            .then((resp) => {
              // Resolving with the chat data and ID
              resolve({ ...resp.data(), id: resp.id });
            })
            .catch((error) => {
              reject(new Error("Failed to fetch chat document: " + error.message));
            });
        })
        .catch((error) => {
          reject(new Error("Failed to create chat: " + error.message));
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
      const ChatCollection = collection(firestore, "UserMessages");
      const chatQuery = query(
        ChatCollection,
        where("members", "array-contains", recipient_uid)
      );

      getDocs(chatQuery)
        .then(async (snap) => {
          const SyncRecipientAuthUser = snap.docs.find((doc) =>
            doc.data().members.includes(auth_user.uid)
          );

          if (SyncRecipientAuthUser) {
            const chatData = SyncRecipientAuthUser.data();
            chatData.id = SyncRecipientAuthUser.id;
            resolve(listener(chatData));
          } else {
            queryToCreateChat(recipient_uid, auth_user)
              .then((data) => {
                resolve(listener(data));
              })
              .catch(reject);
          }
        })
        .catch(reject);
    } catch (error) {
      reject(error);
      notify.error({ text: "Error connecting to server. [UNABLE_TO_QUERY_CHAT]" });
    }
  });

// Fetch chat messages for a given chat
// Fetch chat messages for a given chat
export const queryToFetchChatMessages = (
  listener: (data: { data: ChatMessagesInterface[]; chat_id: string }) => void,
  recipient_uid?: string,
  auth_user?: AuthUserType
): Promise<ChatMessagesInterface[]> =>
  new Promise((resolve, reject) => {
    queryToGetChat((data: ChatMetaListInterface) => data, recipient_uid, auth_user)
      .then((data) => {
        const chat_id = data.id;
        if (!chat_id) {
          reject("Chat ID is missing");
          return notify.error({ text: "Chat ID is missing" });
        }
        try {
          const ChatCollection = collection(firestore, "UserMessages");
          const ChatDocs = doc(ChatCollection, chat_id);
          const ChatMessageCollection = query(
            collection(ChatDocs, "Messages"),
            orderBy("createdAt")
          );
          onSnapshot(
            ChatMessageCollection,
            (snap) => {
              const messages: ChatMessagesInterface[] = snap.docs.map((item) => {
                const data = item.data();
                // Ensure that all required fields are properly mapped
                return {
                  id: item.id,
                  text: data.text || '',
                  sender_uid: data.sender_uid || '',
                  recipient_uid: data.recipient_uid || '',
                  createdAt: data.createdAt || Timestamp.now(),
                  updatedAt: data.updatedAt || Timestamp.now(),
                };
              });
              // Ensure that listener processes the data correctly and returns the expected value
              listener({ data: messages, chat_id });
              resolve(messages);  // Resolving the promise with the messages array
            },
            (error) => {
              reject(error);
              notify.error({ text: "There was a snapshot error" });
            }
          );
        } catch (error) {
          reject(error);
          notify.error({ text: "There was an issue with fetching chat messages" });
        }
      })
      .catch(reject);
  });

// Send a message to a chat
export const queryToSendChatMessage = (
  payload: { text: string; sender_uid: string; recipient_uid: string },
  chat_id?: string
) =>
  new Promise((resolve, reject) => {
    if (!chat_id) {
      reject({ error: true, message: "Please try refreshing the page, unable to send message" });
      return notify.error({ text: "Please try refreshing the page, unable to send message" });
    }
    try {
      const ChatParentInstance = doc(collection(firestore, "UserMessages"), chat_id);
      const ChatMessageCollection = collection(ChatParentInstance, "Messages");
      runTransaction(firestore, async (transact) => {
        addDoc(ChatMessageCollection, {
          ...payload,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        })
          .then(() => {
            transact.update(ChatParentInstance, {
              has_messages: true,
              text: payload.text,
              unread: true,
              updatedAt: Timestamp.now(),
              sent_by_uid: payload.sender_uid,
            });
          })
          .catch(reject);
      })
        .then(resolve)
        .catch(reject);
    } catch (error) {
      reject(error);
      notify.error({ text: "Error while sending message" });
    }
  });
