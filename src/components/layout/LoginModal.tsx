// components/LoginModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, AlertCircle, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: string, name: string) => void;
}

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setIsLoading(true);
    // Simulate OTP send (replace with actual API)
    setTimeout(() => {
      setOtpSent(true);
      setIsLoading(false);
      setError('');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`modal-otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      // Determine user role based on email (demo logic – replace with backend)
      let role = 'customer';
      if (email === 'admin@casaterminal.com') role = 'admin';
      else if (email.includes('seller')) role = 'seller';
      else if (email.includes('contractor')) role = 'contractor';
      else if (email.includes('rental')) role = 'rental';

      const name = email.split('@')[0];
      // Store in both new and old storage for compatibility
      localStorage.setItem('auth_user', JSON.stringify({ isLoggedIn: true, role, name }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', role);
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);

      onLoginSuccess(role, name);
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setEmail('');
    setOtpSent(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-[#e9ddc8] rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#502d13]">Login</h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-[#502d13]/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#502d13]" />
                </button>
              </div>

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[#502d13] text-sm font-medium mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#502d13]/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13] text-[#502d13] placeholder-[#502d13]/50"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#502d13] text-[#e9ddc8] py-2 rounded-lg font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" /> Send OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#502d13]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-[#502d13]" />
                    </div>
                    <p className="text-sm text-[#502d13]/70">
                      We've sent a 6‑digit code to <span className="font-medium">{email}</span>
                    </p>
                    <p className="text-xs text-[#502d13]/50 mt-1">(Demo: any 6 digits work)</p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`modal-otp-${idx}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-10 h-10 text-center text-lg font-bold bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#502d13] text-[#e9ddc8] py-2 rounded-lg font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </span>
                    ) : (
                      'Verify & Login'
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                        setError('');
                      }}
                      className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium"
                    >
                      ← Back to email
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;