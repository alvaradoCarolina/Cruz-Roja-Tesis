import React from 'react';
import Navbar from "../SubmenuNavbar";
import Footer from '../Footer';
import "./Home.style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import carrucel1 from '../../assets/images/1_1.png';
import carrucel2 from '../../assets/images/Banner_principal_responsive-2-1.png';

const Home = () => {

    return (
        <div className="layout">
            <Navbar />

            <main className="main">
                {/* Seccion del carrusel */}
                <section className="carousel-section">
                    <Carousel autoPlay={true} showArrows={false} showThumbs={false} showStatus={false} infiniteLoop={true}>
                        <div>
                            <img src={carrucel1} alt="" />
                        </div>
                        <div>
                            <img src={carrucel2} alt="" />
                        </div>
                    </Carousel>
                </section>

                <section className="compose-section">
                    {/* Seccion de Mision */}
                    <aside className="mision-section">
                        <h1>Misión</h1>
                        Este es una mision
                    </aside>

                    {/* Seccion de Visión */}
                    <aside className="vision-section">
                        <h1>Visión</h1>
                        Esta es mi vision
                    </aside>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;