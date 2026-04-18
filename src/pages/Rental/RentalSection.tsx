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
  Truck,
  Calendar,
  Shield,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

const RentalSection = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    rentalId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginData.rentalId.trim()) {
      newErrors.rentalId = 'Rental ID / Email is required';
    }
    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Set session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'rental');
        localStorage.setItem('userName', loginData.rentalId.split('@')[0] || loginData.rentalId);
        localStorage.setItem('userEmail', loginData.rentalId);

        // 🔥 trigger navbar update
        window.dispatchEvent(new Event('storage'));

        // Redirect to rental dashboard
        navigate('/rental/dashboard');
        setIsLoading(false);
      }, 500);
    } else {
      setErrors(newErrors);
    }
  };

  const benefits = [
    { icon: Truck, text: 'List vehicles & equipment' },
    { icon: Calendar, text: 'Manage bookings easily' },
    { icon: Shield, text: 'Insurance included' },
    { icon: CheckCircle, text: 'Verified customers' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
        <h3 className="text-xl font-bold text-secondary-500">Rental Support Program</h3>
        <p className="text-sm text-secondary-600/90">Join India's largest construction equipment rental network</p>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary-500">500+</div>
                <div className="text-xs text-gray-600">Active Providers</div>
              </div>
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-secondary-500">2000+</div>
                <div className="text-xs text-gray-600">Equipment Listed</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="font-semibold text-secondary-500">Why join as Rental Provider?</h4>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary-100 rounded-lg">
                      <benefit.icon className="w-4 h-4 text-secondary-500" />
                    </div>
                    <span className="text-xs text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Categories */}
            <div>
              <h4 className="font-semibold text-secondary-500 mb-3">Equipment Categories</h4>
              <div className="flex flex-wrap gap-2">
                {['Heavy Equipment', 'Construction Tools', 'Scaffolding', 'Generators', 'Material Handling'].map((cat, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 text-secondary-500 rounded-full text-xs font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/rental/register')}
              className="w-full bg-secondary-500 text-white py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as Rental Provider</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Right Column - Login */}
          <div className="md:border-l md:border-gray-200 md:pl-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <LogIn className="w-5 h-5 text-secondary-500" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-500">Existing Provider Login</h3>
            </div>

            {!showLogin ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Already have a rental account? Login to manage your equipment and bookings.
                </p>
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-secondary inline-flex items-center gap-2 px-6 py-2.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Click to Login</span>
                </button>
              </div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rental ID / Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginData.rentalId}
                      onChange={(e) => {
                        setLoginData({ ...loginData, rentalId: e.target.value });
                        setErrors({ ...errors, rentalId: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        errors.rentalId ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your rental ID or email"
                    />
                  </div>
                  {errors.rentalId && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.rentalId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        setErrors({ ...errors, password: '' });
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="text-sm text-gray-600 hover:text-secondary-500"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="text-sm text-secondary-500 hover:text-primary-600"
                    onClick={() => alert('Password reset link sent to registered email')}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary-500 text-white py-2.5 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Login to Dashboard</span>
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalSection;