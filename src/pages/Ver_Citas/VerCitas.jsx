import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table} from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import Sidebar from '../../components/Sidebar';
import './VerCitas.style.css';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const VerCitas = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const appointmentsCollection = collection(db, "citas");
            const appointmentsSnapshot = await getDocs(appointmentsCollection);
            const appointmentsList = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAppointments(appointmentsList);
        };

        fetchAppointments();
    }, []);


    return (
        <div className="ver-citas-container">
            <CustomNavbar />
            <Container fluid className="ver-citas-main-content">
                <Row className="ver-citas-top-bar">
                    <Col md={16}>
                        <h2 className="text-white">Citas Programadas de Donación</h2>
                    </Col>
                </Row>
                <Row>
                    <Sidebar />
                    <Col md={3} className="ver-citas-content">
                        <Table bordered className="ver-citas-table">
                            <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Día y Hora</th>
                                <th>Lugar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.day}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.location}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VerCitas;