import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OTPInput } from '../../components/auth/OTPInput';
import { OTPTimer } from '../../components/auth/OTPTimer';
import { AuthButton } from '../../components/auth/AuthButton';
import { authService } from '../../services/authService';
import { onboardingService } from '../../services/onboardingService';

interface LocationState {
  phoneNumber?: string;
  mode?: 'signup' | 'login';
}

export const WorkerVerify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || {};

  const rawPhone = state.phoneNumber || '9876543210';
  const mode = state.mode || 'signup';

  // Masked phone format: +91 ••••••1234
  const lastFourDigits = rawPhone.replace(/\D/g, '').slice(-4) || '1234';
  const maskedPhone = `+91 ••••••${lastFourDigits}`;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [resendNotification, setResendNotification] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading || successMessage) return;

    if (otp.length < 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setResendNotification(undefined);

    // Frontend prototype simulation
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Mobile number verified.');
      onboardingService.updateState({ isMobileCompleted: true });
      
      // Navigate to placeholder Worker Dashboard
      setTimeout(() => {
        // Save mock user session for dashboard demonstration
        authService.verifyOtp(rawPhone, otp).finally(() => {
          const target = mode === 'signup' ? '/worker/verification' : '/worker/dashboard';
          navigate(target, { replace: true });
        });
      }, 600);
    }, 400);
  };

  const handleResend = () => {
    setOtp('');
    setError(undefined);
    setResendNotification('OTP sent again');
    
    // Auto clear notification after 3 seconds
    setTimeout(() => {
      setResendNotification((prev) => (prev === 'OTP sent again' ? undefined : prev));
    }, 3000);
  };

  return (
    <AuthLayout
      progress={{
        currentStep: 1,
        step1Progress: successMessage ? 100 : 0,
        step2Progress: 0,
        step3Progress: 0,
      }}
    >
      <div className="space-y-6">
        {/* Back Link */}
        <div className="-mt-1">
          <Link
            to={mode === 'login' ? '/worker/login' : '/worker/signup'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B6B6B] hover:text-[#A66666] transition-colors focus:outline-none focus:ring-1 focus:ring-[#A66666] rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change mobile number</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#222222]">
            Verify your mobile number
          </h1>
          <div className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[320px] mx-auto space-y-0.5">
            <p>Enter the 6-digit OTP sent to your mobile number.</p>
            <p className="font-semibold text-[#222222] tracking-wider pt-0.5">
              {maskedPhone}
            </p>
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4 pt-1" noValidate>
          <div className="space-y-3">
            <OTPInput
              value={otp}
              onChange={(newOtp) => {
                setOtp(newOtp);
                if (error) setError(undefined);
                if (resendNotification) setResendNotification(undefined);
              }}
              hasError={Boolean(error)}
              disabled={isLoading || Boolean(successMessage)}
            />

            {/* OTP Validity Timer Placeholder */}
            <OTPTimer timeString="02:00" />

            {/* Error Message */}
            {error && (
              <p className="text-xs sm:text-sm text-[#953638] font-medium text-center animate-fadeIn">
                {error}
              </p>
            )}

            {/* Resend Notification Message */}
            {resendNotification && (
              <p className="text-xs sm:text-sm text-[#A66666] font-medium text-center animate-fadeIn">
                {resendNotification}
              </p>
            )}

            {/* Success State */}
            {successMessage && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-[#222222] font-semibold text-center animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-[#A66666]" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Verify OTP Button */}
          <div className="pt-2">
            <AuthButton
              type="submit"
              variant="outline"
              disabled={isLoading || Boolean(successMessage)}
              isLoading={isLoading}
            >
              Verify OTP
            </AuthButton>
          </div>
        </form>

        {/* Resend OTP Section */}
        <div className="text-center pt-2 border-t border-slate-100 space-y-1">
          <p className="text-sm text-[#6B6B6B]">
            Didn't receive the OTP?
          </p>
          <div>
            <button
              type="button"
              onClick={handleResend}
              className="text-sm font-semibold text-[#A66666] hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-[#A66666] rounded p-0.5 transition-colors"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
