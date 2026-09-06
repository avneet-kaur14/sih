import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LogOut, ShieldCheck, User } from 'lucide-react';
import { AuthLogo } from '../../components/auth/AuthLogo';
import { authService } from '../../services/authService';

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/worker/login');
  };

  return (
    <main className="min-h-[100dvh] w-full bg-slate-50/60 sm:bg-slate-50/50 flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-[440px] mx-auto bg-white rounded-2xl border border-slate-200/80 sm:border-slate-100 shadow-card p-6 sm:p-8 space-y-6">
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <AuthLogo />
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-crimson transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-brand-crimson"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </header>

        <div className="text-center space-y-3 py-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-black">
              Worker Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted">
              Authentication successful (Prototype)
            </p>
          </div>
        </div>

        {/* Worker Info Card */}
        <div className="bg-brand-ivory/40 border border-brand-ivory-dark/50 rounded-xl p-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between text-xs text-brand-muted font-medium border-b border-brand-ivory-dark/30 pb-2">
            <span>Authentication Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Worker
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center text-brand-navy">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-brand-dark truncate">
                {user?.name || 'GigSevak Partner'}
              </p>
              <p className="text-xs text-brand-muted">
                +91 {user?.phoneNumber || '9876543210'}
              </p>
            </div>
          </div>
        </div>

        {/* Action button to test flow again */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full h-11 rounded-xl text-sm font-semibold text-brand-navy border border-brand-navy/20 hover:bg-brand-navy/5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
          >
            Test Authentication Flow Again
          </button>
        </div>
      </div>
    </main>
  );
};
