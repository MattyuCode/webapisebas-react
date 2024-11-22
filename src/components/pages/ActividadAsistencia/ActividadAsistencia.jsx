import { FormControl } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import TableActividadAsistencia from "./TableActividadAsistencia";
import ModalAcAsis from "./ModalAcAsis";
import { ModelContext } from "../../Context/ModelContext";

const ActividadAsistencia = () => {
  const [datas, setDatas] = useState([]);
  const [filterTarea, setFilterTarea] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const navigate = useNavigate();
  const { upDatos, setIsEdit, IsEdit } = useContext(ModelContext);
  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

  const { GetAllActividadAsistencia } = UseMetods();

  const { data: datos, isSuccess } = useQuery({
    queryKey: ["GetAllActividadAsistencia"],
    queryFn: GetAllActividadAsistencia,
  });

  const reporteActividadAsistencia = () => navigate("/personas-sin-asistencia");
  const abriModal = () => handleOpen("xs");

  useEffect(() => {
    if (isSuccess) {
      setDatas(datos?.Result);
    }
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit, isSuccess, datos]);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setDatas(datos?.Result);
    } else {
      const newData = datos?.Result?.filter(
        (item) => item.nombreActividad.toLowerCase().includes(searchValue)
        // item.nombreUsuario.toLowerCase().includes(searchValue) ||
        // item.email.toLowerCase().includes(searchValue)
      );
      setDatas(newData);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">
            ACTIVIDADES DE ASISTENCIAS{" "}
          </span>
        </div>
        <div className="col-md-12 mb-5">
          <div className="tab-contentAct card shadow">
            <div className="d-flex mb-3 justify-content-between  ">
              <div className="">
                <button
                  onClick={() => handleOpen("xs")}
                  // onClick={abriModal}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  Registrar Actividad de Asistencia
                </button>
              </div>

              {/* <div className="">
                <button
                  onClick={reporteActividadAsistencia}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  REPORTE ACTIVIDAD
                </button>
              </div> */}

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

            <TableActividadAsistencia data={datas} />
          </div>

          <ModalAcAsis open={open} handleClose={handleClose} size={size} />
        </div>
      </div>
    </div>
  );
};

export default ActividadAsistencia;
