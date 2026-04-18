import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Building2,
  Truck,
  Wrench,
  Package,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileText,
  Upload,
  Camera,
  Image as ImageIcon,
  Plus,
  X,
  Clock,
  Mail as MailIcon,
  Phone as PhoneIcon,
  
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  model: string;
  year: string;
  hourlyRate: string;
  dailyRate: string;
  images: File[];
}

const RentalRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [currentEquipment, setCurrentEquipment] = useState<Partial<EquipmentItem>>({});
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  const [formData, setFormData] = useState({
    // Account Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Business Details
    businessName: '',
    businessType: '',
    gstNumber: '',
    panNumber: '',
    yearsInBusiness: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Service Areas
    serviceAreas: [] as string[],
    primaryLocation: '',

    // Documents
    businessProof: null as File | null,
    panCard: null as File | null,
    insuranceCert: null as File | null,
    equipmentList: null as File | null,
    profilePhoto: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited',
    'LLP',
    'Public Limited',
  ];

  const equipmentCategories = [
    { id: 'heavy', label: 'Heavy Equipment', icon: Truck, subcategories: ['Excavator', 'JCB', 'Crane', 'Loader', 'Compactor'] },
    { id: 'tools', label: 'Construction Tools', icon: Wrench, subcategories: ['Concrete Mixer', 'Vibrator', 'Cutting Tool', 'Drilling Machine'] },
    { id: 'scaffolding', label: 'Scaffolding', icon: Package, subcategories: ['Frame', 'Coupler', 'Base Plate', 'Guard Rail'] },
    { id: 'generators', label: 'Generators', icon: Package, subcategories: ['Diesel Generator', 'Petrol Generator', 'Solar Generator'] },
    { id: 'material', label: 'Material Handling', icon: Truck, subcategories: ['Forklift', 'Pallet Truck', 'Stacker', 'Conveyor'] },
  ];

  const indianStates = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat',
    'Uttar Pradesh', 'Telangana', 'West Bengal', 'Rajasthan', 'Madhya Pradesh',
    'Andhra Pradesh', 'Kerala', 'Haryana', 'Punjab', 'Bihar'
  ];

  // Generate a random application ID
  const generateApplicationId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REN-${timestamp}-${random}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [fieldName]: file });
      if (errors[fieldName]) {
        setErrors({ ...errors, [fieldName]: '' });
      }
    }
  };

  const handleServiceAreaToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(city)
        ? prev.serviceAreas.filter(c => c !== city)
        : [...prev.serviceAreas, city]
    }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.yearsInBusiness) newErrors.yearsInBusiness = 'Years in business is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
    if (!formData.primaryLocation) newErrors.primaryLocation = 'Primary service location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessProof) newErrors.businessProof = 'Business proof is required';
    if (!formData.panCard) newErrors.panCard = 'PAN card is required';
    if (!formData.insuranceCert) newErrors.insuranceCert = 'Insurance certificate is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 3 && validateStep3()) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    // Generate application ID
    const newAppId = generateApplicationId();
    setApplicationId(newAppId);
    
    console.log('Form submitted:', formData);
    console.log('Equipment list:', equipmentList);
    console.log('Application ID:', newAppId);
    
    // Show thank you screen
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addEquipment = () => {
    if (currentEquipment.name && currentEquipment.category) {
      const newEquipment: EquipmentItem = {
        id: Date.now().toString(),
        name: currentEquipment.name || '',
        category: currentEquipment.category || '',
        model: currentEquipment.model || '',
        year: currentEquipment.year || '',
        hourlyRate: currentEquipment.hourlyRate || '',
        dailyRate: currentEquipment.dailyRate || '',
        images: currentEquipment.images || [],
      };
      setEquipmentList([...equipmentList, newEquipment]);
      setCurrentEquipment({});
      setShowEquipmentForm(false);
    }
  };

  const removeEquipment = (id: string) => {
    setEquipmentList(equipmentList.filter(item => item.id !== id));
  };

 
  const handleGoHome = () => {
    navigate('/');
  };

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12">
        <div className="max-w-2xl mx-auto container-padding">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>

            {/* Thank You Message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-secondary-500 mb-4"
            >
              Thank You for Registering!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-6"
            >
              Your rental provider application has been submitted successfully. Our team will review your documents and verify your equipment details.
            </motion.p>

            {/* Application ID */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-primary-50 rounded-xl p-6 mb-6"
            >
              <p className="text-sm text-gray-600 mb-2">Your Application ID</p>
              <p className="text-2xl font-mono font-bold text-secondary-500">{applicationId}</p>
            </motion.div>

            {/* Equipment Summary */}
            {equipmentList.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="bg-blue-50 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">{equipmentList.length}</span> equipment items listed for verification
                </p>
              </motion.div>
            )}

            {/* What's Next */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-left mb-8"
            >
              <h3 className="font-semibold text-secondary-500 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                What's Next?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Our team will verify your documents within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your equipment will be inspected for quality and safety standards</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email with your Rental Provider ID once verified</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start listing your equipment and accepting bookings</span>
                </li>
              </ul>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-50 rounded-lg p-4 mb-8"
            >
              <p className="text-sm text-blue-800 mb-2">Need help? Contact our support team</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:support@casaterminal.com" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <MailIcon className="w-4 h-4" />
                  <span className="text-sm">support@casaterminal.com</span>
                </a>
                <span className="hidden sm:inline text-blue-300">|</span>
                <a href="tel:+919876543210" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-sm">+91 xxxxx xxxxx</span>
                </a>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              
              <button
                onClick={handleGoHome}
                className="btn-secondary flex items-center justify-center gap-2 px-6 py-3"
              >
                Return to Home
              </button>
            </motion.div>

            {/* Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-xs text-gray-500 mt-6"
            >
              You will receive an email confirmation shortly. Please check your spam folder if you don't see it.
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-500 mb-2">
            Become a Rental Provider
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our network of verified equipment providers and start earning from your construction equipment
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Business' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Equipment' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step > s.num
                      ? 'bg-green-500 text-white'
                      : step === s.num
                        ? 'bg-secondary-500 text-white scale-110 shadow-lg'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={`text-xs mt-1 ${step === s.num ? 'text-secondary-500 font-medium' : 'text-gray-500'
                    }`}>
                    {s.label}
                  </span>
                </div>
                {s.num < 4 && (
                  <div className={`w-12 md:w-16 h-0.5 mx-2 ${step > s.num ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              {/* Step 1: Account Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-secondary-500 mb-6">Create Your Account</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.fullName ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.email ? 'border-red-500' : 'border-gray-200'
                            }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.phone ? 'border-red-500' : 'border-gray-200'
                            }`}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.password ? 'border-red-500' : 'border-gray-200'
                            }`}
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                            }`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Business Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-secondary-500 mb-6">Business Information</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.businessName ? 'border-red-500' : 'border-gray-200'
                            }`}
                          placeholder="Enter business name"
                        />
                      </div>
                      {errors.businessName && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.businessName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.businessType ? 'border-red-500' : 'border-gray-200'
                          }`}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.businessType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        PAN Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years in Business <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.yearsInBusiness ? 'border-red-500' : 'border-gray-200'
                        }`}
                    >
                      <option value="">Select years</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    {errors.yearsInBusiness && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.yearsInBusiness}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.address ? 'border-red-500' : 'border-gray-200'
                        }`}
                      placeholder="Enter complete business address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.city ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.state ? 'border-red-500' : 'border-gray-200'
                          }`}
                      >
                        <option value="">Select state</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.pincode ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Service Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="primaryLocation"
                        value={formData.primaryLocation}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${errors.primaryLocation ? 'border-red-500' : 'border-gray-200'
                          }`}
                        placeholder="e.g., Mumbai, Maharashtra"
                      />
                    </div>
                    {errors.primaryLocation && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.primaryLocation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Areas (Cities you serve)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Ahmedabad', 'Hyderabad', 'Kolkata'].map((city) => (
                        <label key={city} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50">
                          <input
                            type="checkbox"
                            checked={formData.serviceAreas.includes(city)}
                            onChange={() => handleServiceAreaToggle(city)}
                            className="w-4 h-4 text-secondary-500 rounded focus:ring-secondary-500"
                          />
                          <span className="text-sm">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Document Upload */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-secondary-500 mb-6">Upload Documents</h2>

                  {/* Business Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Proof <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formData.businessProof
                        ? 'border-green-500 bg-green-50'
                        : errors.businessProof
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-secondary-500'
                      }`}>
                      <input
                        type="file"
                        id="businessProof"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'businessProof')}
                      />
                      <label htmlFor="businessProof" className="cursor-pointer">
                        {formData.businessProof ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-8 h-8" />
                            <div>
                              <p className="font-medium">{formData.businessProof.name}</p>
                              <p className="text-sm">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.businessProof && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessProof}
                      </p>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Card <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formData.panCard
                        ? 'border-green-500 bg-green-50'
                        : errors.panCard
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-secondary-500'
                      }`}>
                      <input
                        type="file"
                        id="panCard"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'panCard')}
                      />
                      <label htmlFor="panCard" className="cursor-pointer">
                        {formData.panCard ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-8 h-8" />
                            <div>
                              <p className="font-medium">{formData.panCard.name}</p>
                              <p className="text-sm">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium mb-1">Upload PAN card</p>
                            <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.panCard && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.panCard}
                      </p>
                    )}
                  </div>

                  {/* Insurance Certificate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Certificate <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${formData.insuranceCert
                        ? 'border-green-500 bg-green-50'
                        : errors.insuranceCert
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 hover:border-secondary-500'
                      }`}>
                      <input
                        type="file"
                        id="insuranceCert"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'insuranceCert')}
                      />
                      <label htmlFor="insuranceCert" className="cursor-pointer">
                        {formData.insuranceCert ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <Shield className="w-8 h-8" />
                            <div>
                              <p className="font-medium">{formData.insuranceCert.name}</p>
                              <p className="text-sm">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Shield className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium mb-1">Upload insurance certificate</p>
                            <p className="text-sm text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.insuranceCert && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.insuranceCert}
                      </p>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary-500 transition-colors">
                      <input
                        type="file"
                        id="profilePhoto"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                      />
                      <label htmlFor="profilePhoto" className="cursor-pointer">
                        {formData.profilePhoto ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <Camera className="w-8 h-8" />
                            <div>
                              <p className="font-medium">{formData.profilePhoto.name}</p>
                              <p className="text-sm">Click to change</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600 font-medium mb-1">Upload profile photo</p>
                            <p className="text-sm text-gray-500">JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Document Verification</h4>
                        <p className="text-sm text-blue-700">
                          Your documents will be verified within 24-48 hours. All documents are encrypted and securely stored.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Equipment Listing */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-bold text-secondary-500 mb-6">List Your Equipment</h2>

                  {/* Equipment List - Mobile Responsive */}
                  {equipmentList.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <h3 className="font-semibold text-gray-700">Added Equipment</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {equipmentList.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center justify-between p-3 bg-primary-50 rounded-lg border border-primary-100"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-secondary-500 truncate">{item.name}</p>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">
                                {item.category} {item.model && `- ${item.model}`} {item.year && `(${item.year})`}
                              </p>
                              {(item.hourlyRate || item.dailyRate) && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.dailyRate && `₹${item.dailyRate}/day`}
                                  {item.hourlyRate && item.dailyRate && ' • '}
                                  {item.hourlyRate && `₹${item.hourlyRate}/hr`}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeEquipment(item.id)}
                              className="p-1.5 hover:bg-red-100 rounded-full transition-colors ml-2 flex-shrink-0"
                              title="Remove equipment"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Equipment Button - Mobile Responsive */}
                  {!showEquipmentForm ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowEquipmentForm(true)}
                      className="w-full p-4 sm:p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 transition-colors group"
                    >
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2 group-hover:text-secondary-500" />
                      <p className="text-sm sm:text-base text-gray-600 font-medium group-hover:text-secondary-500">Add Equipment</p>
                      <p className="text-xs sm:text-sm text-gray-500">You can add more equipment later</p>
                    </motion.button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-6 border-2 border-secondary-200 rounded-lg space-y-4 sm:space-y-6 bg-secondary-50/30"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base sm:text-lg font-semibold text-secondary-500">Add Equipment Details</h3>
                        <button
                          onClick={() => {
                            setShowEquipmentForm(false);
                            setCurrentEquipment({});
                          }}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {/* Equipment Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Equipment Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentEquipment.name || ''}
                          onChange={(e) => setCurrentEquipment({ ...currentEquipment, name: e.target.value })}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          placeholder="e.g., JCB 3DX"
                        />
                      </div>

                      {/* Category and Model */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={currentEquipment.category || ''}
                            onChange={(e) => setCurrentEquipment({ ...currentEquipment, category: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                          >
                            <option value="">Select category</option>
                            {equipmentCategories.map(cat => (
                              <option key={cat.id} value={cat.label}>{cat.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model <span className="text-gray-400 text-xs">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={currentEquipment.model || ''}
                            onChange={(e) => setCurrentEquipment({ ...currentEquipment, model: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="Model number"
                          />
                        </div>
                      </div>

                      {/* Year and Rates */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year <span className="text-gray-400 text-xs">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={currentEquipment.year || ''}
                            onChange={(e) => setCurrentEquipment({ ...currentEquipment, year: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="e.g., 2022"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Daily Rate (₹)
                          </label>
                          <input
                            type="text"
                            value={currentEquipment.dailyRate || ''}
                            onChange={(e) => setCurrentEquipment({ ...currentEquipment, dailyRate: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="e.g., 8500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hourly Rate (₹)
                          </label>
                          <input
                            type="text"
                            value={currentEquipment.hourlyRate || ''}
                            onChange={(e) => setCurrentEquipment({ ...currentEquipment, hourlyRate: e.target.value })}
                            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="e.g., 850"
                          />
                        </div>
                      </div>

                      {/* Equipment Photos Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Equipment Photos <span className="text-red-500">*</span>
                          <span className="text-gray-400 text-xs ml-2">(Min. 2 photos recommended)</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 hover:border-secondary-500 transition-colors">
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                            id="equipmentImages"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                const fileArray = Array.from(files);
                                setCurrentEquipment({
                                  ...currentEquipment,
                                  images: fileArray
                                });
                              }
                            }}
                          />
                          <label htmlFor="equipmentImages" className="cursor-pointer block">
                            <div className="flex flex-col items-center">
                              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
                              <p className="text-sm sm:text-base text-gray-600 font-medium text-center">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">
                                JPG, PNG up to 5MB each (Max 5 photos)
                              </p>
                            </div>
                          </label>

                          {/* Show selected files */}
                          {currentEquipment.images && currentEquipment.images.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Selected Files ({currentEquipment.images.length}):
                              </p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {Array.from(currentEquipment.images).map((file, index) => (
                                  <div key={index} className="relative group">
                                    <div className="aspect-square bg-primary-50 rounded-lg border border-primary-100 flex items-center justify-center p-2">
                                      {file.type.startsWith('image/') ? (
                                        <img
                                          src={URL.createObjectURL(file)}
                                          alt={`Preview ${index + 1}`}
                                          className="w-full h-full object-cover rounded"
                                        />
                                      ) : (
                                        <FileText className="w-6 h-6 text-gray-400" />
                                      )}
                                    </div>
                                    <button
                                      onClick={() => {
                                        const newImages = currentEquipment.images?.filter((_, i) => i !== index);
                                        setCurrentEquipment({ ...currentEquipment, images: newImages });
                                      }}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowEquipmentForm(false);
                            setCurrentEquipment({});
                          }}
                          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={addEquipment}
                          className="w-full sm:w-auto px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Equipment
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Summary */}
                  {(formData.fullName || formData.businessName || equipmentList.length > 0) && (
                    <div className="bg-primary-50 rounded-lg p-4 sm:p-6 mt-4">
                      <h3 className="text-sm sm:text-base font-semibold text-secondary-500 mb-3">Registration Summary</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {formData.fullName && (
                          <div className="flex justify-between sm:block p-2 bg-white rounded-lg sm:bg-transparent sm:p-0">
                            <span className="text-gray-600 sm:block">Account:</span>
                            <span className="font-medium text-secondary-500 sm:mt-1 block sm:inline">
                              {formData.fullName}
                            </span>
                          </div>
                        )}
                        {formData.businessName && (
                          <div className="flex justify-between sm:block p-2 bg-white rounded-lg sm:bg-transparent sm:p-0">
                            <span className="text-gray-600 sm:block">Business:</span>
                            <span className="font-medium text-secondary-500 sm:mt-1 block sm:inline">
                              {formData.businessName}
                            </span>
                          </div>
                        )}
                        {formData.city && formData.state && (
                          <div className="flex justify-between sm:block p-2 bg-white rounded-lg sm:bg-transparent sm:p-0">
                            <span className="text-gray-600 sm:block">Location:</span>
                            <span className="font-medium text-secondary-500 sm:mt-1 block sm:inline">
                              {formData.city}, {formData.state}
                            </span>
                          </div>
                        )}
                        {equipmentList.length > 0 && (
                          <div className="flex justify-between sm:block p-2 bg-white rounded-lg sm:bg-transparent sm:p-0">
                            <span className="text-gray-600 sm:block">Equipment Listed:</span>
                            <span className="font-medium text-secondary-500 sm:mt-1 block sm:inline">
                              {equipmentList.length} items
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 w-4 h-4 flex-shrink-0 text-secondary-500 rounded focus:ring-secondary-500"
                    />
                    <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      I confirm that all information provided is accurate and I agree to the
                      <a href="#" className="text-secondary-500 hover:underline mx-1">Terms of Service</a> and
                      <a href="#" className="text-secondary-500 hover:underline mx-1">Rental Agreement</a>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help? Contact our support team at <span className="text-secondary-500 font-medium">support@casaterminal.com</span>
        </p>
      </div>
    </div>
  );
};

export default RentalRegistration;