import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Mail,
  Phone,
  Building2,
  Hammer,
  Award,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileText,
  Camera,
  Briefcase,
  Calendar,
  Plus,
  X,
  Clock,
  Mail as MailIcon,
  Phone as PhoneIcon,
 
  
} from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  year: string;
  file: File | null;
}

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  year: string;
  value: string;
  description: string;
  images: File[];
}

const ContractorRegistration = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentCert, setCurrentCert] = useState<Partial<Certification>>({});
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [showCertForm, setShowCertForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [formData, setFormData] = useState({
    // Account Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Personal Details
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Details
    experience: '',
    specialization: '',
    companyName: '',
    gstNumber: '',
    panNumber: '',
    licenseNumber: '',
    teamSize: '',
    serviceAreas: [] as string[],
    
    // Bank Details
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    
    // Documents
    profilePhoto: null as File | null,
    idProof: null as File | null,
    addressProof: null as File | null,
    licenseDoc: null as File | null,
    panCard: null as File | null,
    bankProof: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const specializations = [
    'Residential Construction',
    'Commercial Construction',
    'Renovation & Remodeling',
    'Infrastructure',
    'Interior Design',
    'Green Building',
    'Historical Restoration',
    'Industrial Construction',
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
    return `CON-${timestamp}-${random}`;
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
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.accountHolderName) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    else if (!/^\d{9,18}$/.test(formData.accountNumber)) newErrors.accountNumber = 'Invalid account number';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) newErrors.ifscCode = 'Invalid IFSC code';
    if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep5 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.idProof) newErrors.idProof = 'ID proof is required';
    if (!formData.addressProof) newErrors.addressProof = 'Address proof is required';
    if (!formData.licenseDoc) newErrors.licenseDoc = 'License document is required';
    if (!formData.panCard) newErrors.panCard = 'PAN card is required';
    if (!formData.bankProof) newErrors.bankProof = 'Bank proof is required';
    
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
    } else if (step === 4 && validateStep4()) {
      setStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 5 && validateStep5()) {
      setStep(6);
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
    console.log('Certifications:', certifications);
    console.log('Projects:', projects);
    console.log('Application ID:', newAppId);
    
    // Show thank you screen
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addCertification = () => {
    if (currentCert.name && currentCert.issuingAuthority && currentCert.year) {
      const newCert: Certification = {
        id: Date.now().toString(),
        name: currentCert.name || '',
        issuingAuthority: currentCert.issuingAuthority || '',
        year: currentCert.year || '',
        file: currentCert.file || null,
      };
      setCertifications([...certifications, newCert]);
      setCurrentCert({});
      setShowCertForm(false);
    }
  };

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
  };

  const addProject = () => {
    if (currentProject.name && currentProject.client && currentProject.location) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: currentProject.name || '',
        client: currentProject.client || '',
        location: currentProject.location || '',
        year: currentProject.year || '',
        value: currentProject.value || '',
        description: currentProject.description || '',
        images: currentProject.images || [],
      };
      setProjects([...projects, newProject]);
      setCurrentProject({});
      setShowProjectForm(false);
    }
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
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
              Your contractor application has been submitted successfully. Our team will review your documents and verify your credentials.
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

            {/* Portfolio Summary */}
            {(certifications.length > 0 || projects.length > 0) && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="bg-blue-50 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-4">
                  {certifications.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        <span className="font-semibold">{certifications.length}</span> certifications
                      </span>
                    </div>
                  )}
                  {projects.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        <span className="font-semibold">{projects.length}</span> projects
                      </span>
                    </div>
                  )}
                </div>
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
                  <span>Your professional credentials and experience will be validated</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You'll receive an email with your Contractor ID once verified</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Start receiving project inquiries and building your reputation</span>
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
            Become a Verified Contractor
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our network of trusted contractors and get access to quality projects across India
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 overflow-x-auto pb-2"
        >
          <div className="flex items-center justify-between min-w-[600px] md:min-w-0 md:max-w-3xl mx-auto">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Address' },
              { num: 3, label: 'Professional' },
              { num: 4, label: 'Bank' },
              { num: 5, label: 'Documents' },
              { num: 6, label: 'Portfolio' }
            ].map((s) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step > s.num 
                      ? 'bg-green-500 text-white'
                      : step === s.num
                      ? 'bg-secondary-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > s.num ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-1 ${
                    step === s.num ? 'text-secondary-500 font-medium' : 'text-gray-500'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {s.num < 6 && (
                  <div className={`w-8 md:w-12 h-0.5 mx-1 ${
                    step > s.num ? 'bg-green-500' : 'bg-gray-200'
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
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
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
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Create Your Account</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.email ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.phone ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.password ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Min. 8 characters"
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                          }`}
                          placeholder="Confirm your password"
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.dateOfBirth ? 'border-red-500' : 'border-gray-200'
                          }`}
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.gender ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Address Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Address Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
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
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select state</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
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
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Professional Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Professional Details</h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.experience ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select experience</option>
                          <option value="0-2">0-2 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="6-10">6-10 years</option>
                          <option value="10-15">10-15 years</option>
                          <option value="15+">15+ years</option>
                        </select>
                      </div>
                      {errors.experience && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialization <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Hammer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <select
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                            errors.specialization ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Select specialization</option>
                          {specializations.map(spec => (
                            <option key={spec} value={spec}>{spec}</option>
                          ))}
                        </select>
                      </div>
                      {errors.specialization && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.specialization}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.companyName ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter your company name"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Number (Optional)
                      </label>
                      <input
                        type="text"
                        name="gstNumber"
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
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
                        className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.licenseNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter your license number"
                      />
                      {errors.licenseNumber && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.licenseNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Size
                      </label>
                      <select
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      >
                        <option value="">Select team size</option>
                        <option value="1">Just me</option>
                        <option value="2-5">2-5 members</option>
                        <option value="6-10">6-10 members</option>
                        <option value="11-20">11-20 members</option>
                        <option value="20+">20+ members</option>
                      </select>
                    </div>
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
                          <span className="text-xs sm:text-sm">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Bank Details */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Bank Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                        errors.accountHolderName ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Enter account holder name"
                    />
                    {errors.accountHolderName && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.accountHolderName}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.accountNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter account number"
                      />
                      {errors.accountNumber && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.accountNumber}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="confirmAccountNumber"
                        value={formData.confirmAccountNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.confirmAccountNumber ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Confirm account number"
                      />
                      {errors.confirmAccountNumber && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.confirmAccountNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IFSC Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.ifscCode ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="SBIN0001234"
                        style={{ textTransform: 'uppercase' }}
                      />
                      {errors.ifscCode && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.ifscCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 sm:py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 ${
                          errors.bankName ? 'border-red-500' : 'border-gray-200'
                        }`}
                        placeholder="Enter bank name"
                      />
                      {errors.bankName && (
                        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.bankName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 sm:py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                      placeholder="Enter branch name"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 5: Document Upload */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Upload Documents</h2>
                  
                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-secondary-500 transition-colors">
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
                            <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.profilePhoto.name}</p>
                              <p className="text-xs">Click to change</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Upload profile photo</p>
                            <p className="text-xs text-gray-500">JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* ID Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID Proof (Aadhar/PAN/Passport) <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                      formData.idProof 
                        ? 'border-green-500 bg-green-50' 
                        : errors.idProof
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-secondary-500'
                    }`}>
                      <input
                        type="file"
                        id="idProof"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'idProof')}
                      />
                      <label htmlFor="idProof" className="cursor-pointer">
                        {formData.idProof ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.idProof.name}</p>
                              <p className="text-xs">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.idProof && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.idProof}
                      </p>
                    )}
                  </div>

                  {/* Address Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Proof (Utility Bill/Bank Statement) <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                      formData.addressProof 
                        ? 'border-green-500 bg-green-50' 
                        : errors.addressProof
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-secondary-500'
                    }`}>
                      <input
                        type="file"
                        id="addressProof"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'addressProof')}
                      />
                      <label htmlFor="addressProof" className="cursor-pointer">
                        {formData.addressProof ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.addressProof.name}</p>
                              <p className="text-xs">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.addressProof && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.addressProof}
                      </p>
                    )}
                  </div>

                  {/* License Document */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Document <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                      formData.licenseDoc 
                        ? 'border-green-500 bg-green-50' 
                        : errors.licenseDoc
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-secondary-500'
                    }`}>
                      <input
                        type="file"
                        id="licenseDoc"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'licenseDoc')}
                      />
                      <label htmlFor="licenseDoc" className="cursor-pointer">
                        {formData.licenseDoc ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <Award className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.licenseDoc.name}</p>
                              <p className="text-xs">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Upload license document</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.licenseDoc && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.licenseDoc}
                      </p>
                    )}
                  </div>

                  {/* PAN Card */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Card <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                      formData.panCard 
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
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.panCard.name}</p>
                              <p className="text-xs">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Upload PAN card</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 2MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.panCard && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.panCard}
                      </p>
                    )}
                  </div>

                  {/* Bank Proof */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Proof (Cancelled Cheque/Passbook) <span className="text-red-500">*</span>
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors ${
                      formData.bankProof 
                        ? 'border-green-500 bg-green-50' 
                        : errors.bankProof
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-secondary-500'
                    }`}>
                      <input
                        type="file"
                        id="bankProof"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'bankProof')}
                      />
                      <label htmlFor="bankProof" className="cursor-pointer">
                        {formData.bankProof ? (
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                            <div>
                              <p className="text-xs sm:text-sm font-medium">{formData.bankProof.name}</p>
                              <p className="text-xs">Click to change file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">Upload bank proof</p>
                            <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                          </>
                        )}
                      </label>
                    </div>
                    {errors.bankProof && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bankProof}
                      </p>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-blue-800 mb-1">Document Verification</h4>
                        <p className="text-xs text-blue-700">
                          Your documents will be verified within 24-48 hours. All documents are encrypted and securely stored.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Portfolio */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-secondary-500 mb-4">Build Your Portfolio</h2>
                  
                  {/* Certifications Section */}
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-secondary-500">Certifications</h3>
                    
                    {/* Certifications List */}
                    {certifications.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {certifications.map((cert) => (
                          <div key={cert.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                            <div>
                              <p className="font-medium text-secondary-500 text-sm">{cert.name}</p>
                              <p className="text-xs text-gray-600">{cert.issuingAuthority} - {cert.year}</p>
                            </div>
                            <button
                              onClick={() => removeCertification(cert.id)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Certification Form */}
                    {!showCertForm ? (
                      <button
                        type="button"
                        onClick={() => setShowCertForm(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 transition-colors group"
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto mb-2 group-hover:text-secondary-500" />
                        <p className="text-xs sm:text-sm text-gray-600 font-medium group-hover:text-secondary-500">Add Certification</p>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border-2 border-secondary-200 rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-secondary-500">Add Certification</h4>
                          <button
                            onClick={() => {
                              setShowCertForm(false);
                              setCurrentCert({});
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            value={currentCert.name || ''}
                            onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="e.g., LEED Green Associate"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Issuing Authority
                            </label>
                            <input
                              type="text"
                              value={currentCert.issuingAuthority || ''}
                              onChange={(e) => setCurrentCert({ ...currentCert, issuingAuthority: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., USGBC"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Year
                            </label>
                            <input
                              type="text"
                              value={currentCert.year || ''}
                              onChange={(e) => setCurrentCert({ ...currentCert, year: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., 2023"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Certificate File (Optional)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setCurrentCert({ ...currentCert, file });
                            }}
                            className="w-full text-sm"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={addCertification}
                            className="px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600"
                          >
                            Add Certification
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Projects Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-secondary-500">Past Projects</h3>
                    
                    {/* Projects List */}
                    {projects.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {projects.map((project) => (
                          <div key={project.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                            <div>
                              <p className="font-medium text-secondary-500 text-sm">{project.name}</p>
                              <p className="text-xs text-gray-600">{project.client} • {project.location} • {project.year}</p>
                              {project.value && <p className="text-xs text-green-600 mt-1">₹{project.value}</p>}
                            </div>
                            <button
                              onClick={() => removeProject(project.id)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Project Form */}
                    {!showProjectForm ? (
                      <button
                        type="button"
                        onClick={() => setShowProjectForm(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-secondary-500 transition-colors group"
                      >
                        <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mx-auto mb-2 group-hover:text-secondary-500" />
                        <p className="text-xs sm:text-sm text-gray-600 font-medium group-hover:text-secondary-500">Add Past Project</p>
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border-2 border-secondary-200 rounded-lg space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-secondary-500">Add Project</h4>
                          <button
                            onClick={() => {
                              setShowProjectForm(false);
                              setCurrentProject({});
                            }}
                            className="p-1 hover:bg-gray-200 rounded-full"
                          >
                            <X className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Project Name
                            </label>
                            <input
                              type="text"
                              value={currentProject.name || ''}
                              onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., Luxury Villa"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Client Name
                            </label>
                            <input
                              type="text"
                              value={currentProject.client || ''}
                              onChange={(e) => setCurrentProject({ ...currentProject, client: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., Rajesh Constructions"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              value={currentProject.location || ''}
                              onChange={(e) => setCurrentProject({ ...currentProject, location: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., Mumbai"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Year
                            </label>
                            <input
                              type="text"
                              value={currentProject.year || ''}
                              onChange={(e) => setCurrentProject({ ...currentProject, year: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., 2023"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Project Value (₹)
                            </label>
                            <input
                              type="text"
                              value={currentProject.value || ''}
                              onChange={(e) => setCurrentProject({ ...currentProject, value: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                              placeholder="e.g., 50L"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={currentProject.description || ''}
                            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500"
                            placeholder="Brief description of the project"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Project Images (Optional)
                          </label>
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                setCurrentProject({ ...currentProject, images: Array.from(files) });
                              }
                            }}
                            className="w-full text-sm"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={addProject}
                            className="px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600"
                          >
                            Add Project
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-primary-50 rounded-lg p-4 mt-6">
                    <h3 className="text-sm sm:text-base font-semibold text-secondary-500 mb-3">Registration Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-secondary-500 ml-2">{formData.fullName || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium text-secondary-500 ml-2">{formData.companyName || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-secondary-500 ml-2">
                          {formData.city ? `${formData.city}, ${formData.state}` : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium text-secondary-500 ml-2">{formData.experience || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Certifications:</span>
                        <span className="font-medium text-secondary-500 ml-2">{certifications.length} added</span>
                      </div>
                      <div className="flex justify-between sm:block p-2 bg-white rounded-lg">
                        <span className="text-gray-600">Projects:</span>
                        <span className="font-medium text-secondary-500 ml-2">{projects.length} added</span>
                      </div>
                    </div>
                  </div>

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
                      <a href="#" className="text-secondary-500 hover:underline mx-1">Privacy Policy</a>
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
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-secondary-500 text-white rounded-lg text-sm sm:text-base hover:bg-secondary-600 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg text-sm sm:text-base hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Help Text */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Need help? Contact our support team at <span className="text-secondary-500 font-medium">support@casaterminal.com</span>
        </p>
      </div>
    </div>
  );
};

export default ContractorRegistration;