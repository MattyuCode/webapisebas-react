import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, FormControl, Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";

const PersonasSinAsistencia = () => {
  const API_Services = import.meta.env.VITE_APP_MY_API; // Ruta de la API
  const [tipoAsistencia, setTipoAsistencia] = useState("6"); // Estado para el tipo de asistencia
  console.log("🚀 ~ PersonasSinAsistencia ~ tipoAsistencia:", tipoAsistencia);
  const [personasSinAsistencia, setPersonasSinAsistencia] = useState([]); // Estado para los datos de personas
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const { GetAllSinAsistencia } = UseMetods();
  // const debounceBuscar = useDebounce(buscar, 500);


  const { data: datos, isSuccess: SuccesRol } = useQuery({
    queryKey: ["GetAllSinAsistencia", tipoAsistencia],
    queryFn: () => GetAllSinAsistencia(tipoAsistencia),
  });

  // Función para obtener las personas sin asistencia
  const obtenerPersonasSinAsistencia = async () => {
    setLoading(true); // Establecemos estado de carga
    setError(null); // Reiniciamos el error
    try {
      const response = await axios.get(
        `${API_Services}/api/SINASISTENCIA/personaSinAsistencia/${tipoAsistencia}`
      );
      setPersonasSinAsistencia(response.data); // Guardamos los datos en el estado
    } catch (error) {
      setError("Error al obtener los datos."); // En caso de error
    } finally {
      setLoading(false); // Terminamos el estado de carga
    }
  };

  // Función para manejar la búsqueda al presionar el botón
  const handleSearch = () => {
    if (tipoAsistencia) {
      obtenerPersonasSinAsistencia(); // Llamamos la función de búsqueda
    }
  };

  return (
    <div className="container">
      <h2>Buscar Personas Sin Asistencia</h2>
      <div className="mb-3">
        {/* Campo de entrada para buscar por tipo de asistencia */}
        <FormControl
          type="number"
          placeholder="Ingrese ID tipo Asistencia"
          value={tipoAsistencia}
          onChange={(e) => setTipoAsistencia(e.target.value)}
        />
        <Button onClick={handleSearch} className="mt-2">
          Buscar
        </Button>
      </div>

      {/* Mostramos el estado de carga */}
      {loading && <Spinner animation="border" variant="primary" />}

      {/* Mostramos los errores */}
      {error && <p className="text-danger">{error}</p>}

      {/* Mostramos los resultados en una tabla */}
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
