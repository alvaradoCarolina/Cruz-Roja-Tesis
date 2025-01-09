import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthVerification = ({ isAuthenticated, children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
};

export default AuthVerification;
