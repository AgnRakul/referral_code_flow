import { useState, useEffect } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { LogOut, User, Link, Settings } from 'lucide-react';

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const axios = useAxios();
  const [userName, setUserName] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get('/user');
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [axios]);

  const handleGenerateReferralCode = async () => {
    try {
      const response = await axios.post('/api/referral/generate', {});
      setReferralCode(response.data.referralCode);
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('/auth/logout');

      if (response.status === 200) {
        setTimeout(() => {
          onLogout();
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <span>{userName || 'User'}</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Referral Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Referral Program</h3>
              <button onClick={handleGenerateReferralCode} className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition-colors">
                Generate Referral Code
              </button>
              {referralCode && (
                <div className="mt-4 p-4 bg-white rounded border border-gray-200">
                  <p className="text-sm text-gray-600">Your Referral Code:</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-lg font-bold">{referralCode}</span>
                    <button onClick={() => navigator.clipboard.writeText(referralCode)} className="text-blue-600 hover:text-blue-700">
                      <Link size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-600">Total Referrals</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
