import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ChooseRolePage from './components/choose-role/ChooseRolePage';
import PendingApprovalPage from './components/choose-role/PendingApprovalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/choose-role" element={<ChooseRolePage />} />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />
      </Routes>
    </Router>
  );
}

export default App;
