import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FormControl } from "react-bootstrap";

const Roles = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");
  const [rol, setRol] = useState([]);
  const [filterRole, setFilterRole] = useState([]);
  const [idEditar, setIdEditar] = useState("");
  const [form, setForm] = useState({
    nombre_rol: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_Services}/api/CRUD/ConsultarRol`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setRol(data);
          setFilterRole(data);
        } else {
          console.error("Ocurrió un error al consultar los roles.");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [API_Services, token]);

  const saveRole = async (e) => {
    e.preventDefault();
    try {
      const resquestOptions = {
        // method: "POST",
        method: idEditar ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreRol: form.nombre_rol,
        }),
      };

      // const response = await fetch(
      //   `${API_Services}/api/CRUD/CrearRol`,
      //   resquestOptions
      // );

      const urls = idEditar
        ? `${API_Services}/api/CRUD/CrearRol`
        : `${API_Services}/api/CRUD/ModificarRol`;
      const response = await fetch(urls, resquestOptions);
      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: idEditar ? "Rol Actualizado" : "Rol guardado",
          text: "Rol registrado correctamente",
        });
        console.log(data);

        if (idEditar) {
          setRol((row) =>
            row.map((item) =>
              item.idRol === idEditar
                ? { ...item, nombreRol: form.nombreRol }
                : item
            )
          );
          setIdEditar("");
        } else {
          // Actualizar la lista de roles después de agregar uno nuevo
          setRol((prevRol) => [...prevRol, data]); // Agregar el nuevo rol a la lista
        }
        setForm({ nombre_rol: "" }); // Limpiar el formulario después de agregar
      } else {
        console.error("Ocurrió un error al guardar el rol.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRol = async (idRol) => {
    //  debugger
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await fetch(
        `${API_Services}/api/CRUD/EliminarRol/${idRol}`,
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setRol(rol.filter((item) => item.idRol !== idRol));
        Swal.fire({
          icon: "success",
          title: `${data.message}`,
          text: "Rol eliminado exitosamente",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al eliminar.",
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const newData = filterRole.filter((item) =>
      item.nombreRol.toLowerCase().includes(searchValue)
    );
    setRol(newData);
    if (searchValue === "") {
      setRol(filterRole);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">Roles </span>
        </div>
        <div className="col-md-12 mb-5">
          <div className="tab-contentAct card shadow">
            <div className="d-flex mb-3 justify-content-end  ">
              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Rol"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  onChange={handleFilter}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">NOmbre ROL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rol.map((item) => (
                      <tr key={item.idRol}>
                        <th scope="row">{item.idRol}</th>
                        <td>{item.nombreRol}</td>
                        <i
                          className="fas fa-edit"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setForm({ nombre_rol: item.nombreRol });
                            setIdEditar(item.idRol);
                          }}
                        ></i>
                        <i
                          className="fas fa-trash-alt"
                          style={{ cursor: "pointer" }}
                          onClick={() => deleteRol(item.idRol)}
                        ></i>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <form onSubmit={saveRole}>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Nombre ROl</label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      value={form.nombre_rol}
                      onChange={(e) => {
                        setForm({ ...form, nombre_rol: e.target.value });
                      }}
                      placeholder="Nombre rol"
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-success mt-3 w-100">
                    {idEditar ? "Actualizar Rol" : "Registrar nuevo Rol"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
