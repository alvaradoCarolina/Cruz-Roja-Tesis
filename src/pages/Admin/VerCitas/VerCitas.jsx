import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import './VerCitas.style.css';

const VerCitas = () => {
    const [citas, setCitas] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener las citas
                const citasSnapshot = await getDocs(collection(db, "citas"));
                const citasData = citasSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Obtener los usuarios
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // Combinar los datos
                const combinedData = citasData.map(cita => {
                    const user = usersData.find(user => user.uid === cita.userId);
                    return {
                        ...cita,
                        usersName: user ? user.name : 'Desconocido',
                        usersEmail: user ? user.email : 'Desconocido',
                    };
                });

                setCitas(combinedData);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="layout">
            <NavbarAdmin />
            <main className="main">
                <div className="ver-citas-container">
                    <h1>Lista de Citas</h1>
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Correo Electrónico</th>
                                <th>Sede</th>
                            </tr>
                        </thead>
                        <tbody>
                            {citas.map((cita, index) => (
                                <tr key={index}>
                                    <td>{cita.day}</td>
                                    <td>{cita.time}</td>
                                    <td>{cita.usersName}</td>
                                    <td>{cita.usersEmail}</td>
                                    <td>{cita.location}</td>
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

export default VerCitas;
