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
  Hammer,
  Star,
  Clock,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

const ContractorSection = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    contractorId: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!loginData.contractorId.trim()) {
      newErrors.contractorId = 'Contractor ID is required';
    }
    if (!loginData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length === 0) {
      // Set session
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'contractor');
      localStorage.setItem('userName', loginData.contractorId.split('@')[0] || loginData.contractorId);
      localStorage.setItem('userEmail', loginData.contractorId);

      // 🔥 trigger navbar update
      window.dispatchEvent(new Event('storage'));

      navigate('/contractor/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  const benefits = [
    { icon: Briefcase, text: 'Get quality projects' },
    { icon: Star, text: 'Build your reputation' },
    { icon: Clock, text: 'Timely payments' },
    { icon: Users, text: 'Verified clients' },
  ];

  const stats = [
    { value: '1000+', label: 'Active Projects', icon: Hammer },
    { value: '500+', label: 'Verified Contractors', icon: Award },
    { value: '4.8', label: 'Average Rating', icon: Star },
    { value: '24/7', label: 'Support', icon: Clock },
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
        <h3 className="text-xl font-bold text-secondary-500">Contractor Program</h3>
        <p className="text-sm text-secondary-600/90">Join India's largest network of verified contractors</p>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-primary-50 rounded-lg p-4">
                  <stat.icon className="w-5 h-5 text-secondary-500 mb-2" />
                  <div className="text-xl font-bold text-secondary-500">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Benefits */}
            <div>
              <h4 className="font-semibold text-secondary-500 mb-3">Why join as Contractor?</h4>
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

            {/* Specializations */}
            <div>
              <h4 className="font-semibold text-secondary-500 mb-3">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {['Residential', 'Commercial', 'Renovation', 'Infrastructure', 'Interior', 'Green Building'].map((spec, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 text-secondary-500 rounded-full text-xs font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setShowLogin(false);
                navigate('/contractor/register');
              }}
              className="w-full bg-secondary-500 text-white py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-5 h-5" />
              <span>Register as Contractor</span>
            </button>
          </div>

          {/* Right Column - Login */}
          <div className="md:border-l md:border-gray-200 md:pl-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-primary-100 rounded-lg">
                <LogIn className="w-5 h-5 text-secondary-500" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-500">Existing Contractor Login</h3>
            </div>

            {!showLogin ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Already have a contractor account? Login to manage your projects and profile.
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
                    Contractor ID / Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={loginData.contractorId}
                      onChange={(e) => {
                        setLoginData({ ...loginData, contractorId: e.target.value });
                        setErrors({ ...errors, contractorId: '' });
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        errors.contractorId ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your contractor ID or email"
                    />
                  </div>
                  {errors.contractorId && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.contractorId}
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
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-500 text-white py-2.5 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContractorSection;