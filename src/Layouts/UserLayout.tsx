import MediaModal from "@/Components/MediaModal";
import Sidebar from "@/Components/Sidebar";
import { useAuthUser } from "@/Services/Hooks";
import { FC, useLayoutEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

interface AdminLayoutInterface {
  children: React.ReactNode;
}
const UserLayout: FC<AdminLayoutInterface> = ({ children }) => {
  // react state
  const { data: currentUser } = useAuthUser();
  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false);
  // react hooks function
  useLayoutEffect(() => {
    setShowLoadingBar(true);
  }, []);
  return (
    <>
      <div className="relative">
        {showLoadingBar && (
          <LoadingBar
            height={3}
            color="#fc6902"
            transitionTime={800}
            progress={100}
          />
        )}

        <>
          <Sidebar type="user" />
          <div className="px-2 py-6 space-y-4 sm:px-4 sm:ml-64">
            <div>
              {currentUser?.displayName && (
                <p className="text-lg text-gray-200 font-bold lg:text-xl">
                  Welcome, {currentUser?.displayName}
                </p>
              )}
            </div>
            <div>{children}</div>
          </div>
        </>
      </div>
      <MediaModal />
    </>
  );
};

export default UserLayout;
