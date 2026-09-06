import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  error,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs sm:text-sm font-semibold text-brand-dark tracking-wide"
      >
        {label}
      </label>

      <input
        id={id}
        disabled={disabled}
        className={`w-full h-12 px-3.5 rounded-xl border text-[15px] sm:text-base text-brand-dark placeholder:text-brand-muted/70 bg-white transition-colors outline-none ${
          error
            ? 'border-brand-crimson ring-1 ring-brand-crimson/30'
            : 'border-slate-300 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20'
        } ${disabled ? 'bg-slate-100 opacity-70' : ''} ${className}`}
        {...props}
      />

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-brand-crimson font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
