import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useContext, useState } from "react";
import { Button, Pagination, Table } from "rsuite";
import { ModelContext } from "../Context/ModelContext";
import { UseMetods } from "../Utilities/UseMetods";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TablePersonas = ({ data }) => {
  const { Column, HeaderCell, Cell } = Table;
  const { setUpDatos, setIsEdit } = useContext(ModelContext);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState();
  const { eliminarPersonas } = UseMetods();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState();

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const ActualizarDatos = (data) => {
    setIsEdit(true);
    setUpDatos([data]);
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => eliminarPersonas(id),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Borrado...!",
        text: "Persona borrado con exito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        // text: ${error.data.message}},
        html: <h1>${error.data.message}</h1>,
        icon: "error",
        // showConfirmButton: false,
        // timer: 2000,
      });
    },
  });

  const getData = () => {
    let filteredData = data;
    if (sortColumn && sortType) {
      filteredData = filteredData.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        return sortType === "asc" ? x - y : y - x;
      });
    }
    const start = limit * (page - 1);
    const end = start + limit;
    return filteredData?.slice(start, end);
  };

  const listaDatas = getData();

  return (
    <div>
      <Table
        appearance={"primary"}
        height={400}
        data={listaDatas}
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
            idPersona
          </HeaderCell>
          <Cell dataKey="idPersona" />
        </Column>
        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            nombreApellido
          </HeaderCell>
          <Cell dataKey="nombreApellido" />
        </Column>

        <Column width={250} sortable resizable align="center">
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            telefono
          </HeaderCell>
          <Cell dataKey="telefono" />
        </Column>

        <Column width={200} sortable resizable align="center">
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            sector
          </HeaderCell>
          <Cell dataKey="sector" />
        </Column>

        <Column width={250} sortable resizable align="center">
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            fechaRegistrado
          </HeaderCell>
          <Cell dataKey="fechaRegistrado" />
        </Column>

        {localStorage.getItem("idRolUsuario") === "ADMIN" && (
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
                    onClick={() => ActualizarDatos(rowData)}
                  >
                    Editar
                  </Button>
                  {"   | "}
                  <Button
                    size="sm"
                    color="red"
                    appearance="primary"
                    onClick={() => {
                      // console.log(rowData)
                      Swal.fire({
                        title: "¿Está seguro de eliminar este registro?",
                        texrt: "Esta acción no se puede deshacer",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#28a745",
                        cancelButtonColor: "#dc3545",
                        confirmButtonText: "Sí, eliminar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteMutation.mutateAsync(rowData?.idPersona);
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
        )}
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
    </div>
  );
};

export default TablePersonas;
