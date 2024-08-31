import React, { useState } from "react";
import TablePersonas from "../../Hooks/TablePersonas";
import { useQuery } from "@tanstack/react-query";
import { Button } from "rsuite";
import { FormControl } from "react-bootstrap";
import Modals from "../../Utilities/Modals";
import { ToastContainer } from "react-toastify";

const Personas = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const token = localStorage.getItem("access_token");
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const abriModal = () => handleOpen("sm");

  const GetAllPersonas = async () => {
    try {
      const response = await fetch(
        `${API_Services}/api/CRUDPERSONAS/ConsultarPersonas`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: AllPerson } = useQuery({
    queryKey: ["GetAllPersonas"],
    queryFn: GetAllPersonas,
  });

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
                    // onChange={handleFilter}
                  />
                </div>
              </div>
              <TablePersonas data={AllPerson} />
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
