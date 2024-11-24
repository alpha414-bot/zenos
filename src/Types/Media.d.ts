import { Timestamp } from "firebase/firestore";
import { FullMetadata } from "firebase/storage";
import { Modal } from "flowbite";

interface MediaItemInterface {
  id?: string;
  user_uid?: string;
  media: FullMetadata;
  createdAt: Timestamp;
  reuploadAttempt?: number;
  updatedAt: Timestamp;
  _selected?: boolean;
}

type ExtensionType =
  | ".avif"
  | ".bmp"
  | ".gif"
  | ".ico"
  | ".jpeg"
  | ".jpg"
  | ".png"
  | ".svg"
  | ".webp"
  | ".aac"
  | ".flac"
  | ".mp3"
  | ".ogg"
  | ".wav"
  | ".avi"
  | ".mp4"
  | ".mkv"
  | ".mpeg"
  | ".ogg"
  | ".webm" // '.csv'|
  | ".doc"
  | ".docx"
  // '.html'|
  | ".pdf"
  | ".ppt"
  | ".pptx"
  | ".txt"
  | ".xls"
  | ".xlsx";

type MediaMimeType = "image" | "video" | "document" | "others";

type MimesType = {
  [key: string]: ExtensionType[];
};

type MimeType = {
  [key: string]: ExtensionType[];
};

interface FileInterface extends File {
  path?: string;
}

interface ModalInterface extends Modal {
  // onChange?: any;
}