import * as yup from "yup";
const haveMaxTXT = (number) =>
  "Este campo tiene como maximo " + number + "caracteres";
const requiredTXT = "Este campo es obligatorio";
const mustBeStringTXT = "Este campo debe ser de texto";

const validationSchema = yup.object({
  expedientNumber: yup
    .number()
    .typeError('Los caracteres deben ser de tipo numéricos')
    .required(requiredTXT)
    .max(999999999999, haveMaxTXT(12))
    .positive("Debe ser un valor positivo"),
    quantity: yup
    .number()
    .typeError('Los caracteres deben ser de tipo numéricos')
    .required(requiredTXT)
    .max(99999, haveMaxTXT(5))
    .positive("Debe ser un valor positivo")
    .test('is-even', 'Debe ser un número par', value => value % 2 === 0),
});
const labelsSchema = {
  validationSchema,
};

export default labelsSchema;
