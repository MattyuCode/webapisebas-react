import "./App.css";
import { BrowserRouter as MyRoute, Route, Routes } from "react-router-dom";

import Login from "./components/Auth/Login";
import { ProtectedRoutes } from "./components/Routes/ProtectedRoutes";
import Usuario from "./components/pages/Usuario/Usuario";
import Roles from "./components/pages/Roles/Roles";

function App() {
  return (
    <>
      <MyRoute>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/user" element={<Usuario />} />
            <Route exact path="/roles" element={<Roles />} />
          </Route>
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </MyRoute>
    </>
  );
}

export default App;
