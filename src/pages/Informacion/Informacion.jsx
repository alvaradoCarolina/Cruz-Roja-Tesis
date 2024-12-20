import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import './Informacion.style.css';
import imagenDonacion from '../../assets/images/home2.png';
import imagenDonacion1 from '../../assets/images/info3.png';
import Footer from '../../components/Footer';

const Informacion = () => {
    return (
        <div className="info-cruz-roja-container">
            <CustomNavbar />
            <Container fluid className="info-cruz-roja-main">
                {/* Top Bar */}
                <Row className="info-cruz-roja-header">
                    <Col md={12}>
                        <h1>Información sobre la Donación de Sangre</h1>
                    </Col>
                </Row>

                {/* Primera Sección */}
                <Row className="info-cruz-roja-section">
                    <Col md={6} className="info-cruz-roja-image-box">
                        <div className="info-cruz-roja-image-red-box">
                            <Image src={imagenDonacion1} alt="Donación de Sangre" fluid />
                            <h3 className="info-cruz-roja-title">REQUISITOS</h3>
                        </div>
                    </Col>
                    <Col md={6} className="info-cruz-roja-content">
                        <h2>La donación es un acto solidario que puede salvar vidas. </h2>
                        <h2>Cada donación puede ayudar a hasta tres personas diferentes. </h2>
                        <h2>Además, es segura y fácil de realizar.</h2>
                        <ul>
                            <strong><li><h3>Tener entre 18 y 65 años de edad.</h3></li>
                                <li><h3>Pesar al menos 50 kilos (110 libras).</h3></li>
                                <li><h3>Estar en buen estado de salud.</h3></li>
                                <li><h3>No haber donado sangre en los últimos 56 días.</h3></li>
                                <li><h3>No tener enfermedades transmisibles por la sangre.</h3></li>
                                <li><h3>Haber dormido al menos 6 horas y haber ingerido alimentos en las últimas 4 horas.</h3></li></strong>
                        </ul>
                    </Col>
                </Row>

                {/* Segunda Sección */}
                <Row className="info-cruz-roja-section-centered">
                    <Col md={8} className="info-cruz-roja-centered-content">
                        <h1>Mitos y Verdades</h1>
                        <h3><p><strong>¿Donar sangre engorda?</strong> No, mantener una dieta saludable es lo único que afecta tu peso.</p></h3>
                        <h3><p><strong>¿Puedo presentar anemia?</strong> No, el cuerpo regenera rápidamente las células donadas.</p></h3>
                        <h3><p><strong>¿Es seguro donar sangre?</strong> Sí, todo el material utilizado es estéril y descartable.</p></h3>
                        <h3><p><strong>¿Las personas con tatuajes pueden donar sangre?</strong> Sí, pero deben esperar 12 meses después de hacerse el tatuaje.</p></h3>
                    </Col>
                </Row>

                {/* Tercera Sección */}
                <Row className="info-cruz-roja-section">
                    <Col md={6} className="info-cruz-roja-content">
                        <ul>
                            <li><h3>Ayudas a salvar vidas.</h3></li>
                            <li><h3>Promueves un estilo de vida saludable.</h3></li>
                            <li><h3>Recibes un chequeo básico de salud antes de donar.</h3></li>
                            <li><h3>Favoreces la renovación celular en tu cuerpo.</h3></li>
                            <li><h3>Mejora la salud cardiovascular</h3></li>
                            <li><h3>Donar sangre estimula la producción de nuevas células sanguíneas, lo que ayuda a mantener el sistema sanguíneo en buen estado</h3></li>
                            <li><h3>Cada vez que donas sangre, se realiza un chequeo de salud básico, lo que puede detectar problemas de salud no detectados anteriormente, como niveles altos de hemoglobina o infecciones.</h3></li>
                            <li><h3>La donación ayuda a regular los niveles de hierro, lo que puede prevenir la sobrecarga de hierro, una condición que puede dañar los órganos.</h3></li>
                            <li><h3>Ayudar a salvar vidas genera un fuerte sentimiento de satisfacción y bienestar emocional.</h3></li>
                            <li><h3>La donación de sangre también es esencial para tratar a personas con enfermedades crónicas como leucemia o trastornos hemorrágicos.</h3></li>
                        </ul>
                    </Col>
                    <Col md={6} className="info-cruz-roja-image-box">
                        <div className="info-cruz-roja-image-red-box">
                            <Image src={imagenDonacion} alt="Donación de Sangre" fluid />
                            <h3 className="info-cruz-roja-title">BENEFICIOS</h3>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
};

export default Informacion;