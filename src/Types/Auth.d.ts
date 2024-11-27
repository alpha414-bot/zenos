import { User } from "firebase/auth";

interface AuthUserInterface extends User {
  displayName?: any;
  email?: any;
  first_name?: any;
  last_name?: any;
  role?: "admin" | "user" | "guest" | "admin";
  uid?: any;
  username?: any;
}

type AuthUserType = AuthUserInterface | null;
