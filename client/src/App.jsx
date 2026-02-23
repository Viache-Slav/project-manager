import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ChooseRolePage from './components/choose-role/ChooseRolePage';
import PendingApprovalPage from './components/choose-role/PendingApprovalPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import DesignItemPage from './pages/DesignItemPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import BackgroundLayout from './components/layout/BackgroundLayout';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BackgroundLayout>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/choose-role" element={<ChooseRolePage />} />
            <Route path="/pending-approval" element={<PendingApprovalPage />} />
            <Route 
              path="/design-items/:id" 
              element={ <PrivateRoute roles={['designer']}> 
              <DesignItemPage /> </PrivateRoute> } 
            />
          </Routes>
        </Router>
      </BackgroundLayout>
    </GoogleOAuthProvider>
  );
}

export default App;
