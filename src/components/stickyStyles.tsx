import { useEffect, useRef, useState } from "react";

export default function stickyStyles({
  children,
  staticClass,
  fixedClass,
}: {
  children: React.ReactNode;
  staticClass: string;
  fixedClass: string;
}) {
  const [isFixed, setIsFixed] = useState(false);
  const elem = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (elem.current) {
        const rect = (elem.current as HTMLDivElement).getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= 0) {
          setIsFixed(true);
        } else {
          setIsFixed(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed, elem]);
  return (
    <div className={isFixed ? fixedClass : staticClass} ref={elem}>
      {children}
    </div>
  );
}
