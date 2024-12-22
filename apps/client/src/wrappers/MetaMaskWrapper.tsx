import React, { useState, useEffect } from 'react';
import { useAxios } from '../hooks/useAxios';

const MetaMaskWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConnectToDiff, setIsConnectedToDiff] = useState('');
  const axios = useAxios();

  useEffect(() => {
    if ((window as any).ethereum) {
      setIsMetaMaskInstalled(true);
      checkMetaMaskAccount();
    } else {
      alert('MetaMask is not installed. Please install it to proceed.');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMetaMaskAccount = async () => {
    try {
      const accounts = await (window as any).ethereum.request({
        method: 'eth_accounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        storeWalletInDB(accounts[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching account:', err);
      setLoading(false);
    }
  };

  const storeWalletInDB = async (walletAddress: string) => {
    try {
      const response = await axios.post('/auth/metamask-authenticate', {
        walletAddress,
      });

      setIsConnectedToDiff(response.data.message);

      console.log('Wallet address stored successfully:', response.data);
    } catch (err) {
      console.error('Error storing wallet address:', err);
    }
  };

  const handleConnect = async () => {
    if (isMetaMaskInstalled) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        storeWalletInDB(accounts[0]);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error connecting to MetaMask:', err);
      }
    } else {
      alert('MetaMask is not installed.');
    }
  };

  if (isConnectToDiff) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">{isConnectToDiff}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <h2 className="text-2xl font-bold text-gray-600">Please connect to MetaMask</h2>
          <button onClick={handleConnect} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export { MetaMaskWrapper };
