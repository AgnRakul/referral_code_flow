import React, { createContext, ReactNode } from 'react';
import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_URL,
  withCredentials: true,
});

const AxiosContext = createContext<AxiosInstance | null>(null);

export const AxiosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <AxiosContext.Provider value={axiosInstance}>{children}</AxiosContext.Provider>;
};

export { AxiosContext };
