import React, { useState } from 'react';
import { auth } from '../../services/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo_cre_trans.png';
import './SubmenuNavbar.style.css';
import { AiOutlineLogout } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';
import Loader from "../Loader";

const NavbarConSubmenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
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
                    <a href="/home" className="navbar-logo">
                        <img src={logo} alt="Logo" />
                    </a>

                    {/* Icono de menú para móvil */}
                    <button
                        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <IoMdClose /> : <GiHamburgerMenu />}
                    </button>

                    {/* Menú de navegación */}
                    <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                        <a href="/home" className="nav-item">Inicio</a>
                        <a href="/informacion" className="nav-item">Aprende Sobre Donación</a>
                        <div className="dropdown">
                            <button
                                className="dropdown-toggle"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                Perfil
                            </button>
                            <div className={`dropdown-menu ${dropdownOpen ? '' : 'hidden'}`}>
                                <a href="/cita/programar" className="dropdown-item">Citas</a>
                                <a href="/donacion/formulario" className="dropdown-item">Llenar Formulario</a>
                                <a href="/usuario/actualizar_datos" className="dropdown-item">Actualizar Datos</a>
                            </div>
                        </div>
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

export default NavbarConSubmenu;