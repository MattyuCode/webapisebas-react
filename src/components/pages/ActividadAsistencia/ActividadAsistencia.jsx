import { FormControl } from "react-bootstrap"; 
import { useEffect, useState } from "react";
import Modal from "../../Utilities/Modals";
import { useNavigate } from "react-router-dom";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import TableActividadAsistencia from "./TableActividadAsistencia";

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
  const handleClose = () => setOpen(false);
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const { GetAllActividadAsistencia } = UseMetods();
  const { data: datos, isSuccess } = useQuery({
    queryKey: ["GetAllActividadAsistencia"],
    queryFn: GetAllActividadAsistencia,
  });

  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  useEffect(() => {
    if (isSuccess) {
      setDatas(datos?.Result);
    }
  }, []);

  const getData = () => {
    if (sortColumn && sortType) {
      return datas.sort((a, b) => {
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
    return datas;
  };

  const listaDatas = getData().filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i <= end;
  });

  const reporteActividadAsistencia = () => {
    navigate("/personas-sin-asistencia");
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
                  onClick={() => handleOpen("lg")}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  Registrar Actividad de Asistencia
                </button>
              </div>

              <div className="">
                <button
                  onClick={reporteActividadAsistencia}
                  className="btn btnCrea btn-success text-decoration-none"
                  style={{ width: "100%" }}
                >
                  REPORTE ACTIVIDAD
                </button>
              </div>

              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Actividad de Asistencia"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  // onChange={handleFilter}
                />
              </div>
            </div>

            <TableActividadAsistencia data={datas} />
          </div>

          {/* <Modals open={open} handleClose={handleClose} /> */}
        </div>
      </div>
    </div>
  );
};

export default ActividadAsistencia;
