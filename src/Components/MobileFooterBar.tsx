import { useAuthUser } from "@/Services/Hooks";
import { queryToLogout } from "@/Services/Queries/AuthQuery";
import classNames from "classnames";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

interface LinkItemInterface {
  icon: string;
  text: string;
  link: string;
  notvisible?: boolean;
  onClick?: () => void;
}

const MobileFooterBar = () => {
  const { data: currentUser } = useAuthUser();
  const LinkItem: LinkItemInterface[] = useMemo(() => {
    const ifSignedIn = !!(currentUser?.uid && !currentUser?.isAnonymous);
    const ifSignedOut = !(currentUser?.uid && !currentUser?.isAnonymous);

    return [
      {
        icon: "fa-solid fa-home",
        text: "Home",
        link: "/",
        notvisible: ifSignedIn,
      },
      {
        icon: "fa-solid fa-shop",
        text: "Shop",
        link: "/user/shop",
        notvisible: ifSignedOut,
      },
      {
        icon: "fa-solid fa-inbox",
        text: "Inbox",
        link: "/user/inbox",
        notvisible: ifSignedOut,
      },
      {
        icon: "fa-solid fa-shopping-cart",
        text: "Cart",
        link: "/user/carts",
      },
      {
        icon: "fa-solid fa-credit-card",
        text: "Orders",
        link: "/user/orders",
        notvisible: ifSignedOut,
      },
      {
        icon: "fa-solid fa-circle-user",
        text: "Account",
        link: "/auth",
        notvisible: ifSignedIn,
      },
      {
        icon: "fa-solid fa-arrow-right-from-bracket",
        text: "Logout",
        link: "/user/logout",
        notvisible: ifSignedOut,
        onClick: () => {
          queryToLogout();
        },
      },
    ];
  }, [currentUser]);
  const VisibleFilteredLink = useMemo(
    () => _.filter(LinkItem, (item) => !item.notvisible),
    [LinkItem]
  );
  return (
    <div
      className={classNames(
        " z-50 -bottom-2 left-0 right-0 pt-4 pb-7 px-4 bg-gray-900 w-full gap-x-0.5 rounded-t-2xl grid items-center md:hidden",
        {
          "grid-cols-5": VisibleFilteredLink.length === 5,
          "grid-cols-4": VisibleFilteredLink.length === 4,
          "grid-cols-3": VisibleFilteredLink.length === 3,
        }
      )}
    >
      {LinkItem.map((item, i) => {
        if (!item.notvisible) {
          return <NavLinkChild key={i} item={item} />;
        }
      })}
    </div>
  );
};

const NavLinkChild = ({
  item,
}: {
  item: { link: string; icon: string; text: string; onClick?: () => void };
}) => {
  const [isNavActive, setNavIsActive] = useState<boolean>(false);
  return (
    <NavLink
      to={item.link}
      onClick={(e) => {
        if (item.onClick) {
          e.preventDefault();
          item.onClick();
        }
      }}
      className={({ isActive }) => {
        useEffect(() => {
          setNavIsActive(isActive);
        }, [isActive]);
        return classNames(
          "h-full w-full flex flex-col items-center justify-center gap-y-1",
          {
            "text-zenos-600": isActive,
          }
        );
      }}
    >
      <i
        className={classNames("inline leading-none", item.icon, {
          "fa-xl": !isNavActive,
          "fa-2xl": isNavActive,
        })}
      ></i>
      {!isNavActive && (
        <p className="text-sm uppercase font-medium">{item.text}</p>
      )}
    </NavLink>
  );
};

export default MobileFooterBar;
