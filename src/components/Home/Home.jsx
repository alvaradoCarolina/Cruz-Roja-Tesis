
import React, { useState, useEffect } from 'react';
import Navbar from "../SubmenuNavbar";
import "./Home.style.css";
import carrucel1 from '../../assets/images/carrucel1.png';
import carrucel2 from '../../assets/images/carrucel2.png';
import carrucel3 from '../../assets/images/carrucel3.png';
import home1 from '../../assets/images/info4.png'
import home2 from '../../assets/images/home1.png'
import Footer from '../Footer';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0); // Hook para el carrusel
    const images = [carrucel1, carrucel2, carrucel3
    ];

    // Cambiar la imagen cada 3 segundos
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000); // Cambia cada 3 segundos

        return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
    }, [images.length]);

    return (
        <div className="App">
            <Navbar />
            {/* Carrusel */}
            <div className="carousel-container">
                <div className="carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Imagen ${index + 1}`} className="carousel-image" />
                    ))}
                </div>
            </div>

            {/* Secciones debajo del carrusel */}
            <div className="sections-container">
                <div className="section">
                    <img src={home1} alt="Sección 1" />
                </div>
                <div className="section">
                    <img src={carrucel2} alt="Sección 1" />
                </div>
                <div className="section">
                    <img src={home2} alt="Sección 1" />
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default Home;
