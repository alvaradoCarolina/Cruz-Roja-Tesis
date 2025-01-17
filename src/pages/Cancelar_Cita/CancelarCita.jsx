import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Container, Row, Col, Table, Button, Modal, Spinner } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConfig';
import { sendCancelScheduleEmail } from '../../services/mailerService.js';
import './CancelarCita.css';

const CancelarCita = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [userData, setUserData] = useState({ email: "", name: "", uid: "" });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Máximo de 10 citas por página

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                setUserData({
                    email: user.email || "Correo no proporcionado",
                    name: user.displayName || "Nombre no proporcionado",
                    uid: user.uid,
                });
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userData.uid) return;
            setLoading(true);

            try {
                const appointmentsCollection = collection(db, "citas");
                const appointmentsQuery = query(
                    appointmentsCollection,
                    where("userId", "==", userData.uid)
                );
                const appointmentsSnapshot = await getDocs(appointmentsQuery);
                const appointmentsList = appointmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    email: doc.data().email || "Correo no proporcionado",
                    name: doc.data().name || "Nombre no proporcionado",
                }));

                // Ordenar las citas por fecha (de 1 a 30)
                appointmentsList.sort((a, b) => new Date(a.day) - new Date(b.day));
                setAppointments(appointmentsList);
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [userData.uid]);

    const handleShowModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const handleCancel = async (id) => {
        if (selectedAppointment && selectedAppointment.usersEmail) {
            try {
                await Swal.fire({
                    title: 'Cita Cancelada',
                    text: 'La cita ha sido cancelada con éxito. Enviando correo...',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    setShowModal(false);
                });

                await sendCancelScheduleEmail({
                    to_email: selectedAppointment.usersEmail,
                    subject: "Cancelación de Cita",
                    userName: selectedAppointment.usersName,
                    day: selectedAppointment.day,
                    time: selectedAppointment.time,
                    location: selectedAppointment.location,
                    cancellationTime: new Date().toLocaleString(),
                });

                await deleteDoc(doc(db, "citas", id));
                setAppointments(appointments.filter(appointment => appointment.id !== id));
            } catch (error) {
                console.error("Error en el proceso de cancelación:", error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al cancelar la cita. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } else {
            await Swal.fire({
                title: 'Error',
                text: 'La cita seleccionada no tiene datos válidos.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    const totalPages = Math.ceil(appointments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="cancelar-cita-container">
            <Container fluid className="cancelar-cita-main-content">
                <Row className="reprogramar-cita-top-bar">
                    <Col md={12}>
                        <h1 className="text-white">Cancelación de Cita</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={8} className="cancelar-cita-content">
                        {loading ? (
                            <Spinner animation="border" variant="primary" className="loader" />
                        ) : appointments.length === 0 ? (
                            <p className="non-scheudle-phrase">No tiene citas registradas.</p>
                        ) : (
                            <Table bordered className="cancelar-cita-table">
                                <thead>
                                    <tr>
                                        <th>#</th> {/* Columna de numeración */}
                                        <th>Fecha</th>
                                        <th>Hora</th>
                                        <th>Lugar</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedAppointments.map((appointment, index) => (
                                        <tr key={appointment.id}>
                                            <td>{startIndex + index + 1}</td> {/* Numeración */}
                                            <td>{appointment.day}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.location}</td>
                                            <td>
                                                <Button variant="danger" onClick={() => handleShowModal(appointment)}>Cancelar</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Cancelación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedAppointment && (
                                <p>
                                    ¿Estás seguro de que deseas cancelar la cita programada para el {selectedAppointment.day} a las {selectedAppointment.time} en {selectedAppointment.location}?
                                </p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>No</Button>
                            <Button variant="danger" onClick={() => handleCancel(selectedAppointment.id)}>Sí, cancelar</Button>
                        </Modal.Footer>
                    </Modal>
                </Row>

                {/* Paginación */}
                <Row>
                    <Col md={3} className="pagination">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span> Página {currentPage} de {totalPages} </span>
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CancelarCita;
