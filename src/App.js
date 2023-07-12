import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Drawer from './components/drawer/Drawer'
import Card from './components/card/Card';
import Dashboard from './components/dashboard/Dashboard';
import {dataCard} from './components/dashboard/cardsdata'
import Etiquetas from './components/etiquetas/Etiquetas';
function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Drawer open={true} showMenu={true} />
      <Routes>
        <Route path="/digitalizacion" element={<Dashboard cardsDataArray={dataCard}/>} />
        <Route path="/digitalizacion/etiquetas" element={<Etiquetas/>} />
        <Route path="/home" element={<Card/>} />
        <Route path="/login" element={<Card />} />
        <Route path="/*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
