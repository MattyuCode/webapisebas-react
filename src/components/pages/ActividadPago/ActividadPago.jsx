import { FormControl } from "react-bootstrap"; 
import { useEffect, useState } from "react";
import Modal from "../../Utilities/Modals";
import { useNavigate } from "react-router-dom";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import TableActividadPago from "./TableActividadPago";

const ActividadPago = () => {
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
  const { GetAllActividadPago} = UseMetods();
  const { data: datos, isSuccess} = useQuery({
    queryKey: ["GetAllActividadPago"],
    queryFn: GetAllActividadPago,
  });
  console.log("----->", datos)
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

  const reporteActividadPago = () => {
    navigate("/personas-sin-pago");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">
            ACTIVIDADES DE PAGOS{" "}
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
                  // onChange={handleFilter}
                />
              </div>
            </div>

            <TableActividadPago data={datas} />
          </div>

          {/* <Modals open={open} handleClose={handleClose} /> */}
        </div>
      </div>
    </div>
  );
};
export default ActividadPago;