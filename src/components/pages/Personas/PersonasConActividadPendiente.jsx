import React, { useEffect, useState } from "react";
import { FormControl, Spinner, Table } from "react-bootstrap";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdSimCardDownload } from "react-icons/md";
import { PDFAsistencia } from "../../Utilities/PDFAsistencia";

const PersonasConActividadPendiente = () => {
  const { idPersona } = useParams();
  const [idPersonas, setIdPersona] = useState("");
  const { getPersonaConActividad } = UseMetods();
  const [buscar, setBuscar] = useState("");
  const debounceBuscar = useDebounce(buscar, 500);
  const navigate = useNavigate();

  const {
    data: datos,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["getPersonaConActividad", idPersona],
    queryFn: () => getPersonaConActividad(idPersona),
    enabled: !!idPersona,
  });
  useEffect(() => {
    if (debounceBuscar) {
      setIdPersona(debounceBuscar);
    }
  }, [debounceBuscar]);

  const handleGrupoChange = (e) => {
    const inputValue = e.target.value;
    setBuscar(inputValue);
  };
  const regresar = () => navigate("/personas");
  const generarReporte = () => {
    const reporteData = {
      idPersona: idPersona,
      nombreApellido: datos?.Result[0]?.nombreApellido,
      listaPersonas: datos?.Result,
    };

    PDFAsistencia({ data: reporteData });
  };

  return (
    <div className="container">
      <div className="mb-3">
        {/* <FormControl
          type="number"
          placeholder="Ingrese ID PERSONA"
          value={buscar}
          onChange={handleGrupoChange}
        /> */}
      </div>

      {isLoading && <Spinner animation="border" variant="primary" />}

      {isError && <p className="text-danger">{isError}</p>}

      <div>
        <div className="container d-flex justify-content-around mb-3">
          <button className="btn btn-danger" onClick={regresar}>
            <FaArrowLeft />
            &nbsp; Regresar
          </button>

          <button className="btn btn-success" onClick={generarReporte}>
            <MdSimCardDownload /> &nbsp; Descargar Reporte
          </button>
        </div>

        <div
          className="container"
          style={{ padding: "25px", background: "white", borderRadius: "15px" }}
        >
          <h4 className="text-center">
            Reporte de personas con asistencias pendientes con el ID {idPersona}
          </h4>

          <h4
            className="text-center mb-3"
            style={{ background: "#3d3d3d", color: "white" }}
          >
            {datos?.Result[0]?.nombreApellido}
          </h4>

          <table className="table table-hover ">
            <thead>
              <tr className="table-primary">
                <th>ID Activdad</th>
                <th>Nombre de Actividad</th>
              </tr>
            </thead>
            <tbody>
              {datos?.Result?.length > 0 ? (
                datos.Result.map((persona, index) => (
                  <tr key={index}>
                    <td>{persona.idActivdadAsistencia}</td>
                    <td>{persona.nombreActividad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No hay personas pendientes en esta asistencia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonasConActividadPendiente;
