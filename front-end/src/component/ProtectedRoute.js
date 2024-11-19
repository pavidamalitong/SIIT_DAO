import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    return isLoggedIn === 'true' ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
