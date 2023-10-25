import { FormControl } from "react-bootstrap";
import TableComponent from "../../Utilities/TableComponent";
import { useEffect, useState } from "react";
import Modals from "../../Utilities/Modals";

const Asistencia = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");
  const [datas, setDatas] = useState([]);
  const [filterTarea, setFilterTarea] = useState([]);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

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

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const listaDatas = getData().filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i <= end;
  });

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  useEffect(() => {
    const Api_Fetch = async () => {
      try {
        const response = await fetch(
          `${API_Services}/api/CRUDASISTENCIA/ConsultarAsistencia`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json();
        console.log(data);
        setDatas(data);
        setFilterTarea(data);

        const response1 = await fetch(`${API_Services}/api/CRUD/ConsultarRol`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data1 = await response1.json();
        // setSelectedRol(data1);
      } catch (error) {
        console.log(error);
      }
    };
    Api_Fetch();
  }, [API_Services, token]);

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
                  onClick={() => handleOpen("lg")}
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

            <TableComponent
              data={listaDatas}
              onSortColumn={handleSortColumn}
              sortColumn={sortColumn}
              sortType={sortType}
              loading={loading}
              limit={limit}
              page={page}
              onChangePage={setPage}
              onChangeLimit={handleChangeLimit}
            />
          </div>

          <Modals open={open} size={modalSize} handleClose={handleClose} />
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
