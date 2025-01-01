import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Swal from 'sweetalert2'; // Importamos SweetAlert
import './recoverypassword.style.css';
import '@material/web/field/outlined-field.js';
import { FaArrowLeft } from 'react-icons/fa';
import logo_cruz_roja from "../../assets/images/LOGOS-PARA-WEB-MARZO-02.png";

const RecoveryPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(); // Obtén la instancia de auth

    const handleRecoverPassword = async () => {
        if (!email) {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor ingresa un correo electrónico',
            });
            return;
        }

        try {
            // Formateamos el correo para quitar espacios y poner en minúsculas
            const formattedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formattedEmail)) {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Ingresa un correo electrónico válido',
                });
                return;
            }

            // Enviar el correo de recuperación de contraseña directamente
            await sendPasswordResetEmail(auth, formattedEmail);
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Se ha enviado un correo para recuperar tu contraseña.',
            });

            // Redirigir después de 5 segundos
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            // Manejamos posibles errores al enviar el correo de recuperación
            if (error.code === 'auth/user-not-found') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'El correo no está registrado. Por favor regístrate primero.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: `Error al enviar el correo: ${error.message}`,
                });
            }
        }
    };

    const handleBack = () => {
        navigate('/'); // Cambia '/login' a la ruta de tu formulario de login
    };

    return (
        <div className="recover-password-wrapper">
            <button className="recover-back-button" onClick={handleBack}>
                <FaArrowLeft/>
            </button>

            <aside className="aside-info">
                <img src={logo_cruz_roja} alt="logo cruz-roja" className="logo_register"/>
                <h1>Recuperar contraseña</h1>
                <p>Ingresa el correo electrónico asociado a tu cuenta para obtener el correo de recuperación.</p>
            </aside>

            <div className="recover-right-side">
                <md-outlined-text-field
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    onInput={(e) => setEmail(e.target.value)}
                    required
                ></md-outlined-text-field>
                <br/>
                <md-filled-button onClick={handleRecoverPassword}>
                    Recuperar contraseña
                </md-filled-button>
            </div>
        </div>
    );
};

export default RecoveryPassword;