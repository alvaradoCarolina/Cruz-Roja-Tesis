// src/pages/Citas.js
import React from 'react';
import CustomNavbar from "../../components/SubmenuNavbar";
import { Link } from 'react-router-dom';
import './Citas.style.css'; // Archivo CSS para estilos
import Footer from "../../components/Footer";

import addScheudle from '../../assets/vectors/calendar-add-svgrepo-com.svg';
import editScheudle from '../../assets/vectors/calendar-edit-svgrepo-com.svg'
import seeScheudle from '../../assets/vectors/calendar-search-svgrepo-com.svg'
import deleteScheudle from '../../assets/vectors/calendar-remove-svgrepo-com.svg'

const Citas = () => {
    return (
        <>
            <CustomNavbar />
            <div className="citas-container">
                {/* Panel izquierdo */}
                <div className="citas-left-panel">
                    <h1>Gestión de Citas</h1>
                    <p>Nuestro nuevo sistema de gestión de citas para la donación de sangre facilitará a los usuarios, nuevos y recurrentes, agilizar el proceso de donación.</p>
                </div>

                {/* Panel derecho */}
                <div className="citas-right-panel">
                    <div className="citas-item">
                        <Link to="programar">
                            <div className="cita-compose-item">
                                <img src={addScheudle} alt="" className="compose-icon"/>
                                <p>Programar Cita</p>
                            </div>
                        </Link>
                    </div>
                    <div className="citas-item">
                        <Link to="ver">
                            <div className="cita-compose-item">
                                <img src={seeScheudle} alt="" className="compose-icon"/>
                                <p>Ver Citas</p>
                            </div>
                        </Link>
                    </div>
                    <div className="citas-item">
                        <Link to="reprogramar">
                            <div className="cita-compose-item">
                                <img src={editScheudle} alt="" className="compose-icon"/>
                                <p>Actualizar o Editar Cita</p>
                            </div>
                        </Link>
                    </div>
                    <div className="citas-item">
                        <Link to="cancelar">
                            <div className="cita-compose-item">
                                <img src={deleteScheudle} alt="" className="compose-icon"/>
                                <p>Cancelar Cita</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default Citas;
