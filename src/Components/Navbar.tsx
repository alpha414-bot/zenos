import { useAuthUser, useCartProducts } from "@/Services/Hooks";
import { queryToVerifyAccount } from "@/Services/Queries/AuthQuery";
import { Link, NavLink } from "react-router-dom";
import Button from "./Button";

function Navbar() {
  const { data: CartProducts } = useCartProducts() as { data: CartMetaItem[] };
  const { data: currentUser } = useAuthUser();
  return (
    <>
      {currentUser &&
        currentUser?.uid &&
        !currentUser?.isAnonymous &&
        !currentUser?.emailVerified && (
          <div className="mynavbar bg-gray-900 px-6 py-3 relative z-50 text-center space-x-2">
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
            className="w-32 md:w-40"
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
                  to={currentUser.admin ? "/admin/dashboard" : "/user/carts"}
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
                  to="/auth"
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
            {/* Search Icon */}
            <Link
              to="/products/"
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
                  d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm-10 8a10 10 0 1 1 20 0 10 10 0 0 1-20 0Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M15.93 15.93a1 1 0 0 1 1.414 0l4.95 4.95a1 1 0 0 1-1.414 1.414l-4.95-4.95a1 1 0 0 1 0-1.414Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
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
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;