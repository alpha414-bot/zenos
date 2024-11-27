import { useLayoutEffect } from "react";
import { Navigate, RouteObject, useLocation } from "react-router-dom";
import { useAuthUser, useCartProducts } from "../Hook";

// Creating a higher-order component to wrap the router with scroll-to-top functionality
export const withScrollToTop = (routerConfig: RouteObject[]) => {
  return routerConfig.map((route) => {
    return {
      ...route,
      element: <ScrollToTop>{route.element}</ScrollToTop>,
    };
  });
};

// Implementing a middleware guard in your route component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
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
    if (middlewares && middlewares.includes("admin")) {
      if (!currentUser?.uid || !(currentUser.role == "admin")) {
        return <Navigate to="/admin/login" />;
      }
    }
    if (middlewares && middlewares.includes("admin_guest")) {
      if (
        currentUser?.uid &&
        !currentUser.isAnonymous &&
        currentUser.role == "admin"
      ) {
        // user is authenticated, user is not anonymous and user is an administrator.
        return <Navigate to="/admin/dashboard" />;
      }
    }
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
