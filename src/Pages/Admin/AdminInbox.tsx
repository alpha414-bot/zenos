import Image from "@/Components/Image";
import MediaItem from "@/Components/MediaItem";
import AdminLayout from "@/Layouts/AdminLayout";
import PageMeta from "@/Layouts/PageMeta";
import { notify } from "@/notify";
import { useAdminChat } from "@/Services/Hooks/useAdminChat";
import { useAppDispatch } from "@/Services/Redux/Hook";
import { setModalState } from "@/Services/Redux/MediaSlice";
import { getMediaUrl } from "@/System/Constants";
import { MediaItemInterface } from "@/Types/Media";
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
import { Link } from "react-router-dom";

interface ChatFormData {
  message: string;
  attachments: any[];
}

const AdminInbox: React.FC = () => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ChatFormData>({
      defaultValues: {
        message: "",
        attachments: [],
      },
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
  const attachments = watch("attachments");

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleChatSelect = (chatId?: string) => {
    setSelectedChatId(chatId as string);
    reset({ message: "", attachments: [] });
    if (messageListRef.current) {
      messageListRef.current.scrollTo(0, 0);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const currentMessage = watch("message");
    reset({ ...watch(), message: currentMessage + emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const onSubmit = async (data: ChatFormData) => {
    if (!selectedChatId || (!data.message.trim() && !data.attachments?.length))
      return;

    const selectedChat = chats.find((chat) => chat.id === selectedChatId);
    if (!selectedChat) return;

    const recipientUid = selectedChat.members.find((id) => id !== adminUid);
    if (!recipientUid) {
      notify.error({ text: "Cannot find recipient" });
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
              type: file.type,
            },
          });
        }
      }

      // Handle text message
      if (data.message.trim()) {
        await sendMessage(data.message.trim(), recipientUid);
      }

      // Reset form after successful send
      reset({ message: "", attachments: [] });
    } catch (error) {
      console.error("Error sending message:", error);
      notify.error({ text: "Failed to send message" });
    } finally {
      setUploading(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    return moment(timestamp.toDate()).format("DD MMM YYYY, h:mma");
  };
  const renderMessageContent = (msg: any) => {
    if (msg.media) {
      if (msg.media.type.startsWith("image")) {
        return (
          <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
            <a
              href={getMediaUrl(msg.media.name)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={msg.media.name}
                alt={msg.media.name}
                className="max-w-full h-auto rounded"
                loading="lazy"
                w="1280"
              />
            </a>
          </LightGallery>
        );
      }
      return (
        <a
          href={getMediaUrl(msg.media.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-zenos-600 hover:text-zenos-700"
        >
          <i className="fa-solid fa-paperclip"></i>
          <span>{msg.media.name}</span>
        </a>
      );
    }
    return (
      <p className="text-sm font-medium break-words whitespace-pre-line">
        {msg.text}
      </p>
    );
  };

  return (
    <AdminLayout>
      <PageMeta
        title="Inbox - Administrator"
        description="Chat with users and manage your orders in the Inbox."
      >
        <div className="flex h-full bg-gray-900">
          {/* Chat List Sidebar */}
          <div className="w-1/6 py-4 border-r border-gray-700 bg-gray-800 overflow-y-auto md:w-1/4">
            <Link to={"/admin/dashboard"} className="block py-2 md:hidden">
              <img
                src="/assets/images/zenos.svg"
                alt="Zenos Ecommerce Logo"
                className="w-32 mx-auto"
              />
            </Link>
            <div className="hidden p-4 border-b border-gray-700 md:block">
              <h2 className="text-xl font-semibold text-white">
                Conversations
              </h2>
            </div>

            {loading ? (
              <div className="p-4 text-center text-gray-400">
                Loading chats...
              </div>
            ) : (
              <div className="py-3 divide-y divide-gray-700 md:py-0">
                {chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No conversations yet
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className={`px-0 py-2 cursor-pointer hover:bg-gray-700 transition-colors md:px-4 md:py-4 ${
                        selectedChatId === chat.id ? "bg-gray-700" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 mx-auto">
                          <div className="w-12 h-12 rounded-full bg-zenos-600 flex items-center justify-center">
                            <span className="text-lg text-gray-900">
                              {chat.userData?.first_name?.[0]?.toUpperCase() ||
                                "?"}
                            </span>
                          </div>
                        </div>
                        <div className="hidden flex-1 min-w-0 md:block">
                          <p className="text-sm font-medium text-white truncate">
                            {chat.userData
                              ? `${chat.userData.first_name} ${chat.userData.last_name}`
                              : "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-400">
                            {formatTimestamp(chat.updatedAt)}
                          </p>
                          {chat.unread && chat.sent_by_uid !== adminUid && (
                            <span className="inline-block bg-zenos-600 rounded-full w-2 h-2 ml-2"></span>
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
                <div className="py-2 px-2 flex justify-between bg-zenos-500">
                  <button
                    onClick={() => {
                      handleChatSelect(undefined);
                    }}
                    className="px-4 py-2 "
                  >
                    <i className="fa-xl fa-solid fa-xmark"></i>
                  </button>
                </div>
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
                          msg.sender_uid === adminUid
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={classNames("rounded-lg p-3", {
                            "bg-zenos-600 text-gray-900":
                              msg.sender_uid === adminUid,
                            "bg-gray-800 text-white": !(
                              msg.sender_uid === adminUid
                            ),
                            "max-w-[70%]": !msg.media,
                            "max-w-[80%] md:max-w-[40%]": !!msg.media,
                          })}
                        >
                          {renderMessageContent(msg)}
                          <p
                            className={`text-xs mt-1.5 italic tracking-tight opacity-60`}
                          >
                            {formatTimestamp(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input with Media Component */}
                <div className="px-2 py-4 bg-opacity-25 bg-gray-900 md:bg-opacity-100 md:px-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                          {...control.register("message")}
                          placeholder="Type your message..."
                          className="flex-1 w-full rounded-lg border border-gray-700 bg-gray-800 text-white pl-9 pr-12 py-2 focus:outline-none focus:border-zenos-600 md:pr-4 md:pl-4"
                        />
                      </div>
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
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-400 text-lg text-center font-medium">
                  Select a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </PageMeta>
    </AdminLayout>
  );
};

export default AdminInbox;
