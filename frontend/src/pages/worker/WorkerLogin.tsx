import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PhoneInput } from '../../components/auth/PhoneInput';
import { AuthButton } from '../../components/auth/AuthButton';

export const WorkerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your mobile number');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError('Enter a valid 10-digit mobile number');
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Frontend-only mock login: store session and navigate directly to dashboard
    const user = {
      phoneNumber,
      name: 'GigSevak Partner',
      isVerified: true,
    };
    sessionStorage.setItem('gharsaathi_worker_session', JSON.stringify(user));

    setTimeout(() => {
      setIsLoading(false);
      navigate('/worker/dashboard');
    }, 300);
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#222222]">
            Welcome back!
          </h1>
          {/* <p className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[320px] mx-auto">
            Log in to manage your work and service requests.
          </p> */}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
          <PhoneInput
            id="worker-login-phone"
            value={phoneNumber}
            onChange={(val) => {
              setPhoneNumber(val);
              if (error) setError(undefined);
            }}
            error={error}
            disabled={isLoading}
          />

          <div className="pt-2">
            <AuthButton type="submit" variant="outline" isLoading={isLoading}>
              Continue
            </AuthButton>
          </div>
        </form>

        {/* Switch to Signup */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-[#6B6B6B]">
            New to GigSevak?{' '}
            <Link
              to="/worker/signup"
              className="font-semibold text-[#A66666] hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#A66666] rounded"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
