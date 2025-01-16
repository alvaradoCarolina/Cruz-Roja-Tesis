import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import './VerCitas.style.css';


const VerCitas = () => {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const fetchCitas = async () => {
            const querySnapshot = await getDocs(collection(db, "citas"));
            const citasData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCitas(citasData);
        };

        fetchCitas();
    }, []);

    return (
        <div className="layout">
            <NavbarAdmin/>
            <main className="main">
                <div className="ver-citas-container">
                    <h1>Lista de Citas</h1>
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Correo Electronico</th>
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
                                    <th>{cita.location}</th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default VerCitas;
