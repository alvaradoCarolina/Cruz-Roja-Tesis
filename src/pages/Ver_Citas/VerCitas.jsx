import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { db } from '../../services/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import './VerCitas.style.css';

const VerCitas = () => {
    const [appointments, setAppointments] = useState([]);
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchUserData = () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                console.log("Usuario autenticado: ", user.uid); // Verificar el ID del usuario
                setUserId(user.uid);  // Obtener el ID del usuario autenticado
            } else {
                console.log("No hay usuario autenticado");
            }
        };

        fetchUserData();
    }, []); // Se ejecuta solo una vez cuando el componente se monta

    useEffect(() => {
        if (!userId) return;  // Asegurarse de que el userId del usuario esté disponible

        // Referencia a la colección de citas
        const appointmentsCollection = collection(db, "citas");
        const appointmentsQuery = query(
            appointmentsCollection,
            where("userId", "==", userId)  // Filtramos por userId
        );

        console.log("Escuchando cambios en Firestore para el userId: ", userId);

        // Utilizamos onSnapshot para escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(appointmentsQuery, (appointmentsSnapshot) => {
            console.log("Datos recibidos de Firestore: ", appointmentsSnapshot.docs.map(doc => doc.data()));
            const appointmentsList = appointmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAppointments(appointmentsList);
            setIsLoading(false); // Cambiar el estado de carga cuando los datos se hayan cargado
        });

        // Limpiar el listener cuando el componente se desmonte
        return () => unsubscribe();
    }, [userId]); // Se ejecuta cuando el userId del usuario cambia

    return (
        <div className="ver-citas-container">
            <Container fluid className="ver-citas-main-content">
                <Row className="ver-citas-top-bar">
                    <Col md={16}>
                        <h2 className="text-white">Citas Programadas</h2>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="ver-citas-content">
                        {isLoading ? (
                            <div className="d-flex justify-content-center">
                                <Spinner animation="border" variant="light" />
                            </div>  // Indicador de carga
                        ) : (
                            appointments.length === 0 ? (
                                <p className="non-scheudle-phrase">Sin citas registradas</p>  // Mensaje si no hay citas
                            ) : (
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
                            )
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default VerCitas;