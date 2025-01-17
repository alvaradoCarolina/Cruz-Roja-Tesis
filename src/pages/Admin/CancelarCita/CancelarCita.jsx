import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import './CancelarCita.style.css';

const CancelarCita = () => {
    const [citas, setCitas] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchCitas();
        fetchUsers();
    }, []);

    // Obtener datos de citas
    const fetchCitas = async () => {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCitas(citasData);
    };

    // Obtener datos de usuarios
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(usersData);
    };

    // Obtener el nombre y correo del donante basado en userId
    const getDonanteDetails = (userId) => {
        const user = users.find((user) => user.uid === userId);
        if (user) {
            return { name: user.name || "Sin Nombre", email: user.email || "Sin Correo" };
        }
        return { name: "Desconocido", email: "Desconocido" };
    };

    // Manejar la cancelación de la cita
    const handleCancelar = async (id) => {
        try {
            await deleteDoc(doc(db, "citas", id));
            Swal.fire({
                title: "Cita Cancelada",
                text: "La cita ha sido cancelada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            fetchCitas(); // Actualizar la lista de citas
        } catch (error) {
            Swal.fire({
                title: "Error al cancelar cita",
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
                <div className="cancelar-cita-container">
                    <h1>Cancelar Cita</h1>
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Nombre del Donante</th>
                                <th>Correo del Donante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita) => {
                                const { name, email } = getDonanteDetails(cita.userId);
                                return (
                                    <tr key={cita.id}>
                                        <td>{cita.day}</td>
                                        <td>{cita.time}</td>
                                        <td>{name}</td>
                                        <td>{email}</td>
                                        <td>
                                            <button
                                                className="cancelar-button"
                                                onClick={() => handleCancelar(cita.id)}
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CancelarCita;
