import { useContext } from 'react';
import { AxiosContext } from '../context/AxiosProvider';
import { AxiosInstance } from 'axios';

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within an AxiosProvider');
  }
  return context;
};
