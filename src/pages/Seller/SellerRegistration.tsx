import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail as MailIcon,
  Phone as PhoneIcon,
 
  Eye,
  EyeOff
} from 'lucide-react';

const steps = [
  { num: 1, label: 'Basic Info' },
  { num: 2, label: 'Business' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Review' }
];

const SellerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    // Step 2
    businessName: '',
    businessAddress: '',
    gstNumber: '',
    panNumber: '',
    businessType: '',
    yearsOfOperation: '',
    // Step 3
    documents: {
      gstCertificate: null as File | null,
      panCard: null as File | null,
      businessLicense: null as File | null,
      bankProof: null as File | null,
    },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Generate a random application ID
  const generateApplicationId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SEL-${timestamp}-${random}`;
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      if (!formData.businessName) newErrors.businessName = 'Business name is required';
      if (!formData.businessAddress) newErrors.businessAddress = 'Business address is required';
      if (!formData.gstNumber) newErrors.gstNumber = 'GST number is required';
      if (!formData.panNumber) newErrors.panNumber = 'PAN number is required';
      if (!formData.businessType) newErrors.businessType = 'Business type is required';
      if (!formData.yearsOfOperation) newErrors.yearsOfOperation = 'Years of operation is required';
    } else if (step === 3) {
      if (!formData.documents.gstCertificate) newErrors.gstCertificate = 'GST certificate is required';
      if (!formData.documents.panCard) newErrors.panCard = 'PAN card is required';
      if (!formData.documents.businessLicense) newErrors.businessLicense = 'Business license is required';
      if (!formData.documents.bankProof) newErrors.bankProof = 'Bank account proof is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const newAppId = generateApplicationId();
      setApplicationId(newAppId);
      console.log('Form submitted:', formData);
      console.log('Application ID:', newAppId);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (field: keyof typeof formData.documents) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        documents: {
          ...formData.documents,
          [field]: file,
        },
      });
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-500 mb-4">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile"
                    maxLength={10}
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.mobile}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-secondary-500" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-secondary-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-secondary-500" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-secondary-500" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-2 sm:space-y-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-500 mb-4">Business Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter business name"
                  />
                </div>
                {errors.businessName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                    errors.businessType ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  <option value="sole">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="private">Private Limited</option>
                  <option value="public">Public Limited</option>
                  <option value="llp">LLP</option>
                </select>
                {errors.businessType && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.businessType}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Business Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <textarea
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  rows={3}
                  className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                    errors.businessAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter complete business address"
                />
              </div>
              {errors.businessAddress && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.businessAddress}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.gstNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                {errors.gstNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.gstNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                    className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                      errors.panNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="ABCDE1234F"
                  />
                </div>
                {errors.panNumber && (
                  <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.panNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Years of Operation <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.yearsOfOperation}
                onChange={(e) => setFormData({ ...formData, yearsOfOperation: e.target.value })}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all ${
                  errors.yearsOfOperation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Number of years"
                min="0"
              />
              {errors.yearsOfOperation && (
                <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.yearsOfOperation}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-500 mb-4">Document Upload</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              Please upload clear, legible copies of all required documents.
            </p>

            <div className="space-y-4">
              {[
                { key: 'gstCertificate', label: 'GST Certificate *', accept: '.pdf,.jpg,.jpeg,.png' },
                { key: 'panCard', label: 'PAN Card *', accept: '.pdf,.jpg,.jpeg,.png' },
                { key: 'businessLicense', label: 'Business License *', accept: '.pdf,.jpg,.jpeg,.png' },
                { key: 'bankProof', label: 'Bank Account Proof *', accept: '.pdf,.jpg,.jpeg,.png' },
              ].map((doc) => (
                <div key={doc.key}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {doc.label}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept={doc.accept}
                      onChange={handleFileUpload(doc.key as keyof typeof formData.documents)}
                      className="hidden"
                      id={doc.key}
                    />
                    <label
                      htmlFor={doc.key}
                      className={`flex items-center justify-center w-full p-3 sm:p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                        formData.documents[doc.key as keyof typeof formData.documents]
                          ? 'border-green-500 bg-green-50'
                          : errors[doc.key]
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-secondary-500 hover:bg-primary-50'
                      }`}
                    >
                      <div className="text-center">
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-400" />
                        {formData.documents[doc.key as keyof typeof formData.documents] ? (
                          <div>
                            <p className="text-xs sm:text-sm text-green-600 font-medium break-all px-2">
                              {formData.documents[doc.key as keyof typeof formData.documents]?.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                              Click to change file
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium">
                              Click to upload
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG (Max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  {errors[doc.key] && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors[doc.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-secondary-500 mb-4">Review & Submit</h3>
            
            <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm sm:text-base font-semibold text-secondary-500 mb-2 sm:mb-3">Basic Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">Name:</span>
                  <span className="font-medium text-secondary-500">{formData.fullName || 'Not provided'}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">Email:</span>
                  <span className="font-medium text-secondary-500 break-all">{formData.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">Mobile:</span>
                  <span className="font-medium text-secondary-500">{formData.mobile || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm sm:text-base font-semibold text-secondary-500 mb-2 sm:mb-3">Business Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">Business:</span>
                  <span className="font-medium text-secondary-500">{formData.businessName || 'Not provided'}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">GST:</span>
                  <span className="font-medium text-secondary-500">{formData.gstNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">PAN:</span>
                  <span className="font-medium text-secondary-500">{formData.panNumber || 'Not provided'}</span>
                </div>
                <div className="flex justify-between sm:block">
                  <span className="text-gray-600 sm:hidden">Type:</span>
                  <span className="font-medium text-secondary-500 capitalize">{formData.businessType || 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm sm:text-base font-semibold text-secondary-500 mb-2 sm:mb-3">Documents</h4>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                {Object.entries(formData.documents).map(([key, file]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    {file ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Uploaded</span>
                      </span>
                    ) : (
                      <span className="text-red-500">Missing</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>Important:</strong> By submitting, you confirm that all information is accurate. Your application will be reviewed within 48 hours.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Thank You Screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 md:p-12 text-center"
          >
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            >
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600" />
            </motion.div>

            {/* Thank You Message */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-500 mb-2 sm:mb-4"
            >
              Thank You!
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-6 px-2"
            >
              Your application has been submitted successfully. Our team will review your documents and verify your details.
            </motion.p>

            {/* Application ID */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-primary-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Your Application ID</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-mono font-bold text-secondary-500 break-all">
                {applicationId}
              </p>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-left mb-6 sm:mb-8"
            >
              <h3 className="text-sm sm:text-base font-semibold text-secondary-500 mb-2 sm:mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                What's Next?
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Our team will verify your documents within 24-48 hours',
                  "You'll receive an email with your Seller ID once verified",
                  'You can then login and start listing your products'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8"
            >
              <p className="text-xs sm:text-sm text-blue-800 mb-2">Need help? Contact our support team</p>
              <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-4">
                <a href="mailto:support@casaterminal.com" className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                  <MailIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>support@casaterminal.com</span>
                </a>
                <span className="hidden xs:inline text-blue-300">|</span>
                <a href="tel:+919876543210" className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm">
                  <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>+91 XXXXX XXXXX</span>
                </a>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col xs:flex-row gap-3 justify-center"
            >
              <button
                onClick={handleGoHome}
                className="w-full xs:w-auto btn-secondary flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                Return to Home
              </button>
            </motion.div>

            {/* Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-[10px] sm:text-xs text-gray-500 mt-4 sm:mt-6"
            >
              You will receive an email confirmation shortly. Please check your spam folder if you don't see it.
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps - Enhanced like ContractorRegistration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 overflow-x-auto pb-2"
        >
          <div className="flex items-center justify-between min-w-[400px] md:min-w-0 md:max-w-3xl mx-auto">
            {steps.map((s) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      s.num < currentStep
                        ? 'bg-green-500 text-white'
                        : s.num === currentStep
                        ? 'bg-secondary-500 text-white scale-110 shadow-lg'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {s.num < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 ${
                      s.num === currentStep ? 'text-secondary-500 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {s.num < steps.length && (
                  <div
                    className={`w-8 md:w-12 h-0.5 mx-1 ${
                      s.num < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-100 text-secondary-500 hover:bg-primary-200'
              }`}
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Back</span>
              <span className="xs:hidden">←</span>
            </button>

            <button
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              className="btn-primary flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <span>{currentStep === steps.length ? 'Submit' : 'Next'}</span>
              {currentStep !== steps.length && <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>

        {/* Info Message */}
        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-4">
          * All fields are mandatory. Your information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default SellerRegistration;