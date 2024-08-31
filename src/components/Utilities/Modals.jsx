import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import * as yup from "yup";
import { UseMetods } from "./UseMetods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Swal from "sweetalert2";

const Modals = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const { postPersonas } = UseMetods();
  const [sectorSeleccionado, setSectorSelccionado] = useState(null);
  const [size, setSize] = useState(false);
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const options = [
    { value: "01", label: "Sector 1" },
    { value: "02", label: "Sector 2" },
  ];

  const handleSelectSector = (value) => setSectorSelccionado(value);

  const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre completo es requerido!"),
    telefono: yup
      .string()
      .typeError("Debe ser un número")
      .length(8, "El número de teléfono debe tener exactamente 8 dígitos")
      .required("El teléfono es requerido!"),
    sector: yup
      .object()
      .shape({
        value: yup.string().required("El sector es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("El sector es requerido!"),
    numDpi: yup
      .string()
      .matches(/^\d+$/, "Debe ser un número")
      .length(13, "El número de DPI debe tener exactamente 13 dígitos")
      .required("El DPI es requerido!"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const MutationPostPersonas = useMutation({
    mutationFn: (dataNew) => postPersonas(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Registrado..!",
        html: `<h1>Persona registrado</h1>`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
      resetForm();
    },
    onError: (error) => {
      toast.error(`${error.data?.mensaje}`, {
        // position: "top-left",
        theme: "colored",
      });
    },
  });

  const resetForm = () => {
    reset();
    setSectorSelccionado(null);
  };

  const onSubmit = (data) => {
    const obj = {
      nombreApellido: data.nombreCompleto,
      telefono: data.telefono,
      sector: data.sector.value,
      idUsuarioRegistro: localStorage.getItem("idUsario"),
      dpi: data.numDpi,
    };
    MutationPostPersonas.mutateAsync(obj);
    //console.log(obj);
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
          <div className="row">
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
                      <Controller
                        name="sector"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={options}
                            placeholder="Selecciona un Sector"
                            value={sectorSeleccionado}
                            onChange={(value) => {
                              handleSelectSector(value);
                              setValue("sector", value);
                            }}
                          />
                        )}
                      />
                      {errors.sector && (
                        <p className="text-danger">
                          {errors.sector.value?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">DPI</label>
                      <input
                        type="number"
                        placeholder="Ingresa número DPI"
                        className="form-control"
                        {...register("numDpi")}
                      />
                      {errors.numDpi && (
                        <p className="text-danger">{errors.numDpi.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <Boton onClick={handleClose} color="red" appearance="primary">
                    Cerrar
                  </Boton>
                  &nbsp; &nbsp;
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
