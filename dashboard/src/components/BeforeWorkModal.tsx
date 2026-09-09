import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, Camera, Trash2, RotateCcw, CheckCircle2, Clock, MapPin, User, Play } from 'lucide-react';
import { JobItem } from '../types';

interface BeforeWorkModalProps {
  isOpen: boolean;
  job: JobItem | null;
  onClose: () => void;
  onStartWork: (beforeWorkPhoto: string) => void;
}

export const BeforeWorkModal: React.FC<BeforeWorkModalProps> = ({
  isOpen,
  job,
  onClose,
  onStartWork,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPhotoPreview(job?.beforeWorkPhoto || null);
      setPhotoName('');
      setErrorMessage(null);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      window.getSelection()?.removeAllRanges();

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, job]);

  if (!isOpen || !job || typeof document === 'undefined') return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoName('');
  };

  const handleStart = () => {
    if (!photoPreview) {
      setErrorMessage('Please upload a before-work photo before starting.');
      return;
    }
    onStartWork(photoPreview);
  };

  // Format estimated work duration in human readable format
  const formatEstimatedDuration = (minutes?: number, fallbackDuration?: string) => {
    if (!minutes) return fallbackDuration || '1 hour';
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0 && mins > 0) {
      return `${hrs} hour${hrs > 1 ? 's' : ''} ${mins} minutes`;
    }
    if (hrs > 0) {
      return `${hrs} hour${hrs > 1 ? 's' : ''}`;
    }
    return `${mins} minutes`;
  };

  const formattedEstimated = formatEstimatedDuration(job.estimatedDuration, job.duration);

  const modalContent = (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none"
      style={{ isolation: 'isolate' }}
    >
      {/* Background Overlay */}
      <div
        className="fixed inset-0 z-[9990] bg-black/75 backdrop-blur-md transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className="relative z-[10000] bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col select-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="before-work-modal-title"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 p-5 sm:p-6 pb-3 border-b border-neutral-100 bg-white sticky top-0 z-20">
          <div className="flex-1 min-w-0 pr-2">
            <h3
              id="before-work-modal-title"
              className="text-xl sm:text-2xl font-extrabold text-[#222222] tracking-tight leading-tight"
            >
              Before You Start
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 leading-relaxed">
              Take a photo of the work area before starting the job to record pre-service condition.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close before you start popup"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 hover:text-black flex items-center justify-center font-bold cursor-pointer transition-colors shadow-xs flex-shrink-0 border border-neutral-200/60 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain">
          {/* Job Summary Banner */}
          <div className="bg-neutral-50 rounded-2xl p-3.5 sm:p-4 border border-neutral-200/70 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                {job.serviceName}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ Location Verified
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-neutral-700">
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span className="font-semibold">{job.clientName}</span>
              </div>

              <div className="flex items-center gap-1.5 font-bold text-[#1C516C]">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Estimated Work Time: {formattedEstimated}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-neutral-500 truncate pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />
              <span className="truncate">{job.clientAddress}</span>
            </div>
          </div>

          {/* Photo Upload Section */}
          <section className="space-y-3">
            <div>
              <h4 className="text-sm sm:text-base font-bold text-[#222222] flex items-center gap-1.5">
                <span>Upload Before-Work Photo</span>
                <span className="text-red-500 font-bold">*</span>
              </h4>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                Take a photo of the work area before starting the job.
              </p>
            </div>

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {!photoPreview ? (
              <div className="border-2 border-dashed border-neutral-300 hover:border-[#A66666] bg-neutral-50/70 hover:bg-[#A66666]/5 rounded-2xl p-5 sm:p-6 text-center transition-all duration-200 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#A66666]/10 text-[#A66666] flex items-center justify-center shadow-2xs">
                  <Camera className="w-6 h-6 stroke-[2.2]" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[#222222]">
                    Capture or select initial condition photo
                  </p>
                  <p className="text-[11px] text-[#6B6B6B]">
                    JPG, PNG, or WEBP (Max 10MB)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#1C516C] hover:bg-[#164055] text-white shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-neutral-100 text-[#222222] border border-neutral-300 shadow-2xs cursor-pointer active:scale-95 transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#A66666]" />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-neutral-900 shadow-md">
                  <img
                    src={photoPreview}
                    alt="Before-work preview"
                    className="w-full h-44 sm:h-52 object-contain bg-neutral-950"
                  />

                  {/* Top Success Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-emerald-600/90 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Before-work photo captured</span>
                  </div>

                  {/* Bottom Actions Bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium text-white/90 truncate max-w-[150px] sm:max-w-[200px]">
                      {photoName || 'before-work-photo.jpg'}
                    </p>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                        title="Retake Photo"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                        title="Remove Photo"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Before-work photo captured</span>
                </p>
              </div>
            )}

            {errorMessage && (
              <p className="text-xs font-semibold text-red-600 text-center">{errorMessage}</p>
            )}
          </section>

          {/* Start Work Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={!photoPreview}
              onClick={handleStart}
              className={`w-full h-13 sm:h-14 rounded-2xl font-extrabold text-sm sm:text-base transition-all duration-150 shadow-xs flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1C516C] ${
                photoPreview
                  ? 'bg-[#1C516C] hover:bg-[#164055] text-white active:scale-[0.99] shadow-md hover:shadow-lg'
                  : 'bg-neutral-200 text-neutral-400 border border-neutral-300 opacity-60 cursor-not-allowed'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Work</span>
            </button>
            <p className="text-[11px] text-neutral-500 text-center mt-2">
              Countdown timer will start as soon as you tap "Start Work".
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
