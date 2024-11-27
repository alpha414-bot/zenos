import classNames from "classnames";
import {
  ToastOptions,
  ToastProps,
} from "node_modules/react-toastify/dist/types";
import { toast } from "react-toastify";
import { ToastWrapperProps } from "./Types/Toast";

export const ToastWrapper = ({
  title,
  text,
  toastProps,
}: ToastWrapperProps) => {
  return (
    <div>
      {/* <p className="text-lg font-extrabold ">{title}</p> */}
      <p
        className={classNames(
          "text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r",
          {
            "from-green-500 via-green-400 to-green-50":
              toastProps?.type == "success",
            "from-red-500 via-red-400 to-red-50": toastProps?.type == "error",
          }
        )}
      >
        {title}
      </p>
      <p
        className={classNames(
          "text-base font-normal bg-clip-text text-transparent bg-gradient-to-r",
          {
            "from-green-500 via-green-400 to-green-50 decoration-white":
              toastProps?.type == "success",
            "from-red-500 via-red-400 to-red-50 decoration-white": toastProps?.type == "error",
          }
        )}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
};

const notify = (myProps: ToastWrapperProps, toastProps?: ToastProps) =>
  toast(<ToastWrapper {...myProps} />, { ...toastProps });

notify.success = (myProps: ToastWrapperProps, toastProps?: ToastProps) =>
  toast.success(<ToastWrapper {...myProps} />, {
    ...toastProps,
    progressClassName(context) {
      return classNames("bg-green-500", context?.defaultClassName);
    },
  });

notify.error = (
  { title, ...myProps }: ToastWrapperProps,
  toastProps?: ToastOptions
) =>
  toast.error(<ToastWrapper title={title || "Error"} {...myProps} />, {
    ...toastProps,
    progressClassName(context) {
      return classNames("bg-red-500", context?.defaultClassName);
    },
  });

export { notify };
