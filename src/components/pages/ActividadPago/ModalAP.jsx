import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ModelContext } from "../../Context/ModelContext";
import { UseMetods } from "../../Utilities/UseMetods";
import Swal from "sweetalert2";

export const ModalAP = ({ open, handleClose, size }) => {
  const queryClient = useQueryClient();
  const { upDatos, IsEdit, setIsEdit } = useContext(ModelContext);
  const { postActividadPagos, putActividadPagos } = UseMetods();
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";
  const schema = yup.object().shape({
    nameActividad: yup.string().required("El nombre es requerido!"),
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

  const cerrar = () => {
    handleClose();
    resetForm();
  };
  const resetForm = () => {
    reset();
  };

  useEffect(() => {
    if (IsEdit) {
      setValue("nameActividad", upDatos.nombreActividad);
      setValue("cantidad", upDatos.cantidad);
    }
  }, [IsEdit, upDatos, setValue]);

  const postAPMutation = useMutation({
    mutationFn: (dataNew) => postActividadPagos(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllActividadPago");
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
    mutationFn: (dataNew) => putActividadPagos(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllActividadPago");
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
      nombreActividad: data.nameActividad,
      cantidad: data.cantidad,
      idUsuario: localStorage.getItem("idUsario"),
    };

    const update = {
      idActividadPago: upDatos.idActividadPago,
      nombreActividad: data.nameActividad,
      cantidad: data.cantidad,
      idUsuario: localStorage.getItem("idUsario"),
    };
    if (IsEdit) {
      await updatePersonaMutation.mutateAsync(update);
    } else {
      await postAPMutation.mutateAsync(obj);
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
          {IsEdit ? "Editar Activdad Pago" : "Nueva Registro "}
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
                        Nombre Actividad pago
                      </label>
                      <input
                        type="text"
                        placeholder="Escribe un nombre"
                        className="form-control"
                        {...register("nameActividad")}
                      />
                      {errors.nameActividad && (
                        <p className="text-danger">
                          {errors.nameActividad.message}
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
