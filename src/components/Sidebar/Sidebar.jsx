import React, { useState } from 'react';
import { Col, Button } from 'react-bootstrap';
import './Sidebar.style.css';
import { Row } from 'react-bootstrap';


const Sidebar = () => {
    // Estado para el botón seleccionado
    const [selectedButton, setSelectedButton] = useState(null);

    // Función para manejar el clic en el botón
    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };

    return (
        <Col md={2} className="sidebar-cita-navbar">
            <div className="sidebar-appointment-menu-navbar">
                <Row className="cancelar-cita-top-bar">
                    <Col md={12}>
                        <h1 className="text-white">Cancelar Citas</h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={7} className="cancelar-cita-red-sidebar">
                        <div className="cancelar-cita-appointment-menu">
                            <Button className="cancelar-cita-button mb-4" href="/cita/programar">Programar Cita</Button>
                            <Button className="cancelar-cita-button mb-4" href="/cita/ver">Ver Citas</Button>
                            <Button className="cancelar-cita-button mb-4" href="/cita/reprogramar">Editar Citas</Button>
                            <Button className="cancelar-cita-button mb-4" href="/cita/cancelar">Cancelar Cita</Button>
                        </div>
                    </Col>
                </Row>
            </div>
        </Col>
    );
};

export default Sidebar;
