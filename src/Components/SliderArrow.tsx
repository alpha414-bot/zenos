import classNames from "classnames";

export default function SliderArrow(props: {
  type: "next" | "prev";
  className?: string;
  arrowClassName?: string;
  onClick?: any;
}) {
  let { type, arrowClassName, className, onClick } = props;
  // console.log(className);
  // className = className.replace(/\bslick\S*/g, "").trim();
  return (
    <div
      className={classNames(
        "absolute z-40 top-[50%] text-3xl cursor-pointer transition-all duration-100 ease-in-out flex p-1 items-center justify-center bg-gray-600/80 rounded-md shadow shadow-white",
        {
          "-right-2": type == "next",
          "-left-2": type == "prev",
          "hidden ": !!className?.includes("slick-disabled"),
          "block ": !className?.includes("slick-disabled"),
        },
        arrowClassName
      )}
      onClick={onClick}
    >
      {(type == "prev" && (
        <svg
          className="w-5 h-5 text-white"
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
            d="m15 19-7-7 7-7"
          />
        </svg>
      )) || (
        <svg
          className="w-5 h-5 text-white"
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
            d="m9 5 7 7-7 7"
          />
        </svg>
      )}
    </div>
  );
}
