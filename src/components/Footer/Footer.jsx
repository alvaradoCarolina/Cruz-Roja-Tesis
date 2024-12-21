import React from 'react';
import "./Footer.style.css";
import logo_stack from '../../assets/images/LOGOS-PARA-WEB-MARZO-02.png';
import {FaFacebook, FaInstagram, FaTiktok} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";

const Footer = () => {
    return (
        <>
            <div className="contacto-container">
                <section className="logo-stack">
                    <img src={logo_stack} alt="logo stack"/>
                </section>
                <section className="contacto-info">
                    <h2 className="title">Contacto</h2>
                    <ul>
                        <li><strong>Teléfono:</strong> (+593 2) 2582 482</li>
                        <li><strong>Email:</strong> comunicacion@cruzroja.org.ec</li>
                        <li>
                            <strong>Dirección:</strong> Antonio Elizalde E4-31 y Av. Gran Colombia, sector La Alameda.
                            Quito
                            - Ecuador
                        </li>
                    </ul>

                    <div className="social-info">
                        <ul>
                            <li>
                                <a href="https://www.facebook.com/cruzrojaecuatorianacre">
                                    <FaFacebook/>
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/cruzrojaecuador">
                                    <FaXTwitter/>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/cruz_roja_ecuatoriana/">
                                    <FaInstagram/>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.tiktok.com/@cruzrojaecuador?lang=es">
                                    <FaTiktok/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="map-info">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7898307783794!2d-78.50608572414394!3d-0.21652309978134557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a214b2c1c8f%3A0xbe846faa316e92da!2sCruz%20Roja%20Ecuatoriana%20-%20Sede%20Central!5e0!3m2!1ses!2sec!4v1734748094238!5m2!1ses!2sec"
                        style={{border: 0}}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Embed"
                    ></iframe>
                </section>
            </div>

            <footer className="footer">
                <span>CRE© 2024 Todos los derechos reservados</span>
            </footer>
        </>
    );
};

export default Footer;
