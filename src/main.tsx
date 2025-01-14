import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./Assets/index.css";
import Cookie from "./Components/Cookie";
import { QueryClient } from "./Services/Queries/QueryClient";
import router from "./Services/Router";
import { store } from "./Services/Store";

// localStorage.theme = /"dark";
// window._ = _;
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={QueryClient}>
        <Provider store={store}>
          <ToastContainer
            position="top-left"
            autoClose={6000}
            limit={3}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            className="!h-auto p-0 bg-transparent space-y-2"
            toastClassName="relative glass-back rotate-0 rounded-md m-0"
            closeButton={
              <>
                <svg
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
              </>
            }
            rtl={false}
            icon={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            transition={Slide}
          />
          <Cookie />
          <RouterProvider router={router} />
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
