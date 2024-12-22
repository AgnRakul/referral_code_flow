import React, { useState, useEffect, ReactNode } from 'react';
import { useAxios } from '../hooks/useAxios';
import { useLocation } from 'react-router-dom';

interface AuthWrapperProps {
  children: ReactNode;
  onAuthStatusChange: (isAuthenticated: boolean) => void;
}

const SESSION_AUTH_KEY = 'isAuthenticated';

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, onAuthStatusChange }) => {
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const validateAuth = () => {
      if (location.pathname === '/') {
        setLoading(false);
        return;
      }

      const storedAuthStatus = sessionStorage.getItem(SESSION_AUTH_KEY);

      if (storedAuthStatus !== null) {
        const isAuthenticated = storedAuthStatus === 'true';
        onAuthStatusChange(isAuthenticated);
        setLoading(false);
        return;
      }

      const checkAuth = async () => {
        try {
          const response = await axiosInstance.get('/auth/validate');
          const isAuthenticated = response.status === 200;

          sessionStorage.setItem(SESSION_AUTH_KEY, isAuthenticated.toString());
          onAuthStatusChange(isAuthenticated);
        } catch (error) {
          console.error('Authentication validation failed:', error);
          sessionStorage.setItem(SESSION_AUTH_KEY, 'false');
          onAuthStatusChange(false);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    };

    validateAuth();
  }, [axiosInstance, onAuthStatusChange, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export { AuthWrapper };
