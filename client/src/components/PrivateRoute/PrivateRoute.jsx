import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from '../../api/axios';

const PrivateRoute = ({ children, roles }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromGoogle = urlParams.get('token');
        if (tokenFromGoogle) {
            localStorage.setItem('token', tokenFromGoogle);
            window.history.replaceState(null, '', '/dashboard');
        }

        axios.get('/auth/user')
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!user) return <Navigate to="/" replace />;

    if (!user.role && user.googleId) 
        return <Navigate to="/choose-role" replace />;

    if (user.status !== 'approved') 
        return <Navigate to="/pending-approval" replace />;

    if (roles && user.role !== 'admin' && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;