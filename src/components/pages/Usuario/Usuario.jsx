import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useContext, useEffect, useState } from "react";
import { Table, Button, Pagination, Toggle } from "rsuite";
import "rsuite/dist/rsuite.css";
import { FormControl } from "react-bootstrap";
import ModalsUser from "../../Utilities/ModalsUser";
import { ModelContext } from "../../Context/ModelContext";
import { UseMetods } from "../../Utilities/UseMetods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Usuario = () => {
  const [filterTarea, setFilterTarea] = useState([]);
  const { IsEdit, setIsEdit } = useContext(ModelContext);
  const { Column, HeaderCell, Cell } = Table;
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const { GetUser, updateStateUser, GetRol } = UseMetods();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["GetUser"],
    queryFn: GetUser,
  });

  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const getData = () => {
    if (sortColumn && sortType) {
      return data?.sort((a, b) => {
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
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const listUsuarios = getData()?.filter((v, i) => {
    if (!data) return [];
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i <= end;
  });
  const abriModal = () => handleOpen("sm");

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  useEffect(() => {
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit]);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (data && data.length > 0) {
      const filteredData = data.filter((item) =>
        item.nombreApellido.toLowerCase().includes(searchValue)
      );
      setFilterTarea(filteredData);
    } else {
      setFilterTarea([]);
    }
    if (searchValue === "") {
      setFilterTarea(data);
    }
  };

  const updateStateUserMutation = useMutation({
    mutationFn: ({ idPerson, isActive }) => updateStateUser(idPerson, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Actualizado...!",
        text: "estado actualizado con exito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: "Hay un error",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
      });
    },
  });

  const fnUpdateEstadoPerson = async (data) => {
    // console.log(data);
    const idPerson = data?.idUsuario;
    const isActive = data?.isActive ? false : true;
    // console.log({ idPerson, isActive });
    updateStateUserMutation.mutate({ idPerson, isActive });
  };

  const { data: datos, isSuccess: SuccesRol } = useQuery({
    queryKey: ["GetRol"],
    queryFn: GetRol,
  });

  const fn = (data) => {
    const rolEncontrado = datos?.find((d) => d.idRol == data.idRol);
    return rolEncontrado?.nombreRol;
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
              data={filterTarea.length > 0 ? filterTarea : listUsuarios}
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

              <Column width={100} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  ACTIVO
                </HeaderCell>
                <Cell>
                  {(rowData) => (
                    <Toggle
                      // defaultChecked={rowData.isActive}
                      checked={rowData.isActive}
                      onClick={() => fnUpdateEstadoPerson(rowData)}
                      color={rowData.isActive ? "green" : "red"}
                    />
                  )}
                </Cell>
              </Column>

              <Column width={200} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  Telefono
                </HeaderCell>
                <Cell dataKey="telefono" />
              </Column>

              <Column width={250} sortable resizable align="center">
                <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
                  ROl
                </HeaderCell>
                {/* <Cell dataKey="idRol" /> */}
                <Cell>
                  {(rowData) => {
                    const nombreRol = fn(rowData);
                    return (
                      <span>
                        {nombreRol
                          ? nombreRol
                          : rowData.idRol === "ADMIN"
                          ? "ADMIN"
                          : rowData.idRol}
                      </span>
                    );
                  }}
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
                total={data?.length}
                limitOptions={[5, 10, 15, 50]}
                limit={limit}
                activePage={page}
                onChangePage={setPage}
                onChangeLimit={handleChangeLimit}
              />
            </div>

            <ModalsUser open={open} handleClose={handleClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
