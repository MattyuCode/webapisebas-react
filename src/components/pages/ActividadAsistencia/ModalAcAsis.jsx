import React, { useContext, useEffect, useState } from "react";
import { Button, Modal } from "rsuite";
import { UseMetods } from "../../Utilities/UseMetods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { ModelContext } from "../../Context/ModelContext";

const ModalAcAsis = ({ open, handleClose, size }) => {
  const queryClient = useQueryClient();
  const { postAcAsis, updateAcAsis } = UseMetods();
  const [nameActivity, setNameActivity] = useState("");
  const [error, setError] = useState("");
  const { upDatos, IsEdit } = useContext(ModelContext);
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const postAAsMutation = useMutation({
    mutationFn: (dataNew) => postAcAsis(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllActividadAsistencia");
      Swal.fire({
        title: "Registrado..!",
        text: `Actividad Asistencia registrado`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const putAAsMutation = useMutation({
    mutationFn: (dataNew) => updateAcAsis(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllActividadAsistencia");
      Swal.fire({
        title: "Actualizado..!",
        text: `Actividad Asistencia actualizado`,
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameActivity) {
      setError("Campo obligatario");
      return;
    }
    const newData = {
      nombreActividad: nameActivity,
      idUsuario: localStorage.getItem("idUsario"),
    };
    const upData = {
      idActividadAsistencia: upDatos?.idActividadAsistencia,
      nombreActividad: nameActivity,
      idUsuario: upDatos?.idUsuario,
    };
    if (!IsEdit) {
      await postAAsMutation.mutate(newData);
    } else {
      await putAAsMutation.mutate(upData);
    }

    setNameActivity("");
  };

  const handleValue = (data) => {
    const value = data.target.value;
    setNameActivity(value);
    if (value) {
      setError("");
    }
  };

  useEffect(() => {
    if (IsEdit) {
      const { nombreActividad } = upDatos;
      setNameActivity(nombreActividad);
    }
  }, [IsEdit]);

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      size={modalSize}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>
        <p className="text-center">
          {/* {IsEdit */}
          {/* ? "Editar Actividad Asistencia" */}
          {/* : "Nueva Actividad Asistencia" */}
          Insertar nuevo
        </p>
      </Modal.Header>

      <Modal.Body>
        <div className="container border p-3">
          <div className="row">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-outline mb-5">
                    <label className="form-label ">
                      Nombre Actividad asistencia
                    </label>
                    <input
                      type="text"
                      placeholder="Ingresa una actividad asistencia"
                      className="form-control"
                      value={nameActivity}
                      onChange={handleValue}
                    />
                    {error && <p className="text-danger">{error}</p>}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <Button onClick={handleClose} color="red" appearance="primary">
                  Cerrar
                </Button>
                &nbsp; &nbsp;
                <Button type="submit" color="green" appearance="primary">
                  <i className="fas fa-save"></i> &nbsp;{" "}
                  {/* {IsEdit ? "Editar" : "Guardar"} */}Add
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAcAsis;
