import { Timestamp } from "firebase/firestore";

export interface AuthUserInterface {
  displayName?: any;
  email?: any;
  first_name?: any;
  last_name?: any;
  // role?: "admin" | "user" | "guest" | "admin";
  uid?: string;
  username?: any;
  isAnonymous?: boolean;
  emailVerified?: boolean;
  admin?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

type AuthUserType = AuthUserInterface | null;



type RemovePerson = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: "relationship" | "complicated" | "single";
  subRows?: RemovePerson[];
};