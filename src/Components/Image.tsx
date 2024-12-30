import classNames from "classnames";
import { FC } from "react";
import { Img, ImgProps } from "react-image";
import Spinner from "./Spinner";
import { useMediaFile } from "@/Services/Hooks";

interface ImagePropsInterface extends ImgProps {
  asDiv?: boolean;
  w?: string;
  type?: string;
}

const Image: FC<ImagePropsInterface> = ({
  src,
  className,
  asDiv = false,
  children,
  w,
  ...props
}) => {
  const { data: image, isLoading } = useMediaFile(src, w, "images");
  return (
    (isLoading && (
      <div
        className={classNames(
          `w-full min-w-56 h-[20rem] flex flex-col gap-5 items-center justify-center bg-ray-100/95`,
          className
        )}
      >
        <Spinner className="w-12 h-12" />
      </div>
    )) ||
    (asDiv && (
      <div
        className={className}
        {...props}
        style={{ backgroundImage: `url("${image}")` }}
      >
        {children}
      </div>
    )) || (
      <Img
        src={image}
        className={className}
        unloader={
          <>
            <Img src="/assets/images/zenosmainlogo.svg" className={className} />
          </>
        }
        {...props}
      />
    )
  );
};
export default Image;
