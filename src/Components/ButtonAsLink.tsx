import classNames from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";

interface ButtonAsLinkProps extends Omit<LinkProps, "className"> {
  text?: React.ReactNode;
  custom?: boolean;
  asNavLink?: boolean;
  // className?: string; // Keep this compatible with LinkProps
  // className?: ({ isActive }: { isActive: boolean }) => string; // New prop
  className?: string | ((props: { isActive: boolean }) => string | undefined);
}

const ButtonAsLink: React.FC<ButtonAsLinkProps> = ({
  text,
  children,
  className,
  custom,
  asNavLink = false,
  ...props
}) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState<boolean>(false);
  useEffect(() => {
    if (
      `${location.pathname}${location.hash}`.toLowerCase() ===
        props.to.toString().toLowerCase() &&
      asNavLink
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location, asNavLink, className]);
  const customClassName = useMemo(() => {
    if (typeof className == "function") {
      return className({ isActive: isActive });
    } else {
      return className;
    }
  }, [isActive, className]);
  return (
    <Link
      {...props}
      className={classNames(
        {
          "bg-zenos-700 hover:bg-zenos-800 hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600 inline-flex items-center px-6 py-1 text-lg font-medium text-center rounded-lg":
            !custom && !asNavLink,
        },
        customClassName
      )}
    >
      {text || children}
    </Link>
  );
};

export default ButtonAsLink;
