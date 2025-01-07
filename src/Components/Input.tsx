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
  const [inputType, setInputType] = useState<any>(type);
  const input = ref ? ref : useRef<HTMLInputElement>(null);

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
              <div className="relative">
                <input
                  ref={input}
                  id={name}
                  disabled={disabled}
                  type={inputType}
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
                {type == "password" && (
                  <button
                    type="button"
                    className="absolute bg-red-500/5 top-0 bottom-0 right-0 px-2 rounded-lg"
                    onClick={() => {
                      if (inputType == "password") {
                        setInputType("text");
                      } else {
                        setInputType("password");
                      }
                    }}
                  >
                    {(inputType == "password" && (
                      <svg
                        className="w-7 h-7 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )) || (
                      <svg
                        className="w-7 h-7 dark:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
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
