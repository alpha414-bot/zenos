import React, { useEffect, useRef } from "react";

interface OutsideClickInterface
  extends React.AllHTMLAttributes<HTMLDivElement> {
  outsideClick: any;
  children: any;
}

const OutsideClick: React.FC<OutsideClickInterface> = ({
  children,
  outsideClick,
  ...props
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (parentRef.current && !parentRef.current?.contains(event.target)) {
        return outsideClick();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleClickOutside(document);
      }
    });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", (e) => {
        let key = e.key;
        if (
          key === "Enter" ||
          key === "Tab" ||
          key === "Escape" ||
          key === "Meta"
        ) {
          handleClickOutside(document);
        }
      });
    };
  }, []);
  return (
    <div ref={parentRef} {...props}>
      {children}
    </div>
  );
};

export default OutsideClick;
