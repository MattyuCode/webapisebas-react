import { createContext, useState } from "react";

export const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [upDatos, setUpDatos] = useState([]);
  const [IsEdit, setIsEdit] = useState(false);

  return (
    <ModelContext.Provider value={{ upDatos, setUpDatos, IsEdit, setIsEdit }}>
      {children}
    </ModelContext.Provider>
  );
};
