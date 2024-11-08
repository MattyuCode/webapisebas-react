import React, { useContext, useEffect, useState } from "react";
import { FormControl } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import TablePagos from "./TablePagos";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import ModalPago from "./ModalPago";
import { ModelContext } from "../../Context/ModelContext";

const Pagos = () => {
  const { IsEdit, setIsEdit } = useContext(ModelContext);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState(false);
  const { GetAllPago } = UseMetods();
  const { data, isSuccess } = useQuery({
    queryKey: ["GetAllPago"],
    queryFn: GetAllPago,
  });
  console.log("🚀 ~ Pagos ~ data:", data)

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
  };
  const handleOpen = (value) => {
    setSize(value);
    setOpen(true);
  };
  const abriModal = () => handleOpen("lg");

  useEffect(() => {
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit]);

  return (
    <div className="d-flex justify-content-center py-4">
      <div className="position-relative d-flex flex-column w-100 bg-white text-secondary border border-warning rounded-3 shadow-lg">
        <div
          style={{
            bottom: "25px",
            background: "linear-gradient(to left, #3a7bd5, #3a6073)",
            borderBottom: "5px solid #bf9005",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
          className="position-relative mx-3 p-3 text-center text-white rounded-3"
        >
          <h3 className="m-0 fs-3 fw-semibold">PAGOS</h3>
        </div>

        <div className="px-5">
          <div className="d-flex mb-3 justify-content-between  ">
            <div className="">
              <button
                onClick={abriModal}
                className="btn btnCrea btn-success text-decoration-none"
                style={{ width: "100%" }}
              >
                Registrar Pagos
              </button>
            </div>

            <div className="">
              {/* <FormControl
                type="search"
                placeholder="Buscar Personas"
                className="inpuBuscar"
                style={{ width: "100%" }}
                // onChange={handleFilter}
              /> */}
            </div>
          </div>
        </div>
        <div className="row mb-5 px-5">
          {isSuccess && <TablePagos data={data?.Result} />}
          <ModalPago open={open} handleClose={handleClose} size={size} />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Pagos;
