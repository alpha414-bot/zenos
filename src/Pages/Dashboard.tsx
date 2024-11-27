import MainLayout from "@/Layouts/MainLayout";
import PageMeta from "@/Layouts/PageMeta";
import { useCartProducts } from "@/Services/Hook";
import { logoutUser } from "@/Services/Query";
import { auth } from "@/firebase-config";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { data: carts } = useCartProducts() as { data: CartMetaItem[] };
  const navigate = useNavigate();
  return (
    <MainLayout>
      <PageMeta
        title="User - Dashboard"
        description="User - View orders, profile and checkout"
      >
        <div className="px-4 py-10 md:py-20 md:px-8 lg:px-12">
          <div className="flex flex-col border boder-white px-3 py-5 rounded-lg justify-between gap-12 lg:flex-row">
            {/* Sidebar */}
            <div className="flex flex-col gap-4 md:py-5">
              {auth.currentUser?.displayName && (
                <p className="text-lg text-gray-200 font-bold px-3 lg:text-xl">
                  Welcome, {auth.currentUser?.displayName}
                </p>
              )}
              <NavLink
                to="/user/carts"
                className={({ isActive }) =>
                  `py-1.5 pl-5 pr-20 border-t border-x border-b-2 ${
                    isActive ? "bg-white bg-opacity-20" : "bg-transparent"
                  } border-gray-300 text-base font-medium whitespace-nowrap rounded-lg transition-all duration-150 ease-in-out hover:shadow-sm hover:shadow-gray-200 inline-flex gap-3`
                }
              >
                My Carts
                <span className="border border-white rounded px-1.5 bg-white text-zenos-700 text-sm font-bold text-center">
                  {carts?.length}
                </span>
              </NavLink>
              <NavLink
                to="/user/orders"
                className={({ isActive }) =>
                  `py-1.5 pl-5 pr-20 border-t border-x border-b-2 ${
                    isActive ? "bg-white bg-opacity-20" : "bg-transparent"
                  } border-gray-300 text-base font-medium whitespace-nowrap rounded-lg transition-all duration-150 ease-in-out hover:shadow-sm hover:shadow-gray-200 inline-flex gap-3`
                }
              >
                My Orders
              </NavLink>
              {auth.currentUser?.uid && !auth.currentUser.isAnonymous && (
                <div
                  className="mt-0 lg:mt-12"
                  onClick={() =>
                    logoutUser().then(() => {
                      navigate("/");
                    })
                  }
                >
                  <button className="flex items-center gap-2 border w-full py-1.5 px-2 rounded-lg">
                    <svg
                      className="w-4 h-4"
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
                        d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                      />
                    </svg>
                    Log out
                  </button>
                </div>
              )}
            </div>
            {/* Display */}
            <div className="grow h-auto border-t border-gray-500 py-8 md:px-4 lg:px-12 lg:py-0 lg:border-t-0 lg:border-l">
              <Outlet />
            </div>
          </div>
        </div>
      </PageMeta>
    </MainLayout>
  );
};

export default Dashboard;
