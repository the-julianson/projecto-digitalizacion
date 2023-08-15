import React, { useEffect } from "react";
import DatePicker from "../../reusable/DatePicker";
import SubmitButton from "../../reusable/buttons/SubmitButton";
import {Button, Stack} from "@mui/material";
import axiosBase from '../../utils/axiosBase'

function SearchForm({formik}) {

useEffect(()=>{

 
},[])

  return (
    <Stack direction="column" justifyContent="start" spacing={3} marginTop={2} width='25%'>
      <DatePicker
        value={formik.values.dateToSearch || ""}
        id="dateToSearch"
        name="dateToSearch"
        editable={true}
        onChange={formik.setFieldValue}
        label="Fecha de creacion del lote"
        errorProp={
          formik.touched.dateToSearch && Boolean(formik.errors.dateToSearch)
        }
        helperTextProp={
          formik.touched.dateToSearch && formik.errors.dateToSearch
        }
      />
      <SubmitButton
        // requestType="GET" // suele podria se useSelector de redux o un useState
        // isLoading={true} // suele podria se useSelector de redux o un useState
        // postOrPutTexts={["Buscar lote", "Guardar"]}
        // handleSubmit={formik.handleSubmit}
        requestType="GET" // suele podria se useSelector de redux o un useState
        isLoading={false} // suele podria se useSelector de redux o un useState
        postOrPutTexts={["Crear e Imprimir", ""]}
        textForRequestType={["Buscar", "POSTExample", "PUTExample"]}
        handleSubmit={formik.handleSubmit}
      />
    </Stack>
  );
}

export default SearchForm;
