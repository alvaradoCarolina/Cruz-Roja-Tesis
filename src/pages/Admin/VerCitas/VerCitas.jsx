import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import './VerCitas.style.css';

const VerCitas = () => {
    const [citas, setCitas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Elementos por página

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

                // Combinar y ordenar los datos
                const combinedData = citasData.map(cita => {
                    const user = usersData.find(user => user.uid === cita.userId);
                    return {
                        ...cita,
                        usersName: user ? user.name : 'Desconocido',
                        usersEmail: user ? user.email : 'Desconocido',
                    };
                });

                // Ordenar citas por fecha (más recientes al final)
                combinedData.sort((a, b) => new Date(a.day) - new Date(b.day));

                setCitas(combinedData);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    // Calcular el número total de páginas
    const totalPages = Math.ceil(citas.length / itemsPerPage);

    // Obtener los elementos para la página actual
    const currentItems = citas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Manejador de cambio de página
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="layout">
            <NavbarAdmin />
            <main className="main">
                <div className="ver-citas-container">
                    <h1>Citas Agendadas</h1>
                    <table className="citas-table">
                        <thead>
                            <tr>
                                <th>#</th> {/* Columna de numeración */}
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Donante</th>
                                <th>Correo Electrónico</th>
                                <th>Sede</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((cita, index) => (
                                <tr key={cita.id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Numeración */}
                                    <td>{cita.day}</td>
                                    <td>{cita.time}</td>
                                    <td>{cita.usersName}</td>
                                    <td>{cita.usersEmail}</td>
                                    <td>{cita.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
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

export default VerCitas;
