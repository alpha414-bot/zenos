export default function Arrow(props: any) {
  const { type, className, onClick } = props;
  return (
    <div
      className={` absolute z-40 top-[50%] ${
        type == "next" ? "-right-2" : "-left-2"
      } ${
        className.includes("slick-disabled") ? "hidden" : "block"
      } text-3xl cursor-pointer transition-all duration-100 ease-in-out flex items-center justify-center bg-gray-600/60 rounded-lg`}
      onClick={onClick}
    >
      {(type == "next" && (
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
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
          className="w-6 h-6 text-gray-800 dark:text-white"
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
