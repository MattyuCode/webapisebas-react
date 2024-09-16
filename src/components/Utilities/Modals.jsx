import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import * as yup from "yup";
import { UseMetods } from "./UseMetods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Swal from "sweetalert2";
import { ModelContext } from "../Context/ModelContext";

const Modals = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const { postPersonas, modificarPersonas } = UseMetods();
  const [sectorSeleccionado, setSectorSelccionado] = useState(null);
  const { upDatos, IsEdit, setIsEdit } = useContext(ModelContext);
  const [size, setSize] = useState(false);
  const handleSelectSector = (value) => setSectorSelccionado(value);
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const options = [
    { value: "01", label: "Sector 1" },
    { value: "02", label: "Sector 2" },
  ];

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

  useEffect(() => {
    if (IsEdit) {
      setValue("nombreCompleto", upDatos[0].nombreApellido);
      setValue("telefono", upDatos[0].telefono);
      const sectorEncontrado = options.find(
        (opt) => Number(opt.value) === upDatos[0].sector
      );
      if (sectorEncontrado) {
        setValue("sector", sectorEncontrado);
        setSectorSelccionado(sectorEncontrado);
      }
      setValue("numDpi", upDatos[0].dpi);
    }
  }, [IsEdit, upDatos, setValue]);

  const postPersonasMutation = useMutation({
    mutationFn: (dataNew) => postPersonas(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Registrado..!",
        text: `Persona registrado`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
      resetForm();
      setIsEdit(false);
    },
    onError: (error) => {
      toast.error(`${error.data?.mensaje}`, {
        theme: "colored",
      });
    },
  });
  const updatePersonaMutation = useMutation({
    mutationFn: (dataNew) => modificarPersonas(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Actualizado..!",
        text: `Persona Actualizado`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
      setIsEdit(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`${error.data?.mensaje}`, {
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
    const update = {
      idPersona: upDatos[0]?.idPersona,
      nombreApellido: data.nombreCompleto,
      telefono: data.telefono,
      sector: data.sector.value,
      dpi: data.numDpi,
    };
    // console.log("🚀 ~ onSubmit ~ obj:", update);
    console.log("🚀 ~ onSubmit ~ IsEdit:", IsEdit);
    if (IsEdit) {
      updatePersonaMutation.mutateAsync(update);
    } else {
      postPersonasMutation.mutateAsync(obj);
    }
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
        <h5 className="text-center">
          {IsEdit ? "Editar Persona" : "Nueva Persona"}
        </h5>
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
                    <i className="fas fa-save"></i> &nbsp;{" "}
                    {IsEdit ? "Editar" : "Guardar"}
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
