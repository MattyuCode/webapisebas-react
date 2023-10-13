import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "../pages/Sidebar/Sidebar";

export const ProtectedRoutes = () => {
  const [show, setShow] = useState(true);

  //NOTE: AQUI VALIDMOS EL TOKEN QUE GENERAMOS
  const isLoggedIn = localStorage.getItem("access_token");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className={show ? "space-toggle" : null}>
      <Sidebar show={show} setShow={setShow} />
      <Outlet />
    </main>
  );
};
