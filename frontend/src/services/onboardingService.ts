/**
 * Frontend-only Onboarding State Management for GigSevak Worker Platform
 */

export interface OnboardingState {
  mobileNumber?: string;
  isMobileCompleted: boolean;
  isAadhaarVerified: boolean;
  isSelfieVerified: boolean;
  isCategoriesCompleted: boolean;
  isLocationCompleted: boolean;
}

const STORAGE_KEY = 'gigsevak_onboarding_state';

const defaultState: OnboardingState = {
  isMobileCompleted: false,
  isAadhaarVerified: false,
  isSelfieVerified: false,
  isCategoriesCompleted: false,
  isLocationCompleted: false,
};

export const onboardingService = {
  getState(): OnboardingState {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      return data ? { ...defaultState, ...JSON.parse(data) } : defaultState;
    } catch {
      return defaultState;
    }
  },

  updateState(updates: Partial<OnboardingState>): OnboardingState {
    const current = this.getState();
    const updated = { ...current, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignored in private browsing
    }
    return updated;
  },

  reset(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignored
    }
  },

  getStep1Progress(state?: OnboardingState): number {
    const s = state || this.getState();
    return s.isMobileCompleted ? 100 : 0;
  },

  getStep2Progress(state?: OnboardingState): number {
    const s = state || this.getState();
    if (s.isAadhaarVerified && s.isSelfieVerified) return 100;
    if (s.isAadhaarVerified) return 50;
    return 0;
  },

  getStep3Progress(state?: OnboardingState): number {
    const s = state || this.getState();
    if (s.isCategoriesCompleted && s.isLocationCompleted) return 100;
    if (s.isCategoriesCompleted) return 50;
    return 0;
  },
};

