import Button from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";
import About from "@/Pages/About";
import AddProducts from "@/Pages/Admin/AddProducts";
import ForgotPassword from "@/Pages/Auth/ForgotPassword";
import AuthPage from "@/Pages/AuthPage";
import Checkout from "@/Pages/Checkout";
import Dashboard from "@/Pages/Dashboard";
import ErrorPage from "@/Pages/ErrorPage";
import Home from "@/Pages/Home";
import Product from "@/Pages/Product";
import Carts from "@/Pages/Subpages/Carts";
import Orders from "@/Pages/Subpages/Orders";
import { DummyData } from "@/System/function";
import { useLayoutEffect } from "react";
import {
  Navigate,
  RouteObject,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { useAuthUser, useCartProducts } from "./Hook";
import { addCollectionDoc } from "./Query";

// Creating a higher-order component to wrap the router with scroll-to-top functionality
const withScrollToTop = (routerConfig: RouteObject[]) => {
  return routerConfig.map((route) => {
    return {
      ...route,
      element: <ScrollToTop>{route.element}</ScrollToTop>,
    };
  });
};

// Implementing a middleware guard in your route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  middlewares,
}) => {
  const { data: currentUser, isLoading, isFetching } = useAuthUser();
  const {
    data: carts,
    isLoading: CartIsLoading,
    isFetching: CartIsFetching,
  } = useCartProducts();
  const PauseAuthorization =
    isLoading || isFetching || CartIsLoading || CartIsFetching;
  if (!PauseAuthorization) {
    if (middlewares && middlewares.includes("auth")) {
      if (!currentUser?.isAnonymous) {
        // current user is not anonymous
        if (!currentUser?.uid) {
          // user user is not permanently signed in
          return <Navigate to="/login" />;
        }
      }
    }
    if (middlewares && middlewares.includes("guest")) {
      if (currentUser?.uid && !currentUser.isAnonymous) {
        // user is authenticated and user is not anonymous
        return <Navigate to="/" />;
      }
    }
    if (middlewares && middlewares.includes("checkout")) {
      // check if the checkout contains data
      if (carts?.length == 0) {
        return <Navigate to="/" />;
      }
    }
  }

  return children;
};

// Define ScrollToTop component
const ScrollToTop = ({ children }: { children?: any }) => {
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

// all pages route
const routes: RouteObject[] = [
  // root
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
        <Dashboard />
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
    ],
  },
  // login
  {
    path: "/login",
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
  // admin
  {
    path: "add/products",
    element: (
      <ProtectedRoute>
        <AddProducts />
      </ProtectedRoute>
    ),
  },
  // help
  {
    path: "/help",
    element: (
      <MainLayout
        title="Help"
        description="Reach to us for help concerning our site"
      >
        <Button
          onClick={() =>
            addCollectionDoc("Products", DummyData).then((data) => {
              console.log("data is added", data);
            })
          }
        >
          Add product data
        </Button>
      </MainLayout>
    ),
  },
];

const router = createBrowserRouter(withScrollToTop(routes));
export default router;
