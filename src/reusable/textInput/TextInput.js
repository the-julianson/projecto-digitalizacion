import React from "react";
import {Box, Skeleton, TextField} from "@mui/material";
import {startCase} from "lodash";
import { Password } from "@mui/icons-material";

/**
 *
 * @param {*} props
 * @example
 *          <TextInput
 *            nombreVariable="descripcion"
 *            text={formik.values.descripcion}
 *            variant="h6"
 *            editing={editing}
 *            isLoading={isLoading}
 *            formik={formik}
 *            label="NombreEnPantalla" // default nombreVariable
 *            multiline
 *            rows="3"
 *            sxTextFieldProp={}
 *            type='password' //default string
 *            data-cy='unNombreParaCypress'
 *          />
 */
function TextInput({
  nombreVariable,
  text,
  variant,
  editing,
  isLoading,
  formik,
  multiline,
  label,
  rows,
  sxTextFieldProp,
  type,
  dataCy,

}) {
  const textFieldValidationProps = (nombreVariable) => {
    return {
      label: label? label: startCase(nombreVariable),
      id: nombreVariable,
      name: nombreVariable,
      value: formik.values?.[nombreVariable],
      onChange: formik.handleChange,
      error:
        formik.touched?.[nombreVariable] && Boolean.errors?.[nombreVariable],
      helperText:
        formik.touched?.[nombreVariable] && formik.errors?.[nombreVariable],
    };
  };

  //Propidades sx por parametro y sino por defecto
  const sxProp = sxTextFieldProp
    ? sxTextFieldProp
    : {
        fullWidth: true,
        fontSize: "large",
        size: "large",
        inputProps: {fontSize: "100px"},
      };

  const calcHeight = rows ? rows * 50 : 50;
  return (
    // <Box sx={{mt: 2}}>
    <>
      {isLoading ? (
        <Skeleton width={"100%"} height={calcHeight + "px"} />
      ) : (
        <TextField
          variant="standard"
          multiline={multiline ? true : false}
          rows={rows ? rows : 1}
          {...sxProp}
          {...textFieldValidationProps(nombreVariable)}
          value={text}
          type={type && 'password'}
          // type={type ? 'numeric' : "numeric"}
          // inputProps={{
            // inputMode: "numeric", // Permite la entrada numérica en dispositivos móviles
            // pattern: "[0-9]*", // Asegura que solo se ingresen dígitos
          // }}
        />
      )}
    </>
    // </Box>
  );
}

export default TextInput;
