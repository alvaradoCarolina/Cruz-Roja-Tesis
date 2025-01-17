import React, { useState, useEffect } from 'react';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import './EditarCita.style.css';

const EditarCita = () => {
    const [citas, setCitas] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCita, setSelectedCita] = useState(null);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    // Cargar citas y usuarios al montar el componente
    useEffect(() => {
        fetchCitas();
        fetchUsers();
    }, []);

    // Obtener citas desde la base de datos
    const fetchCitas = async () => {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCitas(citasData);
    };

    // Obtener usuarios desde la base de datos
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(usersData);
    };

    // Manejar la selección de una cita para editar
    const handleSelectCita = (cita) => {
        setSelectedCita(cita);
        setFecha(cita.day); // Usar el campo `day` como fecha
        setHora(cita.time); // Usar el campo `time` como hora
    };

    // Guardar los cambios en la cita seleccionada
    const handleEditar = async (id) => {
        if (!fecha || !hora) {
            Swal.fire({
                title: "Campos incompletos",
                text: "Por favor, llena todos los campos antes de continuar.",
                icon: "warning",
                confirmButtonText: "Aceptar",
            });
            return;
        }

        try {
            await updateDoc(doc(db, "citas", id), {
                day: fecha,
                time: hora,
            });
            Swal.fire({
                title: "Cita Editada",
                text: "La cita ha sido editada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
            setSelectedCita(null);
            setFecha('');
            setHora('');
            fetchCitas(); // Actualizar la lista de citas
        } catch (error) {
            Swal.fire({
                title: "Error al editar cita",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    // Obtener el nombre del donante desde la lista de usuarios
    const getUserName = (userId) => {
        const user = users.find((user) => user.uid === userId);
        return user ? user.name || "Sin nombre" : "Desconocido";
    };

    return (
        <div className="layout">
            <NavbarAdmin />
            <main className="main">
                <div className="editar-cita-container">
                    <h1>Editar Cita</h1>
                    {selectedCita && (
                        <div className="editar-cita-form">
                            <h2>Editar Cita</h2>
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
                            <button
                                className="admin-button"
                                onClick={() => handleEditar(selectedCita.id)}
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    )}
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita) => (
                                <tr key={cita.id}>
                                    <td>{cita.day}</td>
                                    <td>{cita.time}</td>
                                    <td>{getUserName(cita.userId)}</td>
                                    <td>{cita.usersEmail}</td>
                                    <td>
                                        <button
                                            className="edit-button"
                                            onClick={() => handleSelectCita(cita)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditarCita;
