import {Outlet} from "react-router-dom";
import AlertDialogRedux from "./reusable/AlertDialogRedux";
import SnackbarRedux from "./reusable/SnackbarRedux";
// TODO eliminar implementaciones de Alert, snackbar sin redux

export default function AppLayout() {
  return (
    <>
      <Outlet />
      <AlertDialogRedux />
      <SnackbarRedux />
    </>
  );
}
