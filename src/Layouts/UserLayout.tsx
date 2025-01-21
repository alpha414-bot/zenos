import Footer from "@/Components/Footer";
import MediaModal from "@/Components/MediaModal";
import MobileFooterBar from "@/Components/MobileFooterBar";
import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";
import { useAuthUser } from "@/Services/Hooks";
import classNames from "classnames";
import { FC, useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

interface AdminLayoutInterface {
  children: React.ReactNode;
}
const UserLayout: FC<AdminLayoutInterface> = ({ children }) => {
  // react state
  const location = useLocation();
  const { data: currentUser } = useAuthUser();
  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false);
  const [chatStateEnable, setChatStateEnable] = useState<boolean>(false);
  // react hooks function
  useLayoutEffect(() => {
    setShowLoadingBar(true);
  }, []);
  useEffect(() => {
    setChatStateEnable(location.pathname.split("/").includes("inbox"));
  }, [location]);
  return (
    <>
      <div className="h-screen overflow-hidden md:h-auto md:overflow-auto">
        {/* <div className="grid grid-rows-[minmax(10vh,90vh)_auto] min-h-screen items-start !p-0 !m-0 bg-gray-900 md:block"> */}
        <div className="h-full md:h-full">
          <div
            className={classNames("relative", {
              "overflow-hidden h-full bg-gray-900": chatStateEnable,
              "overflow-y-auto h-full scroll-mobile md:h-auto md:overflow-auto":
                !chatStateEnable,
            })}
          >
            {showLoadingBar && (
              <LoadingBar
                height={3}
                color="#fc6902"
                transitionTime={800}
                progress={100}
              />
            )}
            {!chatStateEnable && (
              <div className={classNames("w-full block md:hidden")}>
                <Navbar />
              </div>
            )}
            {true && <Sidebar type="user" />}
            <div
              className={classNames({
                "sm:ml-64": true,
                "px-0 py-0 sm:px-0 space-y-0 h-[90vh] overflow-hidden bg-red-500":
                  chatStateEnable, // if in chat component
                "px-2 py-6 sm:px-4 space-y-4": !chatStateEnable, // if not in chat component
              })}
            >
              {!currentUser?.isAnonymous && (
                <div
                  className={classNames("bg-gray-700 rounded-xl shadow", {
                    "hidden px-0 py-0": chatStateEnable, // if in chat component
                    "block px-4 py-2": !chatStateEnable, // if not in chat component
                  })}
                >
                  {currentUser?.displayName && (
                    <p className="text-lg text-gray-200 font-bold">
                      Hey,&nbsp;
                      <span className="underline underline-offset-4 decoration-dotted">
                        {currentUser?.displayName}
                      </span>
                    </p>
                  )}
                </div>
              )}
              <div className="px-0 pb-0 md:pb-0 h-full">
                <div
                  className={classNames({
                    "px-0 h-full md:h-screen": chatStateEnable,
                    "px-2 min-h-[30vh] mb-12": !chatStateEnable,
                  })}
                >
                  {children}
                </div>
                {!chatStateEnable && <Footer type="user" />}
              </div>
            </div>
          </div>
          <MobileFooterBar />
        </div>
      </div>
      <MediaModal />
    </>
  );
};

export default UserLayout;
