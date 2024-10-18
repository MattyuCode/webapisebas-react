import * as yup from "yup";

export const schema = yup.object().shape({
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
  password: yup
    .string()
    .when([], {
      is: () => !IsEdit, // Usamos directamente IsEdit aquí
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
  confirmPassword: yup
    .string()
    .when("password", (password, schema) => {
      if (password) {
        return schema
          .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
          .required("Debe confirmar la contraseña.");
      }
      return schema.notRequired();
    }),
});
