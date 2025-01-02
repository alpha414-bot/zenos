import MediaModal from "@/Components/MediaModal";
import MobileFooterBar from "@/Components/MobileFooterBar";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import { useAuthUser } from "@/Services/Hooks";
import classNames from "classnames";
import { FC, useLayoutEffect, useMemo, useState } from "react";
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
  const ifSignedIn = useMemo(
    () => currentUser?.uid && !currentUser?.isAnonymous,
    [currentUser]
  );
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
          <div
            className={classNames("w-full block", {
              "md:hidden": ifSignedIn, // only hide if fixed user is signed in
            })}
          >
            <Navbar />
          </div>
          {ifSignedIn && <Sidebar type="user" />}
          <div
            className={classNames("px-2 py-6 space-y-4 sm:px-4", {
              "sm:ml-64": ifSignedIn,
            })}
          >
            <div className="bg-gray-700">
              {currentUser?.displayName && (
                <p className="text-lg text-gray-200 font-bold lg:text-xl">
                  Welcome, {currentUser?.displayName}
                </p>
              )}
            </div>
            <div className="px-0 pb-24 md:pb-0">{children}</div>
          </div>
        </>
      </div>
      <MobileFooterBar />
      <MediaModal />
    </>
  );
};

export default UserLayout;
