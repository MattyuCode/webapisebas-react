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

  const GetAllActividadAsitencia = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDACTIVIDADASISTENCIA/ConsultarActividad`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllPersonaSinPago = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/SINPAGO/personasinPago2/{idTipoPago}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllPersonaSinAsistencia = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/SINASISTENCIA/personaSinAsistencia/{tipoAsistencia}`,
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

  const UpdateUser = async (dataNew) => {
    debugger;
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDUSUARIO/ModificarUsuario`,
        dataNew,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const GetAllSinAsistencia = async (tipo) => {
    try {
      const response = await axios.get(
        `${API_Services}/api/SINASISTENCIA/personaSinAsistencia/${tipo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const GetAllSinPago = async (idTipoPago) => {
    try {
      const response = await axios.get(
        `${API_Services}/api/SINPAGO/personasinPago2/${idTipoPago}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status == 200) {
        return response;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const GetAllActividadAsistencia = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDACTIVIDADASISTENCIA/ConsultarActividad`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPersonaConActividad = async (idPersona) => {
    // debugger
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDASISTENCIA/pendientes/${idPersona}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // if (response.status === 200) {
      return response.data;
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllAsistencia = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDASISTENCIA/GetAllAsisencia`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {}
  };

  const inserNewAsistencia = async (data) => {
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDASISTENCIA/CrearAsistencia`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {}
  };

  const GetPersonaConActividadPagoPendiente = async (idPersona) => {
    //debugger
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDPAGO/pendientes/${idPersona}`,

        { headers: { Authorization: `Bearer ${token}` } }
      );
      // if (response.status === 200) {
      return response.data;
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const GetAllActividadPago = async () => {
    try {
      const response = await axios.get(
        `${API_Services}/api/CRUDACTIVIDAD/ConsultarActividad`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch {
      console.log(error);
    }
  };

  const postAcAsis = async (data) => {
    // debugger;
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDACTIVIDADASISTENCIA/CrearActividad`,
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

  const deleteAcAsis = async (id) => {
    try {
      const response = await axios.delete(
        `${API_Services}/api/CRUDACTIVIDADASISTENCIA/EliminarActividad/${id}`,
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
      } else {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const updateAcAsis = async (dataNew) => {
    // debugger;
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDACTIVIDADASISTENCIA/ModificarActividad`,
        dataNew,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 201) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const postAsistencia = async (data) => {
    // debugger;
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDASISTENCIA/CrearAsistencia`,
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

  const deleteAsis = async (id) => {
    try {
      const response = await axios.delete(
        `${API_Services}/api/CRUDASISTENCIA/EliminarAsistencia/${id}`,
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
      } else {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const updateAsis = async (dataNew) => {
    // debugger;
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDASISTENCIA/ActualizarAsistencia`,
        dataNew,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status == 200) {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  const postActividadPagos = async (data) => {
    // debugger;
    try {
      const response = await axios.post(
        `${API_Services}/api/CRUDACTIVIDAD/CrearActividad`,
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

  const putActividadPagos = async (data) => {
    // debugger;
    try {
      const response = await axios.put(
        `${API_Services}/api/CRUDACTIVIDAD/ModificarActividad`,
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

  const deleteAP = async (id) => {
    try {
      const response = await axios.delete(
        `${API_Services}/api/CRUDACTIVIDAD/EliminarActividad/${id}`,
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
      } else {
        return response.data;
      }
    } catch (error) {
      throw error.response || error;
    }
  };

  return {
    //NOTE: PAGO
    postActividadPagos,
    putActividadPagos,
    deleteAP,
    //NOTE. ActividadAsistencia
    updateAcAsis,
    deleteAcAsis,
    postAcAsis,
    inserNewAsistencia,
    //NOTE: Asistencia
    GetAllAsistencia,
    postAsistencia,
    deleteAsis,
    updateAsis,
    //
    getPersonaConActividad,
    GetAllActividadAsistencia,
    GetAllActividadPago,
    GetAllSinAsistencia,
    GetAllSinPago,
    UpdateUser,
    updateStateUser,
    postUser,
    GetUser,
    GetRol,
    GetAllPersonas,
    GetAllActividadAsitencia,
    GetAllPersonaSinAsistencia,
    GetAllPersonaSinPago,
    postPersonas,
    modificarPersonas,
    eliminarPersonas,
    GetPersonaConActividadPagoPendiente,
  };
};
