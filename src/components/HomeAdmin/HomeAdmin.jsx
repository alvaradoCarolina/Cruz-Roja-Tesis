import React from 'react';
import NavbarAdmin from "../NavbarAdmin";
import Footer from '../Footer';
import "./HomeAdmin.style.css";

const HomeAdmin = () => {

    const year_now = new Date().getFullYear() + 1;

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
                    <button className="admin-button">Ver Donantes</button>
                    <button className="admin-button">Eliminar Donante</button>
                </aside>

                {/* Administrar Citas */}
                <aside className="citas-section">
                    <h1>Administrar Citas</h1>
                    <button className="admin-button">Ver Citas</button>
                    <button className="admin-button">Modificar Citas</button>
                    <button className="admin-button">Eliminar Citas</button>
                </aside>

                {/* Gestionar Formularios de Donación */}
                <aside className="formularios-section">
                    <h1>Gestionar Formularios de Donación</h1>
                    <button className="admin-button">Ver Formularios</button>
                    <button className="admin-button">Eliminar Formulario</button>
                </aside>
            </section>

            <Footer/>
        </div>
        </>
    );
};

export default HomeAdmin;
