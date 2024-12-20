import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import Sidebar from '../../components/Sidebar';
import './ProgramarCita.style.css';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const ProgramarCita = () => {
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [usersName, setUsersName] = useState('');
    const [usersEmail, setUsersEmail] = useState("");

    useEffect(() => {
        const auth = getAuth();
        const users = auth.currentUser;
        if (users) {
            setUsersName(users.displayName);  // Capturamos el nombre
            setUsersEmail(users.email);
        }
    }, []);

    const handleDayChange = (event) => {
        setSelectedDay(event.target.value);
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
    };

    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    const handleSchedule = async () => {
        if (!selectedDay || !selectedTime || !selectedLocation) {
            alert("Por favor, seleccione todos los campos.");
            return;
        }
        try {
            await addDoc(collection(db, "citas"), {
                day: selectedDay,
                time: selectedTime,
                location: selectedLocation,
                usersEmail: usersEmail,
                usersName:usersName
            });
            alert("Cita agendada correctamente");
            setSelectedDay('');
            setSelectedTime('');
            setSelectedLocation('');
        } catch (e) {
            console.error("Error al agendar la cita: ", e);
            alert("Error al agendar la cita: " + e.message);
        }
    };

    const handleCancel = () => {
        setSelectedDay('');
        setSelectedTime('');
        setSelectedLocation('');
    };

    return (
        <div className="programar-cita-container">
            <CustomNavbar />
            <Container fluid className="programar-cita-main-content">
                <Row className="programar-cita-top-bar justify-content-center">
                    <Col md={4}>
                        <Form.Control as="select" value={selectedLocation} onChange={handleLocationChange}>
                            <option value="">Seleccione un lugar de donación</option>
                            <option value="Centro 1">CCI</option>
                            <option value="Centro 2">Alameda</option>
                            <option value="Centro 3">Recreo</option>
                        </Form.Control>
                    </Col>
                </Row>
                <Row>
                    <Sidebar />
                    <Col md={9} className="programar-cita-content">
                        <Form>
                            <Row>
                                <Col md={3}>
                                    <Form.Group controlId="programar-cita-formDay" className='programar-cita-formDay'>
                                        <Form.Label>SELECCIONE UN DIA DE DONACION</Form.Label>
                                        <input
                                            type="date"
                                            value={selectedDay}
                                            onChange={handleDayChange}
                                            className="programar-cita-day-selector"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="programar-cita-formTime">
                                        <Form.Label className='programar-cita-formDay'>HORARIO DE RESERVA</Form.Label>
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
                                            {Array.from({ length: 9 }, (_, i) => 9 + i ).map((hour) => (
                                                <tr key={hour}>
                                                    <td>{`${hour}:00 `}</td>
                                                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                                        <td key={day}>
                                                            <div
                                                                className={`programar-cita-available-slot ${
                                                                    selectedTime === `${day} ${hour}:00` ? 'selected' : ''
                                                                }`}
                                                                onClick={() => handleTimeClick(`${day} ${hour}:00`)}
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
                                    <Button variant="success" onClick={handleSchedule} block className="programar-cita-ml-2">REGISTRAR CITA</Button>
                                </Col>
                                <Col md={3}>
                                    <Button variant="danger" onClick={handleCancel} block className="programar-cita-ml-2">CANCELAR</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProgramarCita;