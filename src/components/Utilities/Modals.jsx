import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import * as yup from "yup";

const Modals = ({ open, handleClose }) => {
  const [size, setSize] = useState(false);
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre completo es requerido!"),
    telefono: yup
      .number()
      .typeError("Debe ser un número")
      .min(10000000, "El número de teléfono debe tener al menos 8 dígitos")
      .required("El teléfono es requerido!"),
    sector: yup
      .number()
      .typeError("Debe ser un número")
      .min(2, "El número de sector debe tener al menos 2 dígitos")
      .required("El sector es requerido!"),
    fecharegistro: yup.date().required("La fecha es requerida!"),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size={modalSize}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>
        <h5 className="text-center">Nueva Persona</h5>
      </Modal.Header>

      <Modal.Body>
        <div className="container border p-3">
          <div className="row ">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Nombre completo</label>
                      <input
                        type="text"
                        placeholder="Nombre completo"
                        className="form-control"
                        {...register("nombreCompleto")}
                      />
                      {errors.nombreCompleto && (
                        <p className="text-danger">
                          {errors.nombreCompleto.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Teléfono</label>
                      <input
                        type="number"
                        placeholder="Teléfono"
                        className="form-control"
                        {...register("telefono")}
                      />
                      {errors.telefono && (
                        <p className="text-danger">{errors.telefono.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Sector</label>
                      <input
                        type="number"
                        placeholder="Sector"
                        className="form-control"
                        {...register("sector")}
                      />
                      {errors.sector && (
                        <p className="text-danger">{errors.sector.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Fecha de Registro</label>
                      <input
                        type="date"
                        placeholder="Fecha de Registro"
                        className="form-control"
                        {...register("fecharegistro")}
                      />
                      {errors.fecharegistro && (
                        <p className="text-danger">
                          {errors.fecharegistro.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <Boton onClick={handleClose} color="red" appearance="primary">
                    Cerrar
                  </Boton>&nbsp; &nbsp;
                  <Boton type="submit" color="green" appearance="primary">
                    <i className="fas fa-save"></i> &nbsp; Guardar
                  </Boton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Modals;
