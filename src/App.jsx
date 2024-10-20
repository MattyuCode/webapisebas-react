import "./App.css";
import { BrowserRouter as MyRoute, Route, Routes } from "react-router-dom";

import Login from "./components/Auth/Login";
import { ProtectedRoutes } from "./components/Routes/ProtectedRoutes";
import Usuario from "./components/pages/Usuario/Usuario";
import Roles from "./components/pages/Roles/Roles";
import Personas from "./components/pages/Personas/Personas";
import Asistencia from "./components/pages/Asistencia/Asistencia";
import Pagos from "./components/pages/Pagos/Pagos";
import ActividadAsistencia from "./components/pages/ActividadAsistencia/ActividadAsistencia"
import PersonasSinAsistencia from "./components/pages/PersonaSinAsistencia/PersonaSinsAsistencia";
import PersonaSinPago from "./components/pages/PersonaSinPago/PersonaSinPago";




import NotFound from "./components/NotFound/NotFound";
import Home from "./components/pages/Home/Home";
import { UseTypeUser } from "./components/Context/UseTypeUser";
import { ModelProvider } from "./components/Context/ModelContext";
import PersonasConActividadPendiente from "./components/pages/Personas/PersonasConActividadPendiente";

function App() {
  return (
    <>
      <MyRoute>
        <ModelProvider>
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
                <Route path="/actividadAsistencia" element={<ActividadAsistencia/>} />
                <Route path="/personas-sin-asistencia" element={<PersonasSinAsistencia />} />
                <Route path="/personas-sin-pago" element={<PersonaSinPago/>} />
                <Route path="/personaConActividad" element={<PersonasConActividadPendiente/>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </UseTypeUser>
        </ModelProvider>
      </MyRoute>
    </>
  );
}

export default App;
