import { Config } from "@/System/Constants";
import classNames from "classnames";
import { Link } from "react-router-dom";
import Slider from "react-slick";

const Footer = ({
  type = "general",
}: {
  type: "user" | "general" | "admin";
}) => {
  return (
    <div
      className={classNames("space-y-2", {
        "px-3 md:px-10": type === "general",
      })}
    >
      <Slider
        {...{
          slidesToShow: 5,
          autoplay: true,
          autoplaySpeed: 900,
          infinite: true,
          arrows: false,
          dots: false,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ],
        }}
        className="quick-us px-5"
      >
        {[
          {
            icon: "fa-solid fa-headset",
            title: "24/7 Support",
            subtitle: "Support every time",
          },
          {
            icon: "fa-solid fa-credit-card",
            title: "Accept Payment",
            subtitle: "Verve, Bank Transfer",
          },
          {
            icon: "fa-solid fa-shield",
            title: "Secure Payment",
            subtitle: "100% Secured",
          },
          {
            icon: "fa-solid fa-truck",
            title: "Free Shipping",
            subtitle: "Across Nigeria",
          },
          {
            icon: "fa-solid fa-calendar",
            title: "30 days return",
            subtitle: "Get 30 days guarantee",
          },
        ].map((item, index) => (
          <div key={index}>
            <div className="w-full px-6 !flex flex-nowrap !flex-row items-center justify-center gap-4 group">
              <i
                className={classNames(
                  "fa-2x text-orange-500 group-hover:text-orange-700",
                  item.icon
                )}
              ></i>
              <div className="space-y-1">
                <p className="font-sans whitespace-nowrap text-xl leading-none font-semibold uppercase">
                  {item.title}
                </p>
                <p className="text-sm leading-5">{item.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div className={classNames("mt-8 py-6 md:py-3 shadow-lg")}>
        <div
          className={classNames(
            "py-4 grid grid-cols-1 items-stretch justify-center gap-x-2 gap-y-8 md:items-start md:grid-cols-4",
            {
              "px-4 md:px-5": type === "general",
            }
          )}
        >
          <img
            src="/assets/images/zenos.svg"
            alt="Zenos Logo"
            className="max-w-ful mx-auto max-w-56"
          />
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
                { text: "Home", link: "/" },
                { text: "Dashboard", link: "/user/shop" },
                { text: "My Orders", link: "/user/orders" },
                { text: "My Profile", link: "/user/profile" },
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
        <div className="flex flex-col items-center justify-center gap-2 mt-2 py-2 px-4 md:px-6">
          <hr className="my-4 w-full border-gray-500" />
          <p className="text-center text-base font-medium leading-none w-full md:text-left">
            Copyright&nbsp;&copy;{" "}
            <span className="text-zenos-600 font-semibold">Zenos</span>{" "}
            {new Date().getFullYear()}. All rights reserved.
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
    </div>
  );
};

export default Footer;
