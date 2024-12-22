import { ChevronRight, Sigma, UserCircle2 } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const referralCode = urlParams.get('referralCode');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleAuth = (provider: string) => {
    setIsLoading(true);
    window.location.href = `${backendUrl}/auth/${provider}?referralCode=${referralCode || ''}`;
  };

  const AuthButton = ({ provider, icon: Icon, label, onClick }: { provider: string; icon: React.ComponentType<any>; label: string; onClick?: () => void }) => (
    <button onClick={onClick || (() => handleAuth(provider))} disabled={isLoading} className="w-full flex items-center justify-between px-4 py-3 border border-gray-700 rounded-xl hover:bg-gray-700 transition-colors duration-200 group">
      <div className="flex items-center">
        <Icon className="h-6 w-6 mr-3 text-white" />
        <span className="text-white">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-200" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <UserCircle2 className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">Choose your preferred login method</p>
          {referralCode && <div className="mt-2 text-sm text-blue-400">Referral Code: {referralCode}</div>}
        </div>

        <div className="mt-8 space-y-4">
          <AuthButton provider="google" icon={Sigma} label="Continue with Google" />
          {/* <AuthButton provider="twitter" icon={Twitter} label="Continue with Twitter" />
          <AuthButton provider="apple" icon={Apple} label="Continue with Apple" /> */}
        </div>

        {/* Terms */}
        <p className="mt-4 text-center text-xs text-gray-400">
          By continuing, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export { Login };
