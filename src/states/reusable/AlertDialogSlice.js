import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  open: false,
  content: "",
  title: "",
  icon:"",
  actionAcceptButton: "",
  actionCancelButton: "",
  textAcceptButton: "",
  textCancelButton: "",
  otherMessages: [""],
  timer: 0,
};

/*

dispatch(
        openAlertDialog({
          icon: "error", // o "cancel"
          title: weSorryMessage,
          content: responseStrings(response.status),
          otherMessages: ["Status: " + response.status],
          open: false,
          actionCancelButton: () => {
            dispatch(resetState());
          },
        })
      );

*/
export const alertDialogSlice = createSlice({
  name: "alertDialog",
  initialState,
  reducers: {
    openAlertDialog: (state, action) => {
      const pay = action.payload
      state.open = true;
      state.title = pay.title;
      state.content = pay.content;
      state.icon = pay.icon;
      state.actionAcceptButton = pay.actionAcceptButton;
      state.actionCancelButton = pay.actionCancelButton;
      state.textAcceptButton = pay.textAcceptButton;
      state.textCancelButton = pay.textCancelButton;
      state.otherMessages = pay.otherMessages
        ? pay.otherMessages
        : [""];
    },
    closeAlertDialog: () => initialState,
  },
});

// export const {handleShow, resetState} = alertDialogSlice.actions;
export const {closeAlertDialog, openAlertDialog} = alertDialogSlice.actions;

export default alertDialogSlice.reducer;
