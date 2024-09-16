import Swal from "sweetalert2/dist/sweetalert2.all.js";

import React, { useState } from "react";
import { Button, Pagination, Table } from "rsuite";

const TablePersonas = ({ data }) => {
  const { Column, HeaderCell, Cell } = Table;
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState();
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
                  onClick={(d)=> console.log(rowData)}
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

export default TablePersonas;
