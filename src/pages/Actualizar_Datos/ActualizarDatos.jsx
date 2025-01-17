import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Image, Modal } from 'react-bootstrap';
import CustomNavbar from '../../components/SubmenuNavbar';
import { db } from '../../services/firebaseConfig';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import changeKey from '../../assets/images/c.png';
import updateData from '../../assets/images/update-data.png';
import changeBloodType from '../../assets/images/change-blood-type.png';
import './ActualizarDatos.style.css';
import Footer from '../../components/Footer/Footer';

const ActualizarDatos = () => {
    const [donantes, setDonantes] = useState([]);
    const [selectedDonante, setSelectedDonante] = useState(null);
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [edad, setEdad] = useState('');
    const [tipoSangre, setTipoSangre] = useState('');
    const [userName, setUserName] = useState('');

    // Estados para Cambiar Clave
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Estados para Cambiar Datos Personales
    const [showUpdateData, setShowUpdateData] = useState(false);

    // Estados para Cambiar Tipo de Sangre
    const [showChangeBloodType, setShowChangeBloodType] = useState(false);

    // Estados para Actualizar Foto
    const [showUpdatePhoto, setShowUpdatePhoto] = useState(false);
    const [newPhoto, setNewPhoto] = useState(null);

    useEffect(() => {
        const fetchDonantes = async () => {
            try {
                const donantesCollection = collection(db, "donantes");
                const donantesSnapshot = await getDocs(donantesCollection);
                const donantesList = donantesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDonantes(donantesList);
            } catch (error) {
                console.error("Error fetching donors: ", error);
            }
        };

        fetchDonantes();
    }, []);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserName(user.displayName || user.email);
        }
    }, []);

    const handleChangePassword = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(user.email, currentPassword);

            // Reautenticar al usuario
            await reauthenticateWithCredential(user, credential);

            // Actualizar la contraseña
            await updatePassword(user, newPassword);
            alert("Contraseña actualizada exitosamente.");
            setShowChangePassword(false);
        } catch (error) {
            console.error("Error al cambiar la contraseña: ", error);
            alert("Error al cambiar la contraseña.");
        }
    };

    const handleUpdateData = async () => {
        if (selectedDonante) {
            try {
                const donanteDoc = doc(db, "donantes", selectedDonante.id);
                await updateDoc(donanteDoc, {
                    nombre,
                    email,
                    edad
                });
                alert("Datos personales actualizados exitosamente.");
                setShowUpdateData(false);
            } catch (error) {
                console.error("Error al actualizar datos personales: ", error);
                alert("Error al actualizar datos personales.");
            }
        } else {
            alert("Por favor, seleccione un donante.");
        }
    };

    const handleChangeBloodType = async () => {
        if (selectedDonante) {
            try {
                const donanteDoc = doc(db, "donantes", selectedDonante.id);
                await updateDoc(donanteDoc, {
                    tipoSangre
                });
                alert("Tipo de sangre actualizado exitosamente.");
                setShowChangeBloodType(false);
            } catch (error) {
                console.error("Error al actualizar tipo de sangre: ", error);
                alert("Error al actualizar tipo de sangre.");
            }
        } else {
            alert("Por favor, seleccione un donante.");
        }
    };


    const handleSelectDonante = (donante) => {
        setSelectedDonante(donante);
        setNombre(donante.nombre);
        setEmail(donante.email);
        setEdad(donante.edad);
        setTipoSangre(donante.tipoSangre);
    };

    return (
        <div className="actualizar-datos-container">
            <CustomNavbar />
            
        <br></br>
        <br></br>
        <br></br>
            <div className="actualizar-datos-main-content">
            <Row className="actualizar-datos-top-bar align-items-center"></Row>
            <Container fluid className="mt-4">
                    <Row className="justify-content-center">
                        <Col md={3} className="text-center">
                            <Button className="actualizar-datos-option" onClick={(e) => {e.target.blur(); setShowChangePassword(true);}}>
                                <Image src={changeKey} className="actualizar-datos-option-icon" />
                            </Button>
                            <div>Actualizar Contraseña</div>
                        </Col>
                        <Col md={3} className="text-center">
                            <Button className="actualizar-datos-option" onClick={(e) => {e.target.blur(); setShowUpdateData(true);}}>
                                <Image src={updateData} className="actualizar-datos-option-icon" />
                            </Button>
                            <div>Actualizar Nombre</div>
                        </Col>
                        <Col md={3} className="text-center">
                            <Button className="actualizar-datos-option" onClick={(e) => {e.target.blur(); setShowChangeBloodType(true);}}>
                                <Image src={changeBloodType} className="actualizar-datos-option-icon"/>
                            </Button>
                            <div>Actualizar Correo Electronico</div>
                        </Col>
                    </Row>
                </Container>

                {/* Modal para Cambiar Clave */}
                <Modal show={showChangePassword} onHide={() => setShowChangePassword(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar Contraseña</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formCurrentPassword">
                                <Form.Label>Contraseña Actual</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formNewPassword">
                                <Form.Label>Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{backgroundColor: '#b40b0b', color: 'white', border: 'none', }} onClick={() => setShowChangePassword(false)}>
                            Cancelar
                        </Button>
                        <Button variant="secondary" onClick={handleChangePassword}>
                            Actualizar Contraseña
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal para Cambiar Datos Personales */}
                <Modal show={showUpdateData} onHide={() => setShowUpdateData(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Actualizar Nombre</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            {/* Campo para el nombre */}
            <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        {/* Botón de cancelar */}
        <Button
            style={{ backgroundColor: '#b40b0b', color: 'white', border: 'none' }}
            onClick={() => setShowUpdateData(false)}
        >
            Cancelar
        </Button>

        {/* Botón de actualizar */}
        <Button variant="secondary" onClick={handleUpdateData}>
            Actualizar Datos
        </Button>
    </Modal.Footer>
</Modal>


                {/* Modal para Cambiar Tipo de Sangre */}
                <Modal show={showChangeBloodType} onHide={() => setShowChangeBloodType(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Actualizar correo</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                        <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
                            
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{backgroundColor: '#b40b0b', color: 'white', border: 'none', }} onClick={() => setShowChangeBloodType(false)}>
                            Cancelar
                        </Button>
                        <Button variant="secondary" onClick={handleChangeBloodType}>
                            Actualizar Tipo de Sangre
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <Footer />
        </div>
    );
    
};

export default ActualizarDatos;