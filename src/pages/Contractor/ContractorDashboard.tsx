import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hammer, 
  Star, 
  Clock, 
  Calendar,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Shield,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  Percent,
  Target,
  MessageCircle,
  Zap,
  Download,
  Search,
  Hash,
  Info,
  Upload,
  Package,
  Camera,
  FileText,
  User,
  ThumbsUp,
  Gift,
  Gem,
  MapPin,
  Image as ImageIcon,
  XCircle as XCircleIcon,
  CheckCircle as CheckCircleIcon,
  File,
  FileText as FileTextIcon,
  FileVideo,
  FileAudio} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// ==================== TYPES ====================

interface Contractor {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
  suspensionReason?: string;
  email: string;
  avatar: string | null;
  phone: string;
  company: string;
  gst: string;
  verified: boolean;
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  website?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface Service {
  id: number;
  name: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  price: string;
  priceMin: number;
  priceMax: number;
  bookings: number;
  rating: number;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt?: string;
  features?: string[];
  duration?: string;
  warranty?: string;
  tags?: string[];
}

interface Review {
  id: number;
  user: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  serviceId: number;
  helpful?: number;
  images?: string[];
  response?: {
    message: string;
    date: string;
  };
}

interface Notification {
  id: number;
  type: 'service_approved' | 'service_rejected' | 'booking_pending' | 'booking_confirmed' | 'booking_completed' | 'membership' | 'account' | 'payment' | 'document';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionable: boolean;
  actionUrl?: string;
  image?: string;
}

interface BookingInquiry {
  id: number;
  serviceId: number;
  serviceName: string;
  customerName: string;
  customerId: string;
  customerEmail?: string;
  customerPhone?: string;
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  address: string;
  verifiedByAdmin: boolean;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  attachments?: string[];
}

interface DashboardStats {
  totalServices: number;
  activeBookings: number;
  completedServices: number;
  totalRevenue: number;
  serviceApprovalRate: number;
  fulfillmentRate: number;
  averageRating: number;
  totalReviews: number;
  pendingApprovals: number;
  monthlyGrowth: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  monthlyEarnings: number;
  topServices: Array<{
    id: number;
    name: string;
    bookings: number;
    revenue: number;
  }>;
}

type AuthStatus = 'loading' | 'approved' | 'pending' | 'rejected' | 'suspended';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
}

// ==================== CUSTOM HOOKS ====================

const useAuth = () => {
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    const checkAuth = async () => {
      const mockContractor: Contractor = {
        id: 'XXXX-2024-001',
        name: 'XXxx YYY',
        status: 'approved',
        suspensionReason: '',
        email: 'xxxx.yyy@example.com',
        avatar: null,
        phone: '+91 98765 43210',
        company: 'XXxx Construction Pvt Ltd',
        gst: '27AAAAA0000A1Z5',
        verified: true,
        joinDate: '2024-01-15',
        address: '123, Green Park',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        website: 'https://xxxxconstruction.com',
        social: {
          facebook: 'https://facebook.com/xxxx',
          twitter: 'https://twitter.com/xxxx',
          instagram: 'https://instagram.com/xxxx',
          linkedin: 'https://linkedin.com/company/xxxx'
        }
      };

      setContractor(mockContractor);
      setAuthStatus(mockContractor.status);
    };

    checkAuth();
  }, []);

  return { contractor, authStatus };
};

const useServices = () => {
  const [services, setServices] = useState<Service[]>([
    { 
      id: 1, 
      name: 'Plumbing Service', 
      category: 'Plumbing', 
      status: 'approved', 
      price: '₹5,000 - ₹15,000',
      priceMin: 5000,
      priceMax: 15000,
      bookings: 23,
      rating: 4.8,
      description: 'Professional plumbing services for residential and commercial properties. Includes pipe repair, fixture installation, and emergency services.',
      images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500'],
      createdAt: '2024-01-20',
      updatedAt: '2024-03-15',
      features: ['24/7 Emergency Service', 'Licensed Plumbers', 'Free Estimate'],
      duration: '2-4 hours',
      warranty: '6 months',
      tags: ['plumbing', 'repair', 'installation']
    },
    { 
      id: 2, 
      name: 'Electrical Solutions', 
      category: 'Electrical', 
      status: 'pending', 
      price: '₹3,000 - ₹8,000',
      priceMin: 3000,
      priceMax: 8000,
      bookings: 0,
      rating: 0,
      description: 'Complete electrical wiring and installation services for homes and offices.',
      images: [],
      createdAt: '2024-03-01',
      features: ['Certified Electricians', 'Safety Guaranteed', 'Modern Equipment'],
      duration: '1-3 hours',
      warranty: '3 months',
      tags: ['electrical', 'wiring', 'installation']
    },
    { 
      id: 3, 
      name: 'HVAC Systems', 
      category: 'HVAC', 
      status: 'approved', 
      price: '₹10,000 - ₹25,000',
      priceMin: 10000,
      priceMax: 25000,
      bookings: 15,
      rating: 4.9,
      description: 'Heating, ventilation, and air conditioning installation and repair services.',
      images: ['https://images.unsplash.com/photo-1631771811071-8c2b92b5c2e0?w=500'],
      createdAt: '2024-02-05',
      updatedAt: '2024-03-10',
      features: ['Energy Efficient', 'Smart Thermostat Compatible', 'Maintenance Plans'],
      duration: '3-6 hours',
      warranty: '1 year',
      tags: ['hvac', 'ac', 'heating']
    },
    { 
      id: 4, 
      name: 'Renovation Works', 
      category: 'Construction', 
      status: 'rejected', 
      price: '₹50,000+',
      priceMin: 50000,
      priceMax: 500000,
      bookings: 0,
      rating: 0,
      description: 'Complete building renovation and remodeling services for residential and commercial properties.',
      images: [],
      createdAt: '2024-02-28',
      features: ['Design Consultation', 'Project Management', 'Quality Materials'],
      duration: '2-8 weeks',
      warranty: '2 years',
      tags: ['renovation', 'construction', 'remodeling']
    },
  ]);

  return { services, setServices };
};

const useBookings = () => {
  const [bookings, setBookings] = useState<BookingInquiry[]>([
    {
      id: 1,
      serviceId: 1,
      serviceName: 'Plumbing Service',
      customerName: 'ABC Constructions',
      customerId: 'CUST-001',
      customerEmail: 'contact@abcconstructions.com',
      customerPhone: '+91 98765 12345',
      date: '2024-03-20',
      timeSlot: '10:00 AM - 12:00 PM',
      status: 'confirmed',
      amount: 12000,
      address: '123, Green Park, New Delhi',
      verifiedByAdmin: true,
      createdAt: '2024-03-15',
      updatedAt: '2024-03-16',
      notes: 'Need urgent plumbing repair for office building'
    },
    {
      id: 2,
      serviceId: 3,
      serviceName: 'HVAC Systems',
      customerName: 'XYZ Valley Project',
      customerId: 'CUST-002',
      customerEmail: 'info@xyzvalley.com',
      customerPhone: '+91 98765 54321',
      date: '2024-03-22',
      timeSlot: '2:00 PM - 4:00 PM',
      status: 'pending',
      amount: 18000,
      address: '456, Lake View, Mumbai',
      verifiedByAdmin: true,
      createdAt: '2024-03-17',
      notes: 'AC installation for new office space'
    },
    {
      id: 3,
      serviceId: 1,
      serviceName: 'Plumbing Service',
      customerName: 'City Hospital',
      customerId: 'CUST-003',
      customerEmail: 'facility@cityhospital.com',
      customerPhone: '+91 98765 67890',
      date: '2024-03-18',
      timeSlot: '9:00 AM - 5:00 PM',
      status: 'completed',
      amount: 15000,
      address: '789, Hill View, Bangalore',
      verifiedByAdmin: true,
      createdAt: '2024-03-10',
      updatedAt: '2024-03-19',
      notes: 'Complete bathroom renovation'
    }
  ]);

  return { bookings, setBookings };
};

const useDashboardStats = (services: Service[], bookings: BookingInquiry[]) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeBookings: 0,
    completedServices: 0,
    totalRevenue: 0,
    serviceApprovalRate: 0,
    fulfillmentRate: 0,
    averageRating: 0,
    totalReviews: 0,
    pendingApprovals: 0,
    monthlyGrowth: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    topServices: []
  });

  useEffect(() => {
    if (services.length > 0) {
      const totalServices = services.length;
      const approvedServices = services.filter(s => s.status === 'approved').length;
      const serviceApprovalRate = totalServices > 0 ? (approvedServices / totalServices) * 100 : 0;
      const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
      const completedServices = bookings.filter(b => b.status === 'completed').length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
      const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.amount, 0);
      const fulfillmentRate = bookings.length > 0 ? (completedServices / bookings.length) * 100 : 0;

      // Calculate top services
      const serviceBookings = bookings.reduce((acc, booking) => {
        if (!acc[booking.serviceId]) {
          acc[booking.serviceId] = { bookings: 0, revenue: 0 };
        }
        acc[booking.serviceId].bookings += 1;
        acc[booking.serviceId].revenue += booking.amount;
        return acc;
      }, {} as Record<number, { bookings: number; revenue: number }>);

      const topServices = Object.entries(serviceBookings)
        .map(([serviceId, data]) => ({
          id: parseInt(serviceId),
          name: services.find(s => s.id === parseInt(serviceId))?.name || 'Unknown',
          bookings: data.bookings,
          revenue: data.revenue
        }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      setStats({
        totalServices,
        activeBookings,
        completedServices,
        totalRevenue,
        serviceApprovalRate: Math.round(serviceApprovalRate),
        fulfillmentRate: Math.round(fulfillmentRate),
        averageRating: 4.8,
        totalReviews: 124,
        pendingApprovals: services.filter(s => s.status === 'pending').length,
        monthlyGrowth: 15,
        pendingBookings,
        cancelledBookings,
        totalEarnings: totalRevenue,
        monthlyEarnings: Math.round(totalRevenue * 0.3), // 30% of total as monthly
        topServices
      });
    }
  }, [services, bookings]);

  return stats;
};

// ==================== CUSTOM FILE UPLOAD HOOK ====================

const useFileUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = async (file: File) => {
    const id = Math.random().toString(36).substring(7);
    const fileType = file.type.split('/')[0] as 'image' | 'video' | 'audio' | 'other';
    const url = URL.createObjectURL(file);

    const newFile: UploadedFile = {
      id,
      file,
      url,
      progress: 0,
      status: 'uploading',
      type: fileType === 'image' || fileType === 'video' || fileType === 'audio' ? fileType : 'document'
    };

    setFiles(prev => [...prev, newFile]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev =>
        prev.map(f =>
          f.id === id ? { ...f, progress: i } : f
        )
      );
    }

    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;
    setFiles(prev =>
      prev.map(f =>
        f.id === id ? { ...f, status: success ? 'success' : 'error' } : f
      )
    );

    return id;
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.url) {
        URL.revokeObjectURL(file.url);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const retryFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file) {
      removeFile(id);
      uploadFile(file.file);
    }
  };

  const clearAll = () => {
    files.forEach(file => {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    });
    setFiles([]);
  };

  return {
    files,
    isDragging,
    setIsDragging,
    uploadFile,
    removeFile,
    retryFile,
    clearAll
  };
};

// ==================== COMPONENTS ====================

// File Upload Component
interface FileUploadProps {
  onUpload?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/*', 'application/pdf'],
  className = ''
}) => {
  const { files, isDragging, setIsDragging, uploadFile, removeFile, retryFile, clearAll } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await handleFiles(selectedFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is ${maxSize}MB`);
        return false;
      }
      
      // Check file type
      const fileType = file.type.split('/')[0];
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType === type.split('/')[0];
        }
        return file.type === type;
      });
      
      if (!isValidType) {
        alert(`File ${file.name} type is not accepted`);
        return false;
      }
      
      return true;
    });

    if (files.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    const uploadedIds = await Promise.all(
      validFiles.map(file => uploadFile(file))
    );

    const uploadedFiles = files.filter(f => uploadedIds.includes(f.id));
    onUpload?.(uploadedFiles);
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'document': return <FileTextIcon className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'video': return <FileVideo className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'audio': return <FileAudio className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: return <File className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-secondary-500 bg-secondary-50' 
            : 'border-gray-300 hover:border-secondary-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="text-center">
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            {isDragging ? 'Drop files here' : 'Click or drag files to upload'}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Max {maxFiles} files, up to {maxSize}MB each
          </p>
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
            Supported: {acceptedTypes.join(', ')}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-medium text-gray-700">
              Uploaded Files ({files.length})
            </h4>
            <button
              onClick={clearAll}
              className="text-xs sm:text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {file.type === 'image' && file.url ? (
                    <img
                      src={file.url}
                      alt={file.file.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {formatFileSize(file.file.size)}
                  </p>
                </div>

                {/* Progress/Status */}
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <div className="w-16 sm:w-20">
                      <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className="h-full bg-secondary-500"
                        />
                      </div>
                    </div>
                  )}
                  
                  {file.status === 'success' && (
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                  
                  {file.status === 'error' && (
                    <button
                      onClick={() => retryFile(file.id)}
                      className="text-red-500 hover:text-red-600"
                      title="Retry"
                    >
                      <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}

                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Remove"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Status Page Component
interface StatusPageProps {
  status: AuthStatus;
  reason?: string;
}

const StatusPage = ({ status, reason }: StatusPageProps) => {
  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Application Under Review',
      message: 'Your contractor application is being verified by our team. This usually takes 2-3 business days.',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    rejected: {
      icon: XCircle,
      title: 'Application Not Approved',
      message: reason || 'Your application does not meet our current requirements. Please contact support for more information.',
      color: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    suspended: {
      icon: AlertCircle,
      title: 'Account Suspended',
      message: reason || 'Your account has been suspended. Please contact support for assistance.',
      color: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  };

  if (status === 'loading' || status === 'approved') return null;
  
  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 w-full max-w-[90%] sm:max-w-md text-center"
      >
        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 md:mb-6`}>
          <config.icon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${config.color}`} />
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-500 mb-2 sm:mb-3">{config.title}</h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 sm:mb-5 md:mb-6 px-2">{config.message}</p>
        {status === 'rejected' || status === 'suspended' ? (
          <button className="w-full sm:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors text-xs sm:text-sm md:text-base">
            Contact Support
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            <span>We'll notify you via email once verified</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};



// Sidebar Component
interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  contractor: Contractor | null;
}

const Sidebar = ({ activeItem, setActiveItem, isMobileMenuOpen, setIsMobileMenuOpen, contractor }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'My Services', icon: Hammer, hasAdd: true },
    { id: 'bookings', label: 'Booking Inquiries', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reviews', label: 'Ratings & Reviews', icon: Star },
    { id: 'membership', label: 'Membership', icon: Crown, placeholder: true },
    { id: 'notifications', label: 'Notification Center', icon: Bell },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 sm:p-4 lg:p-5 border-b border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3">
          {contractor?.avatar ? (
            <img
              src={contractor.avatar}
              alt={contractor.name}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg shadow-md flex-shrink-0">
              {contractor?.name.split(' ').map(n => n[0]).join('') || 'XX'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-secondary-500 truncate text-xs sm:text-sm lg:text-base">{contractor?.name || 'XXxx YYY'}</h3>
            <p className="text-[10px] sm:text-xs text-gray-500 truncate flex items-center gap-1">
              <Hash className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
              <span className="truncate">{contractor?.id || 'XXXX-000-000'}</span>
            </p>
            {contractor?.verified && (
              <span className="inline-flex items-center gap-1 text-[8px] sm:text-xs text-green-600 bg-green-50 px-1.5 sm:px-2 py-0.5 rounded-full mt-1">
                <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                <span className="hidden xs:inline">Verified</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-0.5 sm:mb-1">
            <button
              onClick={() => {
                setActiveItem(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm transition-all ${
                activeItem === item.id
                  ? 'bg-gradient-to-r from-secondary-500 to-primary-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-primary-100 hover:text-secondary-500'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.hasAdd && (
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              )}
              {item.placeholder && (
                <span className="text-[8px] sm:text-xs px-1 sm:px-1.5 py-0.5 bg-gray-200 rounded-full flex-shrink-0">Soon</span>
              )}
            </button>
          </div>
        ))}
      </nav>

      <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56 xl:w-64 2xl:w-72 bg-white shadow-xl h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        {isMobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 flex"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-64 sm:w-72 bg-white h-full overflow-y-auto shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Dashboard Overview Component
const DashboardOverview = ({ stats }: { stats: DashboardStats }) => {
  const overviewStats = [
    { icon: Hammer, label: 'Total Services', value: stats.totalServices.toString(), change: '+2', color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { icon: Calendar, label: 'Active Bookings', value: stats.activeBookings.toString(), change: '+3', color: 'text-green-500', bgColor: 'bg-green-100' },
    { icon: CheckCircle, label: 'Completed', value: stats.completedServices.toString(), change: '+5', color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { icon: DollarSign, label: 'Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, change: '+15%', color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
    { icon: Percent, label: 'Approval Rate', value: `${stats.serviceApprovalRate}%`, change: '+5%', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { icon: Target, label: 'Fulfillment', value: `${stats.fulfillmentRate}%`, change: '+3%', color: 'text-indigo-500', bgColor: 'bg-indigo-100' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
        {overviewStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-1 sm:mb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${stat.color}`} />
              </div>
              <span className="text-[8px] sm:text-xs font-medium text-green-600 bg-green-100 px-1 sm:px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-secondary-500 truncate">{stat.value}</div>
            <div className="text-[8px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1 truncate">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-secondary-500 mb-3 sm:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { icon: Plus, label: 'Add Service', color: 'bg-blue-500', onClick: () => {} },
              { icon: Calendar, label: 'View Bookings', color: 'bg-green-500', onClick: () => {} },
              { icon: TrendingUp, label: 'Analytics', color: 'bg-purple-500', onClick: () => {} },
              { icon: Settings, label: 'Settings', color: 'bg-orange-500', onClick: () => {} }
            ].map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-all"
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[8px] sm:text-xs font-medium text-gray-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-secondary-500 mb-3 sm:mb-4">Performance</h2>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                <span className="text-gray-600">Approval Rate</span>
                <span className="font-medium text-secondary-500">{stats.serviceApprovalRate}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.serviceApprovalRate}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                <span className="text-gray-600">Fulfillment</span>
                <span className="font-medium text-secondary-500">{stats.fulfillmentRate}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.fulfillmentRate}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
        <h2 className="text-sm sm:text-base lg:text-lg font-bold text-secondary-500 mb-3 sm:mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-800">New booking received for Plumbing Service</p>
                <p className="text-[10px] sm:text-xs text-gray-500">5 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Services Management Component
const ServicesManagement = ({ services, setServices, contractor }: { services: Service[], setServices: any, contractor: Contractor | null }) => {
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(service => {
    if (filter !== 'all' && service.status !== filter) return false;
    if (selectedCategory !== 'all' && service.category !== selectedCategory) return false;
    if (searchTerm && !service.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: Service['status']) => {
    const config = {
      approved: { bg: 'bg-green-100', text: 'text-green-600', label: 'Approved', icon: CheckCircle },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Pending', icon: Clock },
      rejected: { bg: 'bg-red-100', text: 'text-red-600', label: 'Rejected', icon: XCircle }
    };
    const style = config[status];
    const Icon = style.icon;
    return (
      <span className={`inline-flex items-center gap-1 text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${style.bg} ${style.text}`}>
        <Icon className="w-2 h-2 sm:w-3 sm:h-3" />
        <span className="hidden xs:inline">{style.label}</span>
      </span>
    );
  };

  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">My Services</h2>
        <button
          onClick={() => setShowAddService(true)}
          className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:from-secondary-600 hover:to-primary-600 transition-all shadow-md text-xs sm:text-sm"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Add New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {(['all', 'approved', 'pending', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-secondary-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All' : cat}
                </option>
              ))}
            </select>
            
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 sm:pl-9 pr-2 sm:pr-3 py-1 sm:py-1.5 text-[10px] sm:text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 w-24 sm:w-32"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {filteredServices.map((service) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 3 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h3 className="font-semibold text-secondary-500 text-xs sm:text-sm lg:text-base truncate">{service.name}</h3>
                  {getStatusBadge(service.status)}
                  {service.status === 'approved' && service.rating > 0 && (
                    <span className="inline-flex items-center gap-1 text-[8px] sm:text-xs bg-blue-100 text-blue-600 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                      <span className="hidden xs:inline">{service.rating}</span>
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 xs:grid-cols-3 gap-1 sm:gap-2 text-[8px] sm:text-xs">
                  <p className="text-gray-600 flex items-center gap-1">
                    <Briefcase className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{service.category}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <DollarSign className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{service.price}</span>
                  </p>
                  {service.status === 'approved' && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                      <span className="truncate">{service.bookings}</span>
                    </p>
                  )}
                </div>
                
                {service.images && service.images.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <ImageIcon className="w-2 h-2 sm:w-3 sm:h-3 text-gray-400" />
                    <span className="text-[8px] sm:text-xs text-gray-500">
                      {service.images.length} image{service.images.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                
                {service.status === 'rejected' && (
                  <p className="text-[8px] sm:text-xs text-red-500 mt-1 sm:mt-2 flex items-center gap-1">
                    <AlertCircle className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">Resubmit to activate</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 self-end xs:self-center">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredServices.length === 0 && (
          <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-gray-500">No services found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      <AnimatePresence>
        {(showAddService || editingService) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
            onClick={() => {
              setShowAddService(false);
              setEditingService(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-base sm:text-lg font-bold text-secondary-500 mb-3 sm:mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 p-2 sm:p-3 bg-primary-50 rounded-lg">
                <Info className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-primary-500" />
                New services need admin approval. Your ID ({contractor?.id}) will be attached.
              </p>
              
              <form className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Plumbing Service"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.name}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select 
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.category}
                      required
                    >
                      <option value="">Select Category</option>
                      <option>Plumbing</option>
                      <option>Electrical</option>
                      <option>HVAC</option>
                      <option>Construction</option>
                      <option>Painting</option>
                      <option>Roofing</option>
                      <option>Flooring</option>
                      <option>Landscaping</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Min Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="5000"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.priceMin}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="15000"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.priceMax}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    placeholder="Describe your service in detail..."
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                    defaultValue={editingService?.description}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                    Service Features (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="24/7 Support, Free Estimate, Licensed"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                    defaultValue={editingService?.features?.join(', ')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Duration (e.g., 2-4 hours)
                    </label>
                    <input
                      type="text"
                      placeholder="2-4 hours"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.duration}
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                      Warranty
                    </label>
                    <input
                      type="text"
                      placeholder="6 months"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      defaultValue={editingService?.warranty}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">
                    Service Images
                  </label>
                  <FileUpload
                    maxFiles={5}
                    maxSize={5}
                    acceptedTypes={['image/*']}
                    onUpload={(files) => {
                      console.log('Uploaded files:', files);
                    }}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3 sm:pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddService(false);
                      setEditingService(null);
                    }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:from-secondary-600 hover:to-primary-600 transition-all"
                  >
                    {editingService ? 'Save Changes' : 'Submit for Approval'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Bookings Component
const BookingsManagement = ({ bookings }: { bookings: BookingInquiry[] }) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingInquiry | null>(null);

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const handleAcceptBooking = (bookingId: number) => {
    console.log('Accepting booking:', bookingId);
    // Implement accept logic
  };

  const handleRejectBooking = (bookingId: number) => {
    console.log('Rejecting booking:', bookingId);
    // Implement reject logic
  };

  const handleViewDetails = (booking: BookingInquiry) => {
    setSelectedBooking(booking);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">Booking Inquiries</h2>
      
      <p className="text-xs sm:text-sm text-gray-600 bg-primary-50 p-2 sm:p-3 rounded-lg">
        <Info className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 text-primary-500" />
        All bookings are verified by admin first.
      </p>

      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {['all', 'pending', 'confirmed', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg text-[10px] sm:text-xs lg:text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-secondary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredBookings.map((booking) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <h3 className="font-semibold text-secondary-500 text-xs sm:text-sm lg:text-base truncate">{booking.serviceName}</h3>
                  <span className={`text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 sm:gap-2 text-[8px] sm:text-xs">
                  <p className="text-gray-600 flex items-center gap-1">
                    <User className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{booking.customerName}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Calendar className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{booking.date}</span>
                  </p>
                  <p className="text-gray-600 flex items-center gap-1 xs:col-span-2">
                    <MapPin className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                    <span className="truncate">{booking.address}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-1 sm:gap-2 self-end xs:self-center">
                <button
                  onClick={() => handleViewDetails(booking)}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-xs bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-all"
                >
                  View
                </button>
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAcceptBooking(booking.id)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-xs bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking.id)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-4 sm:p-5 md:p-6 w-full max-w-[95%] sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-secondary-500">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Service
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.serviceName}</p>
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <span className={`inline-block text-[8px] sm:text-xs px-2 py-1 rounded-full ${
                      selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Customer Name
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Customer ID
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.customerId}</p>
                  </div>
                </div>

                {selectedBooking.customerEmail && (
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.customerEmail}</p>
                  </div>
                )}

                {selectedBooking.customerPhone && (
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.customerPhone}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Date
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Time Slot
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.timeSlot}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                    Address
                  </label>
                  <p className="text-xs sm:text-sm text-gray-900">{selectedBooking.address}</p>
                </div>

                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <p className="text-xs sm:text-sm font-semibold text-secondary-500">
                    ₹{selectedBooking.amount.toLocaleString()}
                  </p>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-500 mb-1">
                      Notes
                    </label>
                    <p className="text-xs sm:text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleAcceptBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          handleRejectBooking(selectedBooking.id);
                          setSelectedBooking(null);
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  const topServices = [
    { name: 'Plumbing', bookings: 45, revenue: '₹2.25L', trend: '+25%' },
    { name: 'Electrical', bookings: 32, revenue: '₹1.60L', trend: '+15%' },
    { name: 'HVAC', bookings: 28, revenue: '₹3.50L', trend: '+40%' },
  ];

  const lowServices = [
    { name: 'Renovation', bookings: 5, revenue: '₹2.50L', trend: '-10%' },
    { name: 'Painting', bookings: 8, revenue: '₹0.40L', trend: '-5%' },
  ];

  const revenueData = {
    week: [45, 52, 48, 58, 62, 55, 68],
    month: [185, 210, 195, 225, 240, 260, 280, 295, 310, 325, 340, 360],
    year: [850, 920, 880, 950, 1020, 1150, 1250, 1380, 1450, 1520, 1600, 1750]
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">Analytics</h2>
        <div className="flex gap-1 sm:gap-2">
          {(['week', 'month', 'year'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                timeframe === t
                  ? 'bg-secondary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'week' ? 'W' : t === 'month' ? 'M' : 'Y'}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-secondary-500">Revenue Trend</h3>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
          </button>
        </div>
        
        <div className="h-32 sm:h-40 lg:h-48 xl:h-56 flex items-end justify-between gap-0.5 sm:gap-1">
          {revenueData[timeframe].map((value, i) => {
            const max = Math.max(...revenueData[timeframe]);
            const height = (value / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-gradient-to-t from-secondary-500 to-primary-500 rounded-t group-hover:from-secondary-600 group-hover:to-primary-600 transition-all"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[6px] sm:text-[8px] lg:text-xs text-gray-600">
                  {timeframe === 'week' ? `D${i+1}` : timeframe === 'month' ? `W${i+1}` : `M${i+1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top vs Low Performing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        {/* Top Performing */}
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-500" />
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-secondary-500">Top Services</h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {topServices.map((service, i) => (
              <div key={i} className="p-2 sm:p-3 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-secondary-500 text-[10px] sm:text-xs truncate">{service.name}</h4>
                  <span className="text-[8px] sm:text-xs text-green-600 bg-green-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                    {service.trend}
                  </span>
                </div>
                <div className="flex justify-between text-[8px] sm:text-xs">
                  <span className="text-gray-600">{service.bookings} bks</span>
                  <span className="font-medium text-secondary-500">{service.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Performing */}
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-5 shadow-md">
          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-500" />
            <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-secondary-500">Low Services</h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {lowServices.map((service, i) => (
              <div key={i} className="p-2 sm:p-3 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-secondary-500 text-[10px] sm:text-xs truncate">{service.name}</h4>
                  <span className="text-[8px] sm:text-xs text-red-600 bg-red-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                    {service.trend}
                  </span>
                </div>
                <div className="flex justify-between text-[8px] sm:text-xs">
                  <span className="text-gray-600">{service.bookings} bks</span>
                  <span className="font-medium text-secondary-500">{service.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {[
          { label: 'Avg Rating', value: '4.8★', change: '+0.3', icon: Star },
          { label: 'Reviews', value: '124', change: '+12', icon: MessageCircle },
          { label: 'Conversion', value: '68%', change: '+5%', icon: Target },
          { label: 'Response', value: '95%', change: '+2%', icon: Zap }
        ].map((metric, i) => {
          const IconComponent = metric.icon;
          return (
            <div key={i} className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-md">
              <div className="flex items-center justify-between mb-1">
                <IconComponent className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gray-400" />
                <span className="text-[6px] sm:text-[8px] lg:text-xs text-green-600">{metric.change}</span>
              </div>
              <div className="text-xs sm:text-sm lg:text-base font-bold text-secondary-500">{metric.value}</div>
              <div className="text-[6px] sm:text-[8px] lg:text-xs text-gray-600 truncate">{metric.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Ratings & Reviews Component
const RatingsReviews = () => {
  const [filter, setFilter] = useState<number | 'all'>('all');
  
  const reviews: Review[] = [
    { id: 1, user: 'Rajesh K', rating: 5, comment: 'Excellent work! Highly recommended.', date: '2024-03-15', service: 'Plumbing', serviceId: 1, helpful: 12 },
    { id: 2, user: 'Priya S', rating: 4, comment: 'Good work, slightly delayed.', date: '2024-03-14', service: 'Electrical', serviceId: 2, helpful: 8 },
    { id: 3, user: 'Amit P', rating: 5, comment: 'Very professional team.', date: '2024-03-13', service: 'HVAC', serviceId: 3, helpful: 15 },
  ];

  const filteredReviews = filter === 'all' ? reviews : reviews.filter(r => r.rating === filter);
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const handleHelpful = (reviewId: number) => {
    console.log('Marked as helpful:', reviewId);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">Reviews</h2>
        <div className="flex items-center gap-1 sm:gap-2 bg-yellow-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-secondary-500 text-xs sm:text-sm">{averageRating.toFixed(1)}</span>
          <span className="text-[8px] sm:text-xs text-gray-600">({reviews.length})</span>
        </div>
      </div>

      {/* Rating Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-secondary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter(rating)}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-xs font-medium transition-all flex items-center gap-1 ${
                filter === rating
                  ? 'bg-secondary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {rating} <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review.id}
            whileHover={{ x: 3 }}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md"
          >
            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                  {review.user.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-secondary-500 text-xs sm:text-sm">{review.user}</h3>
                  <p className="text-[8px] sm:text-xs text-gray-500">{review.service}</p>
                </div>
              </div>
              <span className="text-[8px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded-full self-start">
                {review.date}
              </span>
            </div>
            
            <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 ${
                    i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <p className="text-[8px] sm:text-xs text-gray-600 mb-2">"{review.comment}"</p>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-1 sm:gap-2 text-gray-500 hover:text-secondary-500 transition-colors"
              >
                <ThumbsUp className="w-2 h-2 sm:w-3 sm:h-3" />
                <span className="text-[6px] sm:text-[8px]">Helpful ({review.helpful || 0})</span>
              </button>
              <p className="text-[6px] sm:text-[8px] text-gray-400 italic">Cannot reply</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Notifications Component
const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'service_approved', title: 'Service Approved', message: 'Your service "Plumbing" has been approved', time: '2h', read: false, actionable: true },
    { id: 2, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'New booking confirmed for Electrical', time: '5h', read: false, actionable: true },
    { id: 3, type: 'membership', title: 'Membership Update', message: 'Premium features coming soon!', time: '1d', read: true, actionable: false },
    { id: 4, type: 'account', title: 'Profile Verified', message: 'Your profile is verified', time: '2d', read: true, actionable: false },
  ]);

  const getIcon = (type: Notification['type']) => {
    switch(type) {
      case 'service_approved': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-500" />;
      case 'service_rejected': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-red-500" />;
      case 'booking_pending': return <Clock className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-500" />;
      case 'booking_confirmed': return <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-500" />;
      case 'booking_completed': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-500" />;
      case 'membership': return <Crown className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-500" />;
      case 'account': return <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-purple-500" />;
      default: return <Bell className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleAction = (notification: Notification) => {
    console.log('Action for:', notification);
    markAsRead(notification.id);
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="text-[10px] sm:text-xs text-secondary-500 hover:text-primary-600"
        >
          Mark all read
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            whileHover={{ x: 3 }}
            className={`bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all ${
              !notification.read ? 'border-l-4 border-secondary-500' : ''
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 mb-1">
                  <h3 className="font-semibold text-secondary-500 text-[10px] sm:text-xs truncate">
                    {notification.title}
                  </h3>
                  <span className="text-[6px] sm:text-[8px] text-gray-500">{notification.time}</span>
                </div>
                <p className="text-[8px] sm:text-xs text-gray-600 mb-1 sm:mb-2 truncate">{notification.message}</p>
                
                {notification.actionable && (
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => handleAction(notification)}
                      className="text-[6px] sm:text-[8px] bg-primary-50 text-primary-600 px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-primary-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-[6px] sm:text-[8px] bg-gray-50 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-gray-100"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
              
              {!notification.read && (
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary-500 rounded-full flex-shrink-0" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Account Settings Component
const AccountSettings = ({ contractor }: { contractor: Contractor | null }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(contractor?.avatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bank_details', label: 'Bank', icon: DollarSign },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'membership', label: 'Membership', icon: Crown },
    { id: 'deactivate', label: 'Deactivate', icon: AlertCircle }
  ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log('Saving profile with avatar:', avatarFile);
    // Implement save logic
  };

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-secondary-500">Settings</h2>

      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        {/* Mobile Tab Bar */}
        <div className="sm:hidden border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-[10px] font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'text-secondary-500 border-b-2 border-secondary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-secondary-500'
                }`}
              >
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tab Bar */}
        <div className="hidden sm:block border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs lg:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-secondary-500 border-b-2 border-secondary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-secondary-500 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 lg:p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 text-center sm:text-left">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto sm:mx-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-2 border-secondary-200"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl lg:text-3xl shadow-md">
                        {contractor?.name.split(' ').map(n => n[0]).join('') || 'XX'}
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-[8px] sm:text-xs text-secondary-500 hover:text-secondary-600"
                  >
                    Change Photo
                  </button>
                </div>
                
                <div className="flex-1 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={contractor?.name}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={contractor?.email}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue={contractor?.phone}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        defaultValue={contractor?.company}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">GST Number</label>
                      <input
                        type="text"
                        defaultValue={contractor?.gst}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        defaultValue={contractor?.website}
                        placeholder="https://example.com"
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        defaultValue={contractor?.city}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        defaultValue={contractor?.state}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        defaultValue={contractor?.pincode}
                        className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      rows={2}
                      defaultValue={contractor?.address}
                      className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:from-secondary-600 hover:to-primary-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'bank_details' && (
            <form className="space-y-3 sm:space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Account Holder Name</label>
                  <input type="text" defaultValue={contractor?.name} className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Bank Name</label>
                  <input type="text" defaultValue="State Bank of India" className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Account Number</label>
                  <input type="text" defaultValue="12345678901" className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Confirm Account Number</label>
                  <input type="text" defaultValue="12345678901" className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">IFSC Code</label>
                  <input type="text" defaultValue="SBIN0012345" className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-1">Account Type</label>
                  <select className="w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg">
                    <option>Savings</option>
                    <option>Current</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-lg hover:from-secondary-600 hover:to-primary-600">
                  Update Bank Details
                </button>
              </div>
            </form>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { name: 'GST Certificate', status: 'verified', date: '2024-01-20' },
                  { name: 'Business Registration', status: 'verified', date: '2024-01-20' },
                  { name: 'Insurance Certificate', status: 'pending', date: '2024-02-15' },
                  { name: 'PAN Card', status: 'pending', date: '2024-02-15' },
                ].map((doc, i) => (
                  <div key={i} className="p-3 sm:p-4 bg-primary-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-secondary-500 text-[10px] sm:text-xs">{doc.name}</p>
                        <p className="text-[8px] sm:text-xs text-gray-500">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                    <span className={`text-[8px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-[8px] sm:text-xs font-medium text-gray-700 mb-2">
                  Upload New Document
                </label>
                <FileUpload
                  maxFiles={5}
                  maxSize={10}
                  acceptedTypes={['image/*', 'application/pdf']}
                  onUpload={(files) => {
                    console.log('Uploaded documents:', files);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <Crown className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-yellow-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-secondary-500 mb-1 sm:mb-2">Premium Membership</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 mb-4 sm:mb-6">Coming soon! Get ready for exclusive features.</p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8">
                {[
                  { icon: Zap, title: 'Priority Support' },
                  { icon: Gift, title: 'Exclusive Offers' },
                  { icon: Gem, title: 'Premium Features' }
                ].map((feature, i) => (
                  <div key={i} className="p-2 sm:p-3 bg-primary-50 rounded-lg">
                    <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-500 mx-auto mb-1" />
                    <h4 className="font-medium text-secondary-500 text-[8px] sm:text-xs">{feature.title}</h4>
                  </div>
                ))}
              </div>
              
              <button className="px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          )}

          {activeTab === 'deactivate' && (
            <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto text-center">
              <div className="p-4 sm:p-5 lg:p-6 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-red-600 mb-1 sm:mb-2">Deactivate Account</h3>
                <p className="text-[8px] sm:text-xs text-gray-600 mb-3 sm:mb-4">
                  Account deactivation requires admin approval. This action cannot be undone.
                </p>
                
                <div className="bg-white p-3 sm:p-4 rounded-lg mb-3 sm:mb-4 text-left">
                  <h4 className="font-medium text-secondary-500 mb-2 text-[8px] sm:text-xs">What happens when you deactivate:</h4>
                  <ul className="text-[6px] sm:text-[8px] text-gray-600 space-y-1">
                    <li className="flex items-center gap-1 sm:gap-2">
                      <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                      Your services won't be visible to customers
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2">
                      <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                      You won't receive new booking inquiries
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2">
                      <X className="w-2 h-2 sm:w-3 sm:h-3 text-red-500" />
                      Your profile will be hidden from search
                    </li>
                    <li className="flex items-center gap-1 sm:gap-2">
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
                      Your data will be preserved for 30 days
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-2 sm:gap-3 justify-center">
                  <button className="px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                  <button className="px-3 sm:px-4 py-1 sm:py-1.5 text-[8px] sm:text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Request Deactivation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main ContractorDashboard Component
const ContractorDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { contractor, authStatus } = useAuth();
  const { services, setServices } = useServices();
  const { bookings } = useBookings();
  const stats = useDashboardStats(services, bookings);

  if (authStatus !== 'approved') {
    return <StatusPage status={authStatus} reason={contractor?.suspensionReason} />;
  }

  const renderContent = () => {
    switch(activeItem) {
      case 'dashboard':
        return <DashboardOverview stats={stats} />;
      case 'services':
        return <ServicesManagement services={services} setServices={setServices} contractor={contractor} />;
      case 'bookings':
        return <BookingsManagement bookings={bookings} />;
      case 'analytics':
        return <Analytics />;
      case 'reviews':
        return <RatingsReviews />;
      case 'membership':
        return (
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 shadow-md text-center py-6 sm:py-8 lg:py-12">
            <Crown className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-yellow-500 mx-auto mb-2 sm:mb-3 lg:mb-4" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-secondary-500 mb-1 sm:mb-2">Membership</h2>
            <p className="text-xs sm:text-sm text-gray-600">Premium features coming soon!</p>
          </div>
        );
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <AccountSettings contractor={contractor} />;
      default:
        return <DashboardOverview stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex">
      <Sidebar 
        activeItem={activeItem} 
        setActiveItem={setActiveItem}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        contractor={contractor}
      />

      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-30 border-b border-gray-200">
          <div className="px-3 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-3">
            <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4">
              <button className="relative p-1.5 sm:p-2 hover:bg-primary-100 rounded-lg transition-colors">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600" />
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 hover:bg-primary-100 rounded-lg transition-colors">
                  {contractor?.avatar ? (
                    <img
                      src={contractor.avatar}
                      alt={contractor.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                      {contractor?.name.split(' ').map(n => n[0]).join('') || 'XX'}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-secondary-500 truncate max-w-[100px] lg:max-w-[150px]">
                      {contractor?.name || 'XXxx YYY'}
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-gray-500 flex items-center gap-1">
                      <Hash className="w-2 h-2 sm:w-3 sm:h-3" />
                      <span className="truncate max-w-[80px] lg:max-w-[120px]">{contractor?.id || 'XXXX-000'}</span>
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                </button>

                <div className="absolute right-0 mt-2 w-36 sm:w-40 lg:w-48 bg-white rounded-lg shadow-xl py-1 hidden group-hover:block border border-gray-100">
                  <button className="w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[8px] sm:text-xs lg:text-sm text-gray-700 hover:bg-primary-50 hover:text-secondary-500">
                    Profile
                  </button>
                  <button className="w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[8px] sm:text-xs lg:text-sm text-gray-700 hover:bg-primary-50 hover:text-secondary-500">
                    Settings
                  </button>
                  <hr className="my-1" />
                  <button className="w-full text-left px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[8px] sm:text-xs lg:text-sm text-red-600 hover:bg-red-50">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;