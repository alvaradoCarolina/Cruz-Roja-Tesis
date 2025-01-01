import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { FaGoogle } from "react-icons/fa";
import Swal from "sweetalert2";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/button/filled-button.js";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "./Register.style.css";
import logo_cruz_roja from "../../assets/images/LOGOS-PARA-WEB-MARZO-02.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [errors, setErrors] = useState({});
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const selectRef = useRef(null);

  useEffect(() => {
    const selectElement = selectRef.current;

    // Actualiza el estado cuando cambia el valor del select
    const handleChange = (event) => {
      setRole(event.target.value);
    };

    selectElement.addEventListener("change", handleChange);

    // Limpia el listener al desmontar
    return () => {
      selectElement.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    // Sincroniza el valor de React con el select
    if (selectRef.current) {
      selectRef.current.value = role;
    }
  }, [role]);

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

          <md-outlined-select ref={selectRef} label="Rol" required>
            <md-select-option value="admin">
              <div slot="headline">Administrador</div>
            </md-select-option>
            <md-select-option value="donante">
              <div slot="headline">Donante</div>
            </md-select-option>
          </md-outlined-select>

          <md-outlined-text-field
              label="Nombre"
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

          <md-outlined-text-field
              label="Contraseña"
              type="password"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              required
          ></md-outlined-text-field>
          {errors.password && <p className="error">{errors.password}</p>}

          <md-outlined-text-field
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onInput={(e) => setConfirmPassword(e.target.value)}
              required
          ></md-outlined-text-field>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

          <md-filled-button onClick={handleRegister}>
            Registrarse
            <svg xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="16px" height="16px" viewBox="0 0 16 16" id="register-16px">
              <path id="Path_184" data-name="Path 184" d="M57.5,41a.5.5,0,0,0-.5.5V43H47V31h2v.5a.5.5,0,0,0,.5.5h5a.5.5,0,0,0,.5-.5V31h2v.5a.5.5,0,0,0,1,0v-1a.5.5,0,0,0-.5-.5H55v-.5A1.5,1.5,0,0,0,53.5,28h-3A1.5,1.5,0,0,0,49,29.5V30H46.5a.5.5,0,0,0-.5.5v13a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-2A.5.5,0,0,0,57.5,41ZM50,29.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V31H50Zm11.854,4.646-2-2a.5.5,0,0,0-.708,0l-6,6A.5.5,0,0,0,53,38.5v2a.5.5,0,0,0,.5.5h2a.5.5,0,0,0,.354-.146l6-6A.5.5,0,0,0,61.854,34.146ZM54,40V38.707l5.5-5.5L60.793,34.5l-5.5,5.5Zm-2,.5a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,40.5Zm0-3a.5.5,0,0,1-.5.5h-2a.5.5,0,0,1,0-1h2A.5.5,0,0,1,52,37.5ZM54.5,35h-5a.5.5,0,0,1,0-1h5a.5.5,0,0,1,0,1Z" transform="translate(-46 -28)"/>
            </svg>
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
