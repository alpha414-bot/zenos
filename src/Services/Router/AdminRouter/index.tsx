// Route list for accounts, authentication and other related personal settings
import AdminInbox from "@/Pages/Admin/AdminInbox";
import AdminDashoard from "@/Pages/Admin/Dashboard";
import AdminLogin from "@/Pages/Admin/Login";
import ErrorPage from "@/Pages/ErrorPage";
import { queryToRegisterUser } from "@/Services/Queries/AuthQuery";
import { Button } from "flowbite-react";
import { Navigate, Outlet, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../utils";

const AdminRouter: RouteObject[] = [
  // admin authenticated routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute middlewares={["admin"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashoard />,
      },
      {
        path: "inbox",
        element: <AdminInbox />,
      },
    ],
  },
  // admin unauthenticated routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute middlewares={["admin_guest"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Navigate to={"/admin/dashboard"} />,
      },
      {
        path: "login",
        element: <AdminLogin />,
      },
      {
        path: "setup",
        element: (
          <>
            <div className="w-full h-screen justify-center items-center flex gap-3 flex-col">
              <h2 className="text-4xl">Setup Administrator</h2>
              <Button
                type="button"
                onClick={() => {
                  queryToRegisterUser(
                    {
                      email: "admin@gmail.com",
                      first_name: "Admin",
                      last_name: "Admin",
                      password: "password",
                      phone: "8149651464",
                      username: "@admin",
                    },
                    true
                  );
                }}
              >
                Setup Administrator
              </Button>
            </div>
          </>
        ),
      },
    ],
  },
];

export default AdminRouter;
