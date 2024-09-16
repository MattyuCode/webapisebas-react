import { createContext } from "react";

export const useOpenModelContext = createContext();

export const OpenModalProvider = ({ children }) => {
  const [abreModal, setAbreModal] = useState("");

  return (
    <useOpenModelContext.Provider value={{ abreModal, setAbreModal }}>
      {children}
    </useOpenModelContext.Provider>
  );
};

