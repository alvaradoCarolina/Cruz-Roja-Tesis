import React, { useState, useEffect } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    useMediaQuery,
    FormControl,
    InputLabel,
} from "@mui/material";
import Swal from "sweetalert2";
import CustomNavbar from "../../components/SubmenuNavbar";
import "./ProgramarCita.style.css";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ProgramarCita = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [usersName, setUsersName] = useState("");
    const [usersEmail, setUsersEmail] = useState("");

    const isMobile = useMediaQuery("(max-width:1000px)");
    const steps = ["Seleccionar sede", "Seleccionar día y hora", "Confirmar cita"];

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUsersName(user.displayName);
            setUsersEmail(user.email);
        }
    }, []);

    const handleNext = () => {
        if (activeStep === 0 && !selectedLocation) {
            Swal.fire("Error", "Debes seleccionar una sede.", "error");
            return;
        }
        if (activeStep === 1 && (!selectedDay || !selectedTime)) {
            Swal.fire("Error", "Debes seleccionar un día y una hora.", "error");
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleConfirm = async () => {
        try {
            await addDoc(collection(db, "citas"), {
                day: selectedDay,
                time: selectedTime,
                location: selectedLocation,
                usersEmail,
                usersName,
            });
            Swal.fire("Éxito", "Cita registrada correctamente.", "success");
            setSelectedDay("");
            setSelectedTime("");
            setSelectedLocation("");
            setActiveStep(0);
        } catch (error) {
            Swal.fire("Error", "No se pudo registrar la cita: " + error.message, "error");
        }
    };

    return (
        <>
            <header className="header-compose">
                Programación de Cita
            </header>
            <div className="compose-container">
                <Box sx={{width: "100%", maxWidth: "800px", margin: "0 auto", padding: ""}}>
                    <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{mt: 2}}>
                        {activeStep === 0 && (
                            <FormControl fullWidth>
                                <InputLabel id="location-label">Seleccionar sede</InputLabel>
                                <Select
                                    labelId="location-label"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <MenuItem value="CCI">CCI</MenuItem>
                                    <MenuItem value="Alameda">Alameda</MenuItem>
                                    <MenuItem value="Recreo">Recreo</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        {activeStep === 1 && (
                            <Box>
                                <TextField
                                    label="Seleccionar día"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    value={selectedDay}
                                    onChange={(e) => setSelectedDay(e.target.value)}
                                    sx={{mb: 2}}
                                />
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Hora</TableCell>
                                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                                                <TableCell key={day}>{day}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.from({length: 9}, (_, i) => 9 + i).map((hour) => (
                                            <TableRow key={hour}>
                                                <TableCell>{`${hour}:00`}</TableCell>
                                                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                                                    <TableCell
                                                        key={day}
                                                        onClick={() => setSelectedTime(`${day} ${hour}:00`)}
                                                        sx={{
                                                            cursor: "pointer",
                                                            backgroundColor: selectedTime === `${day} ${hour}:00` ? "#1976d2" : "transparent",
                                                            color: selectedTime === `${day} ${hour}:00` ? "#fff" : "inherit",
                                                        }}
                                                    >
                                                        Disponible
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box>
                                <h3>Confirmar cita</h3>
                                <p>
                                    <strong>Sede:</strong> {selectedLocation}
                                </p>
                                <p>
                                    <strong>Día:</strong> {selectedDay}
                                </p>
                                <p>
                                    <strong>Hora:</strong> {selectedTime}
                                </p>
                                <Button variant="contained" color="success" onClick={handleConfirm}>
                                    Confirmar
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between", mt: 2}}>
                        <Button disabled={activeStep === 0} onClick={handleBack}>
                            Atrás
                        </Button>
                        <Button
                            variant="contained"
                            onClick={activeStep === steps.length - 1 ? handleConfirm : handleNext}
                        >
                            {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                        </Button>
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default ProgramarCita;