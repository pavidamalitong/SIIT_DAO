import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import WalletConnect from './screen/WalletConnect';
import Proposal from './screen/Proposal'; 


function App() {
  return (
    <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/wallet-connect" element={<WalletConnect />} />
                <Route path="/proposal" element={<Proposal />} /> 
            </Routes>
        </Router>
  );
}

export default App;
