import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { Container, Row, Col, Table, Button, Modal, Spinner } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';  // Asegúrate de importar 'where' aquí
import { getAuth } from 'firebase/auth';
import { db } from '../../services/firebaseConfig';
import { sendCancelScheduleEmail } from '../../services/mailerService.js'; // Asegúrate de ajustar la ruta correcta
import './CancelarCita.style.css';

const CancelarCita = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [userData, setUserData] = useState({ email: "", name: "", uid: "" });  // Estado para el correo, nombre e ID del usuario
    const [loading, setLoading] = useState(false); // Estado para el indicador de carga

    useEffect(() => {
        const fetchUserData = async () => {
            const auth = getAuth();  // Obtén la instancia de autenticación
            const user = auth.currentUser;  // Obtén el usuario autenticado
            if (user) {
                console.log("Usuario autenticado:", user); // Depuración: información del usuario
                setUserData({
                    email: user.email || "Correo no proporcionado",
                    name: user.displayName || "Nombre no proporcionado",
                    uid: user.uid, // Guardamos el UID del usuario
                });
            } else {
                console.log("No hay usuario autenticado.");
            }
        };

        fetchUserData();
    }, []); // Se ejecuta solo al montar el componente

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!userData.uid) return;  // Asegúrate de que el UID del usuario esté disponible
            setLoading(true); // Activar el indicador de carga

            try {
                const appointmentsCollection = collection(db, "citas");
                const appointmentsQuery = query(
                    appointmentsCollection,
                    where("userId", "==", userData.uid) // Filtramos por ID del usuario
                );
                const appointmentsSnapshot = await getDocs(appointmentsQuery);
                const appointmentsList = appointmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    email: doc.data().email || "Correo no proporcionado",
                    name: doc.data().name || "Nombre no proporcionado",
                }));
                setAppointments(appointmentsList);
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            } finally {
                setLoading(false); // Desactivar el indicador de carga
            }
        };

        fetchAppointments();
    }, [userData.uid]); // Se ejecuta cuando el UID del usuario cambia

    const handleShowModal = (appointment) => {
        console.log("Cita seleccionada:", appointment);  // Imprimir cita seleccionada para depuración
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    const handleCancel = async (id) => {
        if (selectedAppointment && selectedAppointment.usersEmail) { // Asegúrate de que selectedAppointment tiene valores válidos
            try {
                // Mostrar alerta antes de enviar el correo
                await Swal.fire({
                    title: 'Cita Cancelada',
                    text: 'La cita ha sido cancelada con éxito. Enviando correo...',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                }).then(() => {
                    // Cerrar el modal cuando se cierra el SweetAlert
                    setShowModal(false);
                });

                console.log("Datos de la cita seleccionada:", selectedAppointment);

                // Llamada a la función de envío de correo con los parámetros correctos
                await sendCancelScheduleEmail({
                    to_email: selectedAppointment.usersEmail,
                    subject: "Cancelación de Cita",
                    userName: selectedAppointment.usersName,  // Usamos el nombre del usuario de la cita seleccionada
                    day: selectedAppointment.day,
                    time: selectedAppointment.time,
                    location: selectedAppointment.location,
                    cancellationTime: new Date().toLocaleString(),
                });

                console.log("Enviando correo con los siguientes parámetros:", {
                    to_email: selectedAppointment.usersEmail,
                    subject: "Cancelación de Cita",
                    userName: selectedAppointment.usersName,
                    day: selectedAppointment.day,
                    time: selectedAppointment.time,
                    location: selectedAppointment.location,
                    cancellationTime: new Date().toLocaleString(),
                });

                // Eliminar la cita de la base de datos
                console.log("Eliminando cita con ID:", id);
                await deleteDoc(doc(db, "citas", id));
                setAppointments(appointments.filter(appointment => appointment.id !== id));
                console.log("Cita eliminada exitosamente.");
            } catch (error) {
                console.error("Error en el proceso de cancelación. Detalles completos:", error);
                await Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al cancelar la cita. Por favor, intenta de nuevo.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
        } else {
            console.error("La cita seleccionada no tiene datos válidos.", selectedAppointment);
            await Swal.fire({
                title: 'Error',
                text: 'La cita seleccionada no tiene datos válidos.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

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
                            <Spinner animation="border" variant="primary" className="loader"/>  // Indicador de carga
                        ) : appointments.length === 0 ? (
                            <p className="non-scheudle-phrase">No tiene citas registradas.</p>
                        ) : (
                            <Table bordered className="cancelar-cita-table">
                                <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Lugar</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
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
            </Container>
        </div>
    );
};

export default CancelarCita;