import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import NavbarAdmin from "../../../components/Admin/NavbarAdmin";
import Footer from '../../../components/Footer';
import Swal from 'sweetalert2';
import "./Donantes.style.css";

const Donantes = () => {
    const [donantes, setDonantes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const itemsPerPage = 10; // Cantidad de donantes por página

    useEffect(() => {
        fetchDonantes();
    }, []);

    const fetchDonantes = async () => {
        try {
            const q = query(collection(db, "users"), where("role", "==", "donante"));
            const querySnapshot = await getDocs(q);
            const donantesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDonantes(donantesData);
        } catch (error) {
            console.error("Error al obtener donantes:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "users", id));
            Swal.fire({
                title: "Donante eliminado",
                text: "El donante ha sido eliminado exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
            fetchDonantes(); // Actualizar la lista de donantes
        } catch (error) {
            Swal.fire({
                title: "Error al eliminar donante",
                text: error.message,
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        }
    };

    // Cálculo para paginación
    const totalPages = Math.ceil(donantes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDonantes = donantes.slice(startIndex, endIndex);

    return (
        <>
            <div className="layout">
                <NavbarAdmin />
                <main className="main">
                    <div className="donantes-container">
                        <h1>Lista de Donantes</h1>

                        <table className="donantes-table">
                            <thead>
                                <tr>
                                    <th>#</th> {/* Columna para numeración */}
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDonantes.map((donante, index) => (
                                    <tr key={donante.id}>
                                        <td>{startIndex + index + 1}</td> {/* Número de la fila */}
                                        <td>{donante.name}</td>
                                        <td>{donante.email}</td>
                                        <td>{donante.role}</td>
                                        <td>
                                            <button 
                                                className="delete-button"
                                                onClick={() => handleDelete(donante.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Controles de paginación */}
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Anterior
                            </button>
                            <span>Página {currentPage} de {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Donantes;
