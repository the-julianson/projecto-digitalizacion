import {useDispatch, useSelector} from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {Box, Stack, Typography} from "@mui/material";
import {closeAlertDialog} from "../states/reusable/AlertDialogSlice";
import {Error, Cancel, HourglassBottom} from "@mui/icons-material";
import {useEffect, useState} from "react";
/**
 * No usar desde aca, esto solo se usa en el layout por unica vez
 * Para utilizar este componente hacerlo con dispatch(openAlertDialog({......}))
 * @param {*} props
 * @example
 * <AlertDialog
 *      open={openAlertDialog}
 *      setOpen={setOpenAlertDialog}
 *      title={ 'Está por eliminar al cliente' + formik.values.nombre}
 *      content='¿Seguro desea eliminarlo?'
 *      icon='error' // valores posibles: error | cancel
 *      buttonTextAccept='Borrar'
 *      buttonTextDeny='Cancelar'
 *      buttonActionAccept={deleteCliente}
 *      timer=number (default=0)
 * >
 *     <DeleteForeverIcon color="warning" fontSize="medium" />
 * </AlertDialog>
 *
 * @returns
 */

function AlertDialogRedux(props) {
  const dispatch = useDispatch();
  const {
    open,
    title,
    content,
    icon,
    actionAcceptButton,
    actionCancelButton,
    textAcceptButton,
    textCancelButton,
    otherMessages,
    timer
  } = useSelector((state) => state.alertDialog);
  const [count, setCount] = useState(timer);

  // Remember that any click outside de box it's the same that cancel action
  const handleClose = () => {
    dispatch(closeAlertDialog());
    // actionCancelButton();
  };

  const handleAcceptButton = () => {
    if (actionAcceptButton) {
      actionAcceptButton();
    }
    handleClose();
  };

  const messages = otherMessages.map((aMessage, index) => (
    <DialogContentText id="alert-dialog-description" key={index}>
      <span>{aMessage}</span>
    </DialogContentText>
  ));

  const contarHastaCero = (valorInicial) => {
    if (valorInicial >= 0) {
      console.log(valorInicial);
      setCount(valorInicial); // Actualiza el valor en el estado local
      valorInicial--;
      setTimeout(() => contarHastaCero(valorInicial), 1000); // Llama a la función de nuevo después de 1 segundo (1000 ms)
    } else {
      handleClose();
    }
  };
  useEffect(() => {
    if(timer > 0){
      contarHastaCero(count);
    }
  }, []);

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          // Here goes the icons. To agregate another one you must to create en new line, assign an string
          // and import an icon component to render it. Example :
          //
          // {icon==='StringExample') && (
          //  <ExampleComponent  color='error' sx={{margin:'auto', fontSize:"70px"}}/>
          //  )}
          // You can uncommit below.

          icon && (
            <>
              {icon === "error" && (
                <Error color="error" sx={{margin: "auto", fontSize: "70px"}} />
              )}
              {icon === "cancel" && (
                <Cancel color="error" sx={{margin: "auto", fontSize: "70px"}} />
              )}
              {icon === "timeLapsed" && (
                <HourglassBottom
                  color="grey"
                  sx={{margin: "auto", fontSize: "70px"}}
                />
              )}
              {/*  icon==='StringExample') && (
                //   <ExampleComponent  color='error' sx={{margin:'auto', fontSize:"70px"}}/>
                //  )*/}
            </>
          )
        }

        <DialogTitle
          id="alert-dialog-title"
          alignItems="center"
          // aligntContent="center"
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <Stack direction="column" justifyContent="center" alignItems="center">
            <DialogContentText id="alert-dialog-description" key="01">
              {content} {count > 0 ? count : null}
            </DialogContentText>
            {messages}
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
          }}
        >
          {textCancelButton ? (
            <Button
              color="error"
              variant="contained"
              id="cancelarAlertDialog"
              onClick={handleClose}
              autoFocus
            >
              {textCancelButton}
            </Button>
          ) : null}
          {textAcceptButton ? (
            <Button
              color="primary"
              variant="contained"
              id="aceptarAlertDialog"
              onClick={handleAcceptButton}
            >
              {textAcceptButton ? textAcceptButton : "Aceptar"}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AlertDialogRedux;
