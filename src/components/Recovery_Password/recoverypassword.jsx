import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import './recoverypassword.style.css';
import img3 from '../../assets/images/img3.png';
import { FaArrowLeft } from 'react-icons/fa';

const RecoverPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = getAuth(); // Obtén la instancia de auth

    const handleRecoverPassword = async () => {
        if (!email) {
            setError("* Por favor ingresa un correo electrónico");
            return;
        }

        try {
            // Verifica si el correo existe en Firebase Authentication
            const formattedEmail = email.trim().toLowerCase();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(formattedEmail)) {
                setError("* Ingresa un correo electrónico válido");
                return;
            }

            const signInMethods = await fetchSignInMethodsForEmail(auth, formattedEmail);
            if (signInMethods.length === 0) {
                setError("* El correo no está registrado! Por favor regístrate primero.");
                return;
            }

            // Si el correo existe, envía el correo de recuperación de contraseña
            await sendPasswordResetEmail(auth, formattedEmail);
            setMessage("Se ha enviado un correo para recuperar tu contraseña.");
            setError("");
            // Redirigir después de 5 segundos
            setTimeout(() => {
                navigate('/');
            }, 5000);
        } catch (error) {
            setError("Error al enviar el correo: " + error.message);
            setMessage("");
        }
    };

    const handleBack = () => {
        navigate('/'); // Cambia '/login' a la ruta de tu formulario de login
    };

    return (
        <div className="recover-password-wrapper">
            <div className="recover-container">
                <button className="recover-back-button" onClick={handleBack}>
                    <FaArrowLeft/>
                </button>
            </div>
            <div className="recover-left-side">
                <h1 className="recover-title">Recuperar Contraseña</h1>
                {message && <p className="recover-message">{message}</p>}
                {error && <p className="recover-error">{error}</p>}
                <label htmlFor="email" className="recover-label">Correo Electrónico</label>
                <input
                    className="recover-input"
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="recover-button" onClick={handleRecoverPassword}>Enviar Correo</button>
            </div>
            <div className="recover-right-side">
                <img src={img3} alt="Imagen de recuperación" />
            </div>
        </div>
    );
};

export default RecoverPassword;