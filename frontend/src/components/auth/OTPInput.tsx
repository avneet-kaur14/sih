import React, { useRef, useEffect } from 'react';

interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
  hasError?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  hasError = false,
  disabled = false,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of individual digits
  const otpDigits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      // Clear current digit
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    // Handle paste or multi-character input
    if (rawVal.length > 1) {
      const pastedChars = rawVal.slice(0, length);
      onChange(pastedChars);
      const nextIndex = Math.min(pastedChars.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single numeric character
    const newDigits = [...otpDigits];
    newDigits[index] = rawVal[0];
    const newOtp = newDigits.join('');
    onChange(newOtp);

    // Auto-advance to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        // Box is already empty, move to previous box and clear it
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current box
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasteData) {
      onChange(pasteData);
      const targetFocusIdx = Math.min(pasteData.length, length - 1);
      inputRefs.current[targetFocusIdx]?.focus();
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-1.5 min-[375px]:gap-2 sm:gap-3 my-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          value={otpDigits[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className={`w-11 h-13 min-[375px]:w-12 min-[375px]:h-14 sm:w-14 sm:h-15 text-center text-xl sm:text-2xl font-bold rounded-xl border bg-white text-[#222222] transition-all duration-150 outline-none select-none ${
            hasError
              ? 'border-[#953638] ring-2 ring-[#953638]/20 bg-red-50/10'
              : 'border-[#D9D9D9] focus:border-[#A66666] focus:ring-2 focus:ring-[#A66666]/25'
          } ${disabled ? 'bg-slate-50 opacity-60 cursor-not-allowed' : ''}`}
        />
      ))}
    </div>
  );
};
