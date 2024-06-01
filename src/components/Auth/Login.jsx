import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { UseContextTypeUser } from "../Context/UseTypeUser";
import axios from "axios";

const Login = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    loading: false,
  });
  const { setTipoUser } = useContext(UseContextTypeUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    // debugger;
    const data = {
      username: form.username,
      password: form.password,
    };
    try {
      const response = await axios.post(
        `${API_Services}/api/authenticate`,
        data
      );

      if (response.status === 200) {
        const data = response.data;
        console.log(data.access_token);
        navigate("/home");
        setTipoUser(form.username);
        localStorage.setItem("access_token", data.access_token);
        // localStorage.setItem("USERS", data.user);
      } else {
        console.log("Aqui");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const data = error.response.data.Message;
        toast.error(data, {
          theme: "colored",
        });
      } else {
        console.error(error.response);
      }
    }
  };

  return (
    <section className="sect">
      <div className="formu">
        <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              USUARIO
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              value={form.username}
              required
              onChange={(e) => {
                setForm({ ...form, username: e.target.value });
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              CONTRASEÑA
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
              }}
              required
            />
          </div>
          <div className="d-grid gap-2">
            <button
              // onClick={handleLogin}
              type="submit"
              className="btn btn-primary"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </section>
  );
};

export default Login;
