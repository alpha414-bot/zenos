
const Logo: React.FC<{ type: "footer-logo" | "navbar-logo" }> = ({
  type,
  ...props
}) => {
  if (type == "footer-logo") {
    return (
      <>
        <div className="hidden md:block">
          <svg
            width={228}
            height={227}
            viewBox="0 0 228 227"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <g filter="url(#filter0_di_18_8)" clipPath="url(#clip0_18_8)">
              <path
                d="M105.451 224.537L.863 2.695 50.18 16.893l71.162 156.177h49.84l25.252-124.232h27.21l-27.21 124.232h-25.252l-10.461 51.467h-55.271z"
                fill="url(#paint0_linear_18_8)"
              />
            </g>
            <defs>
              <filter
                id="filter0_di_18_8"
                x={0.862793}
                y={0.895068}
                width={226.582}
                height={225.642}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx={2} />
                <feGaussianBlur stdDeviation={0.9} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0.745098 0 0 0 0 0.0705882 0 0 0 0 0.235294 0 0 0 1 0" />
                <feBlend
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_18_8"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_18_8"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx={2} dy={2} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2={-1}
                  k3={1}
                />
                <feColorMatrix values="0 0 0 0 0.745098 0 0 0 0 0.0705882 0 0 0 0 0.235294 0 0 0 0.25 0" />
                <feBlend in2="shape" result="effect2_innerShadow_18_8" />
              </filter>
              <linearGradient
                id="paint0_linear_18_8"
                x1={61.9042}
                y1={35.3253}
                x2={106.494}
                y2={214.055}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset={0.395413} stopColor="#fff" />
                <stop offset={0.746667} stopColor="#fff" />
                <stop offset={0.768278} stopColor="#fff" />
              </linearGradient>
              <clipPath id="clip0_18_8">
                <path fill="#fff" d="M0 0H228V227H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="block md:hidden">
          <svg
            width={99}
            height={106}
            viewBox="0 0 99 106"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
          >
            <g filter="url(#filter0_di_17_2)">
              <path
                d="M44.871 103.561L.863 2.695 21.615 9.15l29.943 71.01h20.971l10.626-56.485h11.449L83.154 80.16H72.53l-4.401 23.401H44.87z"
                fill="url(#paint0_linear_17_2)"
              />
            </g>
            <defs>
              <filter
                id="filter0_di_17_2"
                x={0.862793}
                y={0.895068}
                width={97.5412}
                height={104.665}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx={2} />
                <feGaussianBlur stdDeviation={0.9} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix values="0 0 0 0 0.745098 0 0 0 0 0.0705882 0 0 0 0 0.235294 0 0 0 1 0" />
                <feBlend
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_17_2"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect1_dropShadow_17_2"
                  result="shape"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx={2} dy={2} />
                <feGaussianBlur stdDeviation={2} />
                <feComposite
                  in2="hardAlpha"
                  operator="arithmetic"
                  k2={-1}
                  k3={1}
                />
                <feColorMatrix values="0 0 0 0 0.745098 0 0 0 0 0.0705882 0 0 0 0 0.235294 0 0 0 0.25 0" />
                <feBlend in2="shape" result="effect2_innerShadow_17_2" />
              </filter>
              <linearGradient
                id="paint0_linear_17_2"
                x1={26.5475}
                y1={17.5312}
                x2={48.2413}
                y2={98.0045}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset={0.395413} stopColor="#fff" />
                <stop offset={0.746667} stopColor="#fff" />
                <stop offset={0.768278} stopColor="#fff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </>
    );
  } else if (type == "navbar-logo") {
    return (
      <div>
        <svg
          width={78}
          height={53}
          viewBox="0 0 27 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M12.685 32.05L.575.05l5.71 2.048 8.24 22.528h5.771l2.924-17.92h3.15l-3.15 17.92h-2.924l-1.211 7.424h-6.4z"
            fill="url(#paint0_linear_17_3)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_17_3"
              x1={7.64275}
              y1={4.7571}
              x2={15.4043}
              y2={29.7307}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset={0.395413} stopColor="#fff" />
              <stop offset={0.746667} stopColor="#fff" />
              <stop offset={0.768278} stopColor="#fff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }
};

export default Logo;
