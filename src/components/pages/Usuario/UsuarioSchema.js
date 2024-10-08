import * as yup from "yup";

export const schema = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre completo es requerido!"),
    nombreUser: yup.string().required("El nombre Usuario es requerido!"),
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",<.>/?])(?!.*\s).{8,}$/,
        "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Debe confirmar la contraseña."),
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
      .required("El sector es requerido!"),
  });