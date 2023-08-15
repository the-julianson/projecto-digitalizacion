import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  typeRequest: null,
  isLoading: false,
  isError: false,
  response: {},
  optionsState: [],
  documents: [],
};

export const lotesSlice = createSlice({
  name: "lotes",
  initialState: initialState,
  reducers: {
    getOptionsState: (state) => {
      state.isLoading = true;
    },
    getOptionsStateSuccess: (state, action) => {
      state.isLoading = false;
      state.optionsState = action.payload.stateOptions;
    },
    getOptionsStateFail: (state, action) => {
      console.log('action.payload', action.payload)
      state.isLoading = false;
      state.isError = true;
      state.response = action.payload.e.response
    },
    getDocuments: (state) => {
      state.isLoading = true;
    },
    getDocumentsSuccess: (state, action) => {
      state.isLoading = false;
      state.documents = action.payload.documents;
    },
    getDocumentsFail: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.response = action.payload
    },
    putState: (state, action) => {
      state.isLoading = true
    },
    putStateSuccess: (state, action) => {
      state.isLoading = false
    },
    putStateFail: (state, action) => {
      state.isLoading = false
      state.isError = true
      state.response = action.payload.response 
    },
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.response = {}
    }

  },
});

export const {
getOptionsState,
getOptionsStateSuccess,
getOptionsStateFail,
getDocuments,
getDocumentsSuccess,
getDocumentsFail,
putState,
putStateSuccess,
putStateFail,
resetState,
} = lotesSlice.actions;

export default lotesSlice.reducer;
