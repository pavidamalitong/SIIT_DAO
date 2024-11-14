import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = () => {
        console.log('Logging in with:', username, password);
        
        // Perform API authentication here and on success:
        if (username && password) { // Assume authentication success
            sessionStorage.setItem('isLoggedIn', 'true');
            navigate('/home');
        } else {
            alert('Invalid credentials, please try again.');
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
        </div>
    );
}

export default Login;
