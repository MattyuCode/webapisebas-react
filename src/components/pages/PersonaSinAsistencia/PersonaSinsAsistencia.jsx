import { FaArrowLeft } from "react-icons/fa6";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import { Table, FormControl, Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { MdSimCardDownload } from "react-icons/md";
import jsPDF from "jspdf";
import { PdfGenerate } from "../../Utilities/PdfGenerate";

const PersonasSinAsistencia = () => {
  const pageSizes = [5, 10, 25, 50, 100];
  const { idActividadAsistencia } = useParams();
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const [tipoAsistencia, setTipoAsistencia] = useState("");
  const [personasSinAsistencia, setPersonasSinAsistencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { GetAllSinAsistencia } = UseMetods();
  const [buscar, setBuscar] = useState("");
  const navigate = useNavigate();
  const debounceBuscar = useDebounce(buscar, 500);
  const dataGridRef = useRef(null);

  const { data: datos, isSuccess: SuccesRol } = useQuery({
    queryKey: ["GetAllSinAsistencia", idActividadAsistencia],
    queryFn: () => GetAllSinAsistencia(idActividadAsistencia),
    enabled: !!idActividadAsistencia,
  });
  console.log("🚀 ~ PersonasSinAsistencia ~ datos:", datos)

  useEffect(() => {
    if (debounceBuscar) {
      setTipoAsistencia(debounceBuscar);
    } else {
      setTipoAsistencia("");
    }
  }, [debounceBuscar]);

  const handleGrupoChange = (e) => {
    const inputValue = e.target.value;
    setBuscar(inputValue);
  };

  const regresar = () => navigate("/actividadAsistencia");

  const generarReporte = () => {
    const reporteData = {
      idActividadAsistencia: idActividadAsistencia,
      nombreActividad: datos?.data[0]?.nombreActividad,
      listaPersonas: datos.data,
    };

    PdfGenerate({ data: reporteData });
  };

  return (
    <div className="container">
      <div className="mb-3">
        {/* <FormControl
          type="number"
          placeholder="Ingrese ID tipo Asistencia"
          value={buscar}
          onChange={handleGrupoChange}
        /> */}
      </div>

      {loading && <Spinner animation="border" variant="primary" />}

      {error && <p className="text-danger">{error}</p>}

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
          <h2 className="text-center">
            Reporte de asistencias de personas pendientes con el ID{" "}
            {idActividadAsistencia}
          </h2>

          <h4
            className="text-center mb-3"
            style={{ background: "#3d3d3d", color: "white" }}
          >
            {datos?.data[0]?.nombreActividad}
          </h4>

          <table className="table table-hover ">
            <thead>
              <tr className="table-primary">
                <th scope="col">ID Persona</th>
                <th scope="col">Nombre y Apellido</th>
              </tr>
            </thead>
            <tbody>
              {datos?.data.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{item.idPersona}</th>
                  <td>{item.nombreApellido}</td>{" "}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonasSinAsistencia;
