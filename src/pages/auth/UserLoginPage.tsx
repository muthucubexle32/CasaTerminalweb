import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle } from 'lucide-react';
import logo from "/logo.png";

const UserLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setIsLoading(true);
    // Simulate OTP send
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
        const nextInput = document.getElementById(`otp-${index + 1}`);
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
      // Demo: any 6-digit OTP works
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', email.split('@')[0]);
      // Admin detection (no UI mention)
      if (email === 'admin@casaterminal.com') {
        localStorage.setItem('userType', 'admin');
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('userType', 'customer');
        navigate('/account');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#502d13] to-[#7b4a26] flex items-center justify-center p-3 sm:p-4">
      {/* Background decoration */}
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
        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-3 sm:mb-4"
          >
            <Link to="/" className="block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-shadow">
                {!logoError ? (
                  <img
                    src={logo}
                    alt="Casa Terminal Logo"
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-[#502d13]">CT</span>
                )}
              </div>
            </Link>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e9ddc8] mb-1 sm:mb-2">Welcome Back</h1>
          <p className="text-sm sm:text-base text-[#e9ddc8]/80">Sign in with your email</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#e9ddc8] rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8"
        >
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-[#502d13] text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#502d13]/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-white border border-[#502d13]/20 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#502d13] text-[#502d13] placeholder-[#502d13]/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-center gap-2 text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#502d13] text-[#e9ddc8] py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#502d13]/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-[#502d13]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#502d13] mb-1 sm:mb-2">Enter OTP</h3>
                <p className="text-xs sm:text-sm text-[#502d13]/70">We've sent a 6-digit code to <span className="font-medium">{email}</span></p>
                <p className="text-[10px] sm:text-xs text-[#502d13]/50 mt-1 sm:mt-2">(Demo: any 6-digit number works)</p>
              </div>

              <div className="flex justify-center gap-1.5 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold bg-white border border-[#502d13]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                    maxLength={1}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#502d13] text-[#e9ddc8] py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#7b4a26] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#e9ddc8] border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Login</span>
                  </>
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
                  className="text-xs sm:text-sm text-[#502d13] hover:text-[#7b4a26] font-medium"
                >
                  ← Back to email
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-4 sm:mt-6">
          <Link
            to="/"
            className="text-xs sm:text-sm text-[#e9ddc8] hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLoginPage;