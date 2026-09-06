import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { PhoneInput } from '../../components/auth/PhoneInput';
import { AuthButton } from '../../components/auth/AuthButton';
import { authService } from '../../services/authService';
import { onboardingService } from '../../services/onboardingService';

export const WorkerSignup: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await authService.requestOtp(phoneNumber);
      if (response.success) {
        onboardingService.updateState({ mobileNumber: phoneNumber, isMobileCompleted: true });
        navigate('/worker/verify', {
          state: {
            phoneNumber,
            mode: 'signup',
          },
        });
      } else {
        setError(response.message);
      }
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      progress={{
        currentStep: 1,
        step1Progress: 0,
        step2Progress: 0,
        step3Progress: 0,
      }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#222222]">
            Enter your mobile number
          </h1>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1" noValidate>
          <PhoneInput
            id="worker-signup-phone"
            value={phoneNumber}
            onChange={(val) => {
              setPhoneNumber(val);
              if (error) setError(undefined);
            }}
            error={error}
            disabled={isLoading}
          />

          <div className="pt-2">
            <AuthButton type="submit" isLoading={isLoading}>
              Send OTP
            </AuthButton>
          </div>
        </form>

        {/* Switch to Login */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-sm text-[#6B6B6B]">
            Already have an account?{' '}
            <Link
              to="/worker/login"
              className="font-semibold text-[#A66666] hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#A66666] rounded"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};
