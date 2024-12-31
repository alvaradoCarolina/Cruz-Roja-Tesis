import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import profilePic from '../../assets/images/img1.png';
import './CancelarCita.style.css';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from '../../components/Sidebar';

const CancelarCita = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            const appointmentsCollection = collection(db, "citas");
            const appointmentsSnapshot = await getDocs(appointmentsCollection);
            const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentsList);
        };

        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        await deleteDoc(doc(db, "citas", id));
        setAppointments(appointments.filter(appointment => appointment.id !== id));
        setShowModal(false);
    };

    const handleShowModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowModal(true);
    };

    return (
        <div className="cancelar-cita-container">
            <Container fluid className="cancelar-cita-main-content">
                <Row className="reprogramar-cita-top-bar">
                    <Col md={12}>
                        <h1 className="text-white">EDITAR CITAS</h1>
                    </Col>
                </Row>
                <Row>

                    <Col md={8} className="cancelar-cita-content">

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
                    </Col>


                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Cancelación</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedAppointment && (
                                <>
                                    <p>¿Estás seguro de que deseas cancelar la cita programada para el {selectedAppointment.day} a las {selectedAppointment.time} en {selectedAppointment.location}?</p>
                                </>
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