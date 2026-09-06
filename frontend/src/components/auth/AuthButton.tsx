import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'solid' | 'outline';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  isLoading = false,
  variant = 'solid',
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full h-12 sm:h-13 rounded-xl font-semibold text-[15px] sm:text-base active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus:outline-none focus:ring-offset-2';
  
  const variantStyles = variant === 'outline'
    ? 'border border-[#A66666] text-[#A66666] bg-white hover:bg-[#A66666]/5 active:bg-[#A66666]/10 focus:ring-2 focus:ring-[#A66666]/30'
    : 'text-white bg-[rgba(166,102,102,1)] hover:bg-[rgba(152,91,91,1)] focus:ring-2 focus:ring-[rgba(166,102,102,1)]';

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className={`w-5 h-5 animate-spin ${variant === 'outline' ? 'text-[#A66666]' : 'text-white'}`} />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
