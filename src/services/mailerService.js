import emailjs from "emailjs-com";

// Función para enviar el correo utilizando EmailJS
export const sendMail = async (toEmail, templateType, additionalInfo) => {
    try {
        const dateTime = new Date().toLocaleString(); // Obtén la fecha y hora actual
        let templateId;
        let templateParams = {};
        const message ="Hello"

        // Asigna el templateId y el contenido dinámico del correo según su tipo
        if (templateType === "login_email") {
            templateId = "template_3pavaxn"; // Template ID para login_email
            templateParams = {
                to_email: toEmail,
                subject: "Inicio de Sesión Exitoso",
                body: `Hola ${additionalInfo.userName},
                        Has iniciado sesión exitosamente en nuestro sistema.
                        Detalles de inicio de sesión:
                        - Correo: ${additionalInfo.email}
                        - Fecha y Hora: ${dateTime}
                        Gracias por utilizar nuestra plataforma.`
            };
        } else if (templateType === "login_google") {
            templateId = "template_l605kph"; // Template ID para login_google
            templateParams = {
                to_email: toEmail,
                subject: "Inicio de Sesión con Google Exitoso",
                body: `Hola ${additionalInfo.userName},
                        Has iniciado sesión exitosamente utilizando tu cuenta de Google.
                        Detalles de inicio de sesión:
                        - Correo: ${additionalInfo.email}
                        - Fecha y Hora: ${dateTime}
                        Gracias por utilizar nuestra plataforma.`
            };
        } else if (templateType === "welcome") {
            templateId = "template_welcome"; // Template ID para welcome
            templateParams = {
                to_email: toEmail,
                subject: "¡Bienvenido a Nuestra Plataforma!",
                body: `Hola ${additionalInfo.userName},
                        Estamos emocionados de tenerte con nosotros.
                        Si tienes alguna pregunta, no dudes en contactarnos.
                        ¡Gracias por unirte!`
            };
        } else if (templateType === "resetPassword") {
            templateId = "template_reset_password"; // Template ID para resetPassword
            templateParams = {
                to_email: toEmail,
                subject: "Recuperación de Contraseña",
                body: `Hola ${additionalInfo.userName},
                        Hemos recibido una solicitud para restablecer tu contraseña.
                        Puedes restablecerla haciendo clic en el siguiente enlace: ${message}
                        Si no realizaste esta solicitud, por favor ignora este correo.`
            };
        } else {
            console.log("Template no existe")
        }

        console.log("Enviando correo a:", toEmail);
        console.log("Asunto:", templateParams.subject);
        console.log("Cuerpo del mensaje:", templateParams.body);

        // Enviar el correo con EmailJS
        const response = await emailjs.send(
            "service_68q7jwd", // Service ID
            templateId,        // Usar templateId correcto basado en el tipo de correo
            templateParams,    // Parametros del correo (contenido)
            "hmlB-rwpZPHqc6FjN" // User ID (Tu usuario de EmailJS)
        );

        console.log("Correo enviado exitosamente");
        console.log("EmailJS response:", response); // Muestra la respuesta completa
        if (response.status === 200) {
            console.log("El correo se envió correctamente.");
        } else {
            console.log("Hubo un problema con el envío del correo.");
        }
    } catch (error) {
        console.error("Error enviando correo:", error.message);
        throw error;
    }
};