import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isLoggedIn: null,
  isError: null,
  response: null,
  activeUser: {
    access:null,
    refresh:null,
    accessDecoded:{
      exp:null},}
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    loggingIn: (state, action) => {
      state.isLoading = true;
    },
    loggingInFail: (state, action) => {
      const {error} = action.payload;
      state.isLoading = false;
      state.isLoggedIn = false;
      state.isError = true;
      state.response = error.response;
    },
    loggingInSuccess: (state, action) => {
      console.log('loggingInSuccess',action.payload.response.data.access)
      state.isLoading = false;
      state.isLoggedIn = true;
      state.isError = false;
      // state.response = action.payload.response;
      state.activeUser.accessDecoded = action.payload.user;
      state.activeUser.access = action.payload.response.data.access
      state.activeUser.refresh = action.payload.response.data.refresh
    },
    loggingOut: (state) => {
      state.isLoading = true;
    },
    loggingOutSuccess: (state) => {
      state.isLoading = false;
      state.isLoggedIn = false;
      state.activeUser = initialState.activeUser
    },
    loggingReset: (state) => {
      state.isLoading = initialState.isLoading;
      state.isLoggedIn = initialState.isLoggedIn;
      state.isError = initialState.isError;
      state.response = initialState.response;
      state.activeUser = initialState.activeUser;
    },
    getUser: (state) => {
      // {}
      // state= this.state
    },
    getUserFail: (state) => {
      state.isLoading= false
      state.isLoggedIn = false;
    },
    getUserSuccess: (state, action) => {
      console.log(action)
      state.isLoggedIn = true;
      state.activeUser.accessDecoded = action.payload;
    },
  },
});

export const {
  loggingIn,
  loggingInFail,
  loggingInSuccess,
  loggingOut,
  loggingOutSuccess,
  loggingReset,
  getUser,
  getUserFail,
  getUserSuccess,
} = authSlice.actions;

export default authSlice.reducer;
