import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UseMetods } from "../../Utilities/UseMetods";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "rsuite";
import { Button as Boton, Pagination, Table } from "rsuite";
import { ModelContext } from "../../Context/ModelContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const ModalAsistencia = ({ open, handleClose, size }) => {
  const queryClient = useQueryClient();
  const {
    GetAllPersonas,
    GetAllActividadAsistencia,
    postAsistencia,
    updateAsis,
  } = UseMetods();
  
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

  const { data: actividad, isSuccess } = useQuery({
    queryKey: ["GetAllActividadAsistencia"],
    queryFn: GetAllActividadAsistencia,
  });

  const personaOptions = persona?.map((item) => ({
    value: item.idPersona,
    label: item.nombreApellido,
  }));

  const actividadOptions = actividad?.Result?.map((item) => ({
    value: item.idActividadAsistencia,
    label: item.nombreActividad,
  }));

  const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre completo es requerido!"),
    persona: yup
      .object()
      .shape({
        value: yup.string().required("El sector es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("El sector es requerido!"),
    actividad: yup
      .object()
      .shape({
        value: yup.string().required("El sector es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("El sector es requerido!"),
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
      setValue("nombreCompleto", upDatos.descripcion);

      const personaEncontrado = personaOptions.find(
        (opt) => Number(opt.value) === upDatos.idPersona.idPersona
      );

      if (personaEncontrado) {
        setValue("persona", personaEncontrado);
        setPersonaSeleccionado(personaEncontrado);
      }
      const actividadEncontrado = actividadOptions.find(
        (opt) =>
          Number(opt.value) === upDatos.tipoAsistencia.idActividadAsistencia
      );
      if (actividadEncontrado) {
        setValue("actividad", actividadEncontrado);
        setActividadSeleccionado(actividadEncontrado);
      }
    }
  }, [IsEdit, upDatos, setValue]);

  const postAsistenciaMutation = useMutation({
    mutationFn: (dataNew) => postAsistencia(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllAsistencia");
      Swal.fire({
        title: "Registrado..!",
        text: `Asistencia registrado`,
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
    mutationFn: (dataNew) => updateAsis(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllAsistencia");
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

  const resetForm = () => {
    reset();
    setPersonaSeleccionado(null);
    setActividadSeleccionado(null);
  };

  const onSubmit = async (data) => {
    const obj = {
      idPersona: data.persona.value,
      tipoAsistencia: data.actividad.value,
      descripcion: data.nombreCompleto,
      idUsuarioRegistro: localStorage.getItem("idUsario"),
      idUsuarioModifica: localStorage.getItem("idUsario"),
    };
    const update = {
      idAsistencia: upDatos.idAsistencia,
      idPersona: data.persona.value,
      tipoAsistencia: data.actividad.value,
      descripcion: data.nombreCompleto,
      idUsuarioRegistro: localStorage.getItem("idUsario"),
      idUsuarioModifica: localStorage.getItem("idUsario"),
    };
    if (!IsEdit) {
      await postAsistenciaMutation.mutateAsync(obj);
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
        <h5 className="text-center">
          {IsEdit ? "Editar Asistencia" : "Nueva Asistencia"}
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
                      <label className="form-label h5">
                        Descripción de pago
                      </label>
                      <input
                        type="text"
                        placeholder="Descripción de pago"
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
