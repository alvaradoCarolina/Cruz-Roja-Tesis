import React from 'react';
import Navbar from "../SubmenuNavbar";
import Footer from '../Footer';
import "./Home.style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import carrucel1 from '../../assets/images/1_1.png';
import carrucel2 from '../../assets/images/Banner_principal_responsive-2-1.png';

const Home = () => {

    const year_now = new Date().getFullYear() + 1;

    return (
        <>
        <div className="layout">
            <Navbar/>

            <main className="main">
                {/* Seccion del carrusel */}
                <section className="carousel-section">
                    <Carousel autoPlay={true} showArrows={false} showThumbs={false} showStatus={false}
                              infiniteLoop={true}>
                        <div className="carousel-card">
                            <img src={carrucel1} alt=""/>
                            <div className="carousel-text">
                                <h3>Donación Voluntaria de Sangre</h3>
                                <p className="text-compose">
                                    DONAR SANGRE ES UN ACTO <b>VOLUNTARIO, SOLIDARIO Y ALTRUISTA.</b>
                                </p>
                                <span className="text-span">¡Tu mayor recompensa es salvar vidas!</span>
                            </div>
                        </div>

                        <div className="carousel-card">
                            <img src={carrucel2} alt=""/>
                            <div className="carousel-text composable-text">
                                <h3>
                                    ¿Qué hacemos?
                                </h3>
                                <p className="text-compose">
                                    Trabajamos para aliviar y prevenir el sufrimiento humano, promoviendo comunidades resilientes orientadas al desarrollo sostenible.
                                </p>
                            </div>
                        </div>

                    </Carousel>
                </section>
            </main>

            <section className="compose-section">
                {/* Seccion de Mision */}
                <aside className="mision-section">
                    <h1>Misión</h1>
                    <p>
                        Cruz Roja Ecuatoriana trabaja para aliviar y prevenir el sufrimiento humano, promoviendo
                        comunidades resilientes orientadas al desarrollo sostenible, mediante el accionar neutral e
                        imparcial de su personal humanitario y el continuo desarrollo de la Sociedad Nacional,
                        sustentados en los Principios Fundamentales del Movimiento.
                    </p>
                </aside>

                {/* Seccion de Visión */}
                <aside className="vision-section">
                    <h1>Visión</h1>
                    <p>
                        Al {year_now}, Cruz Roja Ecuatoriana será un referente nacional de la acción humanitaria neutral
                        e imparcial, a través de su voluntariado y personal comprometido, brindando servicios de calidad
                        a las comunidades, contribuyendo a su desarrollo sostenible, basados en una gestión innovadora,
                        transparente y eficiente.
                    </p>
                </aside>
            </section>

            <Footer/>
        </div>
        </>
    );
};

export default Home;