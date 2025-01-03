import MediaModal from "@/Components/MediaModal";
import Sidebar from "@/Components/Sidebar";
import classNames from "classnames";
import { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

interface AdminLayoutInterface {
  children: React.ReactNode;
}
const AdminLayout: FC<AdminLayoutInterface> = ({ children }) => {
  // react state
  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false);
  const [chatStateEnable, setChatStateEnable] = useState<boolean>(false);
  // react hooks function
  useLayoutEffect(() => {
    setShowLoadingBar(true);
  }, []);
  const location = useLocation();
  const lastHash = useRef("");

  // listen to location change using useEffect with location as dependency
  // https://jasonwatmore.com/react-router-v6-listen-to-location-route-change-without-history-listen
  useEffect(() => {
    setChatStateEnable(location.pathname.split("/").includes("inbox"));
    if (location.hash) {
      lastHash.current = location.hash.slice(1); // safe hash for further use after navigation
    }

    if (lastHash.current && document.getElementById(lastHash.current)) {
      setTimeout(() => {
        document
          .getElementById(lastHash.current)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
        lastHash.current = "";
      }, 100);
    }
  }, [location]);
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
          <Sidebar type="admin" />
          <div
            className={classNames("sm:ml-64", {
              "px-2 sm:px-4": !chatStateEnable,
              "px-0 h-screen": chatStateEnable,
            })}
          >
            {!chatStateEnable && (
              <div className="py-4 px-2 flex items-center justify-end">
                <Link
                  to={"/"}
                  className="text-zenos-600 px-2 py-2 hover:bg-zenos-600 hover:text-white rounded-lg transition-all duration-300 ease-in-out"
                >
                  <i className="fa-lg fa-solid fa-globe"></i>
                </Link>
              </div>
            )}
            {children}
          </div>
        </>
      </div>
      <MediaModal />
    </>
  );
};

export default AdminLayout;
