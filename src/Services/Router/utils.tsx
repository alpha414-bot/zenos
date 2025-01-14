import { useLayoutEffect } from "react";
import { RouteObject, useLocation, useNavigate } from "react-router-dom";
import { useAuthUser, useCartProducts } from "../Hooks";

// Creating a higher-order component to wrap the router with scroll-to-top functionality
export const withScrollToTop = (routerConfig: RouteObject[]) => {
  return routerConfig.map((route) => ({
    ...route,
    element: <ScrollToTop>{route.element}</ScrollToTop>,
  }));
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
    isFetched: isUserFetched,
  } = useAuthUser();
  const { data: carts, isLoading: cartIsLoading } = useCartProducts();

  const isLoading = isUserLoading || cartIsLoading;
  const isAuthenticated = currentUser?.uid && !currentUser?.isAnonymous;

  useLayoutEffect(() => {
    if (isLoading || !isUserFetched) return;

    // Handle various middlewares
    if (middlewares?.includes("admin") && (!currentUser?.admin || !isAuthenticated)) {
      return navigate("/admin/login", { replace: true });
    }

    if (middlewares?.includes("admin_guest") && currentUser?.admin && isAuthenticated) {
      return navigate("/admin/dashboard", { replace: true });
    }

    if (middlewares?.includes("auth") && !isAuthenticated) {
      return navigate("/auth", { replace: true });
    }

    if (middlewares?.includes("guest") && isAuthenticated) {
      return navigate("/", { replace: true });
    }
  }, [currentUser, carts, isLoading, isUserFetched, navigate, middlewares]);

  if (isLoading) {
    return <></>;
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
