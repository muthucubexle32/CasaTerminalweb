import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  LogIn, 
  Mail, 
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Shield,
  Package
} from 'lucide-react';

const SellerSection = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    sellerId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginData.sellerId.trim()) {
      newErrors.sellerId = 'Seller ID is required';
    }
    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length === 0) {
      // Set session
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'seller');
      localStorage.setItem('userName', loginData.sellerId.split('@')[0] || loginData.sellerId);
      localStorage.setItem('userEmail', loginData.sellerId);

      // 🔥 trigger navbar update
      window.dispatchEvent(new Event('storage'));

      navigate('/seller/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  const benefits = [
    { icon: TrendingUp, text: 'Wide Reach', color: 'text-blue-500', bg: 'bg-blue-100' },
    { icon: Package, text: 'Easy Management', color: 'text-green-500', bg: 'bg-green-100' },
    { icon: Shield, text: 'Secure Payments', color: 'text-purple-500', bg: 'bg-purple-100' },
    { icon: Users, text: 'Verified Buyers', color: 'text-orange-500', bg: 'bg-orange-100' },
  ];

  const stats = [
    { value: '5000+', label: 'Active Sellers', icon: Users },
    { value: '50K+', label: 'Products Listed', icon: Package },
    { value: '₹100Cr+', label: 'Monthly Sales', icon: TrendingUp },
    { value: '99%', label: 'Satisfaction Rate', icon: CheckCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mt-6 sm:mt-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-4 sm:px-6 py-3 sm:py-4">
        <h3 className="text-lg sm:text-xl font-bold text-secondary-500">Seller Program</h3>
        <p className="text-xs sm:text-sm text-secondary-600/90">Join India's largest construction material marketplace</p>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-primary-50 rounded-lg p-2 sm:p-3 text-center">
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500 mx-auto mb-1" />
              <div className="text-xs sm:text-sm font-bold text-secondary-500">{stat.value}</div>
              <div className="text-[8px] sm:text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-500 mb-2">
                Seller Membership
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600">
                Join as a seller and list your construction materials, products, and reach thousands of potential buyers.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 p-2 sm:p-3 bg-primary-50 rounded-lg">
                  <div className={`p-1.5 sm:p-2 rounded-lg ${benefit.bg}`}>
                    <benefit.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${benefit.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-secondary-500">{benefit.text}</h4>
                    <p className="text-[8px] sm:text-xs text-gray-600">Premium feature</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Register Button */}
            <button
              onClick={() => {
                setShowLogin(false);
                navigate('/seller/register');
              }}
              className="w-full bg-secondary-500 text-white py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Register as Seller</span>
            </button>
          </div>

          {/* Right Column - Login */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-6 xl:pl-8">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg">
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-secondary-500">
                Existing Seller Login
              </h3>
            </div>

            {!showLogin ? (
              <div className="text-center py-4 sm:py-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Already have a seller account? Login to access your dashboard.
                </p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Click to Login</span>
                </button>
              </div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLogin}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Seller ID / Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginData.sellerId}
                      onChange={(e) => {
                        setLoginData({ ...loginData, sellerId: e.target.value });
                        setErrors({ ...errors, sellerId: '' });
                      }}
                      className={`w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                        errors.sellerId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your seller ID or email"
                    />
                  </div>
                  {errors.sellerId && (
                    <p className="mt-1 text-[10px] sm:text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {errors.sellerId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full pl-8 sm:pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                        errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-secondary-500" />
                      ) : (
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-secondary-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-[10px] sm:text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="text-[10px] sm:text-xs text-gray-600 hover:text-secondary-500"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="text-[10px] sm:text-xs text-secondary-500 hover:text-primary-600"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-500 text-white py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Login</span>
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerSection;