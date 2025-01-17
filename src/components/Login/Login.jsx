import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebaseConfig.js"; // Importa Firestore
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore"; // Importa Firestore
import './Login.style.css';
import Loader from '../Loader';
import logo_cruz_roja from "../../assets/images/LOGOS-PARA-WEB-MARZO-02.png";
import Swal from "sweetalert2";
import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/textfield/outlined-text-field.js";
//import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwalActive, setIsSwalActive] = useState(false);
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Patrón de validación
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Correo y contraseña son obligatorios.");
            setIsLoading(false);
            setIsSwalActive(true);

            await Swal.fire({
                title: "Error",
                text: "Correo y contraseña son obligatorios.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });

            setIsSwalActive(false);
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.providerData.length > 1) {
                await Swal.fire({
                    title: "Error",
                    text: "Este usuario ya está registrado con otro proveedor. No puedes iniciar sesión con otro servicio.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
                setIsLoading(false);
                return;
            }

            // Consulta Firestore para obtener el rol del usuario
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.role === "admin") {
                    navigate("/home/admin"); // Redirigir a la pantalla de administrador
                } else {
                    navigate("/home"); // Redirigir a la pantalla de donante
                }
            } else {
                navigate("/home"); // Redirigir a la pantalla de donante como predeterminado
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setIsLoading(false);
            setIsSwalActive(true);

            await Swal.fire({
                title: "Error al iniciar sesión",
                text: "Usuario o contraseña incorrectos. Por favor verifica tus datos.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });

            setIsSwalActive(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (user.providerData.length > 1) {
                await Swal.fire({
                    title: "Error",
                    text: "Este usuario ya está registrado con otro proveedor. No puedes iniciar sesión con otro servicio.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
                setIsLoading(false);
                return;
            }

            // Consulta Firestore para obtener el rol del usuario
            const userQuery = query(collection(db, "users"), where("email", "==", user.email));
            const querySnapshot = await getDocs(userQuery);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                if (userData.role === "admin") {
                    navigate("/home/admin"); // Redirigir a la pantalla de administrador
                } else {
                    navigate("/home"); // Redirigir a la pantalla de donante
                }
            } else {
                navigate("/home"); // Redirigir a la pantalla de donante como predeterminado
            }
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            setIsLoading(false);
            setIsSwalActive(true);

            await Swal.fire({
                title: "Error al iniciar sesión",
                text: "Hubo un error al iniciar sesión con Google.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });

            setIsSwalActive(false);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const handleRecoveryPassword = () => {
        navigate('/recuperar-password');
    };

    return (
        <div className="login-container">
            {isLoading && !isSwalActive && <Loader title="Iniciando sesión" />}
            {!isLoading && (
                <div className="login-content">
                    <aside className="aside-info">
                        <img src={logo_cruz_roja} alt="logo cruz-roja" className="logo_register" />
                        <h1>Iniciar Sesión</h1>
                        <p>Accede a los servicios de nuestro sistema mediante el ingreso en el aplicativo de donación.</p>
                    </aside>

                    <div className="right-section">
                        <div className="floating-box login-form">
                            <h4>Ingresa con tu correo y contraseña</h4>
                            <md-outlined-text-field
                                label="Correo electrónico"
                                type="email"
                                value={email}
                                onInput={(e) => setEmail(e.target.value)}
                                required
                            ></md-outlined-text-field>
                            <md-outlined-text-field
                                label="Contraseña"
                                type="password"
                                value={password}
                                onInput={(e) => setPassword(e.target.value)}
                                required
                            ></md-outlined-text-field>

                            <md-filled-button onClick={handleLogin}>
                                Iniciar Sesión
                            </md-filled-button>

                            <span className="button-section">
                                ¿Has olvidado tu contraseña?
                                <button onClick={handleRecoveryPassword}>
                                    Recuperar
                                </button>
                            </span>

                            <hr className="login-hr"/>

                            <md-filled-button
                                className="google-signin"
                                onClick={handleGoogleSignIn}
                            >
                                <span>Iniciar con <FaGoogle className="GIcon"/></span>
                            </md-filled-button>

                            <span className="button-section">
                                ¿Aún no tienes cuenta?
                                <button onClick={handleRegister}>
                                    Registrate
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
