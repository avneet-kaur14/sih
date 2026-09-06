import React from 'react';

export interface OTPTimerProps {
  timeString?: string;
  isExpired?: boolean;
  className?: string;
}

/**
 * Isolated OTP validity timer placeholder component.
 * Designed to easily plug in dynamic countdown logic in the future.
 */
export const OTPTimer: React.FC<OTPTimerProps> = ({
  timeString = '02:00',
  isExpired = false,
  className = '',
}) => {
  return (
    <div className={`text-center py-1 ${className}`}>
      {isExpired ? (
        <span className="text-xs sm:text-sm font-medium text-[#953638]">
          OTP expired
        </span>
      ) : (
        <span className="text-xs sm:text-sm text-[#6B6B6B] font-medium tracking-wide">
          OTP valid for <span className="font-semibold text-[#222222]">{timeString}</span>
        </span>
      )}
    </div>
  );
};

