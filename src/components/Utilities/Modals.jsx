import PropTypes from "prop-types";
import { Modal, Button as Boton } from "rsuite";

const Modals = ({ open, size, handleClose }) => {
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size={modalSize}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>
        <h5 className="text-center">Detalles de Turno</h5>
      </Modal.Header>

      <Modal.Body>
        <div className="container border p-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-12">
              {/* {detallesTurno.length === 0 ? (
                <>
                  <div className="alert alert-info">
                    <br />
                    <br />
                    <h4 className="text-center"> No hay datos disponibles</h4>
                    <br />
                    <br />
                  </div>
                </>
              ) : (
                <table className="table table-hover">
                  <thead>
                    <tr className="table-secondary">
                      <th scope="" width="100">
                        NO CIA
                      </th>
                      <th scope="">TURNO</th>
                      <th scope="">GRUPO</th>
                      <th scope="" width="100">
                        NO CLIENTE
                      </th>
                      <th scope="" >
                        CLIENTE
                      </th>
                      <th scope="">ESTADO</th>
                      <th scope="">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detallesTurno.map((item, index) => (
                      <tr key={index}>
                        <td> {item.NO_CIA} </td>
                        <td> {item.TURNO} </td>
                        <td> {item.GRUPO} </td>
                        <td> {item.NO_CLIENTE} </td>
                        <td> {item.CLIENTE} </td>
                        <td> {item.ESTADO} </td>
                        <td width={200}>
                          <div>
                            <Boton color="cyan" size="sm" appearance="primary">
                              Modificar
                            </Boton> 
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} */}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-center">
          <Boton onClick={handleClose} color="red" appearance="primary">
            Cerrar
          </Boton>
          <Boton color="green" appearance="primary">
            <i className="fas fa-save"></i> &nbsp; Guardar
          </Boton>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

 
Modals.propTypes = {
    open: PropTypes.bool.isRequired, // Agrega esta línea para validar 'open'
    size: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    detallesTurno: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

export default Modals;