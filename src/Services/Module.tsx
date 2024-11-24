import { AuthUserType } from "@/Types/Auth";
import React, { createContext } from "react";

interface AppContextInterface {
  user: AuthUserType;
}
const AppContext = createContext<AppContextInterface | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <AppContext.Provider value={null}>{children}</AppContext.Provider>;
};
