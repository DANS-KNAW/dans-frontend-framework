import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0); // scroll to top on route change
  }, [pathname]);

  return null;
}