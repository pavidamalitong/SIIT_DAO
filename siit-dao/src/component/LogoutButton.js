import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        navigate('/');
    };

    return (
        <button onClick={handleLogout} className="logout-button">
            <img src="/logout.png" alt="Logout" className="logout-icon" />
        </button>
    );
}

export default LogoutButton;
