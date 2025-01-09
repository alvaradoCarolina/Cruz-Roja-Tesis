import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        // Si no está autenticado, redirigir al login
        return <Navigate to="/" />;
    }
    // Si está autenticado, renderizar los hijos
    return children;
};

export default ProtectedRoute;