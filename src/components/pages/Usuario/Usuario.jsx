import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Modal, Button, Pagination } from "rsuite";
import "rsuite/dist/rsuite.css";
import { FormControl } from "react-bootstrap";
import Select from "react-select";

const Usuario = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");
  const [usuarios, setUsuarios] = useState([]);
  const [filterTarea, setFilterTarea] = useState([]);
  const { Column, HeaderCell, Cell } = Table;
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";
  const handleClose = () => setOpen(false);
  const [selectedRol, setSelectedRol] = useState([]);
  const [seleccionadoRol, setSeleccionadoRol] = useState([]);
  const [form, setform] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const getData = () => {
    if (sortColumn && sortType) {
      return usuarios.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return usuarios;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const listUsuarios = getData().filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i <= end;
  });

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  useEffect(() => {
    const Api_Fetch = async () => {
      try {
        const response = await fetch(
          `${API_Services}/api/CRUDUSUARIO/ConsultarUsuario`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        // console.log(data);
        setUsuarios(data);
        setFilterTarea(data);

        const response1 = await fetch(`${API_Services}/api/CRUD/ConsultarRol`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data1 = await response1.json();
        setSelectedRol(data1);
      } catch (error) {
        console.log(error);
      }
    };
    Api_Fetch();
  }, [API_Services, token]);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const newData = filterTarea.filter(
      (item) =>
        item.nombreApellido.toLowerCase().includes(searchValue) ||
        item.nombreUsuario.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue)
    );
    setUsuarios(newData);
    if (searchValue === "") {
      setUsuarios(filterTarea);
    }
  };

  const optsSede = selectedRol.map((item) => ({
    value: item.idRol,
    label: item.nombreRol,
  }));

  const handleSelectedSede = (item) => {
    setSeleccionadoRol(item);
  };

  const saveUser = async () => {
    // debugger
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token},`,
      },
      body: JSON.stringify({
        name: form.name,
        username: form.username.toUpperCase(),
        email: form.email,
        password: form.password,
        rol: seleccionadoRol.value,
      }),
    };
    try {
      const response = await fetch(
        `${API_Services}/api/register`,
        requestOptions
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setUsuarios((prevRol) => [...prevRol, data]);
        Swal.fire({
          icon: "success",
          title: "Usuario guardado",
          text: "Usuario registrado correctamente",
        }).then(() => {
          handleClose();
          setform({ name: "", username: "", password: "", email: "" });
          setSeleccionadoRol("")
        });
      } else {
        console.error("Ocurrió un error al guardar el Usuario");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">Usuarios </span>
        </div>
        <div className="col-md-12 mb-5">
          <div className="tab-contentAct card shadow">
            <div className="d-flex mb-3 justify-content-between  ">
              <div className="">
                <button
                  onClick={() => handleOpen("lg")}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  Registrar Usuario
                </button>
              </div>

              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Usuario"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  onChange={handleFilter}
                />
              </div>
            </div>

            <Table
              appearance={"primary"}
              height={400}
              data={listUsuarios}
              sortColumn={sortColumn}
              sortType={sortType}
              onSortColumn={handleSortColumn}
              loading={loading}
              bordered
              renderEmpty={() => {
                return (
                  <div className="rs-table-body-info">
                    No hay registros para mostrar{" "}
                  </div>
                );
              }}
              autoHeight
              affixHeader
              affixHorizontalScrollbar
            >
              <Column width={250} sortable resizable>
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  NOMBRE
                </HeaderCell>
                <Cell dataKey="nombreApellido" />
              </Column>

              <Column width={250} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  NOMBRE USUARIO
                </HeaderCell>
                <Cell dataKey="nombreUsuario" />
              </Column>

              <Column width={250} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  CORREO ELECTRÓNICO
                </HeaderCell>
                <Cell dataKey="email" />
              </Column>

              <Column width={250} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  ROl
                </HeaderCell>
                {/* <Cell dataKey="idRol" /> */}
                <Cell>
                  {(rowData) => (
                    <span>{rowData.idRol === 1 ? "ADMIN" : "USUARIO"}</span>
                  )}
                </Cell>
              </Column>

              <Column width={230} fixed="right" align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  ACCIONES
                </HeaderCell>
                <Cell style={{ padding: "6px", textAlign: "center" }}>
                  {(rowData) => (
                    <>
                      <Button
                        size="sm"
                        color="cyan"
                        disabled={rowData.TOTAL_SUBTAREAS > 0}
                        appearance="primary"
                      >
                        Editar
                      </Button>
                      {"   | "}
                      <Button
                        size="sm"
                        color="red"
                        appearance="primary"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Está seguro de eliminar este registro?",
                            text: "Esta acción no se puede deshacer",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#28a745",
                            cancelButtonColor: "#dc3545",
                            confirmButtonText: "Sí, eliminar",
                            cancelButtonText: "Cancelar",
                            reverseButtons: true,
                          }).then((result) => {
                            if (result.isConfirmed) {
                              if (rowData.TOTAL_SUBTAREAS > 0) {
                                Swal.fire({
                                  title: "Error al eliminar",
                                  text: "El registro no se puede eliminar porque tiene subtareas🗃",
                                  icon: "error",
                                });
                              } else {
                                // deleteTarea(rowData.ID);
                              }
                            } else if (
                              result.dismiss === Swal.DismissReason.cancel
                            ) {
                              Swal.fire(
                                "Cancelado",
                                "El registro está seguro 🗃",
                                "error"
                              );
                            }
                          });
                        }}
                      >
                        Eliminar
                      </Button>
                    </>
                  )}
                </Cell>
              </Column>
            </Table>

            <div style={{ padding: 20 }}>
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={["total", "-", "limit", "|", "pager", "skip"]}
                total={usuarios.length}
                limitOptions={[5, 10, 15, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>

            {/* MODAL ADD USER */}
            <Modal
              backdrop="static"
              keyboard={false}
              size={modalSize}
              open={open}
              onClose={handleClose}
            >
              <Modal.Header>
                <h5 className="text-center">Agregar nuevo usuario</h5>
              </Modal.Header>
              <Modal.Body>
                <div className="container border p-3 mb-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-outline mb-5">
                        <label className="form-label h5">Nombre completo</label>
                        <input
                          type="text"
                          placeholder="name"
                          className="form-control"
                          value={form.name}
                          onChange={(e) => {
                            setform({ ...form, name: e.target.value });
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-outline mb-5">
                        <label className="form-label h5">Nombre Usuario</label>
                        <input
                          type="text"
                          placeholder="USUARIO EN MAYUSCULA"
                          className="form-control"
                          value={form.username}
                          onChange={(e) => {
                            setform({ ...form, username: e.target.value });
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-outline mb-5">
                        <label className="form-label h5">
                          Correo Electronico
                        </label>
                        <input
                          type="text"
                          placeholder="email"
                          className="form-control"
                          value={form.email}
                          onChange={(e) => {
                            setform({ ...form, email: e.target.value });
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-outline mb-5">
                        <label className="form-label h5">Contraseñá</label>
                        <input
                          type="text"
                          placeholder="password"
                          className="form-control"
                          value={form.password}
                          onChange={(e) => {
                            setform({ ...form, password: e.target.value });
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-outline mb-5">
                        <label className="form-label h5">
                          Selecionar un ROl
                        </label>
                        <Select
                          options={optsSede}
                          value={seleccionadoRol}
                          onChange={handleSelectedSede}
                          placeholder="Selecciona un tipo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>

              <Modal.Footer>
                <div className="d-flex justify-content-center">
                  <Button
                    onClick={() => {
                      saveUser();
                    }}
                    color="green"
                    appearance="primary"
                  >
                    Registrar
                  </Button>
                  <Button
                    onClick={handleClose}
                    color="red"
                    appearance="primary"
                  >
                    Cerrar
                  </Button>
                </div>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
