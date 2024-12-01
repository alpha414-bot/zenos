import { useMediaFile } from "@/Services/Hook";
import { FC } from "react";
import { Img, ImgProps } from "react-image";

interface ImagePropsInterface extends ImgProps {}

const Image: FC<ImagePropsInterface> = ({ src, className, ...props }) => {
  const { data: image } = useMediaFile(src, false);
  return (
    <>
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
    </>
  );
};
export default Image;
