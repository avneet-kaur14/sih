import React from 'react';
import { ShieldCheck, Star, MapPin, Wallet, Settings, ChevronRight, LogOut } from 'lucide-react';

export const AccountPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-neutral-100 border-4 border-brand-primary/20 overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Rajesh Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h2 className="text-xl font-bold text-neutral-dark">Rajesh Kumar Sharma</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/60 self-center sm:self-auto">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Verified
            </span>
          </div>

          <p className="text-xs sm:text-sm text-neutral-muted mt-1 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>Model Town, Jalandhar, Punjab</span>
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9 (128 Reviews)
            </span>
            <span className="text-neutral-500">2.5 Years on GigSevak</span>
          </div>
        </div>
      </div>

      {/* Skills / Categories */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-neutral-dark uppercase tracking-wider">
          Registered Service Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Electrical Repair & Wiring', 'Plumbing & Drainage', 'AC Installation & Repair', 'Appliance Repair'].map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200/50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Quick Settings & Navigation */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-xs divide-y divide-neutral-100 overflow-hidden">
        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-dark">Payouts & Bank Account</div>
              <div className="text-xs text-neutral-muted">Manage UPI ID & direct bank transfers</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-dark">Verification & Documents</div>
              <div className="text-xs text-neutral-muted">Aadhaar, Live Selfie & Police Clearance</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-dark">Preferences & Languages</div>
              <div className="text-xs text-neutral-muted">App notifications and language choice</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-red-50/50 transition text-left group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-100">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-red-600">Log Out</div>
              <div className="text-xs text-red-400">Exit worker session</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
};

