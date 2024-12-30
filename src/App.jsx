// src/App.js
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

// Views
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import RecoveryPassword from './components/Recovery_Password';
import ProgramarCita from './pages/Programar_Cita';
import VerCitas from './pages/Ver_Citas';
import ReprogramarCita from './pages/Reprogramar_Cita';
import CancelarCita from './pages/Cancelar_Cita';
import FormularioDonacion from './pages/Formulario_Donacion';
import ActualizarDatos from './pages/Actualizar_Datos';
import Footer from './components/Footer';
import Informacion from './pages/Informacion';
import Citas from './pages/Citas';

function App() {
    return (
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-password" element={<RecoveryPassword />} />

            {/* Ruta padre para Citas */}
            <Route path="/cita" element={<Citas />}>
                <Route path="programar" element={<ProgramarCita />} />
                <Route path="ver" element={<VerCitas />} />
                <Route path="reprogramar" element={<ReprogramarCita />} />
                <Route path="cancelar" element={<CancelarCita />} />
            </Route>

            <Route path="/donacion/formulario" element={<FormularioDonacion />} />
            <Route path="/usuario/actualizar_datos" element={<ActualizarDatos />} />
            <Route path="/contacto" element={<Footer />} />
            <Route path="/informacion" element={<Informacion />} />
        </Routes>
    );
}

export default App;