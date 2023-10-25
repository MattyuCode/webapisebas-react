import PropTypes from "prop-types";
import { Table, Pagination, Button } from "rsuite";
import { Swal } from "sweetalert2/dist/sweetalert2.all";

const TableComponent = ({
  data,
  onSortColumn,
  sortColumn,
  sortType,
  loading,
  limit,
  page,
  onChangePage,
  onChangeLimit,
}) => {
  const { Column, HeaderCell, Cell } = Table;

  return (
    <div>
      <Table
        appearance={"primary"}
        height={400}
        data={data}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={onSortColumn}
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
          <Cell dataKey="asistencia" />
        </Column>

        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            descripcion
          </HeaderCell>
          <Cell dataKey="descripcion" />
        </Column>

        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            fechaRegistro
          </HeaderCell>
          <Cell dataKey="fechaRegistro" />
        </Column>

        <Column width={250} sortable resizable>
          <HeaderCell style={{ background: "#d9d9d9", color: "black" }}>
            fechaModificado
          </HeaderCell>
          <Cell dataKey="fechaModificado" />
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
          total={data.length}
          limitOptions={[5, 10, 15, 50]}
          limit={limit}
          activePage={page}
          onChangePage={onChangePage}
          onChangeLimit={onChangeLimit}
        />
      </div>
    </div>
  );
};

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onSortColumn: PropTypes.func.isRequired,
  sortColumn: PropTypes.string,
  sortType: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  limit: PropTypes.number,
  page: PropTypes.number,
  onChangePage: PropTypes.func,
  onChangeLimit: PropTypes.func,
};

export default TableComponent;
