import classNames from "classnames";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  className?: string;
  label?: string;
  isFocused?: boolean;
  control: Control;
  rules?: RegisterOptions;
  updateOnChange?: any;
}

const Input = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  {
    type = "text",
    className = "",
    label,
    isFocused = false,
    control,
    name,
    rules,
    defaultValue,
    updateOnChange = (data: any) => data,
    disabled,
    ...props
  },
  ref: any
) {
  const [focus, setFocus] = useState<boolean>(false);
  const input = !!ref ? ref : useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && input?.current) {
      input?.current.focus();
    }
    if (defaultValue) {
      setFocus(true);
    }
  }, []);

  return (
    <div className="relative w-full">
      {/* Instead of using {...register}. Try to make use of Controller, that would give us upper hand over the onChange, and onBlur */}
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({
          field: { value, onChange, onBlur },
          fieldState: { error },
        }) => {
          const InputValue = value ? value.toString().trim() : value;
          const handleFocus = () => {
            setFocus(true);
          };
          const handleBlur = () => {
            if (!InputValue) {
              setFocus(false);
              return onBlur();
            }
          };
          return (
            <>
              <input
                ref={input}
                id={name}
                disabled={disabled}
                type={type}
                className={classNames(
                  "px-4 pr-10 mb-0.5 border border-gray-700 text-white text-base rounded-lg focus:ring-zenos-500 focus:border-zenos-500 block w-full placeholder:text-gray-400",
                  {
                    "pt-4 pb-1": !!InputValue && label,
                    "py-2": !InputValue || !label,
                    "focus:pt-3 focus:pb-1": !!label,
                    "focus:py-2": !label,
                    "bg-gray-600 cursor-not-allowed": !!disabled,
                    "bg-gray-700": !disabled,
                  },
                  className
                )}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={updateOnChange(onChange)}
                defaultValue={defaultValue}
                {...props}
              />
              {error && (
                <span
                  className="block mt-0.5 mb-2.5 text-sm tracking-wider font-medium underline underline-offset-4 decoration-dotted text-red-500"
                  dangerouslySetInnerHTML={{
                    __html: error.message || "Error encountered with the input",
                  }}
                ></span>
              )}
            </>
          );
        }}
      />
      {label && (
        <label
          htmlFor={name}
          className={classNames(
            "absolute mb-0 text-white bg-gray-700 pl-4 pr-6 py-0.5 rounded-md origin-left transform scale-75 -top-4 left-1.5 transition-all duration-400 text-lg font-semibold shadow shadow-gray-500",
            {
              "opacity-100 -top-4": focus,
              "top-8 opacity-0": !focus,
            }
          )}
        >
          {label} {rules?.required ? "(*)" : ""}
        </label>
      )}
    </div>
  );
});

export default Input;
