import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, FormControl, Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { useDebounce } from "../../Hooks/useDebounce";

const PersonasSinAsistencia = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const [tipoAsistencia, setTipoAsistencia] = useState("");
  const [personasSinAsistencia, setPersonasSinAsistencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { GetAllSinAsistencia } = UseMetods();
  const [buscar, setBuscar] = useState("");

  const debounceBuscar = useDebounce(buscar, 500);

  const { data: datos, isSuccess: SuccesRol } = useQuery({
    queryKey: ["GetAllSinAsistencia", tipoAsistencia],
    queryFn: () => GetAllSinAsistencia(tipoAsistencia),
    enabled: !!tipoAsistencia,
  });

  useEffect(() => {
    if (debounceBuscar) {
      setTipoAsistencia(debounceBuscar);
    } else {
      setTipoAsistencia("");
    }
  }, [debounceBuscar]);

  const handleGrupoChange = (e) => {
    const inputValue = e.target.value;
    console.log("🚀 ~ handleGrupoChange ~ inputValue:", inputValue);
    setBuscar(inputValue);
  };

  return (
    <div className="container">
      <h2>Buscar Personas Sin Asistencia</h2>
      <div className="mb-3">
        <FormControl
          type="number"
          placeholder="Ingrese ID tipo Asistencia"
          value={buscar}
          onChange={handleGrupoChange}
        />
      </div>

      {loading && <Spinner animation="border" variant="primary" />}

      {error && <p className="text-danger">{error}</p>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID Persona</th>
            <th>Nombre y Apellido</th>
            <th>Nombre Actividad</th>
          </tr>
        </thead>
        <tbody>
          {/* Si hay personas, las mostramos en la tabla */}
          {datos?.data.length > 0 ? (
            datos.data.map((persona) => (
              <tr key={persona.idPersona}>
                <td>{persona.idPersona}</td>
                <td>{persona.nombreApellido}</td>
                <td>{persona.nombreActividad}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No se encontraron personas sin asistencia
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PersonasSinAsistencia;
