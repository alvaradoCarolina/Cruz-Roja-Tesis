import emailjs from "emailjs-com";

// Función para enviar correo de inicio de sesión exitoso
export const sendLoginEmail = async (toEmail, additionalInfo) => {
    try {
        const serviceID = "service_68q7jwd";  // Service ID de EmailJS
        const templateID = "template_3pavaxn";  // Template ID para login_email

        // Los parámetros del template que EmailJS va a utilizar
        const templateParams = {
            to_email: toEmail,
            subject: "Inicio de Sesión Exitoso",
            userName: additionalInfo.userName,
            email: additionalInfo.email,
            dateTime: new Date().toLocaleString(),
        };

        // Enviar el correo usando EmailJS
        const response = await emailjs.send(serviceID, templateID, templateParams, "hmlB-rwpZPHqc6FjN");  // Reemplaza por tu Public Key

        console.log("Correo de inicio de sesión enviado exitosamente");
        if (response.status === 200) {
            console.log("El correo se envió correctamente.");
        } else {
            console.log("Hubo un problema con el envío del correo.");
        }
    } catch (error) {
        console.error("Error enviando correo de inicio de sesión:", error.message);
        throw error;
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