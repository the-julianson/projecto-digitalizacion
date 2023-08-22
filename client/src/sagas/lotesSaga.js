import {call, put, takeEvery} from "redux-saga/effects";
import {
  getOptionsStateSuccess,
  getOptionsStateFail,
  getDocuments,
  getDocumentsSuccess,
  getDocumentsFail,
  putStateSuccess,
  putStateFail,
} from "../states/lotesState";
import axiosBase from "../utils/axiosBase";
import MockAdapter from "axios-mock-adapter";

import {OptionsState, documents} from "./mockData";

//URLs
const URL_BASE = process.env.REACT_APP_BASE_URL;
const URL_optionsState = URL_BASE + "/api/document-status";
const parcialURLdocument = "/api/document/"
const URL_document = URL_BASE + parcialURLdocument;

// REACT_APP_ENVIRONMENT_TYPE = dev | mocked | test
function* requestManager(apiCallFunction, anUrl, anObject = null) {
  console.log(process.env.REACT_APP_ENVIRONMENT_TYPE === "mocked")
  let request = {}
  if (process.env.REACT_APP_ENVIRONMENT_TYPE === "mocked") {
    console.log("Executing in mocked mode");
    var mock = new MockAdapter(axiosBase);
    mock.onGet(URL_optionsState).reply(200, {...OptionsState})
    .onGet(URL_document).reply(200, {...documents})
    .onPut(anUrl).reply(200)
    request = yield call(apiCallFunction, anUrl, anObject)
    mock.restore()
  } else {
    console.log("Executing in dev mode");
    request = yield call(apiCallFunction, anUrl, anObject);
    console.log("request ",request );

  }
  return request
}

function* workGetOptionsStates() {
  //Call to get the options state for the combobox
  try {
      const stateOptionsRequest = yield requestManager(axiosBase.get, URL_optionsState)
      console.log("stateOptionsRequest ",stateOptionsRequest.data.results )
    yield put(
      getOptionsStateSuccess({
        stateOptions: {...stateOptionsRequest.data.results},
      })
    );
    yield put(getDocuments())
  } catch (e) {
    console.log("Error trying to get from API the options state");
    console.log(e);
    yield put(getOptionsStateFail({e}));
  }
}

function* workGetDocuments() {
  // Call to get the documents for the table
  try {
    const documentsRequest = yield requestManager(axiosBase.get, URL_document)
    console.log("documentsRequest ", documentsRequest.data);
    yield put(getDocumentsSuccess({documents: {...documentsRequest.data}}));
  } catch (e) {
    console.log("Error trying to get from API the documents");
    console.log(e);
    yield put(getDocumentsFail({e}));
  }
  return;
}

function* workPutDocuments(action) {
  console.log(action.payload);
  const {name, nroLote }= action.payload
  const URLRequest =  URL_BASE + parcialURLdocument + nroLote + '/manage-status'
  console.log(URLRequest)
  try {
    const documentsResponse = yield requestManager(axiosBase.put, URLRequest, {
      status: name
    });
    console.log("documentsResponse ", documentsResponse);
    yield put(putStateSuccess());
    yield put(getDocuments())
  } catch (e) {
    console.log("Error trying to get from API the documents");
    console.log(e);
    yield put(putStateFail(e.response));
  }
  return;
}

function* lotesSaga() {
    yield takeEvery("lotes/getOptionsState", workGetOptionsStates);
    yield takeEvery("lotes/getDocuments", workGetDocuments);
    yield takeEvery("lotes/putState", workPutDocuments);
}

export default lotesSaga;
