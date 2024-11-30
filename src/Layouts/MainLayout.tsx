import Footer from "@/Components/Footer";
import MediaModal from "@/Components/MediaModal";
import Navbar from "@/Components/Navbar";
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
      {showLoadingBar && (
        <LoadingBar
          height={3}
          color="#fc6902"
          transitionTime={800}
          progress={100}
        />
      )}
      <div>
        {/* <div className="inline-flex flex-col justify-between w-full min-h-screen "> */}
        {!no_navbar && <Navbar />}
        <div id="page" className="relative z-40">
          <div id="wrapper">{children}</div>
        </div>
        {!no_footer && <Footer />}
        <MediaModal />
      </div>
    </>
  );
};

export default MainLayout;
