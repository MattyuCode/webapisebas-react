/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Sidebar = ({ show, setShow }) => {
  const [isActive, setIsActive] = useState("/");
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
      <header className={`header ${show ? "space-toggle" : null} `}>
        <div className="header-toogle" onClick={() => setShow(!show)}>
          <i className="fas fa-bars "></i>
        </div>

        <Link to="/" style={{ color: "white" }}>
          <i className="fas fa-sign-out-alt nav-link-icon"></i>{" "}
          <span className="nav-link-name">Logout</span>
        </Link>
      </header>

      <aside className={`sidebar ${show ? "show" : null}`}>
        <nav className="navbars">
          <div className="">
            {/* <Link to="/" className="nav-link nav-logo"> */}
            <Link
              to="/dashboard"
              className={`nav-logo ${
                isActive === "/dashboard" ? "active" : ""
              }`}
              onClick={() => handleClickPath("/dashboard")}
            >
              <i className="fas fa-tachometer-alt  nav-logo-icon "></i>
              <span className="nav-link-name">Dashaboard</span>
            </Link>

            <div className="nav-list">
              {/* <Link to="/home" className="nav-links active"> */}
              <Link
                to="/user"
                className={`nav-links ${isActive === "/user" ? "active" : ""}`}
                onClick={() => handleClickPath("/user")}
              >
                <i className="fas fa-user nav-link-icon"></i>
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
                to="/proyecto"
                className={`nav-links ${
                  isActive === "/proyecto" ? "active" : ""
                }`}
                onClick={() => handleClickPath("/proyecto")}
              >
                <i className="fas fa-project-diagram nav-link-icon"></i>
                <span className="nav-link-name">Protectos</span>
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
