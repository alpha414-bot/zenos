import About from "@/Pages/About";
import AuthPage from "@/Pages/Auth/AuthPage";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import ErrorPage from "@/Pages/ErrorPage";
import Home from "@/Pages/Home";
import Inbox from "@/Pages/Inbox";
import ProductDetails from "@/Pages/ProductDetails";
import Products from "@/Pages/Products";
import Shop from "@/Pages/Shop";
import Carts from "@/Pages/Subpages/Carts";
import FAQPage from "@/Pages/Faq";
import ReturnPolicyPage from "@/Pages/ReturnPolicy";
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
  {
    path: "/legal/return-policy",
    element: (
      <ProtectedRoute>
        <ReturnPolicyPage />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/faq",
    element: (
      <ProtectedRoute>
        <FAQPage />
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
  // Product routes
  {
    path: "/products",
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // // New display category routes
  // {
  //   path: "/products/phone-accessories/:subcategory?",
  //   element: (
  //     <ProtectedRoute>
  //       <Products />
  //     </ProtectedRoute>
  //   ),
  //   errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/products/used-products",
  //   element: (
  //     <ProtectedRoute>
  //       <Products />
  //     </ProtectedRoute>
  //   ),
  //   errorElement: <ErrorPage />,
  // },
  // Legacy category routes (for backward compatibility)
  {
    path: "/products/:type?/:category?/:subcategory?",
    element: (
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  // Single product details
  {
    path: "/product/:product_id",
    element: (
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
];

const router = createBrowserRouter(
  withScrollToTop([...RootRouter, ...AdminRouter])
);

export default router;