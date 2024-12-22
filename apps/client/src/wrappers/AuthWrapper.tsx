import React, { useState, useEffect, ReactNode } from 'react';
import { useAxios } from '../hooks/useAxios';
import { useLocation } from 'react-router-dom';

interface AuthWrapperProps {
  children: ReactNode;
  onAuthStatusChange: (isAuthenticated: boolean) => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, onAuthStatusChange }) => {
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/auth/validate');

        console.log(response);

        onAuthStatusChange(response.status === 200);
      } catch (error) {
        console.error('Authentication validation failed:', error);
        onAuthStatusChange(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
