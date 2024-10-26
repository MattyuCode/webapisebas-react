import Select from "react-select";
import React, { useContext, useEffect, useState } from "react";
import { UseMetods } from "../../Utilities/UseMetods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ModelContext } from "../../Context/ModelContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import Swal from "sweetalert2";

const ModalPago = ({ open, handleClose, size }) => {
  const queryClient = useQueryClient();

  const { GetAllPersonas, GetAllActividadPago, insertPago, updatePago } =
    UseMetods();
  const cerrar = () => {
    handleClose();
    resetForm();
  };
  const [personaSeleccionado, setPersonaSeleccionado] = useState(null);
  const handlePersona = (value) => setPersonaSeleccionado(value);
  const [actividadSeleccionado, setActividadSeleccionado] = useState(null);
  const handleActividad = (value) => setActividadSeleccionado(value);
  const { upDatos, IsEdit, setIsEdit } = useContext(ModelContext);

  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const { data: persona } = useQuery({
    queryKey: ["GetAllPersonas"],
    queryFn: GetAllPersonas,
  });
  const { data: actividad } = useQuery({
    queryKey: ["GetAllActividadPago"],
    queryFn: GetAllActividadPago,
  });

  const personaOptions = persona?.map((item) => ({
    value: item.idPersona,
    label: item.nombreApellido,
  }));

  const actividadOptions = actividad?.map((item) => ({
    value: item.idActividadPago,
    label: item.nombreActividad,
  }));

  const schema = yup.object().shape({
    descrip: yup.string().required("El nombre es requerido!"),
    persona: yup
      .object()
      .shape({
        value: yup.string().required("La persona es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("La persona es requerido!"),
    actividad: yup
      .object()
      .shape({
        value: yup.string().required("La actividad es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("La actividad es requerido!"),
    cantidad: yup
      .number()
      .typeError("Debe ser un número")
      .positive("La cantidad debe ser positiva"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (IsEdit) {
      setValue("descrip", upDatos.descripcion);

      const personaEncontrado = personaOptions.find(
        (opt) => Number(opt.value) === upDatos.idPersona.idPersona
      );

      if (personaEncontrado) {
        setValue("persona", personaEncontrado);
        setPersonaSeleccionado(personaEncontrado);
      }
      const actividadEncontrado = actividadOptions.find(
        (opt) => Number(opt.value) === upDatos.idTipoPago.idActividadPago
      );
      if (actividadEncontrado) {
        setValue("actividad", actividadEncontrado);
        setActividadSeleccionado(actividadEncontrado);
      }
      setValue("cantidad", upDatos.idTipoPago.cantidad);
    }
  }, [IsEdit, upDatos, setValue]);

  const resetForm = () => {
    reset();
    setPersonaSeleccionado(null);
    setActividadSeleccionado(null);
  };

  const postAPMutation = useMutation({
    mutationFn: (dataNew) => insertPago(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPago");
      Swal.fire({
        title: "Registrado..!",
        text: `Datos registrado`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
      resetForm();
    },
    onError: (error) => {
      toast.error(`${error.data?.mensaje}`, {
        theme: "colored",
      });
    },
  });

  const updatePersonaMutation = useMutation({
    mutationFn: (dataNew) => updatePago(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPago");
      Swal.fire({
        title: "Actualizado..!",
        text: `Datos Actualizado`,
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

  const onSubmit = async (data) => {
    const obj = {
      idPersona: data.persona.value,
      idTipoPago: data.actividad.value,
      descripcion: data.descrip,
      cantidad_Q: data.cantidad,
      idUsuarioRegistro: localStorage.getItem("idUsario"),
      idUsuarioModifica: localStorage.getItem("idUsario"),
    };
    const update = {
      idPago: upDatos.idPago,
      idPersona: data.persona.value,
      idTipoPago: data.actividad.value,
      descripcion: data.descrip,
      cantidad_Q: data.cantidad,
      idUsuarioRegistro: localStorage.getItem("idUsario"),
      idUsuarioModifica: localStorage.getItem("idUsario"),
    };
    if (!IsEdit) {
      await postAPMutation.mutateAsync(obj);
    } else {
      await updatePersonaMutation.mutateAsync(update);
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
        <h5 className="text-center">{IsEdit ? "Editar Pago" : "Nuevo pago"}</h5>
      </Modal.Header>

      <Modal.Body>
        <div className="container border p-3">
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">
                        Descripción de pago
                      </label>
                      <input
                        type="text"
                        placeholder="Descripción de pago"
                        className="form-control"
                        {...register("descrip")}
                      />
                      {errors.descrip && (
                        <p className="text-danger">{errors.descrip.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Persona</label>
                      <Controller
                        name="persona"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={personaOptions}
                            placeholder="Selecciona una persona"
                            value={personaSeleccionado}
                            onChange={(value) => {
                              handlePersona(value);
                              setValue("persona", value);
                              clearErrors("persona");
                            }}
                          />
                        )}
                      />
                      {errors.persona && (
                        <p className="text-danger">
                          {errors.persona.value?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Actividad</label>
                      <Controller
                        name="actividad"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={actividadOptions}
                            placeholder="Selecciona una actividad"
                            value={actividadSeleccionado}
                            onChange={(value) => {
                              handleActividad(value);
                              setValue("actividad", value);
                              clearErrors("actividad");
                            }}
                          />
                        )}
                      />
                      {errors.actividad && (
                        <p className="text-danger">
                          {errors.actividad.value?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-outline mb-5">
                      <label className="form-label h5">Cantidad</label>
                      <input
                        type="text"
                        placeholder="Cantidad"
                        className="form-control"
                        {...register("cantidad")}
                      />
                      {errors.cantidad && (
                        <p className="text-danger">{errors.cantidad.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center">
                  <Boton onClick={cerrar} color="red" appearance="primary">
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

export default ModalPago;
