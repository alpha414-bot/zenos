// Sample React Component for Navbar

import { useCartProducts } from "@/Services/Hooks";
import { useAuthUser } from "@/Services/Hooks";
import { queryToVerifyAccount } from "@/Services/Queries/AuthQuery";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";
import OutsideClick from "./OutsideClick";

function Navbar() {
  const [showSideBarMenu, setShowSideBarMenu] = useState<boolean>(false);
  const { data: CartProducts } = useCartProducts() as { data: CartMetaItem[] };
  const { data: currentUser } = useAuthUser();
  return (
    // Example of using TailwindCSS in the Navbar Component
    <>
      {currentUser &&
        currentUser?.uid &&
        !currentUser?.isAnonymous &&
        !currentUser?.emailVerified && (
          <div className="bg-gray-900 px-6 py-3 relative z-50 text-center space-x-2">
            {(currentUser?.admin && (
              <>
                <span className="text-base font-medium">
                  You are currently logged in as an{" "}
                  <span className="underline underline-offset-4 decoration-dotted">
                    ADMINISTRATOR
                  </span>
                </span>
                <Link to={"/admin/dashboard"} className="btn px-4">
                  Go to Dashboard
                </Link>
              </>
            )) || (
              <>
                <span className="text-base font-medium">
                  Verify your account to unlock new exciting features
                </span>
                <Button
                  onClick={() => {
                    queryToVerifyAccount();
                  }}
                  className="px-4 py-0.5 text-sm"
                >
                  Verify Now
                </Button>
              </>
            )}
          </div>
        )}
      <nav className="sticky top-0 z-50 flex items-center justify-between bg-gray-950 shadow-md w-full shadow-gray-900/50 px-4 py-3.5 md:px-10 md:py-3">
        <Link to="/">
          <img
            src="/assets/images/zenos.svg"
            className="w-40"
            alt="Zenos Logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          <ul className="hidden md:inline-flex items-center space-x-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `tracking-wide ${
                    isActive
                      ? "underline underline-offset-4 decoration-dotted"
                      : ""
                  } hover:text-gray-500 font-medium`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `tracking-wide ${
                    isActive
                      ? "underline underline-offset-4 decoration-dotted"
                      : ""
                  } hover:text-gray-500 font-medium`
                }
              >
                About
              </NavLink>
            </li>
            {(currentUser?.uid && !currentUser.isAnonymous && (
              <li>
                <NavLink
                  to={!!currentUser.admin ? "/admin/dashboard" : "/user/carts"}
                  className={({ isActive }) =>
                    `tracking-wide ${
                      isActive
                        ? "underline underline-offset-4 decoration-dotted"
                        : ""
                    } hover:text-gray-500 font-medium`
                  }
                >
                  My account
                </NavLink>
              </li>
            )) || (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `tracking-wide ${
                      isActive
                        ? "underline underline-offset-4 decoration-dotted"
                        : ""
                    } hover:text-gray-500 font-medium`
                  }
                >
                  Sign In/Sign Up
                </NavLink>
              </li>
            )}
          </ul>
          <div className="flex items-center gap-x-1 md:gap-x-2">
            {/* Cart viewer */}
            <Link
              to={
                currentUser && currentUser.admin
                  ? "/admin/dashboard"
                  : "/user/carts"
              }
              className="relative inline-flex items-center px-1 py-1 rounded-full"
            >
              <svg
                className="w-8 h-8 md:w-8 md:h-8 text-zenos-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a1 1 0 0 1 1-1h1.5a1 1 0 0 1 .979.796L7.939 6H19a1 1 0 0 1 .979 1.204l-1.25 6a1 1 0 0 1-.979.796H9.605l.208 1H17a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L5.686 5H5a1 1 0 0 1-1-1Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="flex items-center justify-center w-6 h-6 p-1 ms-2 absolute -top-1 -right-1 text-sm font-bold text-white bg-zenos-600 rounded-full border-2 border-white">
                {CartProducts?.length}
              </span>
            </Link>
            {/* Mobile: Toggle side bar menu */}
            <button
              className="block md:hidden"
              onClick={() => setShowSideBarMenu(!showSideBarMenu)}
            >
              <svg
                className="w-9 h-9 text-zenos-700"
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
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
          </div>
        </div>
        <OutsideClick
          outsideClick={() => setShowSideBarMenu(false)}
          className={`fixed top-0 right-0 bg-gray-800/95 shadow-lg shadow-gray-700 bg-opacity-95 w-2/3 h-screen z-50 sm:w-2/5 md:hidden ${
            showSideBarMenu ? "block" : "hidden"
          }`}
        >
          <div className="flex items-center justify-end p-4">
            {/* Close Side bar Menu */}
            <button className="group" onClick={() => setShowSideBarMenu(false)}>
              <svg
                className="w-10 h-10 text-white group-hover:text-zenos-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <ul className="flex flex-col items-start gap-7 mt-4 px-8">
            <li>
              <Link
                to="/"
                className="underline underline-offset-4 tracking-wide decoration-dotted hover:text-gray-500 font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="underline underline-offset-4 tracking-wide decoration-dotted hover:text-gray-500 font-medium"
              >
                About
              </Link>
            </li>
            {(currentUser?.uid && !currentUser.isAnonymous && (
              <li>
                <Link
                  to={!!currentUser.admin ? "/admin/dashboard" : "/user/carts"}
                  className="underline underline-offset-4 tracking-wide decoration-dotted hover:text-gray-500 font-medium"
                >
                  My account
                </Link>
              </li>
            )) || (
              <li>
                <Link
                  to="/login"
                  className="underline underline-offset-4 tracking-wide decoration-dotted hover:text-gray-500 font-medium"
                >
                  Sign In/Sign Up
                </Link>
              </li>
            )}
          </ul>
        </OutsideClick>
      </nav>
    </>
  );
}

export default Navbar;
