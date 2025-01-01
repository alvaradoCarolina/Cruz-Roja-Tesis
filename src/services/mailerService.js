import emailjs from "emailjs-com";

export const sendCancelScheduleEmail = async ({ to_email, subject, userName, day, time, location, cancellationTime }) => {
    const templateParams = {
        to_email: to_email,
        subject: subject,
        userName: userName,
        day: day,
        time: time,
        location: location,
        cancellationTime: cancellationTime
    };

    try {
        await emailjs.send('service_68q7jwd', 'template_0fkqtkg', templateParams, 'hmlB-rwpZPHqc6FjN');
        console.log("Correo enviado con éxito.");
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    }
};

// Función para enviar correo de agendamiento de cita
export const sendAppointmentEmail = async (toEmail, additionalInfo) => {
    try {
        const serviceID = "service_68q7jwd";  // Service ID de EmailJS
        const templateID = "template_yyysn7c";  // Template ID para cita agendada

        // Los parámetros del template que EmailJS va a utilizar
        const templateParams = {
            to_email: toEmail,
            subject: "Cita Agendada Exitosamente",
            userName: additionalInfo.userName,
            selectedDay: additionalInfo.selectedDay,
            selectedTime: additionalInfo.selectedTime,
            selectedLocation: additionalInfo.selectedLocation,
            dateTime: new Date().toLocaleString(),
        };

        // Enviar el correo usando EmailJS
        const response = await emailjs.send(serviceID, templateID, templateParams, "hmlB-rwpZPHqc6FjN");  // Reemplaza por tu Public Key

        console.log("Correo de agendamiento de cita enviado exitosamente");
        if (response.status === 200) {
            console.log("El correo se envió correctamente.");
        } else {
            console.log("Hubo un problema con el envío del correo.");
        }
    } catch (error) {
        console.error("Error enviando correo de agendamiento de cita:", error.message);
        throw error;
    }
};