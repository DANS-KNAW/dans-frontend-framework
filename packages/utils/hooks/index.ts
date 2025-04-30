import { useMemo } from "react";
import { useLocation } from "react-router-dom";

// Helper to get embed true/false from url
export const useEmbedHandler = () => {
    const location = useLocation();
  
    // on first render, check if embed=true is present in the url
    const isEmbed = useMemo(() => {
      const queryParams = new URLSearchParams(location.search);
      return queryParams.get("embed") === "true";
    }, []);
  
    // Ensure ?embed=true is always preserved ... not needed, as this should never rerender
    // const navigate = useNavigate();
    // useEffect(() => {
    //   if (isEmbed && !location.search.includes("embed=true")) {
    //     const queryParams = new URLSearchParams(location.search);
    //     queryParams.set("embed", "true");
    //     navigate(`${location.pathname}?${queryParams.toString()}`, { replace: true });
    //   }
    // }, [isEmbed, location.search, location.pathname, navigate]);
  
    return { isEmbed };
  };
  