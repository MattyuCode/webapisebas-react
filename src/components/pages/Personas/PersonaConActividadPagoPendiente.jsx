import React, { useEffect, useState } from "react";
import { FormControl, Spinner, Table } from "react-bootstrap";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { MdSimCardDownload } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa6";
import { PdfPagoActividad } from "../../Utilities/PdfPagoActividad";

export const PersonaConActividadPagoPendiente = () => {
  const { idPersona } = useParams();
  const [idPersonas, setIdPersona] = useState("");
  const { GetPersonaConActividadPagoPendiente } = UseMetods();
  const [buscar, setBuscar] = useState("");
  const debounceBuscar = useDebounce(buscar, 500);
  const navigate = useNavigate();

  const {
    data: datos,
    isSuccess,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["GetPersonaConActividadPagoPendiente", idPersona],
    queryFn: () => GetPersonaConActividadPagoPendiente(idPersona),
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
      nombreApellido: datos[0]?.nombreApellido,
      listaPersonas: datos,
    };
    PdfPagoActividad({ data: reporteData });
  };

  const f = () => (isSuccess ? datos[0]?.nombreApellido : null);

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
            Reporte de personas con Pagos pendientes con el ID {idPersona}
          </h4>

          <h4
            className="text-center mb-3"
            style={{ background: "#3d3d3d", color: "white" }}
          >
            {f()}
          </h4>

          <table className="table table-hover ">
            <thead>
              <tr className="table-primary">
                <th>ID Activdad</th>
                <th>Nombre ACTIVIDAD PAGO</th>
                <th>CANTIDAD</th>
              </tr>
            </thead>
            <tbody>
              {datos?.length > 0 ? (
                datos.map((persona, i) => (
                  <tr key={i}>
                    <td>{persona.idActividadPago}</td>
                    <td>{persona.nombreActividad}</td>
                    <td>{persona.cantidad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center">
                    No hay personas pendientes en este pago
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

 
