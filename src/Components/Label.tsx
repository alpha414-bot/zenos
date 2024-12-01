import React from "react";

interface LabelProps extends React.InputHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string | undefined;
  value?: string;
  textClassName?: string;
  children?: React.ReactNode;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({
  value,
  className = "",
  textClassName = "",
  children,
  required = false,
  ...props
}) => {
  return (
    <label
      {...props}
      className={`block mb-1 text-s font-medium text-gray-900 dark:text-white ${className}`}
    >
      <span
        className={`p-0 m-0 underline underline-offset-4 decoration-dotted ${textClassName}`}
      >
        {value ? value : children}
      </span>
      {required && (
        <span className="text-red-500 font-medium dark:text-red-600 text-xs">
          {" "}
          (*)
        </span>
      )}
    </label>
  );
};
export default Label;
