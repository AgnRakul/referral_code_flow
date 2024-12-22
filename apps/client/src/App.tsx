import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './view/dashboard';
import { Login } from './view/login';
import { AuthWrapper } from './wrappers/AuthWrapper';
import { Referrals } from './view/referral';
import { Score } from './view/score';
import { MetaMaskWrapper } from './wrappers/MetaMaskWrapper';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  const handleLogout = () => {
    setIsAuthenticated(false); // Clear the authentication state
  };

  return (
    <Router>
      <AuthWrapper onAuthStatusChange={setIsAuthenticated}>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard onLogout={handleLogout} />
              </PrivateRoute>
            }
          />

          <Route
            path="/referrals"
            element={
              <PrivateRoute>
                <MetaMaskWrapper>
                  <Referrals />
                </MetaMaskWrapper>
              </PrivateRoute>
            }
          />

          <Route
            path="/score"
            element={
              <PrivateRoute>
                <Score />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default App;
