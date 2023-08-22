import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {useDispatch, useSelector} from "react-redux";
import {putState, resetState} from "../../states/lotesState";
import {openAlertDialog} from "../../states/reusable/AlertDialogSlice";
import {responseStrings, weSorryMessage} from "../../utils/responseStrings";

export default function SelectState({selectedValue, nroLote}) {
  const dispatch = useDispatch();
  const [estado, setEstado] = React.useState(selectedValue);
  const {optionsState, isError, response} = useSelector((state) => state.lotes);
  const estadoAnteriorRef = React.useRef(selectedValue);

  const handleChange = (event) => {
    const name = event.target.value;
    // console.log('nroLote', nroLote)
    // console.log("estado ", estado);
    // console.log("estadoAnteriorRef.current ", estadoAnteriorRef.current);
    setEstado(event.target.value);
    dispatch(putState({name, nroLote}));
  };

  React.useEffect(() => {
    // Finalidad: en caso de un put fallido, lanza el alertdialog y
    // vuelte el select al estado anterior
    if (isError) {
      dispatch(
        openAlertDialog({
          icon: "error",
          title: weSorryMessage,
          content: responseStrings(response.status),
          otherMessages: ["Status: " + response.status],
          open: false,
          actionCancelButton: () => {
            dispatch(resetState());
          },
        })
      );
      setEstado(estadoAnteriorRef.current);
    }
  }, [isError, response.status]);

  // Array that have indexes numbers for each elements
  const arrayIndexes = Object.keys(optionsState);

  return (
    <Box sx={{minWidth: 120}}>
      <FormControl fullWidth size="small" variant="standard">
        <InputLabel id="demo-simple-select-label">Cambiar estado</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={estado}
          label="Estado"
          onChange={handleChange}
        >
          {arrayIndexes.map((index) => {
            const {id, name} = optionsState[index];
            return (
              <MenuItem value={name} key={id}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
