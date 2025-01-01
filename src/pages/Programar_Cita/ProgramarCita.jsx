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
import { sendAppointmentEmail } from "../../services/mailerService.js"; // Asegúrate de importar la función correctamente
import "./ProgramarCita.style.css";

const ProgramarCita = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [usersName, setUsersName] = useState("");
    const [usersEmail, setUsersEmail] = useState("");
    const [userId, setUserId] = useState("");  // Almacenar el ID del usuario
    const [bookedSlots, setBookedSlots] = useState([]); // Guardar los horarios ocupados
    const [weekendError, setWeekendError] = useState(""); // Estado para el error de fines de semana
    const [message, setMessage] = useState("Antes de continuar, selecciona un día para agendar tu cita:"); // Mensaje de fecha

    const [page, setPage] = useState(0); // Estado para la página actual
    const [rowsPerPage, setRowsPerPage] = useState(10); // Número de elementos por página

    const isMobile = useMediaQuery("(max-width:1000px)");
    const steps = ["Seleccionar sede", "Seleccionar día y hora", "Confirmar cita"];

    useEffect(() => {
        // Obtener el usuario autenticado
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUsersName(user.displayName);
            setUsersEmail(user.email);  // Obtener el correo electrónico
            setUserId(user.uid);  // Obtener el ID del usuario
        }
    }, []);

    useEffect(() => {
        // Consultar las citas ocupadas
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
            // Registrar la cita en Firebase
            await addDoc(collection(db, "citas"), {
                day: selectedDay,
                time: selectedTime,
                location: selectedLocation,
                usersEmail,
                usersName,
                userId, // Aquí agregamos el ID del usuario
            });

            // Enviar el correo de confirmación
            const additionalInfo = {
                userName: usersName,
                selectedDay: selectedDay,
                selectedTime: selectedTime,
                selectedLocation: selectedLocation,
            };

            // Asegúrate de pasar el correo del usuario aquí
            await sendAppointmentEmail(usersEmail, additionalInfo);

            // Mostrar el mensaje de éxito
            await Swal.fire("Éxito", "Cita registrada correctamente y correo enviado.", "success");

            // Limpiar los campos
            setSelectedDay("");
            setSelectedTime("");
            setSelectedLocation("");
            setActiveStep(0);
        } catch (error) {
            await Swal.fire("Error", "No se pudo registrar la cita: " + error.message, "error");
        }
    };

    // Verificar si el horario está ocupado
    const isSlotBooked = (time) => {
        return bookedSlots.some(
            (slot) => slot.day === selectedDay && slot.time === time
        );
    };

    // Generar las horas entre las 9 AM y 4 PM con intervalos de 15 minutos
    const generateTimeSlots = () => {
        const slots = [];
        const hours = [9, 10, 11, 1, 2, 3, 4]; // Excluir el rango de 12-2 PM
        hours.forEach((hour) => {
            for (let min = 0; min < 60; min += 15) {
                const time = `${hour}:${min === 0 ? "00" : min}`;
                slots.push(time);
            }
        });
        return slots;
    };

    // Verificar si la fecha seleccionada es un día laboral
    const isWeekday = (date) => {
        const day = new Date(date).getDay();
        return day >= 1 && day <= 5; // Lunes a Viernes
    };

    // Función para cambiar de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Función para cambiar el número de filas por página
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Resetea la página cuando cambian las filas por página
    };

    // Obtener los elementos de la página actual
    const paginatedSlots = generateTimeSlots().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleDateChange = (e) => {
        const day = e.target.value;
        const date = new Date(day);

        const dayOfWeek = date.toLocaleString("es-ES", { weekday: "long" }); // Día de la semana
        const dayOfMonth = date.getDate(); // Día del mes
        const month = date.toLocaleString("es-ES", { month: "long" }); // Mes
        const year = date.getFullYear(); // Año

        // Verificar si es fin de semana
        if (!isWeekday(day)) {
            setWeekendError("No se puede agendar una cita los fines de semana");
            setSelectedDay(""); // Reseteamos la fecha
        } else {
            setWeekendError("");
            setSelectedDay(day); // Actualizamos la fecha seleccionada

            // Formateamos la fecha en el formato deseado
            const formattedDate = `${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}, ${dayOfMonth} - ${month.charAt(0).toUpperCase() + month.slice(1)} - ${year}`;

            // Actualizamos el mensaje con la fecha formateada
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
                                    inputProps={{ min: new Date().toISOString().split("T")[0] }} // No permite seleccionar fechas pasadas
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
                                                            backgroundColor: selectedTime === time ? "blue" : isSlotBooked(time) ? "red" : "#fff", // Azul si es la hora seleccionada, rojo si está ocupada
                                                            color: selectedTime === time ? "white" : isSlotBooked(time) ? "white" : "black", // Texto blanco cuando está seleccionada o ocupada
                                                            textDecoration: "none", // Eliminar subrayado
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

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleConfirm}
                                    sx={{ mt: 2 }}
                                >
                                    Confirmar cita
                                </Button>
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