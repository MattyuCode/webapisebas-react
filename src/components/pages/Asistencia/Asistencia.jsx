import { FormControl } from "react-bootstrap";
import TableComponent from "../../Utilities/TableComponent";
import { useEffect, useState } from "react";
import Modals from "../../Utilities/Modals";
import { useQuery } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { GridAsistencia } from "./GridAsistencia";

const Asistencia = () => {
  const [datas, setDatas] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };

  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

  const { GetAllAsistencia } = UseMetods();
  const abriModal = () => handleOpen("sm");

  //NOTE: useQuery

  const { data } = useQuery({
    queryKey: ["GetAllAsistencia"],
    queryFn: GetAllAsistencia,
  });

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">Listado de asistencias </span>
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
                  Registrar Asistencia
                </button>
              </div>

              <div className="">
                <FormControl
                  type="search"
                  placeholder="Buscar Asistencia"
                  className="inpuBuscar"
                  style={{ width: "100%" }}
                  // onChange={handleFilter}
                />
              </div>
            </div>

            <GridAsistencia data={data?.Result} />
          </div>

          <ModalAsistencia open={open} handleClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
