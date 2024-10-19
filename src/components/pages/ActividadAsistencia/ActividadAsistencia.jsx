import { FormControl } from "react-bootstrap";
import TableComponent from "../../Utilities/TableComponent";
import { useEffect, useState } from "react";
import Modal from "../../Utilities/Modals";
import { useNavigate } from "react-router-dom";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";


const ActividadAsistencia = () => {
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
    const {GetAllActividadAsistencia} = UseMetods();
    const { data: datos } = useQuery({
      queryKey: ["GetAllActividadAsistencia"],
      queryFn: GetAllActividadAsistencia
    });
    console.log(datos.Result)
    const navigate = useNavigate()

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

useEffect (()=>{
const Api_Fetch = async () =>{
  try {
    const response = await fetch (
      `${API_Services}/api/CRUDACTIVIDADASISTENCIA/ConsultarActividad`,
      {headers: {Authotization: `Bearer ${token}`}}
     );
     const data = await response.json();
     console.log(data);
     setDatas(data);
     setFilterTarea(data);

     const response1 = await fetch(`${API_Services}/api/CRUD/ConsultarRol`,{
      headers: {Authotization: `Bearer ${token}`},
     });
     const data1 = await response1.json();

  }catch (error){
    console.log(error);
  }
}
Api_Fetch();
},[API_Services, token]);

  const reporteActividadAsistencia = ()=>{
    navigate("/personas-sin-asistencia")
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <span className="titless text-center">ACTIVIDADES DE ASISTENCIAS </span>
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
                  style={{width: "100%" }}
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

          {/* <Modals open={open} handleClose={handleClose} /> */}
        </div>
      </div>
    </div>
  );
};

export default ActividadAsistencia;

