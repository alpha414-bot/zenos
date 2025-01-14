import { backend_url as BackendUrl } from "../../package.json";

export const baseURL = BackendUrl;
export const getMediaUrl = (path: string, w: any = "original") => {
  return `${baseURL}/media/cdn/images/${w}/${path}`;
};
export const headers = ({
  content_type,
}: {
  content_type: "application/json";
}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", content_type);
  return myHeaders;
};
export const Config = {
  phone: "09036279887",
  email: "info@zenos.com.ng",
  address: "651 N North Adekunle. St, Lagos",
};
export const ZenosCategory = [
  { key: "oraimo", value: "Oraimo" },
  { key: "new-age", value: "New Age" },
  { key: "uk-used", value: "UK Used" },
];

export const ZenosOraimoSubCategory = [
  { key: "power-banks", value: "Power Banks" },
  { key: "audio", value: "Audio" },
  { key: "smart-office", value: "Smart Office" },
  { key: "personal-care", value: "Personal Care" },
  { key: "home-appliances", value: "Home Appliances" },
];

export const ZenosNewAgeSubCategory = [
  { key: "power-banks", value: "Power Banks" },
  { key: "audio", value: "Audio" },
  { key: "cables", value: "Cables" },
  { key: "chargers", value: "Chargers" },
];
