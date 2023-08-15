import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isError: null,
  response: null,
};
export const etiquetasSlice = createSlice({
  name: "etiquetas",
  initialState: initialState,
  imagenes: {},
  reducers: {
    postCrearLote: (state) => {
      state.isLoading = true;
    },
    postCrearLoteFail: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.response = action.payload.response;
    },
    postCrearLoteSuccess: (state, action) => {
      state.isError = false;
      state.isLoading = false;
      state.response = action.payload;
    },
    postCrearLoteReset: () => initialState,
  },
});

export const {
  postCrearLote,
  postCrearLoteFail,
  postCrearLoteSuccess,
  postCrearLoteReset,
} = etiquetasSlice.actions;

export default etiquetasSlice.reducer;
