import { useContext, useEffect, useState } from "react";
import TablePersonas from "../../Hooks/TablePersonas";
import { useQuery } from "@tanstack/react-query";
import { FormControl } from "react-bootstrap";
import Modals from "../../Utilities/Modals";
import { ToastContainer } from "react-toastify";
import { ModelContext } from "../../Context/ModelContext";
import { UseMetods } from "../../Utilities/UseMetods";

const Personas = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const { IsEdit, setIsEdit } = useContext(ModelContext);
  const { GetAllPersonas, updateStateUser } = UseMetods();
  const token = localStorage.getItem("access_token");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const [allDatos, setAllDatos] = useState([]);

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };

  const abriModal = () => handleOpen("sm");

  const { data: AllPerson, isSuccess } = useQuery({
    queryKey: ["GetAllPersonas"],
    queryFn: GetAllPersonas,
  });

  useEffect(() => {
    if (isSuccess) {
      setAllDatos(AllPerson);
    }
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit, AllPerson, isSuccess]);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setAllDatos(AllPerson);
    } else {
      const newData = AllPerson.filter(
        (item) => item.nombreApellido.toLowerCase().includes(searchValue)
        // item.nombreUsuario.toLowerCase().includes(searchValue) ||
        // item.email.toLowerCase().includes(searchValue)
      );
      setAllDatos(newData);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <span className="titless text-center">Listado de Personas </span>
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
                    Registrar Personas
                  </button>
                </div>

                <div className="">
                  <FormControl
                    type="search"
                    placeholder="Buscar Personas"
                    className="inpuBuscar"
                    style={{ width: "100%" }}
                    onChange={handleFilter}
                  />
                </div>
              </div>
              <TablePersonas data={allDatos} />
              <Modals open={open} handleClose={handleClose} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Personas;
