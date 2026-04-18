// src/pages/Seller/SellerDashboard.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package, ShoppingCart, DollarSign, Clock, Star, TrendingUp,
  Eye, PlusCircle, Edit2, Trash2, Upload, X,
  Bell, User, LogOut, ChevronDown, Percent,
  CheckCircle, XCircle, AlertCircle, ChevronRight,
  BarChart3, PieChart, ArrowUpRight,
  HardHat, Building2, Crown, FileText, Camera, Gem, Gift, Zap
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell
} from 'recharts';
import { toast, Toaster } from 'react-hot-toast';

// ==================== TYPES (matching ProductsPage) ====================
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  deliveryCharge: number;
  seller: string;
  sellerId: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  stock: number;
  isBestPrice?: boolean;
  isRecommended?: boolean;
  deliveryTimeMinDays?: number;
  createdAt: string;
}

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'completed' | 'processing' | 'pending' | 'cancelled';
  date: string;
  items: number;
  address?: string;
  phone?: string;
}

interface Activity {
  id: number;
  type: 'order' | 'product' | 'review' | 'payout';
  title: string;
  time: string;
  amount?: number;
}

interface SellerProfile {
  name: string;
  email: string;
  phone: string;
  company: string;
  gst: string;
  address: string;
  pan?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  accountType?: string;
}

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  PRODUCTS: 'construction_products',
  ORDERS: 'seller_orders',
  ACTIVITIES: 'seller_activities'
};

// ==================== INITIAL MOCK DATA ====================
const initialProducts: Product[] = [
  {
    id: 'p1', name: 'UltraTech Cement (50kg)', brand: 'UltraTech', category: 'Cement',
    price: 350, deliveryCharge: 50, seller: 'ABC Constructions', sellerId: 's1',
    rating: 4.5, reviewCount: 1250, location: 'Mumbai', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 5000, isBestPrice: true, isRecommended: true, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  },
  {
    id: 'p2', name: 'TATA TMT Steel Bars (12mm)', brand: 'TATA', category: 'Steel',
    price: 750, deliveryCharge: 100, seller: 'XYZ Enterprises', sellerId: 's2',
    rating: 4.8, reviewCount: 850, location: 'Delhi', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 2500, isBestPrice: false, isRecommended: true, deliveryTimeMinDays: 3, createdAt: new Date().toISOString()
  },
  {
    id: 'p3', name: 'Asian Paints Royale', brand: 'Asian Paints', category: 'Paint',
    price: 2200, deliveryCharge: 80, seller: 'PQR Builders', sellerId: 's3',
    rating: 4.3, reviewCount: 430, location: 'Bangalore', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500',
    stock: 0, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 4, createdAt: new Date().toISOString()
  },
  {
    id: 'p4', name: 'JCB 3DX Backhoe Loader', brand: 'JCB', category: 'Equipment',
    price: 8500, deliveryCharge: 1500, seller: 'JCB Rentals', sellerId: 's4',
    rating: 4.2, reviewCount: 12, location: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    stock: 5, isBestPrice: true, isRecommended: false, deliveryTimeMinDays: 5, createdAt: new Date().toISOString()
  },
  {
    id: 'p5', name: 'Birla White Putty', brand: 'Birla', category: 'Paint',
    price: 450, deliveryCharge: 30, seller: 'Singh Traders', sellerId: 's5',
    rating: 4.6, reviewCount: 320, location: 'Pune', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500',
    stock: 1200, isBestPrice: false, isRecommended: false, deliveryTimeMinDays: 2, createdAt: new Date().toISOString()
  }
];

const initialOrders: Order[] = [
  { id: 'ORD-2024-1234', customer: 'XYZ Constructions', amount: 45000, status: 'completed', date: '2024-01-15', items: 3, address: 'Mumbai', phone: '9876543210' },
  { id: 'ORD-2024-1235', customer: 'Urban Developers', amount: 28500, status: 'processing', date: '2024-01-15', items: 2, address: 'Delhi', phone: '8765432109' },
  { id: 'ORD-2024-1236', customer: 'Amit Kumar', amount: 125000, status: 'pending', date: '2024-01-14', items: 1, address: 'Bangalore', phone: '7654321098' },
  { id: 'ORD-2024-1237', customer: 'Sneha Reddy', amount: 8900, status: 'completed', date: '2024-01-14', items: 2, address: 'Chennai', phone: '6543210987' },
  { id: 'ORD-2024-1238', customer: 'Vikram Singh', amount: 67000, status: 'cancelled', date: '2024-01-13', items: 1, address: 'Pune', phone: '5432109876' },
];

const initialActivities: Activity[] = [
  { id: 1, type: 'order', title: 'New order received', time: '5 min ago', amount: 45000 },
  { id: 2, type: 'product', title: 'Product added to store', time: '10 min ago' },
  { id: 3, type: 'review', title: '5-star review from ABC Constructions', time: '1 hour ago' },
  { id: 4, type: 'payout', title: 'Payout processed', time: '2 hours ago', amount: 125000 },
];

const salesData = [
  { name: 'Mon', sales: 12000 },
  { name: 'Tue', sales: 19000 },
  { name: 'Wed', sales: 15000 },
  { name: 'Thu', sales: 22000 },
  { name: 'Fri', sales: 28000 },
  { name: 'Sat', sales: 24000 },
  { name: 'Sun', sales: 18000 },
];

const categoryData = [
  { name: 'Cement', value: 35, color: '#502d13' },
  { name: 'Steel', value: 28, color: '#7b4a26' },
  { name: 'Equipment', value: 20, color: '#a06e3a' },
  { name: 'Tools', value: 12, color: '#c28a5c' },
  { name: 'Paint', value: 5, color: '#e9ddc8' },
];

// Helper functions
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
const generateId = () => `p${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

// Load products from localStorage
const loadProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  return initialProducts;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Load orders from localStorage (or use initial)
const loadOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  return initialOrders;
};

// ==================== FILE UPLOAD (unchanged) ====================
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
    switch (type) {
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

// ==================== MAIN SELLER DASHBOARD ====================
const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState<SellerProfile>({
    name: 'XXxx YYY',
    email: 'seller@example.com',
    phone: '+91 9876543210',
    company: 'XXxx Construction',
    gst: '27AAAAA0000A1Z5',
    address: '123, Construction Hub, Mumbai',
    pan: 'ABCDE1234F',
    bankName: 'State Bank of India',
    accountNumber: '12345678901',
    ifsc: 'SBIN0012345',
    accountType: 'Current'
  });
  const [stats, setStats] = useState({
    totalProducts: 0, activeProducts: 0, totalOrders: 0, pendingOrders: 0,
    totalRevenue: 0, totalCommission: 0, averageRating: 0, totalReviews: 0
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState<Order | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', brand: '', price: '', stock: '', category: 'Cement',
    description: '', deliveryCharge: '50', deliveryTime: '3', images: [] as File[]
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'bank' | 'documents' | 'membership'>('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const fetchData = () => {
      const storedProducts = loadProducts();
      const storedOrders = loadOrders();
      setProducts(storedProducts);
      setOrders(storedOrders);
      setActivities(initialActivities);
      updateStats(storedProducts, storedOrders);
      setLoading(false);
    };
    fetchData();

    // Listen for storage changes (from other tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.PRODUCTS) {
        const updated = loadProducts();
        setProducts(updated);
        updateStats(updated, orders);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const updateStats = useCallback((productsList: Product[], ordersList: Order[]) => {
    const totalRevenue = productsList.reduce((sum, p) => sum + (p.price * (p.stock > 0 ? 1 : 0)), 0); // simplified
    const totalCommission = totalRevenue * 0.05;
    setStats({
      totalProducts: productsList.length,
      activeProducts: productsList.filter(p => p.stock > 0).length,
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending').length,
      totalRevenue,
      totalCommission,
      averageRating: productsList.reduce((sum, p) => sum + p.rating, 0) / productsList.length || 0,
      totalReviews: productsList.reduce((sum, p) => sum + p.reviewCount, 0)
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviews.length > 5) { toast.error('Maximum 5 images allowed'); return; }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    setNewProduct(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // ==================== AUTO-DISPLAY RULE ====================
  const handleAddProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const newId = generateId();
      const newProductObj: Product = {
        id: newId,
        name: newProduct.name,
        brand: newProduct.brand || 'Generic',
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        deliveryCharge: parseFloat(newProduct.deliveryCharge) || 50,
        seller: profile.name,
        sellerId: 'seller_' + Date.now(),
        rating: 0,
        reviewCount: 0,
        location: profile.address.split(',').pop()?.trim() || 'Unknown',
        image: imagePreviews[0] || 'https://via.placeholder.com/500',
        stock: parseInt(newProduct.stock),
        isBestPrice: false,
        isRecommended: false,
        deliveryTimeMinDays: parseInt(newProduct.deliveryTime) || 3,
        createdAt: new Date().toISOString()
      };
      // Get existing products from localStorage
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const updated = [newProductObj, ...existing];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
      // Trigger storage event for other tabs (ProductsPage)
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEYS.PRODUCTS, newValue: JSON.stringify(updated) }));
      // Update local state
      setProducts(updated);
      updateStats(updated, orders);
      setActivities([{ id: Date.now(), type: 'product', title: `New product "${newProduct.name}" added`, time: 'Just now' }, ...activities]);
      toast.success('Product added and instantly visible on Products page!');
      resetProductForm();
      setShowAddProduct(false);
      setIsSubmitting(false);
    }, 800);
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const updatedProducts = products.map(p =>
        p.id === editProduct.id
          ? {
              ...p,
              name: newProduct.name,
              brand: newProduct.brand || p.brand,
              price: parseFloat(newProduct.price),
              stock: parseInt(newProduct.stock),
              category: newProduct.category,
              deliveryCharge: parseFloat(newProduct.deliveryCharge) || p.deliveryCharge,
              deliveryTimeMinDays: parseInt(newProduct.deliveryTime) || p.deliveryTimeMinDays,
              image: imagePreviews[0] || p.image,
              description: newProduct.description
            }
          : p
      );
      saveProducts(updatedProducts);
      setProducts(updatedProducts);
      updateStats(updatedProducts, orders);
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEYS.PRODUCTS, newValue: JSON.stringify(updatedProducts) }));
      toast.success('Product updated and changes reflected immediately');
      resetProductForm();
      setShowAddProduct(false);
      setEditProduct(null);
      setIsSubmitting(false);
    }, 800);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      saveProducts(updatedProducts);
      setProducts(updatedProducts);
      updateStats(updatedProducts, orders);
      window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEYS.PRODUCTS, newValue: JSON.stringify(updatedProducts) }));
      toast.success('Product deleted');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setNewProduct({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: '',
      deliveryCharge: product.deliveryCharge.toString(),
      deliveryTime: (product.deliveryTimeMinDays || 3).toString(),
      images: []
    });
    setImagePreviews([product.image]);
    setShowAddProduct(true);
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '', brand: '', price: '', stock: '', category: 'Cement',
      description: '', deliveryCharge: '50', deliveryTime: '3', images: []
    });
    setImagePreviews([]);
  };

  const handleUpdateProfile = (updatedProfile: SellerProfile) => {
    setProfile(updatedProfile);
    toast.success('Profile updated successfully');
    setShowProfileModal(false);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-800', processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800', cancelled: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800', inactive: 'bg-gray-100 text-gray-800'
    };
    const icons: Record<string, React.ElementType> = {
      completed: CheckCircle, processing: Clock, pending: Clock, cancelled: XCircle,
      active: CheckCircle, inactive: XCircle
    };
    const Icon = icons[status] || AlertCircle;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}><Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center"><div className="relative"><div className="w-16 h-16 border-4 border-[#502d13] border-t-transparent rounded-full animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><HardHat className="w-8 h-8 text-[#502d13]" /></div></div><p className="mt-4 text-gray-500">Loading dashboard...</p></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <Toaster position="top-right" />
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6 text-[#502d13]" /><h1 className="text-xl font-bold text-[#502d13]">Seller Dashboard</h1></div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 rounded-lg relative"><Bell className="w-5 h-5 text-gray-600" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /></button>
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"><div className="w-8 h-8 bg-gradient-to-br from-[#502d13] to-[#7b4a26] rounded-full flex items-center justify-center text-white font-bold text-sm">{profile.name.charAt(0)}</div><ChevronDown className="w-4 h-4 text-gray-500" /></button>
              <AnimatePresence>{showProfileMenu && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"><div className="p-3 border-b"><p className="font-medium">{profile.name}</p><p className="text-xs text-gray-500">{profile.email}</p></div><div className="p-2"><button onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg"><User className="w-4 h-4" /> Profile</button><div className="border-t my-2" /><button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"><LogOut className="w-4 h-4" /> Logout</button></div></motion.div>)}</AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#502d13]"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-bold text-gray-800">{stats.totalProducts}</p></div><div className="p-2 bg-[#502d13]/10 rounded-lg"><Package className="w-5 h-5 text-[#502d13]" /></div></div><div className="mt-2 text-xs text-green-600 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /><span>+{stats.activeProducts} in stock</span></div></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#502d13]"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p></div><div className="p-2 bg-[#502d13]/10 rounded-lg"><ShoppingCart className="w-5 h-5 text-[#502d13]" /></div></div><div className="mt-2 text-xs text-yellow-600 flex items-center gap-1"><Clock className="w-3 h-3" /><span>{stats.pendingOrders} pending</span></div></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#502d13]"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p></div><div className="p-2 bg-[#502d13]/10 rounded-lg"><DollarSign className="w-5 h-5 text-[#502d13]" /></div></div><div className="mt-2 text-xs text-green-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /><span>+12% vs last month</span></div></motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#502d13]"><div className="flex items-start justify-between"><div><p className="text-sm text-gray-500">Commission Earned</p><p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalCommission)}</p></div><div className="p-2 bg-[#502d13]/10 rounded-lg"><Percent className="w-5 h-5 text-[#502d13]" /></div></div><div className="mt-2 text-xs text-gray-500">5% of sales</div></motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-semibold text-gray-800">Sales Trend</h2><p className="text-xs text-gray-500">Last 7 days</p></div><div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-green-500" /><span className="text-sm font-medium text-green-600">+8.2%</span></div></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData}><defs><linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#502d13" stopOpacity={0.3} /><stop offset="95%" stopColor="#502d13" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tickFormatter={(value) => `₹${value / 1000}K`} tick={{ fontSize: 12 }} /><Tooltip formatter={(value) => formatCurrency(value as number)} /><Area type="monotone" dataKey="sales" stroke="#502d13" fill="url(#salesGradient)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></div>
          <div className="bg-white rounded-xl shadow-md p-6"><div className="flex items-center justify-between mb-4"><div><h2 className="text-lg font-semibold text-gray-800">Sales by Category</h2><p className="text-xs text-gray-500">Revenue distribution</p></div><PieChart className="w-5 h-5 text-gray-400" /></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><RePieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}>{categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Pie><Tooltip /></RePieChart></ResponsiveContainer></div></div>
        </div>

        {/* Recent Orders & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden"><div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2><p className="text-xs text-gray-500">Latest transactions</p></div><button onClick={() => setShowAllOrders(true)} className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium">View All</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{orders.slice(0, 4).map(order => (<tr key={order.id} className="hover:bg-gray-50"><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.amount)}</td><td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td><td className="px-6 py-4 whitespace-nowrap"><button onClick={() => setShowOrderDetails(order)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button></td></tr>))}</tbody></table></div></div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden"><div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-800">Top Products</h2><p className="text-xs text-gray-500">Best sellers by revenue</p></div><button onClick={() => { setEditProduct(null); resetProductForm(); setShowAddProduct(true); }} className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium">Add New</button></div><div className="divide-y divide-gray-200">{products.filter(p => p.stock > 0).slice(0, 4).map(product => (<div key={product.id} className="flex items-center justify-between p-4 hover:bg-gray-50"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><Package className="w-4 h-4 text-gray-500" /></div><div><p className="text-sm font-medium text-gray-800">{product.name}</p><p className="text-xs text-gray-500">Stock: {product.stock}</p></div></div><div className="flex items-center gap-2"><button onClick={() => handleEditProduct(product)} className="p-1 hover:bg-gray-200 rounded text-gray-500"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDeleteProduct(product.id)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-4 h-4" /></button><span className="text-sm font-semibold text-gray-800">{formatCurrency(product.price)}</span></div></div>))}</div></div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2><button className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium">View All</button></div><div className="space-y-4">{activities.map(activity => (<div key={activity.id} className="flex items-start gap-3"><div className="p-2 bg-gray-100 rounded-lg">{activity.type === 'order' && <ShoppingCart className="w-4 h-4 text-blue-500" />}{activity.type === 'product' && <Package className="w-4 h-4 text-green-500" />}{activity.type === 'review' && <Star className="w-4 h-4 text-yellow-500" />}{activity.type === 'payout' && <DollarSign className="w-4 h-4 text-green-500" />}</div><div className="flex-1"><p className="text-sm text-gray-800">{activity.title}</p><div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{activity.time}</span>{activity.amount && <><span>•</span><span className="font-medium text-green-600">{formatCurrency(activity.amount)}</span></>}</div></div></div>))}</div></div>
          <div className="bg-white rounded-xl shadow-md p-6"><h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2><div className="space-y-3"><button onClick={() => { setEditProduct(null); resetProductForm(); setShowAddProduct(true); }} className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"><div className="flex items-center gap-2"><PlusCircle className="w-5 h-5 text-[#502d13]" /><span className="text-sm font-medium">Add New Product</span></div><ChevronRight className="w-4 h-4 text-gray-400" /></button><button onClick={() => setShowAllOrders(true)} className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"><div className="flex items-center gap-2"><Eye className="w-5 h-5 text-[#502d13]" /><span className="text-sm font-medium">View All Orders</span></div><ChevronRight className="w-4 h-4 text-gray-400" /></button><button onClick={() => setShowAnalytics(true)} className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"><div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#502d13]" /><span className="text-sm font-medium">Analytics Report</span></div><ChevronRight className="w-4 h-4 text-gray-400" /></button></div></div>
        </div>
      </main>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>{showAddProduct && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-800">{editProduct ? 'Edit Product' : 'Add New Product'}</h2><button onClick={() => setShowAddProduct(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div><form className="space-y-4" onSubmit={(e) => { e.preventDefault(); editProduct ? handleUpdateProduct() : handleAddProduct(); }}><div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label><input type="text" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label><input type="text" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required min="0" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label><input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" required min="0" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge (₹)</label><input type="number" value={newProduct.deliveryCharge} onChange={(e) => setNewProduct({ ...newProduct, deliveryCharge: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" min="0" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days)</label><input type="number" value={newProduct.deliveryTime} onChange={(e) => setNewProduct({ ...newProduct, deliveryTime: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" min="1" /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg"><option>Cement</option><option>Steel</option><option>Equipment</option><option>Tools</option><option>Paint</option><option>Sanitary</option><option>Electrical</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label><input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" /><button type="button" onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#502d13] transition-colors"><Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-600">Click to upload image</p></button>{imagePreviews.length > 0 && (<div className="grid grid-cols-3 gap-2 mt-3">{imagePreviews.map((url, idx) => (<div key={idx} className="relative"><img src={url} alt={`preview-${idx}`} className="w-full h-20 object-cover rounded-lg" /><button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button></div>))}</div>)}</div><div className="flex gap-3 pt-4"><button type="submit" disabled={isSubmitting} className="flex-1 bg-[#502d13] text-white py-2 rounded-lg hover:bg-[#7b4a26] disabled:opacity-50">{isSubmitting ? 'Submitting...' : (editProduct ? 'Update Product' : 'Add Product')}</button><button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div></form></div></motion.div></div>)}</AnimatePresence>

      {/* All Orders Modal */}
      <AnimatePresence>{showAllOrders && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-800">All Orders</h2><button onClick={() => setShowAllOrders(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>{orders.map(order => (<tr key={order.id}><td>{order.id}</td><td>{order.customer}</td><td>{formatCurrency(order.amount)}</td><td>{getStatusBadge(order.status)}</td><td>{order.date}</td><td><button onClick={() => { setShowOrderDetails(order); setShowAllOrders(false); }}>View</button></td></tr>))}</tbody></table></div></div></motion.div></div>)}</AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>{showOrderDetails && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-lg w-full"><div className="p-6"><div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Order Details</h2><button onClick={() => setShowOrderDetails(null)}><X /></button></div><div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-gray-500">Order ID</p><p>{showOrderDetails.id}</p></div><div><p className="text-xs text-gray-500">Date</p><p>{showOrderDetails.date}</p></div><div><p className="text-xs text-gray-500">Customer</p><p>{showOrderDetails.customer}</p></div><div><p className="text-xs text-gray-500">Phone</p><p>{showOrderDetails.phone}</p></div><div><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-green-600">{formatCurrency(showOrderDetails.amount)}</p></div><div><p className="text-xs text-gray-500">Items</p><p>{showOrderDetails.items}</p></div><div className="col-span-2"><p className="text-xs text-gray-500">Address</p><p>{showOrderDetails.address}</p></div><div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(showOrderDetails.status)}</div></div><button onClick={() => setShowOrderDetails(null)} className="w-full border py-2 rounded-lg">Close</button></div></div></motion.div></div>)}</AnimatePresence>

      {/* Analytics Report Modal */}
      <AnimatePresence>{showAnalytics && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Analytics Report</h2><button onClick={() => setShowAnalytics(false)}><X /></button></div><div className="space-y-6"><div className="grid grid-cols-3 gap-4"><div className="bg-primary-50 p-4 text-center"><p className="text-xs">Total Revenue</p><p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p></div><div className="bg-primary-50 p-4 text-center"><p className="text-xs">Total Orders</p><p className="text-xl font-bold">{stats.totalOrders}</p></div><div className="bg-primary-50 p-4 text-center"><p className="text-xs">Commission</p><p className="text-xl font-bold">{formatCurrency(stats.totalCommission)}</p></div></div><div><h3 className="font-semibold mb-2">Weekly Sales</h3><div className="h-64"><ResponsiveContainer><AreaChart data={salesData}><CartesianGrid /><XAxis dataKey="name" /><YAxis tickFormatter={(v) => `₹${v/1000}K`} /><Tooltip formatter={(v) => formatCurrency(v as number)} /><Area type="monotone" dataKey="sales" stroke="#502d13" fill="url(#salesGradient)" /></AreaChart></ResponsiveContainer></div></div><div><h3 className="font-semibold mb-2">Category Distribution</h3><div className="h-64"><ResponsiveContainer><RePieChart><Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>{categoryData.map((e,i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></RePieChart></ResponsiveContainer></div></div></div></div></motion.div></div>)}</AnimatePresence>

      {/* Profile Modal (unchanged) */}
      <AnimatePresence>{showProfileModal && (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"><div className="p-6"><div className="flex justify-between mb-4"><h2 className="text-xl font-bold">Account Settings</h2><button onClick={() => setShowProfileModal(false)}><X /></button></div><div className="flex gap-2 border-b mb-4"><button onClick={() => setSettingsTab('profile')} className={`px-4 py-2 ${settingsTab === 'profile' ? 'text-secondary-500 border-b-2 border-secondary-500' : 'text-gray-500'}`}>Profile</button><button onClick={() => setSettingsTab('bank')} className={`px-4 py-2 ${settingsTab === 'bank' ? 'text-secondary-500 border-b-2 border-secondary-500' : 'text-gray-500'}`}>Bank</button><button onClick={() => setSettingsTab('documents')} className={`px-4 py-2 ${settingsTab === 'documents' ? 'text-secondary-500 border-b-2 border-secondary-500' : 'text-gray-500'}`}>Documents</button><button onClick={() => setSettingsTab('membership')} className={`px-4 py-2 ${settingsTab === 'membership' ? 'text-secondary-500 border-b-2 border-secondary-500' : 'text-gray-500'}`}>Membership</button></div>
        {settingsTab === 'profile' && (<form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleUpdateProfile({ name: fd.get('name') as string, email: fd.get('email') as string, phone: fd.get('phone') as string, company: fd.get('company') as string, gst: fd.get('gst') as string, address: fd.get('address') as string }); }} className="space-y-4"><input name="name" defaultValue={profile.name} placeholder="Name" className="w-full p-2 border rounded" required /><input name="email" defaultValue={profile.email} type="email" placeholder="Email" className="w-full p-2 border rounded" required /><input name="phone" defaultValue={profile.phone} placeholder="Phone" className="w-full p-2 border rounded" required /><input name="company" defaultValue={profile.company} placeholder="Company" className="w-full p-2 border rounded" required /><input name="gst" defaultValue={profile.gst} placeholder="GST" className="w-full p-2 border rounded" /><textarea name="address" rows={2} defaultValue={profile.address} placeholder="Address" className="w-full p-2 border rounded" /><div className="flex gap-3"><button type="submit" className="flex-1 bg-[#502d13] text-white py-2 rounded">Save</button><button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 border py-2 rounded">Cancel</button></div></form>)}
        {settingsTab === 'bank' && (<div className="space-y-4"><input type="text" placeholder="Account Holder" defaultValue={profile.name} className="w-full p-2 border rounded" /><input type="text" placeholder="Bank Name" defaultValue={profile.bankName} className="w-full p-2 border rounded" /><input type="text" placeholder="Account Number" defaultValue={profile.accountNumber} className="w-full p-2 border rounded" /><input type="text" placeholder="IFSC" defaultValue={profile.ifsc} className="w-full p-2 border rounded" /><select defaultValue={profile.accountType} className="w-full p-2 border rounded"><option>Savings</option><option>Current</option></select><button className="w-full bg-[#502d13] text-white py-2 rounded">Save Bank Details</button></div>)}
        {settingsTab === 'documents' && (<div><div className="bg-primary-50 p-3 rounded"><h3 className="font-medium">Uploaded Documents</h3><div className="flex justify-between"><span>GST Certificate</span><span className="text-green-600">Verified</span></div><div className="flex justify-between"><span>PAN Card</span><span className="text-yellow-600">Pending</span></div></div><div className="mt-4"><FileUpload maxFiles={3} maxSize={5} onUpload={(files) => toast.success(`${files.length} file(s) uploaded`)} /></div></div>)}
        {settingsTab === 'membership' && (<div className="text-center"><Crown className="w-16 h-16 text-yellow-500 mx-auto" /><h3 className="text-lg font-bold">Premium Membership</h3><p className="text-sm text-gray-600">Unlock exclusive benefits</p><div className="grid grid-cols-3 gap-3 my-4"><div className="bg-primary-50 p-2 rounded"><Zap className="mx-auto" /><span className="text-xs">Priority Support</span></div><div className="bg-primary-50 p-2 rounded"><Gift className="mx-auto" /><span className="text-xs">Reduced Commission</span></div><div className="bg-primary-50 p-2 rounded"><Gem className="mx-auto" /><span className="text-xs">Analytics</span></div></div><button className="bg-yellow-400 text-white px-6 py-2 rounded opacity-50 cursor-not-allowed">Coming Soon</button></div>)}
      </div></motion.div></div>)}</AnimatePresence>
    </div>
  );
};

export default SellerDashboard;