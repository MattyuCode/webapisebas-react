import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Button as Boton } from "rsuite";
import * as yup from "yup";
import { UseMetods } from "./UseMetods";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";
import { ModelContext } from "../Context/ModelContext";
// import { schema } from "../pages/Usuario/UsuarioSchema";

const ModalsUser = ({ open, handleClose }) => {
  const queryClient = useQueryClient();
  const { GetRol, postUser, UpdateUser } = UseMetods();
  const { upDatos, IsEdit, setIsEdit } = useContext(ModelContext);
  const [size, setSize] = useState(false);
  const cerrar = () => {
    handleClose();
    resetForm();
  };
  const [selectedRol, setSelectedRol] = useState([]);
  const handleSelectRol = (value) => setSelectedRol(value);
  const modalSize = ["xs", "sm", "md", "lg", "full"].includes(size)
    ? size
    : "lg";

  const { data: allRol } = useQuery({
    queryKey: ["GetRol"],
    queryFn: GetRol,
  });

  const optsRol = allRol?.map((item) => ({
    value: item.idRol,
    label: item.nombreRol,
  }));

  const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre completo es requerido!"),
    nombreUser: yup.string().required("El nombre de usuario es requerido!"),
    telefono: yup
      .string()
      .typeError("Debe ser un número")
      .length(8, "El número de teléfono debe tener exactamente 8 dígitos")
      .required("El teléfono es requerido!"),
    rol: yup
      .object()
      .shape({
        value: yup.string().required("El rol es requerido!"),
        label: yup.string().required(),
      })
      .nullable()
      .required("El rol es requerido!"),
    password: yup.string().when([], {
      is: (value, context) => !context.parent.IsEdit, // Accede a IsEdit desde context.parent
      then: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?])(?!.*\s).{8,}$/,
          "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
        ),
      otherwise: yup.string().notRequired(),
    }),
    confirmPassword: yup.string().when("password", (password, schema) => {
      if (password) {
        return schema
          .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
          .required("Debe confirmar la contraseña.");
      }
      return schema.notRequired();
    }),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    context: { IsEdit }, // Pasamos IsEdit como contexto a yup
  });

  useEffect(() => {
    if (IsEdit) {
      setValue("nombreCompleto", upDatos[0].nombreApellido);
      setValue("telefono", upDatos[0].telefono);
      const rolEncontrado = allRol.find(
        (rol) => rol.idRol === upDatos[0].idRol
      );
      if (rolEncontrado) {
        const formattedRol = {
          value: rolEncontrado.idRol,
          label: rolEncontrado.nombreRol,
        };
        setValue("rol", formattedRol);
        setSelectedRol(formattedRol);
      }
      setValue("nombreUser", upDatos[0].nombreUsuario);
    }
  }, [IsEdit, upDatos, setValue, allRol]);

  const postUserMutation = useMutation({
    mutationFn: (dataNew) => postUser(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetUser");
      Swal.fire({
        title: "Registrado..!",
        text: "Usuario registrado correctamente",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
      resetForm();
      setIsEdit(false);
    },
    onError: (error) => {
      Swal.fire({
        title: `${error?.data.message}`,
        text: "Error..!",
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (dataNew) => UpdateUser(dataNew),
    onSuccess: () => {
      queryClient.invalidateQueries("GetAllPersonas");
      Swal.fire({
        title: "Actualizado..!",
        text: `Usuario Actualizado`,
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
    setSelectedRol([]);
  };

  const onSubmit = (data) => {
    const obj = {
      name: data.nombreCompleto,
      username: data.nombreUser.toUpperCase(),
      telefono: data.telefono,
      rol: data.rol.value,
      password: !IsEdit ? data.password : undefined,
    };

    if (IsEdit) {
      updateUserMutation.mutateAsync(obj);
    } else {
      postUserMutation.mutateAsync(obj);
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
          {IsEdit ? "Editar Usuario" : "Nuevo Usuario"}
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
                      <label className="form-label h5">Nombre Usuario</label>
                      <input
                        type="text"
                        placeholder="Nombre Usuario"
                        className="form-control"
                        {...register("nombreUser")}
                      />
                      {errors.nombreUser && (
                        <p className="text-danger">
                          {errors.nombreUser.message}
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
                      <label className="form-label h5">ROL</label>
                      <Controller
                        name="rol"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={optsRol}
                            placeholder="Selecciona un Rol"
                            value={selectedRol}
                            onChange={(value) => {
                              handleSelectRol(value);
                              setValue("rol", value);
                              clearErrors("rol");
                            }}
                          />
                        )}
                      />
                      {errors.rol && (
                        <p className="text-danger">
                          {errors.rol.value.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {!IsEdit && (
                    <>
                      <div className="col-md-6">
                        <div className="form-outline mb-5">
                          <label className="form-label h5">Contraseña</label>
                          <input
                            type="text"
                            placeholder="Ingresar contraseña"
                            className="form-control"
                            {...register("password")}
                          />
                          {errors.password && (
                            <p className="text-danger">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-outline mb-5">
                          <label className="form-label h5">
                            Confirmar Contraseña
                          </label>
                          <input
                            type="text"
                            placeholder="Confirmar contraseña"
                            className="form-control"
                            {...register("confirmPassword")}
                          />
                          {errors.confirmPassword && (
                            <p className="text-danger">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-md-12">
                    <button className="btn btn-success" type="submit">
                      {IsEdit ? "Actualizar" : "Guardar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalsUser;
