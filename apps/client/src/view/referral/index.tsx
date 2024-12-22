import { useState, useEffect } from 'react';

import { User, CheckCircle2, XCircle } from 'lucide-react';
import { useAxios } from '../../hooks/useAxios';

const Referrals = () => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await axiosInstance.get('/referral/list');

        setReferrals(response.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load referrals data');
        console.error('Error fetching referrals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [axiosInstance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading referrals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Your Referrals</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {referrals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You haven't referred anyone yet. Share your referral link to get started!</p>
            ) : (
              referrals.map(referral => (
                <div key={referral.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <User size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{referral.referee.email}</p>
                        <p className="text-sm text-gray-500">Referred on: {new Date(referral.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium
                        ${referral.isCompleted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {referral.isCompleted ? <CheckCircle2 size={14} className="mr-1" /> : <XCircle size={14} className="mr-1" />}
                      </span>
                    </div>
                  </div>
                  {referral.isCompleted && referral.completedAt && <p className="text-sm text-gray-500 mt-2">Completed on: {new Date(referral.completedAt).toLocaleDateString()}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Referral Statistics</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-800">{referrals.length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{referrals.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{referrals.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Referrals };
