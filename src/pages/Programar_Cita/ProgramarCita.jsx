import React, { useState, useEffect } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
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
    TextField,
    TablePagination,
} from "@mui/material";
import Swal from "sweetalert2";
import { db } from "../../services/firebaseConfig";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { sendAppointmentEmail } from "../../services/mailerService.js";
import "./ProgramarCita.style.css"

const ProgramarCita = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [usersName, setUsersName] = useState("");
    const [usersEmail, setUsersEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [bookedSlots, setBookedSlots] = useState([]);
    const [weekendError, setWeekendError] = useState("");
    const [message, setMessage] = useState("Antes de continuar, selecciona un día para agendar tu cita:");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isMobile = useMediaQuery("(max-width:1000px)");
    const steps = ["Seleccionar sede", "Seleccionar día y hora", "Confirmar cita"];

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUsersName(user.displayName);
            setUsersEmail(user.email);
            setUserId(user.uid);
        }
    }, []);

    useEffect(() => {
        const fetchBookedSlots = async () => {
            const q = query(collection(db, "citas"));
            const querySnapshot = await getDocs(q);
            const slots = [];
            querySnapshot.forEach((doc) => {
                slots.push(doc.data());
            });
            setBookedSlots(slots);
        };
        fetchBookedSlots();
    }, []);

    const handleNext = async () => {
        if (activeStep === 0 && !selectedLocation) {
            Swal.fire("Error", "Debes seleccionar una sede.", "error");
            return;
        }
        if (activeStep === 1 && (!selectedDay || !selectedTime)) {
            Swal.fire("Error", "Debes seleccionar un día y una hora.", "error");
            return;
        }
        if (activeStep === 2) {
            try {
                await addDoc(collection(db, "citas"), {
                    day: selectedDay,
                    time: selectedTime,
                    location: selectedLocation,
                    usersEmail,
                    usersName,
                    userId,
                });

                const additionalInfo = {
                    userName: usersName,
                    selectedDay: selectedDay,
                    selectedTime: selectedTime,
                    selectedLocation: selectedLocation,
                };

                await sendAppointmentEmail(usersEmail, additionalInfo);

                await Swal.fire("Éxito", "Cita registrada correctamente y correo enviado.", "success");

                setSelectedDay("");
                setSelectedTime("");
                setSelectedLocation("");
                setActiveStep(0);
            } catch (error) {
                await Swal.fire("Error", "No se pudo registrar la cita: " + error.message, "error");
            }
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const isSlotBooked = (time) => {
        return bookedSlots.some(
            (slot) => slot.day === selectedDay && slot.time === time
        );
    };

    const generateTimeSlots = () => {
        const slots = [];
        const hours = [9, 10, 11, 1, 2, 3, 4];
        hours.forEach((hour) => {
            for (let min = 0; min < 60; min += 15) {
                const time = `${hour}:${min === 0 ? "00" : min}`;
                slots.push(time);
            }
        });
        return slots;
    };

    const isWeekday = (date) => {
        const day = new Date(date).getDay();
        return day >= 1 && day <= 5;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedSlots = generateTimeSlots().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleDateChange = (e) => {
        const day = e.target.value;
        const date = new Date(day);

        const dayOfWeek = date.toLocaleString("es-ES", { weekday: "long" });
        const dayOfMonth = date.getDate();
        const month = date.toLocaleString("es-ES", { month: "long" });
        const year = date.getFullYear();

        if (!isWeekday(day)) {
            setWeekendError("No se puede agendar una cita los fines de semana");
            setSelectedDay("");
        } else {
            setWeekendError("");
            setSelectedDay(day);

            const formattedDate = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dayOfMonth} - ${month.charAt(0).toUpperCase() + month.slice(1)} - ${year}`;

            setMessage(formattedDate);
        }
    };

    return (
        <>
            <header className="header-compose">Programación de Cita</header>
            <div className="compose-container">
                <Box sx={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
                    <Stepper activeStep={activeStep} orientation={isMobile ? "vertical" : "horizontal"}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Box sx={{ mt: 2 }}>
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

                        {activeStep === 1 && selectedLocation && (
                            <Box>
                                {message && <Box sx={{ mb: 2, color: "gray" }}><p className="advice-message">{message}</p></Box>}

                                <TextField
                                    label="Seleccionar día"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    value={selectedDay}
                                    onChange={handleDateChange}
                                    sx={{ mb: 2 }}
                                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                />

                                {weekendError && (
                                    <Box sx={{ mb: 2, color: "red" }}>
                                        <p>{weekendError}</p>
                                    </Box>
                                )}

                                {selectedDay && (
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Hora</TableCell>
                                                <TableCell>Disponibilidad</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedSlots.map((time) => (
                                                <TableRow key={time}>
                                                    <TableCell>{time}</TableCell>
                                                    <TableCell
                                                        onClick={() => {
                                                            if (!isSlotBooked(time)) {
                                                                setSelectedTime(time);
                                                            }
                                                        }}
                                                        sx={{
                                                            cursor: "pointer",
                                                            backgroundColor: selectedTime === time ? "blue" : isSlotBooked(time) ? "red" : "#fff",
                                                            color: selectedTime === time ? "white" : isSlotBooked(time) ? "white" : "black",
                                                            textDecoration: "none",
                                                        }}
                                                    >
                                                        {isSlotBooked(time) ? "Ocupado" : "Disponible"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}

                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={generateTimeSlots().length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                        )}

                        {activeStep === 2 && (
                            <Box>
                                <p>Confirmar cita:</p>
                                <p>Sede: {selectedLocation}</p>
                                <p>Día: {selectedDay}</p>
                                <p>Hora: {selectedTime}</p>
                            </Box>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disabled={activeStep === 0}
                                sx={{ mr: 2 }}
                            >
                                Volver
                            </Button>
                            <Button variant="contained" onClick={handleNext}>
                                {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default ProgramarCita;