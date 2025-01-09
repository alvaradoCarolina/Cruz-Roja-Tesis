import React from 'react';
import { Navigate } from 'react-router-dom'; // Para redirigir a login

const AuthVerification = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        console.log('No autenticado, redirigiendo a login...');
        return <Navigate to="/" />;
    }
    return children;
};

export default AuthVerification;