import React from 'react';
import { Check } from 'lucide-react';

interface HeaderProps {
  isAvailable: boolean;
  onToggleAvailability: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAvailable, onToggleAvailability }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* LEFT: GigSevak Brand Wordmark */}
        <div className="flex items-center">
          <span className="font-sans text-[22px] sm:text-[25px] font-bold tracking-tight select-none leading-none">
            <span className="text-[#A66666]">Gig</span>
            <span className="text-[#292323]">Sevak</span>
          </span>
        </div>

        {/* RIGHT: Availability Toggle */}
        <div>
          <button
            type="button"
            onClick={onToggleAvailability}
            aria-pressed={isAvailable}
            className={`inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.98] select-none ${
              isAvailable
                ? 'border-emerald-600 bg-emerald-50/30 text-emerald-700 hover:bg-emerald-50/60 ring-2 ring-emerald-600/10'
                : 'border-red-500 bg-red-50/20 text-red-600 hover:bg-red-50/40 ring-2 ring-red-500/10'
            }`}
          >
            {/* Custom Checkbox Indicator */}
            <div
              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                isAvailable
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-red-500 bg-white'
              }`}
            >
              {isAvailable && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>Available</span>
          </button>
        </div>
      </div>
    </header>
  );
};

