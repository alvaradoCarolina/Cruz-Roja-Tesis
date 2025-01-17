import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar los íconos de ojo
import "./Register.style.css";
import logo_cruz_roja from "../../assets/images/LOGOS-PARA-WEB-MARZO-02.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("donante");
  const [adminCode, setAdminCode] = useState(""); // Nuevo estado para el código de administrador
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Estado para mostrar/ocultar confirmación de contraseña
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const selectRef = useRef(null);

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!email) newErrors.email = "El correo electrónico es obligatorio.";
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6 || password.length > 12) {
      newErrors.password = "La contraseña debe tener entre 6 y 12 caracteres.";
    }
    if (password !== confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden.";
    if (role === "admin" && !adminCode) newErrors.adminCode = "El código de administrador es obligatorio."; // Validar el código de administrador
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verifica si el correo ya está registrado por otro método (incluido Google)
  const checkIfUserExists = async () => {
    const userQuery = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      // Verifica si el usuario fue registrado con Google
      if (user.provider === "google") {
        return "google";
      }
      return true;
    }
    return false;
  };

  // Verifica el código de administrador
  const checkAdminCode = async (code) => {
    const codesQuery = query(collection(db, "adminCodes"), where("code", "==", code));
    const querySnapshot = await getDocs(codesQuery);
    return !querySnapshot.empty;
  };

  // Definir la función handleRegister
  const handleRegister = async () => {
    if (!validateFields()) return;

    // Verifica si el usuario ya existe con el mismo correo
    const userExists = await checkIfUserExists();
    if (userExists === "google") {
      Swal.fire({
        title: "Error",
        text: "Este correo ya está registrado con Google. No puedes usarlo para registrarte nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    } else if (userExists) {
      Swal.fire({
        title: "Error",
        text: "Este correo ya está registrado con otro servicio. No puedes usarlo para registrarte nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    // Verifica el código de administrador si el rol es "admin"
    if (role === "admin") {
      const validCode = await checkAdminCode(adminCode);
      if (!validCode) {
        Swal.fire({
          title: "Error",
          text: "El código de administrador es inválido.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar en Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        email,
        role,
        provider: "email", // Indica que se registró por correo
      });

      Swal.fire({
        title: "¡Registro exitoso!",
        text: `El ${role === "admin" ? "administrador" : "donante"} se ha registrado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error al registrar",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  // Manejo del registro con Google
  const handleGoogleSignIn = async () => {
    // Verifica si el correo ya está asociado con una cuenta de Google
    const userExists = await checkIfUserExists();
    if (userExists === "google") {
      Swal.fire({
        title: "Error",
        text: "Este correo ya está registrado con Google. No puedes registrarte nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Guardar en Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        role,
        provider: "google", // Indica que se registró con Google
      });

      Swal.fire({
        title: "¡Registro exitoso!",
        text: `El ${role === "admin" ? "administrador" : "donante"} se ha registrado correctamente.`,
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error al iniciar sesión",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <main className="register-container">
      <aside className="aside-info">
        <img src={logo_cruz_roja} alt="logo cruz-roja" className="logo_register" />
        <h1>REGÍSTRATE</h1>
        <p>Accede a los servicios de nuestro sistema mediante el registro en el aplicativo de donación.</p>
        <span className="login-redirect">
          ¿Ya tienes una cuenta? <a className="hyperlink" href="/">Ingresa aquí</a>
        </span>
      </aside>

      <div className="register-form">
        <div>
          <label htmlFor="role">Selecciona tu rol:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="donante">Donante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {role === "admin" && (
          <md-outlined-text-field
            label="Código de Administrador"
            value={adminCode}
            onInput={(e) => setAdminCode(e.target.value)}
            required
          ></md-outlined-text-field>
        )}
        {errors.adminCode && <p className="error">{errors.adminCode}</p>}

        <md-outlined-text-field
          label="Nombre y Apellido"
          value={name}
          onInput={(e) => setName(e.target.value)}
          required
        ></md-outlined-text-field>
        {errors.name && <p className="error">{errors.name}</p>}

        <md-outlined-text-field
          label="Correo Electrónico"
          type="email"
          value={email}
          onInput={(e) => setEmail(e.target.value)}
          required
        ></md-outlined-text-field>
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="password-field-container">
          <md-outlined-text-field
            label="Contraseña"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onInput={(e) => setPassword(e.target.value)}
            required
          ></md-outlined-text-field>
          <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <div className="password-field-container">
          <md-outlined-text-field
            label="Confirmar Contraseña"
            type={confirmPasswordVisible ? "text" : "password"}
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.target.value)}
            required
          ></md-outlined-text-field>
          <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <md-filled-button onClick={handleRegister}>
          Registrarse
        </md-filled-button>

        <hr />
        {role === "donante" && (
          <md-filled-button onClick={handleGoogleSignIn} className="google-signin">
            <FaGoogle style={{ marginRight: "8px" }} /> Regístrate con Google
          </md-filled-button>
        )}
      </div>
    </main>
  );
};

export default Register;
