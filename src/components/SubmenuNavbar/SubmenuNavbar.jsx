import React, { useState } from 'react';
import { auth } from '../../services/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo_cre_trans.png';
import './SubmenuNavbar.style.css';
import { AiOutlineLogout } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdClose } from 'react-icons/io';

const NavbarConSubmenu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para el dropdown
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Sesión cerrada');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header className="custom-navbar">
            <div className="navbar-container">
                {/* Logo */}
                <a href="/home" className="navbar-logo">
                    <img src={logo} alt="Logo" />
                </a>

                {/* Solo se muestra en móvil el icono de menú */}
                <button
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <IoMdClose /> : <GiHamburgerMenu />}
                </button>

                {/* Menú de navegación, visible solo en móvil */}
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
                            <a href="/programarcita" className="dropdown-item">Citas</a>
                            <a href="/formulariodonacion" className="dropdown-item">Llenar Formulario</a>
                            <a href="/actualizardatos" className="dropdown-item">Actualizar Datos</a>
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
    );
};

export default NavbarConSubmenu;