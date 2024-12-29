import { Config } from "@/System/Constants";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-8 px-3 py-6 md:px-10 md:py-3 shadow-lg">
      <div className="py-4 px-4 grid grid-cols-1 items-stretch justify-center gap-x-2 gap-y-8 md:px-5 md:items-start md:grid-cols-4">
        <img src="/assets/images/zenos.svg" alt="Zenos Logo" className="max-w-ful mx-auto max-w-56" />
        <div className="space-y-3">
          <h6 className="text-2xl font-semibold text-gray-400">Contact Us</h6>
          <div className="space-y-2 flex flex-col text-white">
            <a
              href={`tel:${Config.phone}`}
              className="hover:text-zenos-600 text-sm space-x-2"
            >
              <i className="fa-solid fa-phone text-zenos-600"></i>
              <span>{Config.phone}</span>
            </a>
            <a
              href={`mailto:${Config.email}`}
              className="hover:text-zenos-600 text-sm space-x-2"
            >
              <i className="fa-solid fa-envelope text-zenos-600"></i>
              <span>{Config.email}</span>
            </a>
            <a
              href={`//map.google.com`}
              className="hover:text-zenos-600 text-sm space-x-2"
            >
              <i className="fa-solid fa-map text-zenos-600"></i>
              <span>{Config.address}</span>
            </a>
          </div>
        </div>
        <div className="space-y-3">
          <h6 className="text-2xl font-semibold text-gray-400">My Account</h6>
          <div className="space-y-2 flex flex-col text-white">
            {[
              { text: "Dashboard", link: "/user/" },
              { text: "My Orders", link: "/user/my_orders" },
              { text: "My Reviews", link: "/user/my_reviews" },
              { text: "My Profile", link: "/user/my_profile" },
            ].map((item, index) => (
              <a
                key={index}
                href={`${item.link}`}
                className="hover:text-zenos-600 text-base space-x-2"
              >
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h6 className="text-2xl font-semibold text-gray-400">Services</h6>
          <div className="space-y-2 flex flex-col text-white">
            {[
              { text: "Return Policy", link: "/legal/return-policy" },
              { text: "FAQ", link: "/faq" },
              { text: "Privacy Policy", link: "/legal/privacy-policy" },
              {
                text: "Terms & Conditions",
                link: "/legal/terms-and-conditions",
              },
            ].map((item, index) => (
              <a
                key={index}
                href={`${item.link}`}
                className="hover:text-zenos-600 space-x-2"
              >
                <span>{item.text}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-gray-500" />
      <div className="flex flex-col items-center justify-center gap-2 mt-2 py-2">
        <p className="text-center text-base font-medium leading-none w-full md:text-left">
          Copyright&nbsp;&copy; <span className="text-zenos-600 font-semibold">Zenos</span> {new Date().getFullYear()}. All rights reserved.
        </p>
        <Link
          target="_blank"
          to="https://bumiaagency.com/"
          className="inline-flex items-center justify-center gap-1 w-auto"
        >
          <div>
            <span className="text-sm font-bold">Powered By</span>
          </div>
          <img
            src="/assets/images/bumialogo.svg"
            alt="Bumia Agency Logo"
            className="w-10"
          />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
