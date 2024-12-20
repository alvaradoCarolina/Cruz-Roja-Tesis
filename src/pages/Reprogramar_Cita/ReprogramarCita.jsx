import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import Sidebar from '../../components/Sidebar';
import './ReprogramarCita.style.css';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const ReprogramarCita = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newDay, setNewDay] = useState('');
    const [newTime, setNewTime] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            const appointmentsCollection = collection(db, "citas");
            const appointmentsSnapshot = await getDocs(appointmentsCollection);
            const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentsList);
        };

        fetchAppointments();
    }, []);

    const handleReprogram = async () => {
        if (selectedAppointment && newDay && newTime) {
            const appointmentDoc = doc(db, "citas", selectedAppointment.id);
            await updateDoc(appointmentDoc, {
                day: newDay,
                time: newTime,
            });
            alert("Cita reprogramada exitosamente.");
            setAppointments(appointments.map(app => app.id === selectedAppointment.id ? { ...app, day: newDay, time: newTime } : app));
        } else {
            alert("Por favor, seleccione una cita y una nueva fecha y hora.");
        }
    };

    return (
        <div className="reprogramar-cita-container">
            <CustomNavbar />
            <Container fluid className="reprogramar-cita-main-content">
                <Row className="reprogramar-cita-top-bar">
                    <Col md={12}>
                        <h1 className="text-white">EDITAR CITAS</h1>
                    </Col>
                </Row>
                <Row>
                    <Sidebar />
                    <Col md={9} className="reprogramar-cita-content">
                        <h4>Selecciona una Cita </h4>
                        <Table bordered className="reprogramar-cita-table">
                            <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Lugar</th>
                                <th>Seleccionar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.day}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.location}</td>
                                    <td>
                                        <Button
                                            style={{backgroundColor: 'rgb(238, 192, 192)', color: 'black', border: 'none', }}
                                            onClick={() => setSelectedAppointment(appointment)}
                                        >
                                            Seleccionar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>

                        {selectedAppointment && (
                            <Form>
                                <Row>
                                    <Col md={3}>
                                        <Form.Group controlId="reprogramar-cita-formDay">
                                            <Form.Label className='reprogramar-cita-formDay'>Selecciona el Nuevo Día</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={newDay}
                                                onChange={(e) => setNewDay(e.target.value)}
                                                className="custom-date-picker"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={9}>
                                        <Form.Group controlId="reprogramar-cita-formTime">
                                            <Form.Label className='reprogramar-cita-formDay'>Selecciona la Nueva Hora</Form.Label>
                                            <Table bordered className="programar-cita-table">
                                                <thead>
                                                <tr>
                                                    <th>Hora</th>
                                                    <th>Lunes</th>
                                                    <th>Martes</th>
                                                    <th>Miércoles</th>
                                                    <th>Jueves</th>
                                                    <th>Viernes</th>
                                                    <th>Sábado</th>
                                                    <th>Domingo</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {Array.from({ length: 8 }, (_, i) => 9 + i).map((hour) => (
                                                    <tr key={hour}>
                                                        <td>{`${hour}:00 `}</td>
                                                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                                            <td key={day}>
                                                                <div
                                                                    className={`programar-cita-available-slot ${newTime === `${day} ${hour}:00` ? 'selected' : ''}`}
                                                                    onClick={() => setNewTime(`${day} ${hour}:00`)}
                                                                >
                                                                    Disponible
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="mt-3 justify-content-center">
                                    <Col md={3}>
                                        <Button variant="success" onClick={handleReprogram} block className="programar-cita-ml-2">Reprogramar</Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ReprogramarCita;