import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import './ProgramarCita.style.css';

const ProgramarCita = () => {
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [donante, setDonante] = useState('');

    const handleProgramar = async () => {
        try {
            await addDoc(collection(db, "citas"), {
                fecha,
                hora,
                donante
            });
            Swal.fire({
                title: "Cita Programada",
                text: "La cita ha sido programada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
            setFecha('');
            setHora('');
            setDonante('');
        } catch (error) {
            Swal.fire({
                title: "Error al programar cita",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };

    return (
        <div className="layout">
            <NavbarAdmin/>
            <main className="main">
                <div className="programar-cita-container">
                    <h1>Programar Nueva Cita</h1>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="Fecha"/>
                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} placeholder="Hora"/>
                    <input type="text" value={donante} onChange={(e) => setDonante(e.target.value)} placeholder="Donante"/>
                    <button className="admin-button" onClick={handleProgramar}>Programar Cita</button>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default ProgramarCita;
