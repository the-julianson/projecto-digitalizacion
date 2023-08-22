import * as yup from "yup";
const tieneComoMaxTXT = (number) =>
  "Este campo tiene como máximo " + number + "caracteres";
const tieneComoMinTXT = (number) =>
  "Este campo tiene como mínimo " + number + "caracteres";
const obligatorioTXT = "Este campo es obligatorio";
const debeSerStringTXT = "Este campo debe ser de texto";

const validationSchema = yup.object({
  username: yup
    .string()
    .required(obligatorioTXT)
    .min(8, tieneComoMinTXT(8)),
    password: yup
    .string()
    .required(obligatorioTXT)
    .min(3, tieneComoMinTXT(3))
})
const loginSchema = {
  validationSchema,
};

export default loginSchema;
