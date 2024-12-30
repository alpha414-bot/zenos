import About from "@/Pages/About";
import AuthPage from "@/Pages/Auth/AuthPage";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import Checkout from "@/Pages/Checkout";
import ErrorPage from "@/Pages/ErrorPage";
import Home from "@/Pages/Home";
import AddProduct from "@/Pages/AddProduct";
import Inbox from "@/Pages/Inbox";
import Product from "@/Pages/Product";
import Carts from "@/Pages/Subpages/Carts";
import Orders from "@/Pages/Subpages/Orders";
import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import AdminRouter from "./AdminRouter";
import { ProtectedRoute, withScrollToTop } from "./utils";
import AdminProductsComponent from "@/Pages/Admin/Components/AdminProductsComponent";

const RootRouter: RouteObject[] = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // about
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // user <main pages>
  {
    path: "/user",
    element: (
      <ProtectedRoute middlewares={["auth"]}>
        <Outlet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // orders
      {
        path: "orders",
        element: <Orders />,
      },
      // carts
      {
        path: "carts",
        element: <Carts />,
      },
      {
        path: "products",
        element: <AddProduct/>,
      },
      // inbox
      {
        path: "inbox",
        element: <Inbox />,
      },
    ],
  },
  // login
  {
    path: "/auth",
    element: (
      <ProtectedRoute middlewares={["guest"]}>
        <AuthPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // register
  {
    path: "/register",
    element: (
      <ProtectedRoute middlewares={["guest"]}>
        <AuthPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // forgot password
  {
    path: "/forgot-password",
    element: (
      <ProtectedRoute middlewares={["guest"]}>
        <ForgotPassword />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // products
  {
    path: "/products/:product_id",
    element: (
      <ProtectedRoute>
        <Product />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // checkout
  {
    path: "/checkout",
    element: (
      <ProtectedRoute middlewares={["checkout"]}>
        <Checkout />
      </ProtectedRoute>
    ),
  },
];

const router = createBrowserRouter(
  withScrollToTop([...RootRouter, ...AdminRouter])
);
export default router;
