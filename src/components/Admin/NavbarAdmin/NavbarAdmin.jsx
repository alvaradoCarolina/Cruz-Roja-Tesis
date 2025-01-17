import React, { useState } from 'react';
import { auth } from '../../../services/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; // Importa Link
import logo from '../../../assets/images/logo_cre_trans.png';
import './NavbarAdmin.style.css';
import { AiOutlineLogout } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import Loader from "../../Loader/index.jsx";

const NavbarAdmin = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Estado para el loader
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true); // Mostrar el loader

        try {
            await signOut(auth); // Cerrar sesión
            console.log('Sesión cerrada');

            // Redirigir después de un breve retraso
            setTimeout(() => {
                navigate('/'); // Cambiar a la vista de inicio
            }, 3000);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            setIsLoading(false); // Ocultar el loader en caso de error
        }
    };

    return (
        <>
            {/* Mostrar Loader si isLoading está activo */}
            {isLoading && <Loader title="Cerrando sesión" />}

            {/* Contenido de la barra de navegación */}
            <header className="custom-navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/home/admin" className="navbar-logo">
                        <img src={logo} alt="Logo" />
                    </Link>

                    {/* Icono de menú para móvil */}
                    <button
                        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <IoMdClose /> : <GiHamburgerMenu />}
                    </button>

                    {/* Menú de navegación */}
                    <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                        <Link to="/home/admin" className="nav-item">Inicio</Link>
                        <Link to="/gestion/donantes" className="nav-item">Gestionar Donantes</Link>
                        <Link to="/citas/admin" className="nav-item">Administrar Citas</Link>
                        <Link to="/gestion/formulario" className="nav-item">Formularios de Donación</Link>

                        {/* Botón de logout */}
                        <button className="exit_button">
                            <a href="#!" onClick={handleLogout} className="nav-logout">
                                <AiOutlineLogout className="exitIcon" />
                                Salir
                            </a>
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default NavbarAdmin;
