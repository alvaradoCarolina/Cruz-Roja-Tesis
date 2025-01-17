import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import './Informacion.style.css';
import imagenDonacion from '../../assets/images/home2.png';
import imagenDonacion1 from '../../assets/images/info3.png';
import Footer from '../../components/Footer';

const Informacion = () => {
    return (
        <div className="layout">
            <CustomNavbar/>

            <main className="main-component">
                {/* Título */}
                <br></br>
                <br></br>
                <br></br>
                <div className="info-header">
                    <h1>Información sobre la Donación de Sangre</h1>
                </div>

                <div className="info-content">

                    {/* Requisitos */}
                    <div className="donacion-component">
                        <span className="title-compose">
                            <h2>Requisitos</h2>
                        </span>

                        <span className="title-compose-mobile">
                            <h2>Requisitos</h2>
                        </span>

                        <div className="donacion-content">
                            <p className="donacion-text">
                                La donación es un acto solidario que puede salvar vidas. Cada donación puede ayudar a
                                hasta
                                tres personas diferentes. Además, es <strong>segura y fácil de realizar</strong>.
                            </p>
                            <p>Para realizar una donación debes tener en cuenta los siguientes puntos:</p>
                            <ul className="donacion-list">
                                <li>Tener entre 18 y 65 años de edad</li>
                                <li>Pesar al menos 50 kilos (110 libras).</li>
                                <li>Estar en buen estado de salud.</li>
                                <li>No haber donado sangre en los últimos 56 días.</li>
                                <li>No tener enfermedades transmisibles por la sangre.</li>
                                <li>Haber dormido al menos 6 horas y haber ingerido alimentos en las últimas 4 horas.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Mitos y verdades */}
                    <section className="myth-section">
                        <span className="title-compose">
                            <h2>Mitos y Verdades</h2>
                        </span>

                        <span className="title-compose-mobile">
                            <h2>Mitos y Verdades</h2>
                        </span>

                        <ul className="myth-content">
                            <li>
                                <span><strong>¿Donar sangre engorda?</strong></span>
                                <p>No, mantener una dieta saludable es lo único que afecta tu peso.</p>
                            </li>
                            <li>
                                <span><strong>¿Puedo presentar anemia?</strong></span>
                                <p>No, el cuerpo regenera rápidamente las células donadas.</p>
                            </li>
                            <li>
                                <span><strong>¿Es seguro donar sangre?</strong></span>
                                <p>Sí, todo el material utilizado es estéril y descartable.</p>
                            </li>
                            <li>
                                <span><strong>¿Las personas con tatuajes pueden donar sangre?</strong></span>
                                <p>Sí, pero deben esperar 12 meses después de hacerse el tatuaje.</p>
                            </li>
                        </ul>
                    </section>

                    {/* Beneficios */}
                    <section className="razones-section">
                         <span className="title-compose">
                            <h2>Beneficios</h2>
                        </span>

                        <span className="title-compose-mobile">
                            <h2>Beneficios</h2>
                        </span>

                        <ul className="razones-content">
                            <li>Ayudas a salvar vidas.</li>
                            <li>Promueves un estilo de vida saludable.</li>
                            <li>Recibes un chequeo básico de salud antes de donar.</li>
                            <li>Favoreces la renovación celular en tu cuerpo.</li>
                            <li>Mejora la salud cardiovascular</li>
                            <li>Donar sangre estimula la producción de nuevas células sanguíneas, lo que ayuda a mantener el sistema sanguíneo en buen estado</li>
                            <li>Cada vez que donas sangre, se realiza un chequeo de salud básico, lo que puede detectar problemas de salud no detectados anteriormente, como niveles altos de hemoglobina o infecciones.</li>
                            <li>La donación ayuda a regular los niveles de hierro, lo que puede prevenir la sobrecarga de hierro, una condición que puede dañar los órganos.</li>
                            <li>Ayudar a salvar vidas genera un fuerte sentimiento de satisfacción y bienestar emocional.</li>
                            <li>La donación de sangre también es esencial para tratar a personas con enfermedades crónicas como leucemia o trastornos hemorrágicos.</li>
                        </ul>
                    </section>
                </div>

            </main>

            <Footer/>
        </div>
    );
};

export default Informacion;