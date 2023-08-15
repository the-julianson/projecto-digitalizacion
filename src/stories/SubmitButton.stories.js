import SubmitButton from "../reusable/buttons/SubmitButton";
export default {
  title: "Example/SubmitButton",
  component: SubmitButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    // layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    handleSubmit: {
      type: { name: 'function', required: true }, // Indica que se espera una función
      description: 'Función que gestiona el metodo deseado. Suele ser formik.handlesubmit',
    },
    requestType: {
      control: {
        type: "select",
        options: ["POST", "PUT", "GET"],
      },
      description: 'Tipo de solicitud que disparará el boton'
    },
    textForRequestType:{
      description: 'Texto del boton correspondiente al metodo elegido. Se corresponde con RequestType.'
    }
  },
  args: {
    requestType: "GET",
    textForRequestType: ["Buscar", "Crear", "Guardar"],
    handleSubmit: ()=>{'Una funcion'},
  },
};

export const Primary = {
  args: {
    requestType: "POST",
    isLoading: true,
    handleSubmit: ()=>'Una',
  },
};