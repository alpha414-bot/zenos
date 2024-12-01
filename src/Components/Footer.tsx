import { auth } from "@/firebase-config";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-8 px-3 py-5 md:px-10 md:py-3">
      <div className="pt-5 pb-2 flex flex-col items-center justify-center gap-2 md:px-5 md:flex-col">
        <div>
          <img src="/assets/images/zenos.svg" alt="" className="max-w-56" />
        </div>
        <div>
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
            <NavLink to="/about" className="text-base font-medium">
              Home
            </NavLink>
            <NavLink to="/about" className="text-base font-medium">
              About
            </NavLink>
            {(auth.currentUser?.uid && !auth.currentUser.isAnonymous && (
              <NavLink to="/user/carts" className="text-base font-medium">
                Account
              </NavLink>
            )) || (
              <>
                <NavLink to="/login" className="text-base font-medium">
                  Login
                </NavLink>
                <NavLink to="/register" className="text-base font-medium">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <Link
          target="_blank"
          to="https://bumiaagency.com/"
          className="inline-flex items-center justify-center py-2 gap-1 w-auto"
        >
          <div>
            <span className="text-xs font-bold">Powered By</span>
          </div>
          <img src="/assets/images/bumialogo.svg" alt="Bumia Agency Logo" className="w-8" />
        </Link>
        <p className="text-center text-xs">
          <small>&copy;&nbsp;Copyright {new Date().getFullYear()}</small>
        </p>
      </div>
    </div>
  );
};

export default Footer;
