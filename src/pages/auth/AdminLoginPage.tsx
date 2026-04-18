// src/pages/auth/AdminLoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import logo from "/logo.png";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [logoError, setLogoError] = useState(false);

  // Remove demo credentials – any email/password is accepted (for demo purposes)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Accept any non-empty credentials (no hardcoded demo)
      setOtpSent(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');

    // Accept any 6-digit OTP (for simplicity, just check length)
    if (otpValue.length === 6 && /^\d+$/.test(otpValue)) {
      // Set admin session
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userName', email.split('@')[0] || 'Admin');
      localStorage.setItem('userEmail', email);

      navigate('/admin/dashboard');
    } else {
      setError('Invalid OTP. Please enter a 6-digit code.');
    }
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    alert('New OTP sent (any 6-digit number will work)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#502d13] to-[#7b4a26] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#e9ddc8]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#e9ddc8]/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-4"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              {!logoError ? (
                <img
                  src={logo}
                  alt="Casa Terminal Logo"
                  className="w-16 h-16 object-contain"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Shield className="w-10 h-10 text-[#502d13]" />
              )}
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#e9ddc8] mb-2">Admin Portal</h1>
          <p className="text-[#e9ddc8]/80">Secure access for administrators only</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#e9ddc8] rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            {/* Security Badge */}
            <div className="flex items-center gap-2 bg-[#502d13]/10 text-[#502d13] px-4 py-2 rounded-lg mb-6">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">2-Factor Authentication Enabled</span>
            </div>

            {!otpSent ? (
              // Login Form
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[#502d13] text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#502d13]/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13] text-[#502d13] placeholder-[#502d13]/50"
                      placeholder="admin@casaterminal.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#502d13] text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#502d13]/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13] text-[#502d13] placeholder-[#502d13]/50"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#502d13]/50 hover:text-[#502d13]"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#502d13]/30 text-[#502d13] focus:ring-[#502d13]"
                    />
                    <span className="text-sm text-[#502d13]/70">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email')}
                    className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#502d13] text-[#e9ddc8] py-3 rounded-lg font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Login with 2FA</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              // OTP Verification Form
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#502d13]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-[#502d13]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#502d13] mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-[#502d13]/70">
                    Enter the 6-digit code sent to your email
                  </p>
                  <p className="text-xs text-[#502d13]/50 mt-2">
                    Any 6-digit number will work (demo)
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13] text-[#502d13]"
                      maxLength={1}
                    />
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || otp.some(d => !d)}
                  className="w-full bg-[#502d13] text-[#e9ddc8] py-3 rounded-lg font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Verify & Login</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium"
                  >
                    Resend Code
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-sm text-[#502d13]/50 hover:text-[#502d13]"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-[#502d13]/5 border-t border-[#502d13]/10">
            <p className="text-xs text-center text-[#502d13]/60">
              This area is restricted to authorized personnel only.
              <br />
              All activities are monitored and logged.
            </p>
            <p className="text-center text-xs text-[#502d13]/70 mt-1">
              Demo: Any email/password, then any 6‑digit OTP
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-[#e9ddc8] hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;