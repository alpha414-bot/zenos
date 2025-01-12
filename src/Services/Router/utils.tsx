import { useLayoutEffect } from "react";
import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser, useCartProducts } from "../Hooks";

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
  const navigate = useNavigate();
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    isFetched: isUserFetched,
  } = useAuthUser();
  const {
    data: carts,
    isLoading: cartIsLoading,
    isFetching: cartIsFetching,
  } = useCartProducts();
  const PauseAuthorization =
    isUserLoading || isUserFetching || cartIsLoading || cartIsFetching;
  useLayoutEffect(() => {
    if (!PauseAuthorization && isUserFetched) {
      // middleware is for admin, currentuser needs to be authenticated and must be an administrator
      if (middlewares && middlewares.includes("admin")) {
        if (!currentUser?.uid || !currentUser.admin) {
          return navigate("/admin/login", {
            replace: true,
          });
        }
      }
      // middleware is for admin guest, currentUser needs to be authenticated
      if (middlewares && middlewares.includes("admin_guest")) {
        if (currentUser?.uid && currentUser.admin) {
          // user is authenticated, user is not anonymous and user is an administrator.
          return navigate("/admin/dashboard", { replace: true });
        }
      }
      // middle is for authenticated user, user must be not be anonymous and must be logged in
      if (middlewares && middlewares.includes("auth")) {
        if (!currentUser?.isAnonymous && !currentUser?.uid) {
          return navigate("/auth", { replace: true });
        }
      }
      // user is authenticated and user is not anonymous
      if (middlewares && middlewares.includes("guest")) {
        if (currentUser?.uid && !currentUser.isAnonymous) {
          return navigate("/", { replace: true });
        }
      }
      // before checkout can proceed, carts must have content
      if (middlewares && middlewares.includes("checkout")) {
        if (carts?.length == 0) {
          return navigate("/user/carts", { replace: true });
        }
      }
    }
  }, [currentUser, PauseAuthorization, navigate]);
  if (PauseAuthorization) {
    return <></>;
  }
  return children;
};

// Define ScrollToTop component
const ScrollToTop = ({ children }: { children?: any }) => {
  // useAuthUser();
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};
