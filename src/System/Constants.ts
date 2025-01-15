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
  phone: "09131735970",
  email: "info@zenos.com.ng"
};

// Main display categories (for UI)
export const DisplayCategories = [
  { key: "phone-accessories", value: "Phone Accessories" },
  { key: "used-products", value: "Used Products" }
];

// Original categories (for backend/data organization)
export const ZenosCategory = [
  { key: "oraimo", value: "Oraimo" },
 
  { key: "itel", value: "Itel" },
  { key: "uk-used", value: "UK Used" }
];

// Phone Accessories subcategories
export const PhoneAccessoriesSubCategory = [
  { key: "power-banks", value: "Power Banks" },
  { key: "earpods", value: "EarPod/Earbud" },
  { key: "phone-cords", value: "Phone Cords" },
  { key: "phone-charger", value: "Phone Charger" },
  { key: "car-charger", value: "Car Charger" },
  { key: "phone-pouch", value: "Phone Pouch" },
  { key: "memory-card", value: "Memory Card" },
  { key: "bluetooth-speaker", value: "Bluetooth Speaker" }
];

// Keep the subcategories aligned with PhoneAccessoriesSubCategory for consistency
export const ZenosOraimoSubCategory = PhoneAccessoriesSubCategory;

// Remove unused subcategories since we're focusing on phone accessories
export const ZenosNewAgeSubCategory = PhoneAccessoriesSubCategory;
export const ZenosItelSubCategory = PhoneAccessoriesSubCategory;

// Helper function for MixItUp integration
export const getProductType = (category: string): string => {
  if (category === 'uk-used') return 'used-products';
  if (['oraimo',  'itel'].includes(category)) return 'phone-accessories';
  return category;
};

export const createSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Debug helpers
export const DEBUG = {
  phoneAccessoriesSlug: createSlug('phone-accessories'),
  categories: DisplayCategories.map(cat => ({
    original: cat.key,
    slug: createSlug(cat.key)
  }))
};