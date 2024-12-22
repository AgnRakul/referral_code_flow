// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AxiosProvider } from './context/AxiosProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <AxiosProvider>
    <App />
  </AxiosProvider>
);
