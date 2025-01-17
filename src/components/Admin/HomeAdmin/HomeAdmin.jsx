import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from "../NavbarAdmin";
import Footer from '../../Footer';
import "./HomeAdmin.style.css";


const HomeAdmin = () => {

    const year_now = new Date().getFullYear() + 1;
    const navigate = useNavigate();

    return (
        <>
        <div className="layout">
            <NavbarAdmin/>
            <div className="home-admin-container"> 
                <h1>Bienvenido, Administrador</h1>  
            </div>
            
            <section className="admin-section">
                {/* Gestionar Donantes */}
                <aside className="donantes-section">
                    <h1>Gestionar Donantes</h1>
                    <button className="admin-button" onClick={() => navigate('/gestion-donantes')}>Ver Donantes</button>
                </aside>

                {/* Administrar Citas */}
                <aside className="citas-section">
                    <h1>Administrar Citas</h1>
                    <button className="admin-button" onClick={() => navigate('/citas-admin')}>Gestionar Citas</button>
                </aside>

                {/* Gestionar Formularios de Donación */}
                <aside className="formularios-section">
                    <h1>Gestionar Formularios de Donación</h1>
                    <button className="admin-button">Ver Formularios</button>
                </aside>
            </section>

            <Footer/>
        </div>
        </>
    );
};

export default HomeAdmin;
