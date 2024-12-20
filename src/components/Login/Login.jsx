import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig.js";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { sendMail } from "../../services/mailerService.js";
import logo from "../../assets/images/logo.png";
import img2 from "../../assets/images/img2.png";
import { FaGoogle } from "react-icons/fa";
import './Login.style.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const googleProvider = new GoogleAuthProvider();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Correo y contraseña son obligatorios.");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userName = user.displayName || "Usuario";
            const currentDateTime = new Date().toLocaleString();

            // Enviar correo después del login exitoso
            await sendMail(email, "login_email", { userName, email, currentDateTime });

            navigate("/home");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Error al iniciar sesión.");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userName = user.displayName || "Usuario";
            const currentDateTime = new Date().toLocaleString();

            // Enviar correo después del login exitoso con Google
            await sendMail(user.email, "login_google", { userName, email: user.email, currentDateTime });

            navigate("/home");
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            setError("Error al iniciar sesión.");
        }
    };

    const handleRegister = () => {
        navigate('/register'); // Redirige a la ruta "/registro"
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="left-section">
                    <img src={img2} alt="Imagen lado izquierdo" className="side-image" />
                </div>
                <div className="right-section">
                    <div className="floating-box login-form">
                        <img src={logo} alt="logo" className="header-image" />
                        <h4>BIENVENIDO DE VUELTA</h4>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLogin}>Iniciar Sesión</button>
                        <button onClick={handleGoogleSignIn} className="googleButton">
                            <span className="googleLogo"><FaGoogle/></span>
                            Iniciar con Google
                        </button>
                        <p className="button-section">
                            ¿Aún no tienes cuenta?
                            <button onClick={handleRegister}>Registrate</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;