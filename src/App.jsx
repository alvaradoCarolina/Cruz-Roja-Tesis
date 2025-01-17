// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebaseConfig';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componentes
import AuthVerification from './middlewares/auth/AuthVerification';
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
import Informacion from './pages/Informacion';

//componentes Admin
import HomeAdmin from './components/Admin/HomeAdmin/HomeAdmin';
import Donantes from './pages/Admin/Donantes/Donantes';
import CitasAdmin from './pages/Admin/CitasAdmin/CitasAdmin';
import ProgramarCitaAdmin from './pages/Admin/ProgramarCita/ProgramarCita'; 
import VerCitasAdmin from './pages/Admin/VerCitas/VerCitas'; 
import EditarCitaAdmin from './pages/Admin/EditarCita/EditarCita'; 
import CancelarCitaAdmin from './pages/Admin/CancelarCita/CancelarCita';
import GestionFormulario from './pages/Admin/GestionFormulario/GestionFormulario';

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
            <Route path="/gestion-donantes" element={<Donantes />} />
            <Route path="/citas-admin" element={<CitasAdmin />} /> 
            <Route path="/citas/programar" element={<ProgramarCitaAdmin />} /> 
            <Route path="/citas/ver" element={<VerCitasAdmin />} /> 
            <Route path="/citas/editar" element={<EditarCitaAdmin />} /> 
            <Route path="/citas/cancelar" element={<CancelarCitaAdmin />} />
            <Route path="gestion-formulario" element={<GestionFormulario />} />

            {/* Rutas protegidas */}
            <Route
                path="/home"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}> {/* Protección de ruta */}
                        <Home />
                    </AuthVerification>
                }
            />
            <Route
                path="/home-admin" 
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}> {/* Protección de ruta */}
                        <HomeAdmin />
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
                <Route path="programar" element={<ProgramarCita />} />
                <Route path="ver" element={<VerCitas />} />
                <Route path="reprogramar" element={<ReprogramarCita />} />
                <Route path="cancelar" element={<CancelarCita />} />
            </Route>
            <Route
                path="/donacion/formulario"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}> {/* Protección de ruta */}
                        <FormularioDonacion />
                    </AuthVerification>
                }
            />
            <Route
                path="/usuario/actualizar_datos"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}> {/* Protección de ruta */}
                        <ActualizarDatos />
                    </AuthVerification>
                }
            />
            <Route
                path="/informacion"
                element={
                    <AuthVerification isAuthenticated={isAuthenticated}> {/* Protección de ruta */}
                        <Informacion />
                    </AuthVerification>
                }
            />
        </Routes>
    );
}

export default App;