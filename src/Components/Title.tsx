import classNames from "classnames";
import { FC } from "react";

interface TitlePropsInterface {
  children?: any;
  className?: string;
}

const Title: FC<TitlePropsInterface> = ({ children, className }) => {
  return (
    <p
      className={classNames(
        "inline-block underline underline-offset-4 decoration-dotted text-3xl leading-[3rem] px-4 py-2 rounded-xl font-bold bg-gray-400/15 backdrop-blur-lg md:py-1.5",
        className,
      )}
    >
      {children}
    </p>
  );
};

export default Title;
