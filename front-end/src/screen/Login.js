import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const [error, setError] = useState(null);

    const handleLogin = async () => {

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.data.faculty === 'สถาบันเทคโนโลยีนานาชาติสิรินธร'){
                    sessionStorage.setItem('isLoggedIn', 'true');
                    navigate('/home', { replace: true });
                }
                else {
                    setError("Only SIIT students are permitted");
                }
            } else {
                console.error("Login failed:", data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Internal server error. Please try again later.");
        }
    };

    return (
        <div className="login-container">
            <h2>
                Welcome to <span className="highlight">SIIT DAO</span>
            </h2>
            <h3>Log In</h3>

            <label>
                Username
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>

            <label>
                Password
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <button className="login-button" onClick={handleLogin}>Log In</button>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default Login;