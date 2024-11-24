import { auth } from "@/firebase-config";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="mt-8 px-3 py-5 md:px-10 md:py-3">
      <div className="pt-9 pb-5 flex flex- items-stretch gap-4 md:px-5 md:gap-28 md:items-start md:flex-row">
        <Logo type="footer-logo" />
        <div>
          <p className="text-sm font-mono font-normal underline underline-offset-2 decoration-double md:decoration-dotted">
            Power Up Your Life: The Latest in Laptops, Gadgets, and Software
          </p>
          <div className="mt-5 flex flex-col gap-4 md:mt-12">
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

      <div className="mt-8">
        <Link
          target="_blank"
          to="https://app.imperial.learnchameleon.com/"
          className="inline-flex items-center justify-center gap-1 w-full"
        >
          <div>
            <span className="text-xs font-bold">Powered By</span>
          </div>
          <div
            className="bg-no-repeat bg-contain bg-center w-24 h-10 rounded-xl"
            style={{
              backgroundImage:
                "url('https://lh6.googleusercontent.com/4YxlDkJwbdpqJk7dW0YggqzmSoOWDm-E4_sGqwa18jVKfIzvv9IxTvtkXv9on3JQMV1JvPpvU5R1u5nYGBKwx-PKq_vPr04ada4GYNVet1rx5BWGdLb2Nca4pvWZwvp72A=w976')",
            }}
          ></div>
        </Link>
        <p className="text-center text-xs">
          <small>&copy;&nbsp;Copyright {new Date().getFullYear()}</small>
        </p>
      </div>
    </div>
  );
};

export default Footer;
