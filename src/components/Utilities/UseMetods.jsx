import axios from "axios";

export const UseMetods = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");

  const GetAllPersonas = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDPERSONAS/ConsultarPersonas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const postPersonas = async (data) => {
    // debugger;
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDPERSONAS/CrearPersonas`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 201) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };
  const modificarPersonas = async (data) => {
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDPERSONAS/ModificarPersona`,
        data,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };
  const eliminarPersonas = async (id) => {
    try {
      const response = await axios.delete(
        `${API_Services}/api/CRUDPERSONAS/EliminarPersona/${id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const GetRol = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUD/ConsultarRol`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const GetUser = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDUSUARIO/ConsultarUsuario`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { Result } = response.data;
      console.log(Result);
      return Result;
    } catch (error) {
      console.log(error);
    }
  };

  const postUser = async (data) => {
    // debugger;
    try {
      const response = await axios.post(`${API_Services}/api/register`, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const updateStateUser = async (idPerson, isActive) => {
    // debugger;
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDUSUARIO/ModificarEstadoUsuario/${idPerson}`,
        { isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    updateStateUser,
    postUser,
    GetUser,
    GetRol,
    GetAllPersonas,
    postPersonas,
    modificarPersonas,
    eliminarPersonas,
  };
};
