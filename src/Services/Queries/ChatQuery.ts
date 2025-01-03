import { firestore } from "@/firebase-config";
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
  setDoc
} from "firebase/firestore";

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

interface ChatMessagesInterface {
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

export const queryToCreateChat = (recipient_uid?: string, auth_user?: AuthUserType) =>
  new Promise((resolve, reject) => {
    try {
      if (!recipient_uid || !auth_user?.uid) {
        reject(new Error("Recipient or authenticated user not provided."));
        return;
      }

      const chatsCollection = collection(firestore, "UserMessages");

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
            resolve({ id: existingChat.id, ...existingChat.data() });
          } else {
            addDoc(chatsCollection, {
              has_messages: false,
              text: "Start conversation",
              unread: false,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
              members: [auth_user.uid, recipient_uid],
            })
              .then((newChat) => {
                getDoc(newChat).then((chatDoc) => {
                  resolve({ id: chatDoc.id, ...chatDoc.data() });
                });
              })
              .catch(reject);
          }
        })
        .catch(reject);
    } catch (error) {
      reject(error);
      notify.error({ text: "Error while setting up chat instance." });
    }
  });

export const queryToGetChat = (
  listener: any,
  auth_uid?: string,
  recipient?: AuthUserType
): Promise<ChatMetaListInterface> =>
  new Promise(async (resolve, reject) => {
    if (!auth_uid || !recipient?.uid) {
      reject(new Error("Recipient or Auth User is missing"));
      return;
    }

    try {
      const chatCollection = collection(firestore, "UserMessages");
      
      const existingChatQuery = query(
        chatCollection,
        where("members", "array-contains", auth_uid)
      );

      const chatSnapshot = await getDocs(existingChatQuery);

      const existingChat = chatSnapshot.docs.find(doc => {
        const members = doc.data().members;
        return members.includes(recipient.uid);
      });

      if (existingChat) {
        const chatData = {
          id: existingChat.id,
          ...existingChat.data()
        } as ChatMetaListInterface;
        return resolve(listener(chatData));
      }

      const sortedMembers = [auth_uid, recipient.uid].sort();
      const deterministicChatId = `chat_${sortedMembers.join('_')}`;

      const deterministicChatRef = doc(chatCollection, deterministicChatId);
      const deterministicChatDoc = await getDoc(deterministicChatRef);

      if (deterministicChatDoc.exists()) {
        const chatData = {
          id: deterministicChatId,
          ...deterministicChatDoc.data()
        } as ChatMetaListInterface;
        return resolve(listener(chatData));
      }

      const newChatData = {
        has_messages: false,
        text: "Start conversation",
        unread: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        members: [auth_uid, recipient.uid]
      };

      await setDoc(deterministicChatRef, newChatData, { merge: true });

      const chatData = {
        id: deterministicChatId,
        ...newChatData
      } as ChatMetaListInterface;

      resolve(listener(chatData));
    } catch (error) {
      console.error("Error in queryToGetChat:", error);
      reject(error);
      notify.error({ text: "Error connecting to server. [UNABLE_TO_QUERY_CHAT]" });
    }
  });

export const queryToSendChatMessage = (
  payload: {
    text: string;
    sender_uid: string;
    recipient_uid: string;
    media?: {
      name: string;
      fullPath: string;
      type: string;
    };
  },
  chat_id?: string
) =>
  new Promise(async (resolve, reject) => {
    if (!chat_id) {
      reject(new Error("Please try refreshing the page, unable to send message"));
      return notify.error({ text: "Please try refreshing the page, unable to send message" });
    }

    try {
      const chatDocRef = doc(firestore, "UserMessages", chat_id);
      
      const chatDoc = await getDoc(chatDocRef);
      if (!chatDoc.exists()) {
        throw new Error("Chat does not exist");
      }

      const messagesCollection = collection(chatDocRef, "Messages");
      const messageData = {
        ...payload,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await runTransaction(firestore, async (transaction) => {
        const newMessageRef = doc(messagesCollection);
        transaction.set(newMessageRef, messageData);

        const chatUpdateData: any = {
          has_messages: true,
          text: payload.media ? `Sent ${payload.media.type.startsWith('image/') ? 'an image' : 'a file'}` : payload.text,
          unread: true,
          updatedAt: Timestamp.now(),
          sent_by_uid: payload.sender_uid,
        };

        transaction.update(chatDocRef, chatUpdateData);
      });

      resolve(payload);
    } catch (error) {
      console.error("Error sending message:", error);
      reject(error);
      notify.error({ text: "Error while sending message" });
    }
  });

export const queryToFetchAllChats = (admin_uid?: string): Promise<{ data: ChatMetaListInterface[] }> =>
  new Promise((resolve, reject) => {
    if (!admin_uid) {
      reject(new Error("Admin UID not provided."));
      return notify.error({ text: "Error: Admin UID is missing." });
    }

    try {
      const chatsCollection = collection(firestore, "UserMessages");

      const allChatsQuery = query(
        chatsCollection,
        where("members", "array-contains", admin_uid),
        orderBy("updatedAt", "desc")
      );

      getDocs(allChatsQuery)
        .then((snapshot) => {
          const chats: ChatMetaListInterface[] = snapshot.docs.map((doc) => {
            const data = doc.data() as ChatMetaListInterface;
            return {
              ...data,
              id: doc.id,
            };
          });

          resolve({ data: chats });
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

export const queryToFetchChatMessages = (
  listener: (data: { data: ChatMessagesInterface[]; chat_id: string }) => void,
  chat_id?: string
): Promise<ChatMessagesInterface[]> =>
  new Promise((resolve, reject) => {
    if (!chat_id) {
      reject(new Error("Chat ID is missing"));
      return notify.error({ text: "Chat ID is missing" });
    }

    try {
      const chatDocRef = doc(firestore, "UserMessages", chat_id);
      const messagesQuery = query(
        collection(chatDocRef, "Messages"),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(
        messagesQuery,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as ChatMessagesInterface));

          listener({ data: messages, chat_id });
          resolve(messages);
        },
        (error) => {
          console.error("Error fetching messages:", error);
          reject(error);
          notify.error({ text: "Error fetching messages" });
        }
      );

      return () => unsubscribe();
    } catch (error) {
      console.error("Unexpected error:", error);
      reject(error);
      notify.error({ text: "Error while fetching messages" });
    }
  });