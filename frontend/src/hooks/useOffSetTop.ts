import { useEffect, useState } from "react";

const useOffSetTop: (top?: number) => boolean = (top) => {
  const [offsetTop, setOffSetTop] = useState(false);
  const isTop = top || 110;

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset > isTop) {
        setOffSetTop(true);
      } else {
        setOffSetTop(false);
      }
    };
    return () => {
      window.onscroll = null;
    };
  }, [isTop]);

  return offsetTop;
};

export default useOffSetTop;
