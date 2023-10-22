import "./App.css";
import { BrowserRouter as MyRoute, Route, Routes } from "react-router-dom";

import Login from "./components/Auth/Login";
import { ProtectedRoutes } from "./components/Routes/ProtectedRoutes";
import Usuario from "./components/pages/Usuario/Usuario";
import Roles from "./components/pages/Roles/Roles";
import Personas from "./components/pages/Personas/Personas";
import Asistencia from "./components/pages/Asistencia/Asistencia";
import Pagos from "./components/pages/Pagos/Pagos";
import NotFound from "./components/NotFound/NotFound";
import Home from "./components/pages/Home/Home";
import { UseTypeUser } from "./components/Context/UseTypeUser";

function App() {
  return (
    <>
      <MyRoute>
        <UseTypeUser>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route exact path="/home" element={<Home />} />
              <Route path="/user" element={<Usuario />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/personas" element={<Personas />} />
              <Route path="/asistencia" element={<Asistencia />} />
              <Route path="/pagos" element={<Pagos />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UseTypeUser>
      </MyRoute>
    </>
  );
}

export default App;
