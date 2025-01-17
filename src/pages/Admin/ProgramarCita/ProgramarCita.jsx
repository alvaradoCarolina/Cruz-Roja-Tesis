import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin';
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import './ProgramarCita.style.css';

const ProgramarCita = () => {
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [donanteId, setDonanteId] = useState('');
    const [users, setUsers] = useState([]);

    // Cargar usuarios desde Firebase
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };

        fetchUsers();
    }, []);

    const isValidTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours >= 9 && hours < 18 && minutes >= 0 && minutes < 60;
    };

    const handleProgramar = async () => {
        if (!fecha || !hora || !selectedLocation || !donanteId) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, llena todos los campos antes de continuar.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        if (!isValidTime(hora)) {
            Swal.fire({
                title: "Hora no válida",
                text: "La hora debe estar entre las 9:00 a.m. y las 6:00 p.m.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        try {
            // Buscar el usuario seleccionado
            const usuarioSeleccionado = users.find((user) => user.id === donanteId);

            if (!usuarioSeleccionado) {
                Swal.fire({
                    title: "Usuario no encontrado",
                    text: "El ID del donante no es válido.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
                return;
            }

            // Crear nueva cita en la colección "citas"
            await addDoc(collection(db, "citas"), {
                day: fecha,
                time: hora,
                location: selectedLocation,
                userId: donanteId,
                usersEmail: usuarioSeleccionado.email,
                usersName: usuarioSeleccionado.name || "Sin nombre",
            });

            Swal.fire({
                title: "Cita Programada",
                text: "La cita ha sido programada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });

            // Limpiar los campos del formulario
            setFecha('');
            setHora('');
            setSelectedLocation('');
            setDonanteId('');
        } catch (error) {
            Swal.fire({
                title: "Error al programar cita",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    return (
        <div className="layout">
            <NavbarAdmin />
            <main className="main">
                <div className="programar-cita-container">
                    <h1>Programar Nueva Cita</h1>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        placeholder="Fecha"
                    />
                    <input
                        type="time"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        placeholder="Hora"
                    />
                    <FormControl fullWidth>
                        <div className='location-label'>Selecciona una Sede:</div>
                        <Select
                            labelId="location-label"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            <MenuItem value="CCI">CCI</MenuItem>
                            <MenuItem value="Alameda">Alameda</MenuItem>
                            <MenuItem value="Recreo">Recreo</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                    <div className='location-label'>Selecciona un Donante::</div>
                        <Select
                            labelId="donante-label"
                            value={donanteId}
                            onChange={(e) => setDonanteId(e.target.value)}
                        >
                            <MenuItem value="">Selecciona un Donante</MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    {user.name || "Sin nombre"} ({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <button className="admin-button" onClick={handleProgramar}>
                        Programar Cita
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProgramarCita;
