// Route list for accounts, authentication and other related personal settings
import AddProducts from "@/Pages/Admin/AddProducts";
import ErrorPage from "@/Pages/ErrorPage";
import { Outlet, RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../utils";
import AdminLogin from "@/Pages/Admin/Auth/login";

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
        element: <p>This is my dashboard</p>,
      },
      {
        path: "add/products",
        element: <AddProducts />,
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
        path: "login",
        element: <AdminLogin />,
      },
    ],
  },
];

export default AdminRouter;
