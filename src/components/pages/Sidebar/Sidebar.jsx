/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import profileImg from "../../../assets/usuario.png";

export const Sidebar = ({ show, setShow }) => {
  const [isActive, setIsActive] = useState("/home");
  const navigate = useNavigate();

  const handleClickPath = (path) => {
    setIsActive(path);
  };

  const logout = () => {
    navigate("/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("USERS");
    // window.location.href = "/";
  };

  return (
    // <main className={show ? 'space-toggle' : null}>
    <>
      <header
        className={`header ${show ? "space-toggle" : null} `}
        style={{ zIndex: "5" }}
      >
        <div className="header-toogle" onClick={() => setShow(!show)}>
          <i className="fas fa-bars "></i>
        </div>

        <div className="divTexto">
          <div
            onClick={logout}
            style={{ color: "white" }}
            className="link-logout"
          >
            <i className="fas fa-sign-out-alt nav-link-icon"></i>{" "}
            <span className="nav-link-name"></span>
          </div>

          <span style={{ margin: "0 30px 0" }}>
            {localStorage.getItem("USERS")}{" "}
          </span>
          <div className="user">
            <img className="profiel-img" src={profileImg} alt="" />
          </div>
        </div>
      </header>

      <aside
        className={`sidebar ${show ? "show" : "hidden"}`}
        style={{ zIndex: "6" }}
      >
        <nav className="navbars">
          <div className="">
            <div className="nav-list " style={{ paddingTop: " 50px" }}>
              {/* <Link to="/home" className="nav-links active"> */}
              <Link
                to="/home"
                className={`nav-links ${isActive === "/home" ? "active" : ""}`}
                onClick={() => handleClickPath("/home")}
              >
                <i className="fas fa-home nav-link-icon"></i>
                <span className="nav-link-name">INICIO</span>
              </Link>

              <Link
                to="/user"
                className={`nav-links ${isActive === "/user" ? "active" : ""}`}
                onClick={() => handleClickPath("/user")}
              >
                <i className="fas fa-users nav-link-icon"></i>
                <span className="nav-link-name">USUARIO</span>
              </Link>

              <Link
                to="/roles"
                className={`nav-links ${isActive === "/roles" ? "active" : ""}`}
                onClick={() => handleClickPath("/roles")}
              >
                <i className="fas fa-user-tag nav-link-icon"></i>

                <span className="nav-link-name">ROLES</span>
              </Link>

              <Link
                to="/personas"
                className={`nav-links ${
                  isActive === "/personas" ? "active" : ""
                }`}
                onClick={() => handleClickPath("/personas")}
              >
                <i className="fas fa-user-check nav-link-icon"></i>
                <span className="nav-link-name">PERSONAS</span>
              </Link>

              <Link
                to="/asistencia"
                className={`nav-links ${
                  isActive === "/asistencia" ? "active" : ""
                }`}
                onClick={() => handleClickPath("/asistencia")}
              >
                <i className="fas fa-clipboard-list nav-link-icon"></i>
                <span className="nav-link-name">ASISTENCIA</span>
              </Link>

              <Link
                to="/pagos"
                className={`nav-links ${isActive === "/pagos" ? "active" : ""}`}
                onClick={() => handleClickPath("/pagos")}
              >
                <i className="fas fa-money-bill-wave nav-link-icon"></i>
                <span className="nav-link-name">PAGOS</span>
              </Link>
            </div>
          </div>

          <div
            onClick={logout}
            className="nav-links"
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-sign-out-alt nav-link-icon"></i>
            <span className="nav-link-name">Logout</span>
          </div>
        </nav>
      </aside>
      {/* </main> */}
    </>
  );
};
