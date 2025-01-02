import { useCartProducts } from "@/Services/Hooks";
import { queryToLogout } from "@/Services/Queries/AuthQuery";
import classNames from "classnames";
import { FC } from "react";
import { Link } from "react-router-dom";
import ButtonAsLink from "./ButtonAsLink";

interface SidebarBarInterface {
  type: "user" | "admin";
}

const Sidebar: FC<SidebarBarInterface> = ({ type }) => {
  const { data: carts } = useCartProducts() as { data: CartMetaItem[] };

  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900">
          <Link
            to={type == "admin" ? "/admin/dashboard" : "/"}
            className="block py-2"
          >
            <img
              src="/assets/images/zenos.svg"
              alt="Zenos Ecommerce Logo"
              className="w-32 mx-auto"
            />
          </Link>
          <ul className="space-y-2 font-medium py-5">
            {type == "admin" && (
              <>
                <li>
                  <ButtonAsLink
                    to="/admin/dashboard#AdminDashboardSection"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <span className="ms-3">Dashboard</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/admin/dashboard#AdminEcommerceSection"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 21"
                    >
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    <span className="ms-3">Ecommerce</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/admin/inbox"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium rounded-full bg-zenos-900 text-zenos-300">
                      3
                    </span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/admin/dashboard#AdminUsersSection"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/admin/dashboard#AdminProductsSection"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 transition duration-75"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                    </svg>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Products
                    </span>
                  </ButtonAsLink>
                </li>
              </>
            )}
            {type == "user" && (
              <>
                <li>
                  <ButtonAsLink
                    to="/"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-home"></i>
                    <span className="ms-3">Home</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/user/carts"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-shopping-cart"></i>
                    <span className="ms-3">Carts</span>
                    <span className="ms-2 border border-white rounded px-1.5 bg-white text-zenos-700 text-sm font-bold text-center">
                      {carts?.length}
                    </span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/user/products"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-shop"></i>
                    <span className="ms-3">Shop</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/user/orders"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-credit-card"></i>
                    <span className="ms-3">My Orders</span>
                  </ButtonAsLink>
                </li>
                <li>
                  <ButtonAsLink
                    to="/user/inbox"
                    custom
                    asNavLink
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 group",
                        {
                          "text-zenos-600 bg-gray-700": !!isActive,
                          "text-white": !isActive,
                        }
                      )
                    }
                  >
                    <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-inbox"></i>
                    <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium rounded-full bg-zenos-900 text-zenos-300">
                      3
                    </span>
                  </ButtonAsLink>
                </li>
              </>
            )}
            <li>
              <ButtonAsLink
                to="#logout"
                custom
                onClick={(e) => {
                  e.preventDefault();
                  return queryToLogout();
                }}
                className="flex items-center px-4 py-2 rounded-lg text-white hover:bg-gray-700 group"
              >
                <i className="flex-shrink-0 transition duration-75 fa-lg fa-solid fa-arrow-right-from-bracket"></i>
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </ButtonAsLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
