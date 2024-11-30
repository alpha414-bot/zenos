import { Timestamp } from "firebase/firestore";

interface AuthUserInterface {
  displayName?: any;
  email?: any;
  first_name?: any;
  last_name?: any;
  // role?: "admin" | "user" | "guest" | "admin";
  uid?: any;
  username?: any;
  isAnonymous?: boolean;
  emailVerified?: boolean;
  admin?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type AuthUserType = AuthUserInterface | null;
