import * as yup from "yup";
const tieneComoMaxTXT = (number) =>
  "Este campo tiene como maximo " + number + "caracteres";
const obligatorioTXT = "Este campo es obligatorio";
const debeSerStringTXT = "Este campo debe ser de texto";

const validationSchema = yup.object({
  dateToSearch: yup
    .date().max(new Date(), "La fecha máxima permitida es la fecha actual")
});
const loteSchema = {
  validationSchema,
};

export default loteSchema;
