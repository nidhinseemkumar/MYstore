import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, isLoading } = useAuthStore();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect based on role if they try to access unauthorized page
        if (role === 'admin') return <Navigate to="/admin" replace />;
        if (role === 'seller') return <Navigate to="/seller" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};
