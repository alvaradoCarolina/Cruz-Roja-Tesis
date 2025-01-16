import React, { useState, useEffect } from 'react';
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import './EditarCita.style.css';

const EditarCita = () => {
    const [citas, setCitas] = useState([]);
    const [selectedCita, setSelectedCita] = useState(null);
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    useEffect(() => {
        fetchCitas();
    }, []);

    const fetchCitas = async () => {
        const querySnapshot = await getDocs(collection(db, "citas"));
        const citasData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setCitas(citasData);
    };

    const handleEditar = async (id) => {
        try {
            await updateDoc(doc(db, "citas", id), {
                fecha,
                hora
            });
            Swal.fire({
                title: "Cita Editada",
                text: "La cita ha sido editada exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
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
                confirmButtonText: "Aceptar"
            });
        }
    };

    const handleSelectCita = (cita) => {
        setSelectedCita(cita);
        setFecha(cita.fecha);
        setHora(cita.hora);
    };

    return (
        <div className="layout">
            <NavbarAdmin/>
            <main className="main">
                <div className="editar-cita-container">
                    <h1>Editar Cita</h1>
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita) => (
                                <tr key={cita.id}>
                                    <td>{cita.fecha}</td>
                                    <td>{cita.hora}</td>
                                    <td>{cita.donante}</td>
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
                    {selectedCita && (
                        <div className="editar-cita-form">
                            <h2>Editar Cita de {selectedCita.donante}</h2>
                            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="Fecha"/>
                            <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} placeholder="Hora"/>
                            <button className="admin-button" onClick={() => handleEditar(selectedCita.id)}>Guardar Cambios</button>
                        </div>
                    )}
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default EditarCita;
