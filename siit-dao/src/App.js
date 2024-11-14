import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './screen/Home';
import Login from './screen/Login';
import ProposalDetail from './screen/ProposalDetail';
import ProtectedRoute from './component/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/proposal-detail" element={<ProposalDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;