import Footer from "@/Components/Footer";
import MediaModal from "@/Components/MediaModal";
import MobileFooterBar from "@/Components/MobileFooterBar";
import Navbar from "@/Components/Navbar";
import classNames from "classnames";
import React, { useLayoutEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";

const MainLayout: React.FC<{
  children: React.ReactNode;
  no_navbar?: boolean;
  no_footer?: boolean;
}> = ({ children, no_navbar, no_footer }) => {
  const [showLoadingBar, setShowLoadingBar] = useState<boolean>(false);
  useLayoutEffect(() => {
    setShowLoadingBar(true);
  }, []);
  return (
    <>
      <div className="h-screen md:h-full">
        <div className="relative grid grid-rows-[minmax(10vh,90vh)_auto] items-start !p-0 !m-0 bg-gry-900 md:block">
          <div
            className={classNames("", {
              "overflow-y-auto h-full scroll-mobile md:h-auto md:overflow-clip":
                true,
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

            <div>
              {!no_navbar && <Navbar />}
              <div
                id="page"
                className={classNames({
                  "px-0 py-2 space-y-4": true, // if not in chat component
                })}
              >
                <div id="wrapper">{children}</div>
              </div>
              {!no_footer && <Footer type="user" />}
            </div>
          </div>
          <MobileFooterBar />
        </div>
      </div>
      <MediaModal />
    </>
  );
};

export default MainLayout;
