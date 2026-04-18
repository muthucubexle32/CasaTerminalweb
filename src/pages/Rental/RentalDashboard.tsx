// src/pages/Rental/RentalDashboard.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, TrendingUp, Settings, LogOut, Package, X, MapPin, DollarSign, CreditCard, Search,
  Plus, Edit, Trash2, Bell, Menu, LayoutDashboard, Star, Camera, Shield, Info, ArrowLeft, ArrowRight,
  Check, Banknote, Building2, Crown, FileText, Upload, CheckCircle, XCircle, Zap, Gift, Gem
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

// ==================== TYPES ====================

interface RentalItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  images: string[];
  price: {
    daily: number;
    weekly: number;
    monthly: number;
    currency: string;
  };
  stock: number;
  available: boolean;
  rating: number;
  reviews: number;
  location: string;
  provider: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  specifications: {
    brand: string;
    model: string;
    year: number;
    condition: 'new' | 'like-new' | 'good' | 'fair';
    features: string[];
  };
}

interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  days: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

interface DashboardStats {
  totalListings: number;
  activeRentals: number;
  totalCustomers: number;
  monthlyRevenue: number;
  pendingBookings: number;
  completedRentals: number;
  averageRating: number;
  utilizationRate: number;
}

// ==================== FILE UPLOAD COMPONENT ====================

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  type: 'image' | 'document' | 'video' | 'audio' | 'other';
}

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

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev =>
        prev.map(f =>
          f.id === id ? { ...f, progress: i } : f
        )
      );
    }

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
      if (file?.url) URL.revokeObjectURL(file.url);
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
    files.forEach(file => { if (file.url) URL.revokeObjectURL(file.url); });
    setFiles([]);
  };

  return { files, isDragging, setIsDragging, uploadFile, removeFile, retryFile, clearAll };
};

const FileUpload: React.FC<{ maxFiles?: number; maxSize?: number; acceptedTypes?: string[]; onUpload?: (files: UploadedFile[]) => void }> = ({
  maxFiles = 5, maxSize = 5, acceptedTypes = ['image/*', 'application/pdf'], onUpload
}) => {
  const { files, isDragging, setIsDragging, uploadFile, removeFile, retryFile } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    await handleFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await handleFiles(selectedFiles);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds ${maxSize}MB`);
        return false;
      }
      const fileType = file.type.split('/')[0];
      const isValidType = acceptedTypes.some(type => type.endsWith('/*') ? fileType === type.split('/')[0] : file.type === type);
      if (!isValidType) { toast.error(`File type not accepted`); return false; }
      return true;
    });
    if (files.length + validFiles.length > maxFiles) { toast.error(`Max ${maxFiles} files`); return; }
    const uploadedIds = await Promise.all(validFiles.map(file => uploadFile(file)));
    const uploadedFiles = files.filter(f => uploadedIds.includes(f.id));
    onUpload?.(uploadedFiles);
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch(type) {
      case 'image': return <Camera className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${isDragging ? 'border-secondary-500 bg-secondary-50' : 'border-gray-300 hover:border-secondary-400'}`}
      >
        <input ref={fileInputRef} type="file" multiple accept={acceptedTypes.join(',')} onChange={handleFileSelect} className="hidden" />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">Click or drag files to upload</p>
        <p className="text-xs text-gray-500">Max {maxFiles} files, up to {maxSize}MB each</p>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {files.map(file => (
            <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">{getFileIcon(file.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{file.file.name}</p>
                <p className="text-[10px] text-gray-500">{(file.file.size / 1024).toFixed(1)} KB</p>
              </div>
              {file.status === 'uploading' && <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-secondary-500" style={{ width: `${file.progress}%` }} /></div>}
              {file.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {file.status === 'error' && <button onClick={() => retryFile(file.id)}><XCircle className="w-4 h-4 text-red-500" /></button>}
              <button onClick={() => removeFile(file.id)}><X className="w-3 h-3 text-gray-400" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==================== MOCK DATA ====================

const generateMockRentals = (): RentalItem[] => [
  {
    id: 'EQ-001',
    name: 'JCB 3DX Backhoe Loader',
    category: 'Heavy Equipment',
    subcategory: 'Excavator',
    images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500'],
    price: { daily: 8500, weekly: 45000, monthly: 150000, currency: '₹' },
    stock: 3,
    available: true,
    rating: 4.8,
    reviews: 124,
    location: 'Mumbai',
    provider: { id: 'PROV-001', name: 'Heavy Solutions', verified: true, rating: 4.7 },
    specifications: {
      brand: 'JCB',
      model: '3DX',
      year: 2022,
      condition: 'good',
      features: ['GPS', 'AC Cabin', 'Reverse Camera']
    }
  },
  {
    id: 'EQ-002',
    name: 'Concrete Mixer 10/7',
    category: 'Construction Tools',
    subcategory: 'Mixer',
    images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500'],
    price: { daily: 2500, weekly: 14000, monthly: 45000, currency: '₹' },
    stock: 5,
    available: true,
    rating: 4.6,
    reviews: 89,
    location: 'Delhi',
    provider: { id: 'PROV-002', name: 'Delhi Rentals', verified: true, rating: 4.5 },
    specifications: {
      brand: 'Schwing Stetter',
      model: 'CP 30',
      year: 2023,
      condition: 'new',
      features: ['Electric Start', 'Heavy Duty']
    }
  },
  {
    id: 'EQ-003',
    name: 'Scaffolding Set (100 pcs)',
    category: 'Equipment',
    subcategory: 'Scaffolding',
    images: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500'],
    price: { daily: 1200, weekly: 7000, monthly: 22000, currency: '₹' },
    stock: 8,
    available: true,
    rating: 4.7,
    reviews: 56,
    location: 'Bangalore',
    provider: { id: 'PROV-003', name: 'Bangalore Tools', verified: true, rating: 4.8 },
    specifications: {
      brand: 'Generic',
      model: 'Standard',
      year: 2023,
      condition: 'like-new',
      features: ['Galvanized', 'Quick Lock']
    }
  }
];

const generateMockBookings = (): Booking[] => [
  {
    id: 'BK-001',
    equipmentId: 'EQ-001',
    equipmentName: 'JCB 3DX Backhoe Loader',
    customerId: 'CUST-001',
    customerName: 'Infra Projects Ltd',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    days: 5,
    totalAmount: 42500,
    status: 'active',
    paymentStatus: 'paid',
    address: 'Site Location A, Mumbai',
    notes: 'Excavation work for foundation',
    createdAt: '2024-03-10',
    updatedAt: '2024-03-15'
  },
  {
    id: 'BK-002',
    equipmentId: 'EQ-002',
    equipmentName: 'Concrete Mixer 10/7',
    customerId: 'CUST-002',
    customerName: 'Urban Developers',
    startDate: '2024-03-18',
    endDate: '2024-03-21',
    days: 3,
    totalAmount: 7500,
    status: 'active',
    paymentStatus: 'paid',
    address: 'Construction Site B, Delhi',
    createdAt: '2024-03-12'
  },
  {
    id: 'BK-003',
    equipmentId: 'EQ-003',
    equipmentName: 'Scaffolding Set (100 pcs)',
    customerId: 'CUST-003',
    customerName: 'Highrise Constructions',
    startDate: '2024-03-22',
    endDate: '2024-03-29',
    days: 7,
    totalAmount: 8400,
    status: 'confirmed',
    paymentStatus: 'pending',
    address: 'Project Site C, Bangalore',
    notes: 'Exterior painting work',
    createdAt: '2024-03-14'
  }
];

// ==================== MODAL COMPONENT ====================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full ${sizes[size]} relative`}
          >
            {title && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-secondary-500">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ==================== BOOKING FORM COMPONENT ====================

interface BookingFormProps {
  equipment: RentalItem;
  onSubmit: (booking: any) => void;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ equipment, onSubmit, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    customerId: `CUST-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    customerName: '',
    startDate: '',
    endDate: '',
    days: 1,
    address: '',
    notes: '',
    paymentMethod: 'online'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateTotal = () => equipment.price.daily * formData.days;

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.startDate && updated.endDate) {
        const start = new Date(updated.startDate);
        const end = new Date(updated.endDate);
        const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        updated.days = diffDays > 0 ? diffDays : 1;
      }
      return updated;
    });
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName) newErrors.customerName = 'Client name is required';
    if (!formData.address) newErrors.address = 'Site address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.days < 1) newErrors.days = 'Minimum 1 day required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    const bookingData = {
      id: `BK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      totalAmount: calculateTotal(),
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    onSubmit(bookingData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${step > num ? 'bg-green-500 text-white' : step === num ? 'bg-secondary-500 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-600'}`}>
                {step > num ? <Check className="w-4 h-4" /> : num}
              </div>
              <span className={`text-xs mt-1 ${step === num ? 'text-secondary-500 font-medium' : 'text-gray-500'}`}>
                {num === 1 ? 'Client' : num === 2 ? 'Schedule' : 'Payment'}
              </span>
            </div>
            {num < 3 && <div className={`flex-1 h-0.5 mx-2 ${step > num ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Client/Company Name <span className="text-red-500">*</span></label>
              <div className="relative"><Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.customerName ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter client or company name" />
              </div>{errors.customerName && <p className="mt-1 text-xs text-red-500">{errors.customerName}</p>}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Site Address <span className="text-red-500">*</span></label>
              <div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.address ? 'border-red-500' : 'border-gray-200'}`} placeholder="Complete site address" />
              </div>{errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Project Notes (Optional)</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" placeholder="Any special requirements or notes" />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-700 flex items-center gap-1"><Info className="w-3 h-3" />Client ID: {formData.customerId} will be auto-generated</p></div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={formData.startDate} onChange={(e) => handleDateChange('startDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.startDate ? 'border-red-500' : 'border-gray-200'}`} />
                </div>{errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date <span className="text-red-500">*</span></label>
                <div className="relative"><Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={formData.endDate} onChange={(e) => handleDateChange('endDate', e.target.value)} min={formData.startDate || new Date().toISOString().split('T')[0]} className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.endDate ? 'border-red-500' : 'border-gray-200'}`} />
                </div>{errors.endDate && <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>}
              </div>
            </div>
            <div className="p-4 bg-primary-50 rounded-lg">
              <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Duration:</span><span className="font-medium text-secondary-500">{formData.days} days</span></div>
              <div className="flex items-center justify-between text-sm mt-2"><span className="text-gray-600">Daily Rate:</span><span className="font-medium text-secondary-500">{equipment.price.currency}{equipment.price.daily.toLocaleString()}</span></div>
              <div className="flex items-center justify-between font-semibold mt-3 pt-3 border-t border-gray-200"><span className="text-gray-800">Total:</span><span className="text-lg text-secondary-500">{equipment.price.currency}{calculateTotal().toLocaleString()}</span></div>
            </div>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50"><input type="radio" name="payment" value="online" checked={formData.paymentMethod === 'online'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4 text-secondary-500" /><div className="flex-1"><p className="font-medium text-gray-800 text-sm">Online Payment</p><p className="text-xs text-gray-500">Pay via UPI, Card, or NetBanking</p></div><CreditCard className="w-5 h-5 text-gray-400" /></label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50"><input type="radio" name="payment" value="bank" checked={formData.paymentMethod === 'bank'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4 text-secondary-500" /><div className="flex-1"><p className="font-medium text-gray-800 text-sm">Bank Transfer</p><p className="text-xs text-gray-500">Direct bank transfer within 24 hours</p></div><Banknote className="w-5 h-5 text-gray-400" /></label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-primary-50"><input type="radio" name="payment" value="cash" checked={formData.paymentMethod === 'cash'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-4 h-4 text-secondary-500" /><div className="flex-1"><p className="font-medium text-gray-800 text-sm">Cash on Delivery</p><p className="text-xs text-gray-500">Pay when equipment is delivered</p></div><DollarSign className="w-5 h-5 text-gray-400" /></label>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg"><div className="flex items-start gap-2"><Shield className="w-4 h-4 text-yellow-600 mt-0.5" /><p className="text-xs text-yellow-700">Security deposit of {equipment.price.currency}{equipment.price.daily * 2} required. Refundable upon safe return of equipment.</p></div></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        {step > 1 ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"><ArrowLeft className="w-4 h-4" />Back</button> : <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>}
        {step < 3 ? <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600">Next<ArrowRight className="w-4 h-4" /></button> : <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"><Check className="w-4 h-4" />Confirm Booking</button>}
      </div>
    </div>
  );
};

// ==================== BOOKING DETAILS MODAL ====================

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Booking['status']) => void;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose, onUpdateStatus }) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'active': return 'bg-green-100 text-green-600';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'paid': return 'bg-green-100 text-green-600';
      case 'refunded': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Booking ID</label><p className="text-sm font-medium text-secondary-500">{booking.id}</p></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Status</label><span className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></div>
      </div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Equipment</label><p className="text-sm text-gray-900">{booking.equipmentName}</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Client ID</label><p className="text-sm text-gray-900">{booking.customerId}</p></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Client Name</label><p className="text-sm text-gray-900">{booking.customerName}</p></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label><p className="text-sm text-gray-900">{booking.startDate}</p></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">End Date</label><p className="text-sm text-gray-900">{booking.endDate}</p></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Duration</label><p className="text-sm text-gray-900">{booking.days} days</p></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Total</label><p className="text-sm font-semibold text-secondary-500">₹{booking.totalAmount.toLocaleString()}</p></div>
      </div>
      <div><label className="block text-xs font-medium text-gray-500 mb-1">Site Address</label><p className="text-sm text-gray-900">{booking.address}</p></div>
      <div className="flex items-center justify-between">
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Payment Status</label><span className={`text-xs px-2 py-1 rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>{booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</span></div>
        <div><label className="block text-xs font-medium text-gray-500 mb-1">Created</label><p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p></div>
      </div>
      {booking.notes && (<div><label className="block text-xs font-medium text-gray-500 mb-1">Notes</label><p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg">{booking.notes}</p></div>)}
      <div className="flex justify-end gap-2 pt-4">
        {booking.status === 'pending' && (<><button onClick={() => onUpdateStatus(booking.id, 'confirmed')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Confirm Booking</button><button onClick={() => onUpdateStatus(booking.id, 'cancelled')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Cancel</button></>)}
        {booking.status === 'confirmed' && (<button onClick={() => onUpdateStatus(booking.id, 'active')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Start Rental</button>)}
        {booking.status === 'active' && (<button onClick={() => onUpdateStatus(booking.id, 'completed')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Mark Completed</button>)}
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Close</button>
      </div>
    </div>
  );
};

// ==================== ADD LISTING MODAL ====================

interface AddListingModalProps {
  onClose: () => void;
  onSubmit: (listing: any) => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '', category: '', subcategory: '', brand: '', model: '', year: '', condition: 'good',
    dailyRate: '', weeklyRate: '', monthlyRate: '', stock: '1', description: '', features: '', location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing = {
      id: `EQ-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...formData,
      images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500'],
      price: {
        daily: parseInt(formData.dailyRate),
        weekly: parseInt(formData.weeklyRate) || parseInt(formData.dailyRate) * 5,
        monthly: parseInt(formData.monthlyRate) || parseInt(formData.dailyRate) * 20,
        currency: '₹'
      },
      stock: parseInt(formData.stock),
      available: true,
      rating: 0,
      reviews: 0,
      provider: { id: 'PROV-001', name: 'Current Provider', verified: true, rating: 4.5 },
      specifications: {
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        condition: formData.condition as any,
        features: formData.features.split(',').map(f => f.trim())
      }
    };
    onSubmit(newListing);
    toast.success('Listing submitted for approval');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., JCB 3DX" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"><option value="">Select Category</option><option value="Heavy Equipment">Heavy Equipment</option><option value="Construction Tools">Construction Tools</option><option value="Scaffolding">Scaffolding</option><option value="Generators">Generators</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label><input type="text" value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} placeholder="e.g., Excavator" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Brand</label><input type="text" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="e.g., JCB" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Model</label><input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="e.g., 3DX" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><input type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} placeholder="e.g., 2023" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Condition</label><select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"><option value="new">New</option><option value="like-new">Like New</option><option value="good">Good</option><option value="fair">Fair</option></select></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g., Mumbai" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹) *</label><input type="number" required value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })} placeholder="e.g., 8500" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Weekly Rate (₹)</label><input type="number" value={formData.weeklyRate} onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })} placeholder="e.g., 45000" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rate (₹)</label><input type="number" value={formData.monthlyRate} onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })} placeholder="e.g., 150000" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity *</label><input type="number" required min="1" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="e.g., 5" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} placeholder="Describe the equipment in detail..." className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label><input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="GPS, AC Cabin, Reverse Camera" className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Equipment Photos *</label>
        <FileUpload maxFiles={5} maxSize={5} acceptedTypes={['image/*']} onUpload={(files) => toast.success(`${files.length} photo(s) uploaded`)} />
      </div>
      <div className="bg-blue-50 p-3 rounded-lg"><p className="text-xs text-blue-700 flex items-center gap-1"><Info className="w-3 h-3" />Listings require admin approval before going live</p></div>
      <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="px-6 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600">Submit for Approval</button></div>
    </form>
  );
};

// ==================== ENHANCED SETTINGS MODAL ====================

interface SettingsModalProps {
  onClose: () => void;
  onSave: (settings: any) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onSave }) => {
  const [settings, setSettings] = useState({
    businessName: 'Mumbai Rentals',
    email: 'rentals@company.com',
    phone: '+91 9876543210',
    gst: '27AAAAA0000A1Z5',
    pan: 'ABCDE1234F',
    bankName: 'State Bank of India',
    accountNumber: '12345678901',
    ifsc: 'SBIN0012345',
    accountType: 'Current',
    address: '123, Business Hub, Mumbai - 400001'
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'bank' | 'documents' | 'membership'>('profile');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    toast.success('Settings saved');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1 border-b">
        {(['profile', 'bank', 'documents', 'membership'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 text-sm font-medium transition-all ${activeTab === tab ? 'text-secondary-500 border-b-2 border-secondary-500' : 'text-gray-500 hover:text-secondary-500'}`}>
            {tab === 'profile' ? 'Profile' : tab === 'bank' ? 'Bank Details' : tab === 'documents' ? 'Documents' : 'Membership'}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Business Name</label><input type="text" value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label><input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label><input type="tel" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">GST Number</label><input type="text" value={settings.gst} onChange={(e) => setSettings({ ...settings, gst: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">PAN Number</label><input type="text" value={settings.pan} onChange={(e) => setSettings({ ...settings, pan: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
          </div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Business Address</label><textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={3} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500" /></div>
          <div className="flex justify-end gap-2 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button><button type="submit" className="px-6 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600">Save Changes</button></div>
        </form>
      )}

      {activeTab === 'bank' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Holder Name</label><input type="text" defaultValue={settings.businessName} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Bank Name</label><input type="text" defaultValue={settings.bankName} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label><input type="text" defaultValue={settings.accountNumber} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">IFSC Code</label><input type="text" defaultValue={settings.ifsc} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
            <div><label className="block text-xs font-medium text-gray-600 mb-1">Account Type</label><select defaultValue={settings.accountType} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option>Current</option><option>Savings</option></select></div>
          </div>
          <div className="flex justify-end"><button onClick={() => toast.success('Bank details saved')} className="px-6 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600">Save Bank Details</button></div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-primary-50 p-3 rounded-lg"><h3 className="font-medium text-secondary-500 mb-2">Uploaded Documents</h3><div className="space-y-2"><div className="flex justify-between items-center"><span>GST Certificate</span><span className="text-green-600 text-sm">Verified</span></div><div className="flex justify-between items-center"><span>Insurance Certificate</span><span className="text-yellow-600 text-sm">Pending</span></div></div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Upload New Document</label><FileUpload maxFiles={3} maxSize={5} acceptedTypes={['image/*', 'application/pdf']} onUpload={(files) => toast.success(`${files.length} file(s) uploaded`)} /></div>
        </div>
      )}

      {activeTab === 'membership' && (
        <div className="text-center py-4">
          <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-secondary-500 mb-2">Premium Membership</h3>
          <p className="text-sm text-gray-600 mb-4">Boost your rental business with premium features</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-primary-50 p-3 rounded-lg"><Zap className="w-6 h-6 text-primary-500 mx-auto mb-1" /><span className="text-xs font-medium">Priority Listing</span></div>
            <div className="bg-primary-50 p-3 rounded-lg"><Gift className="w-6 h-6 text-primary-500 mx-auto mb-1" /><span className="text-xs font-medium">Reduced Commission</span></div>
            <div className="bg-primary-50 p-3 rounded-lg"><Gem className="w-6 h-6 text-primary-500 mx-auto mb-1" /><span className="text-xs font-medium">Advanced Analytics</span></div>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-medium opacity-50 cursor-not-allowed">Coming Soon</button>
        </div>
      )}
    </div>
  );
};

// ==================== MAIN DASHBOARD COMPONENT ====================

const RentalDashboard = () => {
  const navigate = useNavigate();
  const [rentals, setRentals] = useState<RentalItem[]>(generateMockRentals());
  const [bookings, setBookings] = useState<Booking[]>(generateMockBookings());
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<RentalItem | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showAddListing, setShowAddListing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const stats: DashboardStats = {
    totalListings: rentals.length,
    activeRentals: bookings.filter(b => b.status === 'active').length,
    totalCustomers: new Set(bookings.map(b => b.customerId)).size,
    monthlyRevenue: bookings.filter(b => b.status === 'completed' || b.status === 'active').reduce((sum, b) => sum + b.totalAmount, 0),
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    completedRentals: bookings.filter(b => b.status === 'completed').length,
    averageRating: 4.8,
    utilizationRate: 75
  };

  const handleBookingSubmit = (bookingData: any) => {
    setBookings([...bookings, bookingData]);
    setShowBookingForm(false);
    setSelectedEquipment(null);
    toast.success('Booking request submitted');
  };

  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b));
    setSelectedBooking(null);
    toast.success(`Booking ${status}`);
  };

  const handleAddListing = (listing: any) => {
    setRentals([...rentals, listing]);
    setShowAddListing(false);
  };

  const handleUpdateSettings = (settings: any) => {
    console.log('Settings updated:', settings);
    setShowSettings(false);
  };

  const handleDeleteListing = (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setRentals(rentals.filter(r => r.id !== id));
      toast.success('Listing deleted');
    }
  };

  const handleEditListing = (_id: string) => {
    toast('Edit functionality coming soon');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const filteredBookings = bookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (searchTerm && !booking.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) && !booking.customerName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const filteredRentals = rentals.filter(rental => {
    if (searchTerm && !rental.name.toLowerCase().includes(searchTerm.toLowerCase()) && !rental.category.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-primary-50">
      <Toaster position="top-right" />
      <AnimatePresence>{showMobileMenu && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setShowMobileMenu(false)} />)}</AnimatePresence>
      <AnimatePresence>{showMobileMenu && (<motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl"><div className="p-4 border-b border-gray-200"><h2 className="font-bold text-secondary-500">Rental Dashboard</h2></div><nav className="p-2">{['overview', 'listings', 'bookings', 'earnings'].map((item) => (<button key={item} onClick={() => { setActiveTab(item); setShowMobileMenu(false); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-1 ${activeTab === item ? 'bg-secondary-500 text-white' : 'text-gray-600 hover:bg-primary-50'}`}>{item === 'overview' && <LayoutDashboard className="w-4 h-4" />}{item === 'listings' && <Package className="w-4 h-4" />}{item === 'bookings' && <Calendar className="w-4 h-4" />}{item === 'earnings' && <TrendingUp className="w-4 h-4" />}{item.charAt(0).toUpperCase() + item.slice(1)}</button>))}</nav></motion.div>)}</AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3"><button onClick={() => setShowMobileMenu(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-5 h-5" /></button><div><h1 className="text-lg sm:text-xl font-bold text-secondary-500">Rental Dashboard</h1><p className="text-xs sm:text-sm text-gray-600">Manage your equipment rentals</p></div></div>
            <div className="flex items-center gap-2"><button onClick={() => setShowNotifications(true)} className="relative p-2 hover:bg-gray-100 rounded-lg"><Bell className="w-5 h-5" />{stats.pendingBookings > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}</button><button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Settings className="w-5 h-5" /></button><button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-lg"><LogOut className="w-5 h-5" /></button></div>
          </div>
          <div className="hidden lg:flex items-center gap-1 mt-4">{['overview', 'listings', 'bookings', 'earnings'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-secondary-500 text-white shadow-md' : 'text-gray-600 hover:bg-primary-100'}`}>{tab === 'overview' && <LayoutDashboard className="w-4 h-4" />}{tab === 'listings' && <Package className="w-4 h-4" />}{tab === 'bookings' && <Calendar className="w-4 h-4" />}{tab === 'earnings' && <TrendingUp className="w-4 h-4" />}{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>))}</div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: Package, label: 'Total Listings', value: stats.totalListings.toString(), color: 'text-blue-500', bg: 'bg-blue-100' },
                  { icon: Calendar, label: 'Active Rentals', value: stats.activeRentals.toString(), color: 'text-green-500', bg: 'bg-green-100' },
                  { icon: Users, label: 'Total Clients', value: stats.totalCustomers.toString(), color: 'text-purple-500', bg: 'bg-purple-100' },
                  { icon: TrendingUp, label: 'Monthly Revenue', value: `₹${(stats.monthlyRevenue / 1000).toFixed(1)}K`, color: 'text-yellow-500', bg: 'bg-yellow-100' }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (<motion.div key={i} whileHover={{ y: -5 }} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg"><div className="flex items-start justify-between mb-2"><div className={`p-2 rounded-lg ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div></div><div className="text-xl font-bold text-secondary-500">{stat.value}</div><div className="text-xs text-gray-600">{stat.label}</div></motion.div>);
                })}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={() => setShowAddListing(true)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"><div className="p-2 bg-blue-100 rounded-lg"><Plus className="w-5 h-5 text-blue-600" /></div><span className="text-sm font-medium text-gray-700">Add Listing</span></button>
                <button onClick={() => setActiveTab('bookings')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"><div className="p-2 bg-green-100 rounded-lg"><Calendar className="w-5 h-5 text-green-600" /></div><span className="text-sm font-medium text-gray-700">View Bookings</span></button>
                <button onClick={() => setActiveTab('earnings')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"><div className="p-2 bg-yellow-100 rounded-lg"><DollarSign className="w-5 h-5 text-yellow-600" /></div><span className="text-sm font-medium text-gray-700">Earnings</span></button>
                <button onClick={() => setShowSettings(true)} className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all"><div className="p-2 bg-purple-100 rounded-lg"><Settings className="w-5 h-5 text-purple-600" /></div><span className="text-sm font-medium text-gray-700">Settings</span></button>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-secondary-500">Active Rentals</h2><button onClick={() => setActiveTab('bookings')} className="text-sm text-secondary-500 hover:text-primary-600">View All</button></div><div className="space-y-3">{bookings.filter(b => b.status === 'active').map((booking) => (<motion.div key={booking.id} whileHover={{ x: 5 }} onClick={() => { setSelectedBooking(booking); setShowBookingDetails(true); }} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg cursor-pointer"><div><h3 className="font-medium text-secondary-500 text-sm">{booking.equipmentName}</h3><p className="text-xs text-gray-600">{booking.customerName}</p></div><div className="text-right"><span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Active</span><p className="text-xs text-gray-500 mt-1">{booking.days} days</p></div></motion.div>))}</div></div>
              <div className="grid grid-cols-2 gap-4"><div className="bg-white rounded-xl p-4 shadow-md"><h3 className="text-sm font-semibold text-gray-700 mb-2">Utilization Rate</h3><div className="text-2xl font-bold text-secondary-500">{stats.utilizationRate}%</div><div className="h-2 bg-gray-200 rounded-full mt-2"><div className="h-2 bg-green-500 rounded-full" style={{ width: `${stats.utilizationRate}%` }} /></div></div><div className="bg-white rounded-xl p-4 shadow-md"><h3 className="text-sm font-semibold text-gray-700 mb-2">Average Rating</h3><div className="flex items-center gap-2"><div className="text-2xl font-bold text-secondary-500">{stats.averageRating}</div><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /></div><p className="text-xs text-gray-600 mt-1">Based on {stats.completedRentals} rentals</p></div></div>
            </motion.div>
          )}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><h2 className="text-lg font-bold text-secondary-500">All Bookings</h2><div className="flex gap-2"><div className="relative flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search bookings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 w-full sm:w-64" /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500"><option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></div></div>
              <div className="bg-white rounded-xl shadow-md overflow-x-auto"><table className="w-full min-w-[640px]"><thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Booking ID</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Equipment</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Client</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Dates</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{filteredBookings.map((booking) => (<tr key={booking.id} className="hover:bg-gray-50"><td className="px-4 py-3 text-sm font-medium text-secondary-500">{booking.id}</td><td className="px-4 py-3 text-sm text-gray-900">{booking.equipmentName}</td><td className="px-4 py-3 text-sm text-gray-900">{booking.customerName}</td><td className="px-4 py-3 text-sm text-gray-600">{booking.startDate} to {booking.endDate}</td><td className="px-4 py-3 text-sm font-medium text-secondary-500">₹{booking.totalAmount.toLocaleString()}</td><td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : booking.status === 'confirmed' ? 'bg-blue-100 text-blue-600' : booking.status === 'active' ? 'bg-green-100 text-green-600' : booking.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600'}`}>{booking.status}</span></td><td className="px-4 py-3"><button onClick={() => { setSelectedBooking(booking); setShowBookingDetails(true); }} className="text-xs text-secondary-500 hover:text-primary-600">View</button></td></tr>))}</tbody></table></div>
            </motion.div>
          )}
          {activeTab === 'listings' && (
            <motion.div key="listings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><h2 className="text-lg font-bold text-secondary-500">My Listings</h2><div className="flex gap-2"><div className="relative flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search listings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 w-full sm:w-64" /></div><button onClick={() => setShowAddListing(true)} className="flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg text-sm hover:bg-secondary-600"><Plus className="w-4 h-4" />Add Listing</button></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filteredRentals.map((rental) => (<motion.div key={rental.id} whileHover={{ y: -5 }} className="bg-white rounded-xl shadow-md overflow-hidden"><div className="relative h-32"><img src={rental.images[0]} alt={rental.name} className="w-full h-full object-cover" /><div className="absolute top-2 right-2"><span className={`px-2 py-1 text-xs rounded-full ${rental.available ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{rental.available ? 'Available' : 'Out of Stock'}</span></div></div><div className="p-4"><div className="flex items-start justify-between"><div><h3 className="font-semibold text-secondary-500">{rental.name}</h3><p className="text-xs text-gray-600 mt-1">{rental.category} • {rental.subcategory}</p></div><span className="text-xs font-medium text-gray-500">{rental.id}</span></div><div className="flex items-center gap-2 mt-2"><div className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span className="text-xs font-medium">{rental.rating}</span></div><span className="text-xs text-gray-500">({rental.reviews} reviews)</span><span className="text-xs text-gray-400">•</span><span className="text-xs text-gray-600">{rental.location}</span></div><div className="flex items-center justify-between mt-3"><div><span className="text-lg font-bold text-secondary-500">₹{rental.price.daily.toLocaleString()}</span><span className="text-xs text-gray-500">/day</span></div><div className="flex gap-2"><button onClick={() => handleEditListing(rental.id)} className="p-1 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-600" /></button><button onClick={() => handleDeleteListing(rental.id)} className="p-1 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-600" /></button></div></div><div className="mt-3 pt-3 border-t border-gray-200"><div className="flex items-center justify-between text-xs"><span className="text-gray-600">Stock: {rental.stock} units</span><span className="text-gray-600">Condition: {rental.specifications.condition}</span></div></div></div></motion.div>))}</div>
            </motion.div>
          )}
          {activeTab === 'earnings' && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4"><h2 className="text-lg font-bold text-secondary-500">Earnings Overview</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="bg-white rounded-xl p-6 shadow-md"><h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3><div className="text-2xl font-bold text-secondary-500">₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</div><p className="text-xs text-gray-500 mt-2">From {bookings.length} bookings</p></div><div className="bg-white rounded-xl p-6 shadow-md"><h3 className="text-sm font-medium text-gray-600 mb-2">Pending Payments</h3><div className="text-2xl font-bold text-yellow-600">₹{bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}</div><p className="text-xs text-gray-500 mt-2">{bookings.filter(b => b.paymentStatus === 'pending').length} pending</p></div><div className="bg-white rounded-xl p-6 shadow-md"><h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Average</h3><div className="text-2xl font-bold text-green-600">₹{(stats.monthlyRevenue / 1000).toFixed(1)}K</div><p className="text-xs text-gray-500 mt-2">Last 30 days</p></div></div><div className="bg-white rounded-xl p-6 shadow-md"><h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Transactions</h3><div className="space-y-3">{bookings.slice(0, 5).map((booking) => (<div key={booking.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"><div><p className="text-sm font-medium text-gray-900">{booking.equipmentName}</p><p className="text-xs text-gray-500">{booking.customerName} • {booking.startDate}</p></div><div className="text-right"><p className="text-sm font-semibold text-secondary-500">₹{booking.totalAmount.toLocaleString()}</p><p className={`text-xs ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{booking.paymentStatus}</p></div></div>))}</div></div></motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={showBookingForm} onClose={() => { setShowBookingForm(false); setSelectedEquipment(null); }} title={`New Booking: ${selectedEquipment?.name}`} size="lg">{selectedEquipment && <BookingForm equipment={selectedEquipment} onSubmit={handleBookingSubmit} onClose={() => { setShowBookingForm(false); setSelectedEquipment(null); }} />}</Modal>
      <Modal isOpen={showBookingDetails} onClose={() => setShowBookingDetails(false)} title="Booking Details" size="lg">{selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setShowBookingDetails(false)} onUpdateStatus={handleUpdateBookingStatus} />}</Modal>
      <Modal isOpen={showAddListing} onClose={() => setShowAddListing(false)} title="Add New Equipment Listing" size="xl"><AddListingModal onClose={() => setShowAddListing(false)} onSubmit={handleAddListing} /></Modal>
      <Modal isOpen={showNotifications} onClose={() => setShowNotifications(false)} title="Notifications" size="md"><div className="space-y-3">{bookings.filter(b => b.status === 'pending').map((booking) => (<div key={booking.id} className="p-3 bg-yellow-50 rounded-lg"><div className="flex items-start justify-between mb-1"><h4 className="font-medium text-secondary-500 text-sm">New Booking Request</h4><span className="text-xs text-gray-500">Now</span></div><p className="text-xs text-gray-600">{booking.equipmentName} - {booking.customerName}</p><button onClick={() => { setSelectedBooking(booking); setShowBookingDetails(true); setShowNotifications(false); }} className="mt-2 text-xs text-secondary-500 hover:text-primary-600">View Details</button></div>))}{bookings.filter(b => b.status === 'pending').length === 0 && <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>}</div></Modal>
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Settings" size="lg"><SettingsModal onClose={() => setShowSettings(false)} onSave={handleUpdateSettings} /></Modal>
    </div>
  );
};

export default RentalDashboard;