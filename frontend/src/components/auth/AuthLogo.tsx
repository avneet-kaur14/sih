import React from 'react';
import gigSevakLogo from '../../assets/gigsevak-logo.jpg';

interface AuthLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AuthLogo: React.FC<AuthLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-9 w-auto max-w-[140px]',
    md: 'h-[9rem] w-[300px] max-w-[90vw]',
    lg: 'h-[10rem] w-[320px] max-w-[92vw]',
  }[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={gigSevakLogo}
        alt="GigSevak"
        className={`${sizeClasses} object-contain mix-blend-multiply select-none`}
        draggable={false}
      />
    </div>
  );
};
