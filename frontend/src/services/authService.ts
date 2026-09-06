/**
 * Mock Authentication Service for GharSaathi Worker Platform
 * 
 * Note: This is frontend-only for prototyping.
 * To integrate with real backend API in the future, replace the mock implementations
 * with actual HTTP fetch / axios calls to your authentication endpoints.
 */

export interface WorkerUser {
  name?: string;
  phoneNumber: string;
  isVerified: boolean;
}

export const MOCK_OTP = '123456';

export interface SendOtpResponse {
  success: boolean;
  message: string;
  mockOtpHint?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: WorkerUser;
}

export const authService = {
  /**
   * Request OTP for mobile number (signup or login)
   */
  async requestOtp(phoneNumber: string, _name?: string): Promise<SendOtpResponse> {
    // Simulate brief network latency for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Basic format check
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return {
        success: false,
        message: 'Enter a valid 10-digit mobile number',
      };
    }

    return {
      success: true,
      message: `OTP sent to +91 ${cleanPhone}`,
      mockOtpHint: MOCK_OTP,
    };
  },

  /**
   * Verify entered 6-digit OTP
   */
  async verifyOtp(phoneNumber: string, otp: string, name?: string): Promise<VerifyOtpResponse> {
    // Simulate brief network latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (otp === MOCK_OTP) {
      const user: WorkerUser = {
        phoneNumber,
        name: name || 'GharSaathi Worker',
        isVerified: true,
      };

      // Store in sessionStorage for session simulation
      sessionStorage.setItem('gharsaathi_worker_session', JSON.stringify(user));

      return {
        success: true,
        message: 'Phone number verified successfully',
        user,
      };
    }

    return {
      success: false,
      message: 'Incorrect OTP. Please try again.',
    };
  },

  /**
   * Get currently authenticated mock worker session
   */
  getCurrentUser(): WorkerUser | null {
    try {
      const session = sessionStorage.getItem('gharsaathi_worker_session');
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  },

  /**
   * Log out current session
   */
  logout(): void {
    sessionStorage.removeItem('gharsaathi_worker_session');
  },
};
