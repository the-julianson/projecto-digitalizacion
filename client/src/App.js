import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import "./App.css";
import {dataDigitalizationCard, dataHomeCard} from "./data/cardsdata";
//Reusables
import Drawer from "./reusable/drawer/Drawer";
import MenuCard from "./reusable/card/MenuCard";
import Dashboard from "./reusable/dashboard/Dashboard";
//Pages
import Labels from "./components/labels/Labels";
import Lotes from "./components/lotes/Lotes";
import Documentos from "./components/documentos/Documentos";
import GestionDeUsuarios from "./components/gestionDeUsuarios/GestionDeUsuarios";
import Landing from "./components/landing/Landing";
import {useDispatch, useSelector} from "react-redux";
import AppLayout from "./AppLayout";
import {useEffect} from "react";
//States
import {getUser, loggingOut} from "./states/authState";
import {isTokenExpired} from "./utils/tokenValidator";
import {openAlertDialog} from "./states/reusable/AlertDialogSlice";

//Data
import {sessionExpiredString} from "./utils/responseStrings";
function App() {
  const {isLoggedIn, isError, isLoading} = useSelector((state) => state.auth);
  const {exp} = useSelector((state) => state.auth.activeUser.accessDecoded);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser({}));
  }, [isError, isLoading]);
  // console.log("isTokenExpired(exp)", isTokenExpired(exp));

  // useEffect(() => {
  //   if (isTokenExpired(exp)) {
  //     dispatch(loggingOut());
  //     dispatch(
  //       openAlertDialog({
  //         content: sessionExpiredString,
  //         icon: "timeLapsed",
  //         actionCancelButton: () => {},
  //       })
  //     );
  //   }
  // }, []);

  return (
    <div className="fondo">
      <div className="translucid">
        <BrowserRouter>
          <Drawer open={true} showMenu={true} />
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {!isLoggedIn ? (
                <>
                  <Route path="/landing" element={<Landing />}>
                    {" "}
                  </Route>
                  <Route path="/*" element={<Navigate to="/landing" />} />
                </>
              ) : (
                <>
                  <Route
                    path="/home"
                    element={<Dashboard cardsDataArray={dataHomeCard} />}
                  />
                  <Route
                    path="/digitalization"
                    element={
                      <Dashboard cardsDataArray={dataDigitalizationCard} />
                    }
                  />
                  <Route path="/digitalization/labels" element={<Labels />} />
                  <Route path="/digitalization/lotes" element={<Lotes />} />
                  <Route path="/digitalization/lotes/:id" element={<Lotes />} />
                  <Route
                    path="/gestionDeUsuarios"
                    element={<GestionDeUsuarios />}
                  />
                  <Route path="/documentos" element={<Documentos />} />
                  <Route path="/login" element={<MenuCard />} />
                  <Route path="/*" element={<Navigate to="/home" />} />
                </>
              )}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
