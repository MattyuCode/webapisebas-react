import { Button, Pagination, Table } from "rsuite";
import React, { useContext, useState } from "react";
import { ModelContext } from "../../Context/ModelContext";
import { UseMetods } from "../../Utilities/UseMetods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const TableActividadPago = ({ data }) => {
  const { Column, HeaderCell, Cell } = Table;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const { setUpDatos, setIsEdit } = useContext(ModelContext);
  const queryClient = useQueryClient();
  const { deleteAP } = UseMetods();

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

  const actualizar = (data) => {
    setUpDatos(data);
    setIsEdit(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAP(id),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllActividadPago");
      Swal.fire({
        title: "Borrado...!",
        text: "Datos borrado con exito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error",
        text: `${error.data?.Result}`,
        icon: "error",
      });
    },
  });

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
            idActividadPago
          </HeaderCell>
          <Cell dataKey="idActividadPago" />
        </Column>
        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            nombreActividad
          </HeaderCell>
          <Cell dataKey="nombreActividad" />
        </Column>
        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            cantidad
          </HeaderCell>
          <Cell dataKey="cantidad" />
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
                  onClick={() => actualizar(rowData)}
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
                      text: "Esta acción no se puede deshacer",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#28a745",
                      cancelButtonColor: "#dc3545",
                      confirmButtonText: "Sí, eliminar",
                      cancelButtonText: "Cancelar",
                      reverseButtons: true,
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        await deleteMutation.mutateAsync(
                          rowData?.idActividadPago
                        );
                      } else if (result.dismiss === Swal.DismissReason.cancel) {
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
    </div>
  );
};
export default TableActividadPago;
