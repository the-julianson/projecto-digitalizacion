import {call, put, takeEvery} from "redux-saga/effects";
import axios from "axios";
const axiosBase = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function* workRequest(){
    

}

function* axiosBaseSaga(){

}