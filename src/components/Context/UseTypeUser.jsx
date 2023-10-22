import { createContext, useState } from "react";

export const UseContextTypeUser = createContext();

export function UseTypeUser({ children }) {
  const [tipoUser, setTipoUser] = useState("");

  return (
    <UseContextTypeUser.Provider value={{ tipoUser, setTipoUser }}>
      {children}
    </UseContextTypeUser.Provider>
  );
}
