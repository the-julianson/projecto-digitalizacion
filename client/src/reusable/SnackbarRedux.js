import * as React from "react";
import {useSelector, useDispatch} from "react-redux";
import {closeSnackbar, openSnackbar} from "../states/reusable/SnackbarSlice";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import MuiAlert from "@mui/material/Alert";
import {resetState} from "../states/reusable/AlertDialogSlice";

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}
function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}
export default function DirectionSnackbar() {
  const [transition, setTransition] = React.useState(undefined);
  const {openSnackbar, snackbarMessage, snackbarSeverity} = useSelector(
    (state) => state.snackbar
  );
  const dispatch = useDispatch();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={12} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        onClose={handleClose}
        TransitionComponent={transition}
        key={transition ? transition.name : ""}
        autoHideDuration={5000}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSeverity} // success | info | warning | error
          sx={{width: "100%"}}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
