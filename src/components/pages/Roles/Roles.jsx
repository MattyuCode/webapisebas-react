import { useEffect, useState } from "react";
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
  const [isUpdating, setIsUpdating] = useState(false);

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

  const UpdateRole = async (e) => {
    e.preventDefault();
    // debugger;
    try {
      const resquestOptions = {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreRol: form.nombre_rol,
        }),
      };
      const response = await fetch(
        `${API_Services}/api/CRUD/ModificarRol/${idEditar}`,
        resquestOptions
      );

      if (response.ok) {
        const data = await response.json();
        setRol((roles) =>
          roles.map((role) => (role.idRol === idEditar ? data : role))
        );
        setIsUpdating(false);
        setForm({ nombre_rol: "" });
        Swal.fire("Éxito", "Rol actualizado correctamente", "success");
      } else {
        console.error("Ocurrió un error al guardar el rol.");
        Swal.fire("Error", "Ocurrió un error al actualizar el rol", "error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveRole = async (e) => {
    e.preventDefault();
    try {
      const resquestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreRol: form.nombre_rol,
        }),
      };

      const response = await fetch(
        `${API_Services}/api/CRUD/CrearRol`,
        resquestOptions
      );

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          icon: "success",
          title: "Rol guardado",
          text: "Rol registrado correctamente",
        });
        //NOTE: Actualizar la lista de roles después de agregar uno nuevo
        setRol((prevRol) => [...prevRol, data]); //MATT: Agregar el nuevo rol a la lista
        setForm({ nombre_rol: "" }); //FIXME: Limpiar el formulario después de agregar
      } else {
        console.error("Ocurrió un error al guardar el rol.");
      }
      setIsUpdating(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRol = async (idRol) => {
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
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rol.map((item, index) => (
                      <tr key={index}>
                        <th scope="row">{item.idRol}</th>
                        <td>{item.nombreRol}</td>
                        <td>
                          <i
                            className="fas fa-edit"
                            style={{ cursor: "pointer", color: "#0a91d3" }}
                            onClick={() => {
                              setForm({ nombre_rol: item.nombreRol });
                              setIdEditar(item.idRol);
                              setIsUpdating(true);
                            }}
                          ></i>
                        </td>
                        <td>
                          <i
                            className="fas fa-trash-alt"
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => deleteRol(item.idRol)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <form onSubmit={isUpdating ? UpdateRole : saveRole}>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Nombre ROl</label>
                    <input
                      type="text"
                      className={`form-control`}
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
                    {isUpdating ? "Actualizar Rol" : "Registrar nuevo Rol"}
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
