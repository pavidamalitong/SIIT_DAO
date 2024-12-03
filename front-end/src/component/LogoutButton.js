import React from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalState } from "../store"; // Import global state management
import "../styles.css";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear wallet connection details
    localStorage.removeItem("connectedAccount"); 
    setGlobalState("connectedAccount", null); 

    // Clear session details
    sessionStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      <img src="/logout.png" alt="Logout" className="logout-icon" />
    </button>
  );
}

export default LogoutButton;
