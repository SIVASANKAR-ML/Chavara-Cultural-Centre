import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Scroll the window
    window.scrollTo(0, 0);

    // 2. Scroll the "main" element specifically (just in case)
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }

    // 3. Optional: Scroll the body/html (some browsers prefer this)
    document.documentElement.scrollTo(0, 0);
  }, [pathname]);

  return null;
}