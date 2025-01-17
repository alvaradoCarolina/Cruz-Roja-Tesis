import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from '../../../components/Admin/NavbarAdmin/NavbarAdmin';
import Footer from '../../../components/Footer';
import './CitasAdmin.style.css';

const CitasAdmin = () => {
    const navigate = useNavigate();

    return (
        <div className="layout">
            <NavbarAdmin/>
            <div className="home-admin-container">
                <h1>Administrar Citas</h1>
            </div>
            
            <section className="admin-section">
                <aside className="citas-section">
                    <button className="admin-button" onClick={() => navigate('/citas/ver')}>Ver Citas</button>
                    <button className="admin-button" onClick={() => navigate('/citas/editar')}>Editar Citas</button>
                    <button className="admin-button" onClick={() => navigate('/citas/cancelar')}>Cancelar Cita</button>
                </aside>
            </section>

            <Footer/>
        </div>
    );
};

export default CitasAdmin;
