import React, { useEffect, useState } from "react";
import { FormControl, Spinner, Table } from "react-bootstrap";
import { UseMetods } from "../../Utilities/UseMetods";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate } from "react-router-dom";

const PersonaConActividadPagoPendiente = () => {
  const [idPersona, setIdPersona] = useState("");
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

  return (
    <div className="container">
      <h2>BUSCAR ID PERSONAS CON PAGO PENDIENTE</h2>
      <div className="mb-3">
        <FormControl
          type="number"
          placeholder="Ingrese ID PERSONA"
          value={buscar}
          onChange={handleGrupoChange}
        />
      </div>

      {isLoading && <Spinner animation="border" variant="primary" />}

      {isError && <p className="text-danger">{isError}</p>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Activdad</th>
            <th>Nombre y Apellido</th>
            <th>Nombre ACTIVIDAD PAGO</th>
            <th>CANTIDAD</th>
          </tr>
        </thead>
        <tbody>
          {datos?.length > 0 ? (
            datos.map((persona) => (
              <tr key={persona.idActivdadPago}>
                <td>{persona.idActividadPago}</td>
                <td>{persona.nombreApellido}</td>
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
      </Table>

      <button className="btn btn-danger" onClick={regresar}>
        Regresar
      </button>
    </div>
  );
};
export default PersonaConActividadPagoPendiente;
