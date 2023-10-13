import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  Modal,
  Button,
  Pagination,
  Slider,
  Progress,
  InputNumber,
} from "rsuite";
import "rsuite/dist/rsuite.css";
import { FormControl } from "react-bootstrap";

const Usuario = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");
  const [usuarios, setUsuarios] = useState([]);

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
  const handleClose = () => setOpen(false);

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
        console.log(data);
        setUsuarios(data);
      } catch (error) {
        console.log(error);
      }
    };
    Api_Fetch();
  }, [API_Services, token]);

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
                <Link
                  to="/createTarea"
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  Registrar Tarea
                </Link>
              </div>

              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Tarea"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  //   onChange={handleFilter}
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

              <Column width={150} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  NOMBRE USUARIO
                </HeaderCell>
                <Cell dataKey="nombreUsuario" />
              </Column>

              <Column width={280} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  CORREO ELECTRONICO
                </HeaderCell>
                <Cell dataKey="email" />
              </Column>

              <Column width={200} fixed="right" align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  ACCIONES
                </HeaderCell>
                <Cell style={{ padding: "6px", textAlign: "center" }}>
                  {(rowData) => (
                    <td>
                      <Button
                        // onClick={() => {
                        //   handleOpen("lg");
                        //   avances(`${rowData.ID}`);
                        //   setSelectedIdSubProyectos(rowData.ID_SUBPROYECTO);
                        //   setSelectedIdTarea(rowData.ID);
                        //   setNombreTarea(rowData.NOMBRE);
                        //   setDatosAvance(rowData.AVANCE);
                        // }}
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
                    </td>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
