import { useEffect, useState } from "react";

const useSticky = () => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY = window.scrollY;
      setSticky((prev) => {
        // Hysteresis band prevents layout oscillation / scroll flicker
        if (!prev && scrollY > 220) return true;
        if (prev && scrollY < 120) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return (): void => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return {
    sticky,
  };
};

export default useSticky;
