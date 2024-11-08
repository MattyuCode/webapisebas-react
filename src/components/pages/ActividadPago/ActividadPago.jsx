import { FormControl } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import Modal from "../../Utilities/Modals";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import TableActividadPago from "./TableActividadPago";
import { ModalAP } from "./ModalAP";
import { UseMetods } from "../../Utilities/UseMetods";
import { ModelContext } from "../../Context/ModelContext";

const ActividadPago = () => {
  const { setIsEdit, IsEdit } = useContext(ModelContext);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const navigate = useNavigate();
  const [allDatos, setAllDatos] = useState([]);

  const { GetAllActividadPago } = UseMetods();
  const { data, isSuccess } = useQuery({
    queryKey: ["GetAllActividadPago"],
    queryFn: GetAllActividadPago,
  });

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const abriModal = () => handleOpen("lg");

  useEffect(() => {
    if (isSuccess) {
      setAllDatos(data);
    }
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit, isSuccess, data]);

  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

  const reporteActividadPago = () => {
    navigate("/personas-sin-pago");
  };

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setAllDatos(data);
    } else {
      const newData = data?.filter(
        (item) => item.nombreActividad.toLowerCase().includes(searchValue)
        // item.nombreUsuario.toLowerCase().includes(searchValue) ||
        // item.email.toLowerCase().includes(searchValue)
      );
      setAllDatos(newData);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">ACTIVIDADES DE PAGOS </span>
        </div>
        <div className="col-md-12 mb-5">
          <div className="tab-contentAct card shadow">
            <div className="d-flex mb-3 justify-content-between  ">
              <div className="">
                <button
                  onClick={abriModal}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  Registrar Actividad de Pago
                </button>
              </div>

              <div className="">
                <button
                  onClick={reporteActividadPago}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  REPORTE ACTIVIDAD PAGO
                </button>
              </div>

              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Actividad de Asistencia"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  onChange={handleFilter}
                />
              </div>
            </div>

            <TableActividadPago data={allDatos} />
          </div>

          <ModalAP open={open} handleClose={handleClose} size={size} />
        </div>
      </div>
    </div>
  );
};
export default ActividadPago;
