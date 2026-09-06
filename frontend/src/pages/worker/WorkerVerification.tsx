import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Camera, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { AuthButton } from '../../components/auth/AuthButton';
import { onboardingService } from '../../services/onboardingService';

type AadhaarStatus = 'not_started' | 'in_progress' | 'verified' | 'error';
type SelfieStatus = 'locked' | 'in_progress' | 'photo_selected' | 'verified' | 'error';

export const WorkerVerification: React.FC = () => {
  const navigate = useNavigate();

  // Verification Step States
  const [aadhaarStatus, setAadhaarStatus] = useState<AadhaarStatus>('in_progress');
  const [selfieStatus, setSelfieStatus] = useState<SelfieStatus>('locked');

  // Aadhaar Form State
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarError, setAadhaarError] = useState<string | undefined>();
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState(false);

  // Selfie / Camera State
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [selfieError, setSelfieError] = useState<string | undefined>();
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isConfirmingSelfie, setIsConfirmingSelfie] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Format Aadhaar input with spaces: XXXX XXXX XXXX
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = digitsOnly.match(/.{1,4}/g)?.join(' ') || digitsOnly;
    setAadhaarNumber(formatted);
    if (aadhaarError) setAadhaarError(undefined);
  };

  // Mock Aadhaar Verification
  const handleVerifyAadhaar = (e: React.FormEvent) => {
    e.preventDefault();
    const rawDigits = aadhaarNumber.replace(/\s/g, '');

    if (rawDigits.length !== 12) {
      setAadhaarError('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsVerifyingAadhaar(true);
    setAadhaarError(undefined);

    // Frontend-only mock verification delay
    setTimeout(() => {
      setIsVerifyingAadhaar(false);
      setAadhaarStatus('verified');
      onboardingService.updateState({ isAadhaarVerified: true });
      // Automatically unlock and open Live Selfie step
      setSelfieStatus('in_progress');
    }, 500);
  };

  // Start device live camera
  const startCamera = async () => {
    setSelfieError(undefined);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setSelfieError('Live camera is not supported on this browser/device.');
      }
    } catch {
      setSelfieError('Camera permission is required. Please allow camera access to take a live selfie.');
    }
  };

  // Capture image from live video stream
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image horizontally for a natural selfie experience
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPhotoDataUrl(dataUrl);
      setSelfieStatus('photo_selected');
      stopCamera();
    }
  };

  // Retake live photo
  const handleRetake = () => {
    setPhotoDataUrl(null);
    setSelfieStatus('in_progress');
    startCamera();
  };

  // Confirm live photo
  const handleConfirmSelfie = () => {
    if (!photoDataUrl) {
      setSelfieError('Please capture a live photo first');
      return;
    }

    setIsConfirmingSelfie(true);
    setSelfieError(undefined);

    // Mock confirm delay
    setTimeout(() => {
      setIsConfirmingSelfie(false);
      setSelfieStatus('verified');
      onboardingService.updateState({ isSelfieVerified: true });

      // Automatically transition to Step 3 (Work Categories) without needing to click continue
      setTimeout(() => {
        navigate('/worker/categories', { replace: true });
      }, 700);
    }, 400);
  };

  const isAllCompleted = aadhaarStatus === 'verified' && selfieStatus === 'verified';

  // Calculate dynamic step 2 progress: 0%, 50% (Aadhaar), 100% (Selfie)
  const step2Progress = selfieStatus === 'verified' ? 100 : aadhaarStatus === 'verified' ? 50 : 0;

  return (
    <AuthLayout
      progress={{
        currentStep: 2,
        step1Progress: 100,
        step2Progress,
        step3Progress: 0,
      }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#222222]">
            Complete Your Verification
          </h1>
          <p className="text-sm sm:text-[15px] text-[#6B6B6B] leading-relaxed max-w-[340px] mx-auto">
            Both steps are required to start working on GigSevak.
          </p>
        </div>

        {/* Verification Steps List */}
        <div className="space-y-4">
          {/* ========================================================================= */}
          {/* STEP 1: AADHAAR VERIFICATION CARD */}
          {/* ========================================================================= */}
          <div
            className={`rounded-2xl border transition-all p-4 sm:p-5 ${
              aadhaarStatus === 'verified'
                ? 'border-emerald-200 bg-emerald-50/20'
                : 'border-[#D9D9D9] bg-white'
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    aadhaarStatus === 'verified'
                      ? 'bg-[#2E9B57] text-white'
                      : 'bg-[#A66666]/10 text-[#A66666]'
                  }`}
                >
                  {aadhaarStatus === 'verified' ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#222222]">
                    Aadhaar Verification
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B6B6B]">
                    {aadhaarStatus === 'verified'
                      ? 'Aadhaar verified successfully'
                      : 'Verify your Aadhaar number'}
                  </p>
                </div>
              </div>

              {aadhaarStatus === 'verified' && (
                <div className="w-6 h-6 rounded-full bg-[#2E9B57]/10 flex items-center justify-center text-[#2E9B57]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Aadhaar Input Form (When active & not verified) */}
            {aadhaarStatus !== 'verified' && (
              <form onSubmit={handleVerifyAadhaar} className="mt-4 pt-3 border-t border-slate-100 space-y-3" noValidate>
                <div className="space-y-1">
                  <label htmlFor="aadhaar-input" className="block text-xs font-semibold text-[#222222]">
                    Enter your 12-digit Aadhaar number
                  </label>
                  <input
                    id="aadhaar-input"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    placeholder="XXXX XXXX XXXX"
                    disabled={isVerifyingAadhaar}
                    className={`w-full h-12 sm:h-13 px-4 text-center text-base sm:text-lg font-bold tracking-widest text-[#222222] placeholder:text-[#6B6B6B]/40 bg-white rounded-xl border transition-all outline-none ${
                      aadhaarError
                        ? 'border-[#953638] ring-2 ring-[#953638]/20 bg-red-50/10'
                        : 'border-[#D9D9D9] focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/20'
                    }`}
                  />
                </div>

                {aadhaarError && (
                  <div className="flex items-center gap-1.5 text-xs text-[#953638] font-medium animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{aadhaarError}</span>
                  </div>
                )}

                <div className="pt-1">
                  <AuthButton
                    type="submit"
                    variant="outline"
                    isLoading={isVerifyingAadhaar}
                  >
                    Verify Aadhaar
                  </AuthButton>
                </div>
              </form>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: LIVE SELFIE VERIFICATION CARD */}
          {/* ========================================================================= */}
          <div
            className={`rounded-2xl border transition-all p-4 sm:p-5 ${
              selfieStatus === 'verified'
                ? 'border-emerald-200 bg-emerald-50/20'
                : selfieStatus === 'locked'
                ? 'border-slate-100 bg-slate-50/50 opacity-70'
                : 'border-[#D9D9D9] bg-white'
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    selfieStatus === 'verified'
                      ? 'bg-[#2E9B57] text-white'
                      : selfieStatus === 'locked'
                      ? 'bg-slate-200 text-slate-500'
                      : 'bg-[#A66666]/10 text-[#A66666]'
                  }`}
                >
                  {selfieStatus === 'verified' ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : selfieStatus === 'locked' ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    '2'
                  )}
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#222222]">
                    Live Selfie Verification
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B6B6B]">
                    {selfieStatus === 'verified'
                      ? 'Selfie verified successfully'
                      : selfieStatus === 'locked'
                      ? 'Locked until Aadhaar is verified'
                      : 'Take a live photo to verify your identity'}
                  </p>
                </div>
              </div>

              {selfieStatus === 'verified' && (
                <div className="w-6 h-6 rounded-full bg-[#2E9B57]/10 flex items-center justify-center text-[#2E9B57]">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
            </div>

            {/* Selfie Active Interface (When Aadhaar is verified and Selfie not completed) */}
            {aadhaarStatus === 'verified' && selfieStatus !== 'verified' && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                {/* Photo Preview / Camera Capture Viewfinder */}
                <div className="relative w-full aspect-[4/3] max-h-[220px] rounded-xl overflow-hidden bg-slate-100 border border-[#D9D9D9] flex flex-col items-center justify-center">
                  {photoDataUrl ? (
                    // Captured Photo Preview
                    <img
                      src={photoDataUrl}
                      alt="Live selfie preview"
                      className="w-full h-full object-cover"
                    />
                  ) : isCameraActive ? (
                    // Live Camera Viewfinder
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      {/* Face positioning guide overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-28 h-36 border-2 border-dashed border-white/80 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    // Initial Camera Prompt State
                    <div className="text-center p-4 space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-[#A66666]">
                        <Camera className="w-6 h-6" />
                      </div>
                      <p className="text-xs text-[#6B6B6B] max-w-[220px] mx-auto">
                        Position your face inside the frame with good lighting
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {photoDataUrl ? (
                  // Retake & Confirm options
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleRetake}
                      className="h-11 rounded-xl text-xs sm:text-sm font-semibold border border-[#D9D9D9] bg-white text-[#222222] hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmSelfie}
                      disabled={isConfirmingSelfie}
                      className="h-11 rounded-xl text-xs sm:text-sm font-semibold border border-[#A66666] bg-white text-[#A66666] hover:bg-[#A66666]/5 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isConfirmingSelfie ? 'Confirming...' : 'Confirm'}</span>
                    </button>
                  </div>
                ) : isCameraActive ? (
                  // Capture Live Photo Button
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="w-full h-12 rounded-xl text-sm font-semibold border border-[#A66666] bg-white text-[#A66666] hover:bg-[#A66666]/5 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Live Selfie</span>
                    </button>
                  </div>
                ) : (
                  // Open Live Camera Button
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full h-12 rounded-xl text-sm font-semibold border border-[#A66666] bg-white text-[#A66666] hover:bg-[#A66666]/5 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Open Live Camera</span>
                    </button>
                  </div>
                )}

                {selfieError && (
                  <div className="flex items-center gap-1.5 text-xs text-[#953638] font-medium pt-1 animate-fadeIn">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{selfieError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUCCESS STATE */}
        {/* ========================================================================= */}
        {isAllCompleted && (
          <div className="pt-2 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-sm text-[#2E9B57] font-semibold text-center bg-emerald-50/60 border border-emerald-200 py-3.5 px-4 rounded-xl shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-[#2E9B57]" />
              <span>Verification completed successfully! Redirecting...</span>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};
