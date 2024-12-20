import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import './Register.style.css';
import img43 from '../../assets/images/img43.png';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [role, setRole] = useState("admin"); // Estado para el rol del usuario, por defecto 'admin'
    const googleProvider = new GoogleAuthProvider();
    const navigate = useNavigate();

    const validateName = () => {
        if (!name) {
            setErrors(prevErrors => ({ ...prevErrors, name: "*Nombre es requerido" }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, name: null }));
        }
    };

    const validateEmail = () => {
        if (!email) {
            setErrors(prevErrors => ({ ...prevErrors, email: "*Correo Electrónico es requerido" }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: null }));
        }
    };

    const validatePassword = () => {
        if (!password) {
            setErrors(prevErrors => ({ ...prevErrors, password: "*Contraseña es requerida" }));
        } else if (password.length < 6 || password.length > 12) {
            setErrors(prevErrors => ({ ...prevErrors, password: "*La contraseña debe tener entre 6 y 12 caracteres" }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: null }));
        }
    };

    const validateConfirmPassword = () => {
        if (!confirmPassword) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: "*Confirmar Contraseña es requerido" }));
        } else if (confirmPassword !== password) {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: "*Las contraseñas no coinciden" }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, confirmPassword: null }));
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !password || password !== confirmPassword) {
            setErrors({
                name: !name ? "Nombre es requerido" : null,
                email: !email ? "Correo Electrónico es requerido" : null,
                password: !password ? "Contraseña es requerida" : null,
                confirmPassword: password !== confirmPassword ? "Las contraseñas no coinciden" : null,
            });
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Guarda detalles adicionales en Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: name,
                email: email,
                role: role // Añade el rol aquí
            });
            console.log("Registered successfully");
            navigate('/'); // Redirige a la página de login
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            // Guarda detalles adicionales en Firestore
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                role: role // Añade el rol aquí
            });
            console.log("Iniciado sesión con Google");
            navigate('/'); // Redirige a la página de login
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h1>REGISTRATE</h1>
                {error && <p className="error">{error}</p>}
                <label htmlFor="role">Rol</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="donante">Donante</option>
                    <option value="admin">Administrador</option>
                </select>
                <label htmlFor="name">Nombre</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                />
                {errors.name && <p className="error">{errors.name}</p>}
                <label htmlFor="email">Correo Electrónico</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                />
                {errors.password && <p className="error">{errors.password}</p>}
                <label htmlFor="confirm-password">Confirmar Contraseña</label>
                <input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                />
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                <button onClick={handleRegister}>Registrarse</button>
                <hr />
                {role === "donante" && (
                    <div className="button-container">
                        <button onClick={handleGoogleSignIn} className="google-signin">
                            <FaGoogle style={{ marginRight: '8px' }} /> Ingresar con Google
                        </button>
                    </div>
                )}
                <div className="register-form">
                    <div className="register-container1">
                        <a className="ingreso-1" href="/">Ya tienes una cuenta? Ingresa aquí</a>
                    </div>
                </div>
            </div>
            <div className="register-image">
                <img src={img43} alt="Imagen de registro" />
            </div>
        </div>
    );
};

export default Register;