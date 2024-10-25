import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, FormControl, Button, Spinner } from "react-bootstrap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { useDebounce } from "../../Hooks/useDebounce";

const PersonaSinPago = () => {
    const API_Services = import.meta.env.VITE_APP_MY_API;
    const [idTipoPago, setIdTipoPago] = useState ([]);
    const [personaSinPago, setPersonaSinPago] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {GetAllSinPago } = UseMetods();
    const [buscar, setBuscar] = useState("");

    const debounceBuscar = useDebounce(buscar, 500);

    const { data: datosP, isSuccess: SuccesRol } = useQuery({
      queryKey: ["GetAllSinPago", idTipoPago],
      queryFn: () => GetAllSinPago(idTipoPago),
      enabled: !!idTipoPago,
    });
    console.log("🚀 ~ PersonaSinPago ~ datosP:", datosP)

      useEffect(() => {
        if (debounceBuscar) {
          setIdTipoPago(debounceBuscar);
        } else {
          setIdTipoPago("");
        }
      }, [debounceBuscar]);

      const handleGrupoChange = (e) => {
        const inputValue = e.target.value;
        console.log("🚀 ~ handleGrupoChange ~ inputValue:", inputValue);
        setBuscar(inputValue);
      };

      
  return (
    <div className="container">
      <h2>BUSCAR PAGOS CON PERSONAS PENDIENTES</h2>
      <div className="mb-3">
        <FormControl
          type="number"
          placeholder="Ingrese ID DE PAGO"
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
            <th>CANTIDAD</th>
            <th>Nombre ACTIVIDAD PAGO</th>
            
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
                <td>{persona.nombre_actividad}</td>
               
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
    </div>
  );
}
export default PersonaSinPago;