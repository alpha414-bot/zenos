import classNames from "classnames";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: React.ReactNode;
  custom?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  text,
  children,
  className,
  custom,
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled}
    className={classNames(
      {
        "bg-zenos-700 hover:bg-zenos-800 hover:border-gray-800 hover:ring-2 hover:outline-none hover:ring-zenos-600 inline-flex items-center px-6 py-1 text-lg font-medium text-center rounded-lg":
          !custom && !disabled,
        "bg-zenos-700 hover:bg-zenos-800": custom,
        "cursor-not-allowed bg-gray-400": disabled,
      },
      className
    )}
  >
    {text || children}
  </button>
);

export default Button;
