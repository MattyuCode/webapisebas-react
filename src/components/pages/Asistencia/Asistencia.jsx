import { FormControl } from "react-bootstrap";
import TableComponent from "../../Utilities/TableComponent";
import { useContext, useEffect, useState } from "react";
import Modals from "../../Utilities/Modals";
import { useQuery } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { ModalAsistencia } from "./ModalAsistencia";
import { ModelContext } from "../../Context/ModelContext";
import { GridAsistencia} from "./GridAsistencia"

const Asistencia = () => {
  const { setIsEdit, IsEdit } = useContext(ModelContext);
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

  useEffect(() => {
    if (IsEdit) {
      abriModal();
    }
  }, [IsEdit]);

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

          <ModalAsistencia open={open} handleClose={handleClose} size={size} />
        </div>
      </div>
    </div>
  );
};

export default Asistencia;
