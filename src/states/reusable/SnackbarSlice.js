import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  openSnackbar: false,
  snackbarMessage: "",
  snackbarSeverity: "success",
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    openSnackbar: (state, action) => {
      state.snackbarMessage = action.payload.snackbarMessage;
      state.snackbarSeverity = action.payload.snackbarSeverity;
      state.openSnackbar = true;
    },
    closeSnackbar: () => initialState,
  },
});

export const {openSnackbar, closeSnackbar} = snackbarSlice.actions;

export default snackbarSlice.reducer
