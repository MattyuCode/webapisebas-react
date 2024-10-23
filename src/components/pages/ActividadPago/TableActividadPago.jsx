import { Button, Pagination, Table } from "rsuite";

import React, { useState } from "react";

const TableActividadPago = ({data}) =>{
// console.log("🚀 ~ TableActividadPago ~ data:", data);
const { Column, HeaderCell, Cell } = Table;
const [limit, setLimit] = useState(10);
const [page, setPage] = useState(1);
const [sortColumn, setSortColumn] = useState();
const [sortType, setSortType] = useState();
const [loading, setLoading] = useState(false);

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

  return (
    <div>
      <Table
        appearance={"primary"}
        height={400}
        data={data}
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
                //   onClick={() => ActualizarDatos(rowData)}
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
                    }).then((result) => {
                      if (result.isConfirmed) {
                        // deleteMutation.mutateAsync(rowData?.idPersona);
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