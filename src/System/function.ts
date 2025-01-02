import { MimeType } from "@/Types/Media";
import escapeHtml from "escape-html";
import { AuthError } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import _ from "lodash";
import { useEffect } from "react";
import { Text } from "slate";
import { jsx } from "slate-hyperscript";

export const getErrorMessageViaStatus = (error: RouteErrorInterface) => {
  switch (error.status) {
    case 404:
      return {
        status: 404,
        shortMessage: "404 Not Found | We can't find that page!",
        longMessage:
          "Sorry, the page you're looking for does not exist anymore, or we've moved it somewhere else. Try selecting a link from the navigation at the top of the page. ",
      };
    default:
      return {
        ...error,
        shortMessage: error.statusText || "Error Encountered",
        longMessage:
          error.data ||
          "There was a problem with this page. Try refreshing the page, if issue persists, contact administrator.",
      };
  }
};

export const isUrl = (url: string): boolean => {
  const pattern =
    /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  // const pattern = new RegExp("^(?:[a-z]+:)?//", "i");
  return pattern.test(encodeURI(url));
};

/**
 * Function to convert value to human readable output
 *
 * @param value the number to convert valid displayable price
 * @returns string
 */
export const price = (
  value: any,
  style: "currency" | "decimal" | "percent" | "unit" = "currency",
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string => {
  let format = new Intl.NumberFormat("en-NG", {
    style: style,
    currency: "NGN",
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value);
  return isNaN(value) ? "0" : format;
};

/**
 *
 * Percentage calculation and refixing...
 *
 * @param value the actual value of number undergoing calculation
 * @param percentage the percentage of calculation
 * @param operation the type of operation being done in percentage calculation either substraction or addition
 * @returns number
 */
export const priceInPerct = (
  value: number,
  percentage: number,
  operation: "-" | "+"
) => {
  let percentagePrice = (percentage / 100) * value;
  switch (operation) {
    case "+":
      return (value + percentagePrice).toFixed(2);
    case "-":
      return (value - percentagePrice).toFixed(2);
    default:
      return value - percentagePrice;
  }
};

/**
 * react query keys for identifying queries
 */
export const keys = {
  auth_user_profile: (auth_uid?: string) => [
    "auth_user_profile",
    auth_uid || "",
  ],
  product_data: (product_id?: string, admin?: any, extra: string = "") => [
    "product_data",
    product_id || "all",
    admin ? "admin" : "users",
    extra,
  ],
  similar_product_data: (except_product_id?: string) => [
    "product_data",
    except_product_id || "all",
  ],
  cart_data: (user_id?: string, cart_id?: string) => [
    "cart_data",
    user_id || "no_user",
    cart_id || "all",
  ],
  order_data: (user_id?: string, order_id?: string) => [
    "order_data",
    user_id || "no_user",
    order_id || "all",
  ],
  amazon_media: (key: string) => ["image_gallery_from_amazon", key],
};

export const DummyData = [
  {
    name: "Super 30",
    description: "A high-performance laptop with the latest features.",
    category: "laptop",
    price: 20000,
    salesPrice: 25000,
    image: "products/laptop1.jpeg",
    variants: [
      {
        color: "Black",
        size: "15 inch",
        material: "Aluminum",
      },
      {
        color: "Silver",
        size: "13 inch",
        material: "Aluminum",
      },
    ],
    weight: 1.5,
    star: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Type X",
    description:
      "Ultra-thin laptop with a stunning display, fast performance, and all-day battery life. Ideal for on-the-go productivity.",
    category: "laptop",
    price: 90000,
    salesPrice: 100000,
    image: "products/laptop2.jpeg",
    variants: [
      {
        color: "Black",
        size: "10 inch",
        material: "Carbon Fiber",
      },
      {
        color: "Silver",
        size: "13 inch",
        material: "Aluminum",
      },
    ],
    weight: 1.2,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Power FX",
    description:
      "Compact, powerful laptop with vibrant display and long battery life. Perfect for everyday use.",
    category: "laptop",
    price: 75000,
    salesPrice: 80000,
    image: "products/laptop3.jpeg",
    variants: [
      {
        color: "White",
        size: "10 inch",
        material: "Carbon Fiber",
      },
      {
        color: "Blue",
        size: "13 inch",
        material: "Aluminum",
      },
    ],
    weight: 1.0,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "XR 3546",
    description:
      "Lightweight laptop with sharp display and speedy performance. Ideal for work and travel.",
    category: "laptop",
    price: 90000,
    salesPrice: 100000,
    image: "products/laptop4.jpeg",
    variants: [
      {
        color: "Black",
        size: "10 inch",
        material: "Carbon Fiber",
      },
    ],
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "DK PC",
    description:
      "Sleek and powerful laptop with a crisp display and extended battery life. Perfect for all your needs.",
    category: "laptop",
    price: 12000,
    salesPrice: 10000,
    image: "products/laptop5.jpeg",
    variants: [
      {
        color: "Black",
        size: "10 inch",
        material: "Carbon Fiber",
      },
    ],
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Man KX",
    description:
      "High-performance laptop with a vivid display and long-lasting battery. Ideal for productivity and entertainment.",
    category: "laptop",
    price: 70000,
    salesPrice: 80000,
    image: "products/laptop6.jpeg",
    variants: [
      {
        color: "Yellow",
        size: "11 inch",
        material: "Carbon Fiber",
      },
    ],
    weight: 1.1,
    star: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "XR S282",
    description:
      "Slim, fast laptop with brilliant display and enduring battery. Perfect for work and play.",
    category: "laptop",
    price: 12000,
    salesPrice: 8000,
    image: "products/laptop7.jpeg",
    variants: [
      {
        color: "Yellow",
        size: "12 inch",
        material: "Aluminum",
      },
    ],
    weight: 1.25,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Cax Py",
    description:
      "Lightweight laptop with fast performance, clear display, and long battery life. Ideal for on-the-go use.",
    category: "laptop",
    price: 8000,
    salesPrice: 5000,
    image: "products/laptop8.jpeg",
    variants: [
      {
        color: "Black",
        size: "11 inch",
        material: "Abrasion",
      },
    ],
    weight: 1.5,
    star: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "iPhone AF",
    description:
      "Sleek iPhone with stunning display, powerful performance, and advanced camera technology. Redefining mobile excellence.",
    category: "mobile",
    price: 10000,
    salesPrice: 5000,
    image: "products/mobilei1.jpeg",
    variants: [
      {
        color: "Black",
        size: "8 inch",
        material: "Aluminum",
      },
    ],
    weight: 0.7,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "iPhone 55",
    description:
      "Cutting-edge iPhone with vibrant display, lightning-fast performance, and exceptional camera capabilities. Elevating your mobile experience.",
    category: "mobile",
    price: 7000,
    image: "products/mobilei2.jpeg",
    variants: [
      {
        color: "Black",
        size: "10 inch",
        material: "Sulphur Lining",
      },
    ],
    weight: 1,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "iPhone AL",
    description:
      "Stylish iPhone with top-notch display, blazing speed, and unmatched camera quality. Redefining mobile innovation.",
    category: "mobile",
    price: 12000,
    image: "products/mobilei3.jpeg",
    weight: 0.9,
    star: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "iPhone KB",
    description:
      "Premium iPhone with stunning display, lightning-fast performance, and unmatched camera prowess. Setting the standard for mobile excellence.",
    category: "mobile",
    price: 7000,
    image: "products/mobilei4.jpeg",
    weight: 1.2,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sam JK",
    description:
      "Stunning display, lightning-fast performance, and exceptional camera. Unleash your potential.",
    category: "mobile",
    price: 5000,
    image: "products/mobiles1.jpeg",
    variants: [
      {
        color: "Blue",
        size: "10 inch",
        material: "Aluminum",
      },
      {
        color: "Black",
        size: "10 inch",
        material: "Carbon Fiber",
      },
    ],
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sam XR",
    description:
      "Samsung Galaxy: A fusion of style and power, boasting a stunning display and lightning-fast performance.",
    category: "mobile",
    price: 10000,
    image: "products/mobiles2.jpeg",
    variants: [
      {
        color: "Green",
        size: "11 inch",
        material: "Aluminum",
      },
      {
        color: "Black",
        size: "10 inch",
        material: "Sulphur Lining",
      },
    ],
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "XR Galaxy",
    description:
      "Samsung Galaxy: Sleek design, powerful performance, and vibrant display, all in one pocket-friendly device.",
    category: "mobile",
    price: 9500,
    image: "products/mobiles3.jpeg",
    variants: [
      {
        color: "Green",
        size: "11 inch",
        material: "Aluminum",
      },
    ],
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sam XR",
    description:
      "Samsung Galaxy: Sleek design, powerful performance, and vibrant display, setting new standards in mobile excellence.",
    category: "mobile",
    price: 8000,
    image: "products/mobiles4.jpeg",
    weight: 1.2,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "XR TabA",
    description:
      "Tablet: A portable powerhouse with a stunning display, fast performance, and all-day battery life. Redefining versatility.",
    category: "gadget",
    price: 10000,
    image: "products/gadget1.jpeg",
    weight: 1.4,
    star: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "TAB GF",
    description:
      "Cutting-edge tablet with vibrant display, powerful performance, and long-lasting battery. Redefining portable productivity.",
    category: "gadget",
    price: 12000,
    image: "products/gadget2.jpeg",
    weight: 1.8,
    star: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "XR shn",
    description:
      "Sleek tablet with stunning display, fast performance, and all-day battery life. Perfect for work and entertainment on the go.",
    category: "gadget",
    price: 6700,
    image: "products/gadget3.jpeg",
    weight: 1.4,
    star: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Tab KH",
    description:
      "Versatile tablet with vibrant display, fast performance, and long battery life. Ideal for productivity and entertainment.",
    category: "gadget",
    price: 24000,
    salesPrice: 22000,
    image: "products/gadget4.jpeg",
    weight: 1.1,
    star: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const date = (date: FirestoreDate): Date => {
  return new Date((date.seconds as any) * 1000);
};

export const importScript = (resourceUrl: string) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = resourceUrl;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [resourceUrl]);
};

/**
 * function to check if a pass string is valid and absolute URL address
 *
 * @param url the string to cross check if it is valid url
 * @returns boolean true/false
 */
export const isURL = (url: string): boolean => {
  const pattern = new RegExp("^(?:[a-z]+:)?//", "i");
  return pattern.test(url);
};

export const NumberPattern = /^[0-9]*$/;
export const PasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
export const EmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NOAUTOCOMPLETE =
  "no-quicks" + Math.random() * 299 * Math.random() + " countries randon";

export const short = (
  description: string,
  maxLength: number,
  show_short: boolean = true
) => {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength)}${show_short ? "..." : ""}`;
};

export const NigeriaState = [
  { key: "abia", value: "Abia" },
  { key: "adamawa", value: "Adamawa" },
  { key: "akwa_ibom", value: "Akwa Ibom" },
  { key: "anambra", value: "Anambra" },
  { key: "bauchi", value: "Bauchi" },
  { key: "bayelsa", value: "Bayelsa" },
  { key: "benue", value: "Benue" },
  { key: "borno", value: "Borno" },
  { key: "cross_river", value: "Cross River" },
  { key: "delta", value: "Delta" },
  { key: "ebonyi", value: "Ebonyi" },
  { key: "edo", value: "Edo" },
  { key: "ekiti", value: "Ekiti" },
  { key: "enugu", value: "Enugu" },
  { key: "gombe", value: "Gombe" },
  { key: "imo", value: "Imo" },
  { key: "jigawa", value: "Jigawa" },
  { key: "kaduna", value: "Kaduna" },
  { key: "kano", value: "Kano" },
  { key: "katsina", value: "Katsina" },
  { key: "kebbi", value: "Kebbi" },
  { key: "kogi", value: "Kogi" },
  { key: "kwara", value: "Kwara" },
  { key: "lagos", value: "Lagos" },
  { key: "nasarawa", value: "Nasarawa" },
  { key: "niger", value: "Niger" },
  { key: "ogun", value: "Ogun" },
  { key: "ondo", value: "Ondo" },
  { key: "osun", value: "Osun" },
  { key: "oyo", value: "Oyo" },
  { key: "plateau", value: "Plateau" },
  { key: "rivers", value: "Rivers" },
  { key: "sokoto", value: "Sokoto" },
  { key: "taraba", value: "Taraba" },
  { key: "yobe", value: "Yobe" },
  { key: "zamfara", value: "Zamfara" },
  { key: "fct", value: "Federal Capital Territory" },
] as DropdownOptionsType[];

export const ErrorFilter = (
  error: AuthError,
  operation: "forgot-password" | "sign-in" = "sign-in"
) => {
  switch (true) {
    case error.code == "auth/invalid-email":
      return "Email is an invalid format. Please try another.";
    case error.code == "auth/user-disabled":
      return "Your account has been disabled and unable login.";
    case (error as unknown) == "Problem sign in" ||
      error.code == "auth/user-not-found":
      return operation == "sign-in"
        ? "User does not exists in our records. Please crosscheck your credentials."
        : "No registered user with this email.";
    case error.code == "auth/wrong-password" ||
      error.code == "auth/invalid-credential":
      return "The provided credentials are incorrect, Retry with a correct credential or reset your password.";
    case error.code == "auth/email-already-in-use":
      return "The email address is already in use. Please try another.";
    case (error as unknown) == "auth/operation-not-allowed" ||
      error.code == "auth/operation-not-allowed":
      return "Failed to sign in due to restriction. Pleast try again later or contact administrator.";
    case error.code == "auth/weak-password":
      return "Password is too weak to complete sign up. Try again with a stronger password.";
    default:
      return "Failed to complete operation. Pleast try again later, if issue persist, please contact administrator.";
  }
};

// shorten string text to some characters and add ...
export const shorten = (text: string, maxLines: number) => {
  if (text) {
    const lines = text?.split("\n");
    const maxTextLength = maxLines * 20; // Assuming an average line length of 40 characters
    let shortenedText = lines[0]; // Get the first line
    if (shortenedText.length > maxTextLength) {
      shortenedText = shortenedText.substring(0, maxTextLength) + "...";
    }
    return _.trim(shortenedText);
  }
  return "";
};

// firebase date converter to understandable momentjs date
export const fm = (date?: Timestamp) => {
  return date && new Date(date?.seconds * 1000);
};

// Function to generate a random string of specified length
export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return _.times(length, () =>
    characters.charAt(_.random(0, characters.length - 1))
  ).join("");
};

// Function to generate a random file name with a specific extension
export const generateRandomFileName = (length = 10) => {
  const randomString = generateRandomString(length);
  return `${randomString}`;
};

// Function to generate a slug
export const createSlug = (str: any) => {
  return _.chain(str)
    .deburr() // Remove accents and convert to basic Latin letters
    .toLower() // Convert to lowercase
    .trim() // Trim leading and trailing whitespace
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .value(); // Get the final string value
};

export const getFileExtension = (filename: string) => {
  const parts = _.split(filename, ".");
  return parts.length > 1 ? parts.pop() : "";
};

export const removeFileExtension = (filename: string) => {
  const parts = _.split(filename, ".");
  if (parts.length > 1) {
    parts.pop();
    return _.join(parts, ".");
  }
  return filename;
};

export const MIME_TYPE: MimeType = {
  "image/*": [
    ".avif",
    ".bmp",
    ".gif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".webp",
  ],
  "audio/*": [".aac", ".flac", ".mp3", ".ogg", ".wav"],
  "video/*": [".avi", ".mp4", ".mpeg", ".ogg", ".webm", ".mkv"],
  "document/*": [
    // '.csv',
    ".doc",
    ".docx",
    // '.html',
    ".pdf",
    ".ppt",
    ".pptx",
    ".txt",
    ".xls",
    ".xlsx",
    // ".plain",
    // ".txt"
  ],
};

const ELEMENT_TAGS: object = {
  A: (el: any) => ({ type: "link", url: el.getAttribute("href") }),
  BLOCKQUOTE: () => ({ type: "quote" }),
  H1: () => ({ type: "heading-one" }),
  H2: () => ({ type: "heading-two" }),
  H3: () => ({ type: "heading-three" }),
  H4: () => ({ type: "heading-four" }),
  H5: () => ({ type: "heading-five" }),
  H6: () => ({ type: "heading-six" }),
  IMG: (el: any) => ({ type: "image", url: el.getAttribute("src") }),
  LI: () => ({ type: "list-item" }),
  OL: () => ({ type: "numbered-list" }),
  P: () => ({ type: "paragraph" }),
  PRE: () => ({ type: "code" }),
  UL: () => ({ type: "bulleted-list" }),
};

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

// function to strip html tags css classes and everything else
export const stripHtml = (text?: string, replace_with: string = ""): string => {
  if (typeof text === "string") {
    const regex = /(<([^>]+)>)/gi;
    const result = (text || ("" as string)).replace(regex, replace_with);
    return (result as string).toString().trim();
  }
  return "";
};

// Function with working with Slate Rich TextEditor
export const __serialize = (Node: any) => {
  if (Text.isText(Node)) {
    let string = escapeHtml(Node.text);
    const node = Node as any;
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<i>${string}</i>`;
    }
    if (node.underline) {
      string = `<u>${string}</u>`;
    }
    if (node.code) {
      string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = Node?.children.map((n: any) => __serialize(n)).join("");
  let style: string = "";
  if (Node.align) {
    style = ` style='text-align: ${Node.align};'`;
  }
  switch (Node.type) {
    case "bold":
      return `<strong>${children}</strong>`;
    case "italic":
      return `<i>${children}</i>`;
    case "underline":
      return `<u>${children}</u>`;
    case "code":
      return `<code>${children}</code>`;
    case "heading-one":
      return `<h1${style}>${children}</h1>`;
    case "heading-two":
      return `<h2${style}>${children}</h2>`;
    case "block-quote":
      return `<blockquote${style}><p>${children}</p></blockquote>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "list-item":
      return `<li${style}>${children}</li>`;
    case "paragraph":
      return `<p${style}>${children}</p>`;
    case "link":
      let url: any = escapeHtml(stripHtml(Node.url));
      let children_url = escapeHtml(stripHtml(children));
      if (isUrl(children_url)) {
        url = children_url;
      }
      return `<a href="${url}">${children}</a>`;
    default:
      return children;
  }
};

export const slate_serialize = (node: any) => {
  if (node) {
    return _.join(
      node?.map((item: any) => __serialize(item)),
      ""
    );
  }
  return "";
};

export const deserialize = (el: any): any => {
  if (el?.nodeType === 3) {
    return el?.textContent;
  } else if (el?.nodeType !== 1) {
    return null;
  } else if (el?.nodeName === "BR") {
    return "\n";
  }

  const { nodeName } = el;
  let parent = el;

  if (
    nodeName === "PRE" &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === "CODE"
  ) {
    parent = el.childNodes[0];
  }
  let children = Array.from(parent.childNodes).map(deserialize).flat();

  if (children.length === 0) {
    children = [{ text: "" }];
  }

  if (el.nodeName === "BODY") {
    return jsx("fragment", {}, children);
  }

  if ((ELEMENT_TAGS as any)[nodeName]) {
    const attrs = (ELEMENT_TAGS as any)[nodeName](el);
    // attrs.align = "center";
    const alignment = el?.style?.textAlign;
    if (alignment) {
      attrs.align = alignment;
    }
    return jsx("element", attrs, children);
  }

  if ((TEXT_TAGS as any)[nodeName]) {
    const attrs = (TEXT_TAGS as any)[nodeName](el);
    return children.map((child) => jsx("text", attrs, child));
  }

  return children;
};

export const slate_deserialize = (html: any) => {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  const fragment = deserialize(parsed.body);
  return fragment;
};
