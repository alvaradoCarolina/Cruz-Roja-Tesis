import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';

// Componentes
import AuthVerification from './middlewares/auth/AuthVerification';  // Cambié el nombre del componente aquí
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user); // Si hay un usuario, actualizamos el estado
        });
        return unsubscribe; // Nos desuscribimos al desmontar
    }, []);

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
                    <AuthVerification isAuthenticated={isAuthenticated}>  {/* Aquí se hace el cambio */}
                        <Home />
                    </AuthVerification>
                }
            />
            <Route
                path="/cita"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>  {/* Aquí se hace el cambio */}
                        <Citas />
                    </AuthVerification>
                }>
                <Route path="programar" element={<ProgramarCita />} />
                <Route path="ver" element={<VerCitas />} />
                <Route path="reprogramar" element={<ReprogramarCita />} />
                <Route path="cancelar" element={<CancelarCita />} />
            </Route>
            <Route
                path="/donacion/formulario"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>  {/* Aquí se hace el cambio */}
                        <FormularioDonacion />
                    </AuthVerification>
                }
            />
            <Route
                path="/usuario/actualizar_datos"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}>  {/* Aquí se hace el cambio */}
                        <ActualizarDatos />
                    </AuthVerification>
                }
            />
        </Routes>
    );
}

export default App;
