import Image from "@/Components/Image";
import MediaItem from "@/Components/MediaItem";
import PageMeta from "@/Layouts/PageMeta";
import UserLayout from "@/Layouts/UserLayout";
import { useAuthUser } from "@/Services/Hooks";
import { useChat } from "@/Services/Hooks/UseChat";
import { useAppDispatch, useAppSelector } from "@/Services/Redux/Hook";
import { setModalState } from "@/Services/Redux/MediaSlice";
import { getMediaUrl } from "@/System/Constants";
import { MediaItemInterface } from "@/Types/Media";
import { notify } from "@/notify";
import classNames from "classnames";
import EmojiPicker, {
  EmojiClickData,
  SuggestionMode,
  Theme,
} from "emoji-picker-react";
import { Timestamp } from "firebase/firestore";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";
import _ from "lodash";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

interface ChatMessage {
  id: string;
  text: string;
  sender_uid: string;
  recipient_uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  media?: {
    name: string;
    type: string;
  };
  isAutoReply?: boolean;
  isSystemMessage?: boolean;
}

interface ChatFormData {
  message: string;
  attachments: any[];
}

interface LocationState {
  reference: string;
  amount: number;
  carts: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface ChatHookReturn {
  chatId: string;
  messages: ChatMessage[];
  loading: boolean;
  sendMessage: (text: string, options?: Partial<ChatMessage>) => Promise<void>;
  initializeChat: (adminUid: string) => Promise<void>;
}

const AUTO_REPLIES = {
  WELCOME: (userName: string) =>
    `Hello ${userName}! Thanks for your order. Would you like to apply a referral code before proceeding?`,
  DISCOUNT_PROMPT:
    "You can enter your referral code or click 'Chat with an agent' to proceed with payment",
  AGENT_PROMPT: "Would you like to chat with a live agent about your order?",
};

const Inbox = () => {
  const { data: currentUser } = useAuthUser();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const state = location.state as LocationState;
  const adminUid = "Y4P4ECBLLWRbk7VZUqkpqqixE7H2";

  const { selectedItems: mediaAttachment } = useAppSelector(
    (state) => state.media
  );

  const { chatId, messages, loading, sendMessage, initializeChat } = useChat(
    adminUid
  ) as ChatHookReturn;

  const { handleSubmit, reset, watch, register, setValue } =
    useForm<ChatFormData>({
      defaultValues: {
        message: "",
        attachments: [],
      },
    });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const [orderDetailsSent, setOrderDetailsSent] = useState(false);
  const [hasInitiatedChat, setHasInitiatedChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const attachments = watch("attachments");

  useEffect(() => {
    const setup = async () => {
      if (!currentUser) {
        notify.error({ text: "Please log in to continue" });
        return;
      }

      try {
        if (!chatId) {
          await initializeChat(adminUid);
        }

        setTimeout(async () => {
          if (state && !initialMessageSent && chatId) {
            await sendInitialMessages();
          }
        }, 1000);
      } catch (error) {
        notify.error({ text: "Failed to initialize chat" });
      }
    };

    setup();
  }, [state, chatId]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // add attachment to form hook
  useEffect(() => {
    setValue("attachments", mediaAttachment as any);
  }, [mediaAttachment]);

  const handleFormSubmit = async (data: ChatFormData) => {
    if (!chatId || !currentUser) {
      notify.error({ text: "Chat session not initialized" });
      return;
    }

    if (!data.message.trim() && !data.attachments?.length) {
      return;
    }

    try {
      setUploading(true);

      if (data.attachments?.length) {
        for (const file of data.attachments) {
          await sendMessage(`Sent file: ${file.media.name}`, {
            media: {
              name: file.media.name,
              type: _.split(file.media.mimetype, "/")[0],
            },
          });
        }
      }

      if (data.message.trim()) {
        await sendMessage(data.message.trim());
      }

      reset({ message: "", attachments: [] });
    } catch (error) {
      notify.error({ text: "Failed to send message" });
    } finally {
      setUploading(false);
    }
  };

  const sendInitialMessages = async () => {
    if (!currentUser || !state || initialMessageSent || !chatId) {
      return;
    }

    try {
      await sendMessage(`Hello @Zenos, I would like to place this order`, {
        isSystemMessage: true,
      });

      await new Promise((resolve) => setTimeout(resolve, 500));

      await sendMessage(
        formatOrderDetails(state.carts, state.reference, state.amount),
        { isSystemMessage: true }
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      await sendMessage(
        AUTO_REPLIES.WELCOME(currentUser.displayName || "there"),
        {
          isAutoReply: true,
          sender_uid: adminUid,
          recipient_uid: currentUser.uid,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      await sendMessage(AUTO_REPLIES.DISCOUNT_PROMPT, {
        isAutoReply: true,
        sender_uid: adminUid,
        recipient_uid: currentUser.uid,
      });

      setInitialMessageSent(true);
      setOrderDetailsSent(true);
    } catch (error) {
      notify.error({ text: "Failed to send initial messages" });
    }
  };

  const formatOrderDetails = (
    carts: LocationState["carts"],
    reference: string,
    amount: number
  ) => {
    if (!carts?.length) {
      return `🛍️ New Order Details\nReference: ${reference}\nTotal Amount: $${
        amount?.toFixed(2) || 0
      }`;
    }

    return `
    🛍️ New Order Details
        ------------------------
        Reference: ${reference}
        Total Amount: $${amount?.toFixed(2) || 0}

        📦 Order Items:
        ${carts
          .filter((item) => item?.price != null)
          .map(
            (item) => `
        - ${item.name}
          Quantity: ${item.quantity}
          Price: $${item.price?.toFixed(2)}
          Subtotal: $${(item.quantity * item.price)?.toFixed(2)}
        `
          )
          .join("")}
        ------------------------
        Order Date: ${new Date().toLocaleString()}
    `;
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = watch("message");
    reset({ ...watch(), message: currentMessage + emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleChatWithAgent = async () => {
    if (!chatId || hasInitiatedChat || !currentUser) return;

    try {
      setHasInitiatedChat(true);

      await sendMessage(
        "You've been connected with an agent. They will respond shortly.",
        { isSystemMessage: true }
      );
    } catch (error) {
      notify.error({ text: "Failed to connect with agent" });
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return moment(timestamp.toDate()).format("DD MMM YYYY, h:mma");
  };

  return (
    <UserLayout>
      <PageMeta
        title="Inbox - User"
        description="Chat with support agents and manage your orders in the Inbox."
      >
        <div className="relative flex flex-col h-full bg-gray-900">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-300 text-lg">Loading chat...</p>
            </div>
          ) : (
            <>
              <div
                ref={messageListRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {[...messages].reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.isSystemMessage
                        ? "justify-center"
                        : msg.isAutoReply
                        ? "justify-start"
                        : msg.sender_uid === currentUser?.uid
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={classNames(
                        " rounded-lg p-3 shadow-sm whitespace-pre-wrap",
                        {
                          "w-full max-w-xl !bg-gray-600 text-gray-200 text-center italic":
                            msg.isSystemMessage,
                          "bg-zenos-600 text-black":
                            msg.sender_uid === currentUser?.uid,
                          "bg-gray-800 text-white":
                            msg.isAutoReply || msg.sender_uid === adminUid,
                          "max-w-[70%]": !msg.media,
                          "max-w-[40%] ": !!msg.media,
                        }
                      )}
                    >
                      {msg.media ? (
                        <div id="lightgallery">
                          {msg.media.type.startsWith("image") ? (
                            <LightGallery
                              speed={500}
                              plugins={[lgThumbnail, lgZoom]}
                            >
                              <a
                                href={getMediaUrl(msg.media.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline w-auto"
                              >
                                <Image
                                  src={msg.media.name}
                                  alt={msg.media.name}
                                  className="max-w-56 h-auto rounded-lg"
                                  loading="lazy"
                                  w="1280"
                                />
                              </a>
                            </LightGallery>
                          ) : (
                            <a
                              href={getMediaUrl(msg.media.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex items-center flex-wrap space-x-2 w-full px-2"
                            >
                              <i className="fa-solid fa-paperclip -left-2 top-1 absolute"></i>
                              <span className="whitespace-pre-wrap">
                                {msg.media.name}
                              </span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-medium break-words whitespace-pre-line">
                          {msg.text}
                        </p>
                      )}
                      <p
                        className={classNames(
                          "text-xs mt-1.5 text-inherit italic tracking-tight opacity-60",
                          {
                            "hidden ": msg.isSystemMessage,
                          }
                        )}
                      >
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-2 pt-2 bg-opacity-25 bg-gray-900 md:bg-opacity-100 md:px-4 md:py-4">
                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-2 md:space-y-4"
                >
                  {attachments && attachments?.length > 0 && (
                    <div
                      className={classNames(
                        "flex flex-nowrap gap-x-4 overflow-auto w-auto"
                      )}
                    >
                      {attachments?.map((item, i) => {
                        return (
                          <div key={i} className="min-w-40 pb-2">
                            <MediaItem
                              key={i}
                              {...{
                                item: item,
                                onChange: (a: any) =>
                                  console.log("onChange", a),
                                onBlur: (a: any) => console.log("onBlur", a),
                                multiSelect: true,
                                clearSelect: (e: MediaItemInterface) => {
                                  if (e) {
                                    setValue(
                                      "attachments",
                                      _.filter(
                                        attachments as MediaItemInterface[],
                                        (a) =>
                                          a?.media?.name.toLowerCase() !==
                                          e.media?.name?.toLowerCase()
                                      )
                                    );
                                  }
                                },
                                showThumbnail: true,
                                asDiv: true,
                                imageClassName: "!bg-cover !bg-top",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="relative grid grid-cols-[1fr_auto] gap-x-2 md:gap-x-4">
                    <div className="flex items-center gap-x-2 relative rounded-lg overflow-hidden md:rounded-none">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute z-10 top-0 bottom-0 left-0 px-2 text-gray-400 hover:text-zenos-400 md:static"
                      >
                        <i className="fa-lg fa-solid fa-face-smile"></i>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          dispatch(
                            setModalState({
                              multiSelect: true,
                            })
                          );
                        }}
                        className="absolute z-10 top-0 bottom-0 right-0 px-3 text-white md:text-gray-400 md:hover:text-zenos-600 md:static bg-zenos-600 md:bg-transparent "
                      >
                        <i className="fa-lg fa-solid fa-paperclip"></i>
                      </button>
                      <input
                        {...register("message")}
                        placeholder="Type your message..."
                        className="flex-1 w-full rounded-lg border border-gray-700 bg-gray-800 text-white pl-9 pr-12 py-2 focus:outline-none focus:border-zenos-600 md:pr-4 md:pl-4"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        (!watch("message")?.trim() && !attachments?.length) ||
                        uploading
                      }
                      className="grow bg-zenos-600 text-white px-6 py-2 rounded-lg hover:bg-zenos-700 transition-colors disabled:bg-gray-700"
                    >
                      {uploading ? "Sending..." : "Send"}
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute w-full left-0 bottom-full mb-2 z-50">
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          theme={Theme.AUTO}
                          className="!bg-gray-900"
                          searchDisabled
                          skinTonesDisabled
                          suggestedEmojisMode={SuggestionMode.RECENT}
                          previewConfig={{ showPreview: false }}
                        />
                      </div>
                    )}
                  </div>
                </form>
                {orderDetailsSent && !hasInitiatedChat && (
                  <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <button
                      onClick={handleChatWithAgent}
                      className="w-full bg-zenos-600 text-white px-4 py-2 rounded-lg hover:bg-zenos-700 transition-colors"
                    >
                      Chat with an Agent
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </PageMeta>
    </UserLayout>
  );
};

export default Inbox;
