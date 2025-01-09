import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import AuthVerification from './middlewares/auth/AuthVerification';

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
import Citas from './pages/Citas';

function App() {
    // Estado de autenticación simulado (reemplaza con tu lógica real)
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recuperar-password" element={<RecoveryPassword />} />

            {/* Rutas protegidas */}
            <Route
                path="/home"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>
                        <Home />
                    </AuthVerification>
                }
            />
            <Route
                path="/donacion/formulario"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>
                        <FormularioDonacion />
                    </AuthVerification>
                }
            />
            <Route
                path="/usuario/actualizar_datos"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>
                        <ActualizarDatos />
                    </AuthVerification>
                }
            />
            <Route
                path="/cita"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>
                        <Citas />
                    </AuthVerification>
                }>
                <Route
                    path="programar"
                    element={
                        <AuthVerification isAuthenticated={isAuthenticated}>
                            <ProgramarCita />
                        </AuthVerification>
                    }
                />
                <Route
                    path="ver"
                    element={
                        <AuthVerification isAuthenticated={isAuthenticated}>
                            <VerCitas />
                        </AuthVerification>
                    }
                />
                <Route
                    path="reprogramar"
                    element={
                        <AuthVerification isAuthenticated={isAuthenticated}>
                            <ReprogramarCita />
                        </AuthVerification>
                    }
                />
                <Route
                    path="cancelar"
                    element={
                        <ActualizarDatos isAuthenticated={isAuthenticated}>
                            <CancelarCita />
                        </ActualizarDatos>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
