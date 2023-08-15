import {call, put, takeEvery} from "redux-saga/effects";
import MockAdapter from "axios-mock-adapter";
// Redux States
import {
  postCrearLoteSuccess,
  postCrearLoteFail,
  postCrearLoteReset,
} from "../states/etiquetasState";
// Librerias propias
import axiosBase from "../utils/axiosBase";
import {ImagesToPdf} from "../utils/pdfUtilities";
// Data
import {mockLabelData, mockImagesLabelData} from "./mockLabelData";

// const firstURL = process.env.REACT_APP_BASE_URL + "/api/label/create-bulk/";
const firstURL =
  process.env.REACT_APP_BASE_URL + "/api/document/create-document-and-labels/";

let secondURL = ""; // Will be obtained from the first response.

// If in mock mode this function will execute the API interceptor calls and
// return a response with objects from the mockLabelData file.

function* requestManager(apiCallFunction, anUrl, anObject = null) {
  console.log("anUrl ", anUrl);
  let request = {};
  if (process.env.REACT_APP_ENVIRONMENT_TYPE === "mocked") {
    var mock = new MockAdapter(axiosBase);
    console.log("Executing in mocked mode");
    mock.onGet(firstURL, anObject).reply(200, {...mockLabelData});
    mock.onGet(secondURL).reply(200, {...mockImagesLabelData});
    request = yield call(apiCallFunction, anUrl, anObject);
    mock.restore();
  } else {
    console.log("Executing in dev mode");
    request = yield call(apiCallFunction, anUrl, anObject);
  }
  return request;
}

function* workPostLabelsFetch(action) {
  const {expedientNumber, quantity} = action.payload;
  try {
    const body = {
      internal_id: expedientNumber,
      labels_quantity: parseInt(quantity),
      document_description: "sarasa",
    };

    //First call to the API
    console.log("First call to the API");
    const firstResponse = yield requestManager(axiosBase.post, firstURL, body);
    console.log("firstResponse: ", firstResponse);
    const newLabels = yield firstResponse.data;
    console.log("newLabels: ", newLabels);
    console.log("Bulk information successfully generated");
    // secondURL = yield newLabels.bar_code_image;  // Esta segun la Swagger
    secondURL = yield newLabels.base64_labels_url; // Esta segun la contrato
    console.log("SecondURL of first call", secondURL);

    // Second call to the API
    const secondResponse = yield requestManager(axiosBase.get, secondURL);

    console.log("Second call to the API");
    console.log("SecondResponse ", secondResponse);

    const images = Object.values(secondResponse.data).map(
      (obj) => obj.b64_image
    );

    console.log("Labels Images successfully downloaded");
    yield put(postCrearLoteSuccess(images));

    // PDF generation
    console.log("Starting PDF generation");
    const pdf = yield call(ImagesToPdf, images);
    try {
      setTimeout(() => {
        pdf.autoPrint({variant: "non-conform"});
        pdf.save("etiquetas_0to" + quantity + ".pdf");
        pdf.output("datauristring");
        console.log("PDF generated correctly");
        // yield put(postCrearLoteReset())
      }, 1000);
    } catch (error) {
      console.log(
        "An issue occurs creating the tab navigator with the pdf file",
        error
      );
    }
  } catch (error) {
    yield put(postCrearLoteFail(error));
  }
}

function* etiquetaSaga() {
  yield takeEvery("etiquetas/postCrearLote", workPostLabelsFetch);
}

export default etiquetaSaga;
