import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import styled from 'styled-components';
import logo from '../../assets/images/logo.png';
import Sidebar from '../Sidebar';
import './SubmenuNavbar.style.css';
import { auth } from '../../services/firebaseConfig.js';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const NavbarConSubmenu = () => {
    const [submenuVisible, setSubmenuVisible] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setSubmenuVisible(true);
    };

    const handleMouseLeave = () => {
        setSubmenuVisible(false);
    };

    const handleSidebarToggle = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLogout = async () => {
        try {
            // Cerrar sesión en Firebase
            await signOut(auth);
            console.log("Sesión cerrada");

            // Esperar 5 segundos y redirigir al login
            setTimeout(() => {
                // Redirigir al login
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const StyledNavLink = styled(Nav.Link)`
    font-size: 18px;
    font-weight: bold;
    margin-right: 15px;
  `;

    const StyledNavDropdownItem = styled(NavDropdown.Item)`
    font-size: 18px;
    font-weight: bold;
  `;

    return (
        <>
            <Navbar bg="light" expand="lg" className="custom-navbar">
                <Container>
                    <Navbar.Brand href="/home">
                        <img src={logo} alt="Logo" className="logo-navbar-con-submenu" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <StyledNavLink href="/home">Inicio</StyledNavLink>
                            <StyledNavLink href="/informacion">Aprende Sobre Donación</StyledNavLink>
                            <StyledNavLink href="/contacto">Contacto</StyledNavLink>

                            <NavDropdown
                                className='ml-auto'
                                title={<strong>Perfil</strong>}
                                id="basic-nav-dropdown"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <StyledNavDropdownItem href="/programarcita" onClick={handleSidebarToggle}>Citas</StyledNavDropdownItem>
                                <NavDropdown.Divider />
                                <StyledNavDropdownItem href="/formulariodonacion">Llenar Formulario</StyledNavDropdownItem>
                                <NavDropdown.Divider />
                                <StyledNavDropdownItem href="/actualizardatos">Actualizar Datos</StyledNavDropdownItem>
                                <NavDropdown.Divider />
                            </NavDropdown>
                            <StyledNavLink href="#!" onClick={handleLogout}>Salir</StyledNavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showSidebar && <Sidebar />}
        </>
    );
};

export default NavbarConSubmenu;
