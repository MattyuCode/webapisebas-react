import { useEffect, useState } from "react";

export const useDebounce = (value, delay) => {
    const [debouceValue, setDebouceValue] = useState(value);
   
    useEffect(() => {
      const handler = setTimeout(() => setDebouceValue(value), delay);
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouceValue;
  };
  