import About from "@/Pages/About";
import AuthPage from "@/Pages/Auth/AuthPage";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import Checkout from "@/Pages/Checkout";
import ErrorPage from "@/Pages/ErrorPage";
import Home from "@/Pages/Home";
import Inbox from "@/Pages/Inbox";
import ProductDetails from "@/Pages/ProductDetails";
import Products from "@/Pages/Products";
import Shop from "@/Pages/Shop";
import Carts from "@/Pages/Subpages/Carts";
import Orders from "@/Pages/Subpages/Orders";
import {
  Navigate,
  Outlet,
  RouteObject,
  createBrowserRouter,
} from "react-router-dom";
import AdminRouter from "./AdminRouter";
import { ProtectedRoute, withScrollToTop } from "./utils";

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
      {
        path: "",
        element: <Navigate to={"/user/carts"} />,
      },
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
        path: "shop",
        element: <Shop />,
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
  // all products and filtering
  {
    path: "/products/:category?/:subcategory?",
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // products
  {
    path: "/product/:product_id",
    element: (
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // checkout
  {
    path: "/checkout",
    element: (
      <ProtectedRoute middlewares={["auth"]}>
        <Checkout />
      </ProtectedRoute>
    ),
  },
];

const router = createBrowserRouter(
  withScrollToTop([...RootRouter, ...AdminRouter])
);
export default router;
