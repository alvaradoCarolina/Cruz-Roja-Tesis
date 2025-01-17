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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Máximo de 10 citas por página

    // Cargar citas y usuarios al montar el componente
    useEffect(() => {
        fetchCitas();
        fetchUsers();
    }, []);

    const fetchCitas = async () => {
        const querySnapshot = await getDocs(collection(db, 'citas'));
        const citasData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        // Ordenar las citas por fecha de manera ascendente
        const citasOrdenadas = citasData.sort((a, b) => {
            const fechaA = new Date(a.day);
            const fechaB = new Date(b.day);
            return fechaA - fechaB; // Orden ascendente por fecha
        });
        setCitas(citasOrdenadas);
    };

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setUsers(usersData);
    };

    const handleSelectCita = (cita) => {
        setSelectedCita(cita);
        setFecha(cita.day);
        setHora(cita.time);
    };

    const handleEditar = async (id) => {
        if (!fecha || !hora) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor, llena todos los campos antes de continuar.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            await updateDoc(doc(db, 'citas', id), {
                day: fecha,
                time: hora,
            });
            Swal.fire({
                title: 'Cita Editada',
                text: 'La cita ha sido editada exitosamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            setSelectedCita(null);
            setFecha('');
            setHora('');
            fetchCitas();
        } catch (error) {
            Swal.fire({
                title: 'Error al editar cita',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const getUserName = (userId) => {
        const user = users.find((user) => user.uid === userId);
        return user ? user.name || 'Sin nombre' : 'Desconocido';
    };

    const totalPages = Math.ceil(citas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCitas = citas.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="layout">
            <NavbarAdmin />
            <main className="main">
                <div className="editar-cita-container">
                    <h1>Editar Citas</h1>
                    {selectedCita && (
                        <div className="editar-cita-form">
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
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Correo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCitas.map((cita, index) => (
                                <tr key={cita.id}>
                                    <td>{startIndex + index + 1}</td>
                                    <td>{cita.day}</td>
                                    <td>{cita.time}</td>
                                    <td>{getUserName(cita.userId)}</td>
                                    <td>{cita.usersEmail || 'Desconocido'}</td>
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
                    <div className="pagination">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EditarCita;
