import React, {useEffect} from "react";
import {Box, Stack} from "@mui/material";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
// Reusables
import TextInput from "../../reusable/textInput/TextInput";
import SubmitButton from "../../reusable/buttons/SubmitButton";
// Componentes
import labelsSchema from "./labelsValidationSchema";
// Redux
import {postCrearLote, postCrearLoteReset} from "../../states/etiquetasState";
import {openAlertDialog} from "../../states/reusable/AlertDialogSlice";
import {openSnackbar} from "../../states/reusable/SnackbarSlice";
// Data
import {responseStrings, weSorryMessage} from "../../utils/responseStrings";
import {mockImagesLabelData} from "../../sagas/mockLabelData";

// function CrearLoteForm() {
function CrearLoteForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isError, response} = useSelector((state) => state.etiquetas);
  const formik = useFormik({
    initialValues: {
      expedientNumber: "",
      quantity: "",
    },
    validationSchema: labelsSchema.validationSchema,
    onSubmit: (expedientNumber, quantity) => {
      dispatch(postCrearLote(expedientNumber, quantity));
    },
  });

  const {isLoading} = useSelector((state) => state.etiquetas);

  const nth1StackStyle = {
    direction: "column",
    width: "30%",
    alignItems: "center",
    sx: {marginX: "auto", my: 4},
    spacing: 5,
  };
  useEffect(() => {
    if (isLoading === false && isError === false && response !== null) {
      // Uncomment next line to navigate to home page after print labels
      navigate("/home");
      dispatch(
        openSnackbar({
          snackbarMessage: "Lote creado exitosamente. Un momento por favor.",
        })
      );
      dispatch(postCrearLoteReset());
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading === false && isError === true && response !== null) {
      dispatch(
        openAlertDialog({
          title: weSorryMessage,
          content: responseStrings(response.status),
          icon: "cancel",
          actionCancelButton: () => dispatch(postCrearLoteReset()),
        })
      );
    }
  }, [isLoading, isError, response]);

  return (
    <Stack {...nth1StackStyle}>
      <TextInput
        nombreVariable="expedientNumber"
        text={formik.values.expedientNumber}
        label={"Numero de expediente"}
        variant="h6"
        editing={true}
        isLoading={isLoading}
        formik={formik}
        // type="number" ver esto, le paso type number y lo visualiza como password
      />
      <TextInput
        nombreVariable="quantity"
        text={formik.values.quantity}
        label="Cantidad"
        variant="h6"
        editing={true}
        isLoading={isLoading}
        formik={formik}
      />
      <SubmitButton
        requestType="POST"
        isLoading={isLoading}
        textForRequestType={["Crear e Imprimir", "Crear e Imprimir"]}
        handleSubmit={formik.handleSubmit}
      />
      <Box></Box>
    </Stack>
  );
}

export default CrearLoteForm;
