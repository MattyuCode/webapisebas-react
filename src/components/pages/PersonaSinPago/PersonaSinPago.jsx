import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, FormControl, Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { useDebounce } from "../../Hooks/useDebounce";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdSimCardDownload } from "react-icons/md";
import { PdfGenerate2 } from "../../Utilities/PdfGenerate2";
import { InfinitySpin } from "react-loader-spinner";

const PersonaSinPago = () => {
  const { idActividadPago } = useParams();
  const API_Services = import.meta.env.VITE_APP_MY_API;
  const [idTipoPago, setIdTipoPago] = useState([]);
  const [personaSinPago, setPersonaSinPago] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { GetAllSinPago } = UseMetods();
  const [buscar, setBuscar] = useState("");
  const navigate = useNavigate();

  const debounceBuscar = useDebounce(buscar, 500);

  const {
    data: datosP,
    isSuccess: SuccesRol,
    isLoading,
  } = useQuery({
    queryKey: ["GetAllSinPago", idActividadPago],
    queryFn: () => GetAllSinPago(idActividadPago),
    enabled: !!idActividadPago,
  });

  useEffect(() => {
    if (debounceBuscar) {
      setIdTipoPago(debounceBuscar);
    } else {
      setIdTipoPago("");
    }
  }, [debounceBuscar]);

  const handleGrupoChange = (e) => {
    const inputValue = e.target.value;
    setBuscar(inputValue);
  };

  const regresar = () => navigate("/actividadPago");
  const generarReporte = () => {
    const reporteData = {
      idActividadPago: idActividadPago,
      nombre_actividad: datosP?.data[0]?.nombre_actividad,
      listaPersonas: datosP.data,
    };

    PdfGenerate2({ data: reporteData });
  };

  return (
    <div className="container">
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="bg-white rounded w-75 p-5 d-flex justify-content-center">
            <InfinitySpin
              visible={true}
              width="200"
              color="#4fa94d"
              ariaLabel="infinity-spin-loading"
            />
          </div>
        </div>
      ) : (
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
            style={{
              padding: "25px",
              background: "white",
              borderRadius: "15px",
            }}
          >
            <h4 className="text-center">
              Reporte de personas con pagos pendientes con el ID{" "}
              {idActividadPago}
            </h4>

            <h4
              className="text-center mb-3"
              style={{ background: "#3d3d3d", color: "white" }}
            >
              {datosP?.data[0]?.nombre_actividad}
            </h4>

            <table className="table table-hover ">
              <thead>
                <tr className="table-primary">
                  <th>ID Persona</th>
                  <th>Nombre y Apellido</th>
                  <th>CANTIDAD</th>
                </tr>
              </thead>
              <tbody>
                {/* Si hay personas, las mostramos en la tabla */}
                {datosP?.data.length > 0 ? (
                  datosP.data.map((persona) => (
                    <tr key={persona.id_persona}>
                      <td>{persona.id_persona}</td>
                      <td>{persona.nombre_apellido}</td>
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
      )}
    </div>
  );
};
export default PersonaSinPago;
