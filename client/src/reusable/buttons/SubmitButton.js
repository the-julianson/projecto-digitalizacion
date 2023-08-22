import React from 'react'
import PropTypes, { string } from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import SaveIcon from "@mui/icons-material/Save";
import { Button } from '@mui/material';


/**
 *
 * @param {requestType} Es un estado que puede ser POST o PUT 
 * @param {isLoading} Es un estado booleano 
 * @param {postOrPutTexts} El texto del boton segun el tipo de submit post o put
 * @param {handleSubmit} La funcion que maneja el submit
 * @example
 * <SubmitButton
 *      requestType={requestType}      // suele podria se useSelector de redux o un useState
 *      isLoading={isLoading}          // suele podria se useSelector de redux o un useState
 *      textForRequestType={["Crear","Guardar"]}
 *      handleSubmit={formik.handleSubmit}
 * >
 *
 */

function SubmitButton(props) {
const isLoading = props.isLoading
const requestType = props.requestType
const textForRequestType = props.textForRequestType
const handleSubmit = props.handleSubmit

  return (
    <>
        {requestType === "POST" || requestType === "PUT" ||requestType === "GET" ? (
          isLoading ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
            >
              Enviando...
            </LoadingButton>
          ) : (
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              { requestType === "GET" && textForRequestType[0]}
              {requestType === "POST" && textForRequestType[1]}
              {requestType === "PUT" && textForRequestType[2]}
              

            </Button>
          )
        ) : null}
    </>
  )
}

SubmitButton.propTypes = {
  textForRequestType: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading : PropTypes.bool.isRequired,
  requestType: PropTypes.oneOf(['GET', 'POST','PUT']).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

// SubmitButton.propTypes = {
// textForRequestType:'Buscar', 
// isLoading: false,
// requestType: 'GET', 
// // handleSubmit:'', 
// }

export default SubmitButton