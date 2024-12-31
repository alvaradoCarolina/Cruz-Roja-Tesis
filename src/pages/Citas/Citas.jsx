import React, { useState } from 'react';
import CustomNavbar from "../../components/SubmenuNavbar";
import './Citas.style.css'; // Archivo CSS para estilos
import Footer from "../../components/Footer";

import addScheudle from '../../assets/vectors/calendar-add-svgrepo-com.svg';
import editScheudle from '../../assets/vectors/calendar-edit-svgrepo-com.svg'
import seeScheudle from '../../assets/vectors/calendar-search-svgrepo-com.svg'
import deleteScheudle from '../../assets/vectors/calendar-remove-svgrepo-com.svg'

// Componentes
import ProgramarCita from '../Programar_Cita';
import VerCitas from '../Ver_Citas';
import ReprogramarCita from '../Reprogramar_Cita';
import CancelarCita from '../Cancelar_Cita';
import {IoClose} from "react-icons/io5";

const Citas = () => {
    const [modalContent, setModalContent] = useState(null); // Estado para el contenido del modal

    // Función para abrir el modal con el componente correspondiente
    const openModal = (type) => {
        switch(type) {
            case 'programar':
                setModalContent(<ProgramarCita />);
                break;
            case 'ver':
                setModalContent(<VerCitas />);
                break;
            case 'reprogramar':
                setModalContent(<ReprogramarCita />);
                break;
            case 'cancelar':
                setModalContent(<CancelarCita />);
                break;
            default:
                setModalContent(null);
        }
    };

    // Función para cerrar el modal
    const closeModal = () => {
        setModalContent(null);
    };

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
                    <div className="citas-item" onClick={() => openModal('programar')}>
                        <div className="cita-compose-item">
                            <img src={addScheudle} alt="" className="compose-icon"/>
                            <p>Programar Cita</p>
                        </div>
                    </div>
                    <div className="citas-item" onClick={() => openModal('ver')}>
                        <div className="cita-compose-item">
                            <img src={seeScheudle} alt="" className="compose-icon"/>
                            <p>Ver Citas</p>
                        </div>
                    </div>
                    <div className="citas-item" onClick={() => openModal('reprogramar')}>
                        <div className="cita-compose-item">
                            <img src={editScheudle} alt="" className="compose-icon"/>
                            <p>Actualizar o Editar Cita</p>
                        </div>
                    </div>
                    <div className="citas-item" onClick={() => openModal('cancelar')}>
                        <div className="cita-compose-item">
                            <img src={deleteScheudle} alt="" className="compose-icon"/>
                            <p>Cancelar Cita</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalContent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={closeModal}>
                            <IoClose />
                        </button>
                        {modalContent}
                    </div>
                </div>
            )}
        </>
    );
}

export default Citas;