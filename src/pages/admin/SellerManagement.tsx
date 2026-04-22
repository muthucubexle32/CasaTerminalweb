// src/pages/admin/SellerManagement.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Users,
  UserPlus,
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  Grid,
  Menu,
  X,
  Percent,
  Edit2,
  Trash2,
 
} from 'lucide-react';

// ==================== TYPES ====================
interface Seller {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  joinedDate: string;
  products: number;
  orders: number;
  revenue: number;
  rating: number;
}

interface FormData {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  revenue: number;
}

interface CommissionRates {
  other: number;
}

// ==================== MOCK DATA ====================
const initialSellers: Seller[] = [
  {
    id: 'SEL-001',
    companyName: 'ABC Constructions',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@abcconstructions.com',
    phone: '+91 98765 43210',
    location: 'Mumbai',
    status: 'approved',
    joinedDate: '2024-01-15',
    products: 45,
    orders: 156,
    revenue: 4560000,
    rating: 4.8
  },
  {
    id: 'SEL-002',
    companyName: 'XYZ Enterprises',
    ownerName: 'Priya Singh',
    email: 'priya@xyzenterprises.com',
    phone: '+91 87654 32109',
    location: 'Delhi',
    status: 'pending',
    joinedDate: '2024-01-16',
    products: 23,
    orders: 0,
    revenue: 0,
    rating: 0
  },
  {
    id: 'SEL-003',
    companyName: 'PQR Builders',
    ownerName: 'Amit Patel',
    email: 'amit@pqrbuilders.com',
    phone: '+91 76543 21098',
    location: 'Ahmedabad',
    status: 'approved',
    joinedDate: '2024-01-10',
    products: 67,
    orders: 234,
    revenue: 6789000,
    rating: 4.6
  },
  {
    id: 'SEL-004',
    companyName: 'Singh Interiors',
    ownerName: 'Amar Singh',
    email: 'amar@singhinteriors.com',
    phone: '+91 65432 10987',
    location: 'Jaipur',
    status: 'rejected',
    joinedDate: '2024-01-12',
    products: 12,
    orders: 0,
    revenue: 0,
    rating: 0
  },
  {
    id: 'SEL-005',
    companyName: 'Patel Electricals',
    ownerName: 'Kunal Patel',
    email: 'kunal@patel.com',
    phone: '+91 54321 09876',
    location: 'Surat',
    status: 'blocked',
    joinedDate: '2023-12-20',
    products: 89,
    orders: 345,
    revenue: 8900000,
    rating: 4.2
  }
];

// Helper functions
const generateId = () => `SEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const formatNumber = (num: number) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ==================== MAIN COMPONENT ====================
const SellerManagement = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'details' | 'approve' | 'reject' | 'commission' | 'block' | 'add' | 'edit' | 'delete'>('none');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [productCommission, setProductCommission] = useState<number>(5);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof Seller>('joinedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filters
  const [filters, setFilters] = useState({
    location: '',
    rating: '',
    revenue: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // Form state for add/edit
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    location: '',
    revenue: 0
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Load mock data and commission rates
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setSellers(initialSellers);
      setLoading(false);
    };
    loadData();

    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const rates: CommissionRates = JSON.parse(saved);
      setProductCommission(rates.other ?? 5);
    }
    // Listen for commission updates
    const handleCommissionUpdate = () => {
      const updated = localStorage.getItem('adminCommissionRates');
      if (updated) setProductCommission(JSON.parse(updated).other ?? 5);
    };
    window.addEventListener('commissionUpdate', handleCommissionUpdate);
    return () => window.removeEventListener('commissionUpdate', handleCommissionUpdate);
  }, []);

  // Tabs configuration
  const tabs = [
    { id: 'all', name: 'All', icon: Users, count: sellers.length, color: 'blue' },
    { id: 'pending', name: 'Pending', icon: Clock, count: sellers.filter(s => s.status === 'pending').length, color: 'yellow' },
    { id: 'approved', name: 'Approved', icon: CheckCircle, count: sellers.filter(s => s.status === 'approved').length, color: 'green' },
    { id: 'rejected', name: 'Rejected', icon: XCircle, count: sellers.filter(s => s.status === 'rejected').length, color: 'red' }
  ];

  // Filter, search, and sort sellers
  const filteredSellers = useMemo(() => {
    let filtered = [...sellers];
    
    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.status === activeTab);
    }
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.companyName.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }
    
    // Advanced filters
    if (filters.location) {
      filtered = filtered.filter(s => s.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.rating) {
      filtered = filtered.filter(s => s.rating >= parseFloat(filters.rating));
    }
    if (filters.revenue) {
      const minRevenue = parseInt(filters.revenue);
      filtered = filtered.filter(s => s.revenue >= minRevenue);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(s => s.joinedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(s => s.joinedDate <= filters.dateTo);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'revenue' || sortField === 'products' || sortField === 'orders' || sortField === 'rating') {
        aVal = a[sortField] as number;
        bVal = b[sortField] as number;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [sellers, activeTab, searchQuery, filters, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const paginatedSellers = filteredSellers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filters, sortField, sortOrder]);

  // Handlers
  const handleSort = (field: keyof Seller) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedSellers.length === paginatedSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(paginatedSellers.map(s => s.id));
    }
  };

  const handleSelectSeller = (id: string) => {
    setSelectedSellers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedSellers.length) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    let updated = [...sellers];
    if (action === 'Approve') {
      updated = updated.map(s => selectedSellers.includes(s.id) ? { ...s, status: 'approved' } : s);
      toast.success(`${selectedSellers.length} seller(s) approved`);
    } else if (action === 'Reject') {
      updated = updated.map(s => selectedSellers.includes(s.id) ? { ...s, status: 'rejected' } : s);
      toast.success(`${selectedSellers.length} seller(s) rejected`);
    } else if (action === 'Delete') {
      updated = updated.filter(s => !selectedSellers.includes(s.id));
      toast.success(`${selectedSellers.length} seller(s) deleted`);
    }
    setSellers(updated);
    setSelectedSellers([]);
    setLoading(false);
  };

  const handleAddSeller = async () => {
    // Validate form
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = '10-digit number required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newSeller: Seller = {
      id: generateId(),
      ...formData,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      products: 0,
      orders: 0,
      rating: 0
    };
    setSellers(prev => [newSeller, ...prev]);
    toast.success('Seller added successfully');
    setShowModal('none');
    resetForm();
    setLoading(false);
  };

  const handleEditSeller = async () => {
    if (!selectedSeller) return;
    // Validate
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = '10-digit number required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSellers(prev =>
      prev.map(s => s.id === selectedSeller.id
        ? { ...s, ...formData, status: s.status === 'approved' ? 'pending' : s.status } // require re-approval if changed
        : s
      )
    );
    toast.success('Seller updated successfully');
    setShowModal('none');
    setSelectedSeller(null);
    resetForm();
    setLoading(false);
  };

  const handleDeleteSeller = async () => {
    if (!selectedSeller) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSellers(prev => prev.filter(s => s.id !== selectedSeller.id));
    toast.success('Seller deleted');
    setShowModal('none');
    setSelectedSeller(null);
    setLoading(false);
  };

  const handleApproveSeller = async () => {
    if (!selectedSeller) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSellers(prev =>
      prev.map(s => s.id === selectedSeller.id ? { ...s, status: 'approved' } : s)
    );
    toast.success(`${selectedSeller.companyName} approved`);
    setShowModal('none');
    setSelectedSeller(null);
    setLoading(false);
  };

  const handleRejectSeller = async () => {
    if (!selectedSeller) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSellers(prev =>
      prev.map(s => s.id === selectedSeller.id ? { ...s, status: 'rejected' } : s)
    );
    toast.success(`${selectedSeller.companyName} rejected`);
    setShowModal('none');
    setSelectedSeller(null);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      ownerName: '',
      email: '',
      phone: '',
      location: '',
      revenue: 0
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setSelectedSeller(null);
    setShowModal('add');
  };

  const openEditModal = (seller: Seller) => {
    setSelectedSeller(seller);
    setFormData({
      companyName: seller.companyName,
      ownerName: seller.ownerName,
      email: seller.email,
      phone: seller.phone,
      location: seller.location,
      revenue: seller.revenue
    });
    setFormErrors({});
    setShowModal('edit');
  };

  const openDeleteModal = (seller: Seller) => {
    setSelectedSeller(seller);
    setShowModal('delete');
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      rating: '',
      revenue: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchQuery('');
    setActiveTab('all');
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      blocked: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const icons = {
      approved: CheckCircle,
      pending: Clock,
      rejected: XCircle,
      blocked: XCircle
    };
    const Icon = icons[status as keyof typeof icons] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Loading skeleton
  if (loading && sellers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading sellers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              Seller Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage and monitor all sellers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`} title="Table View"><Menu className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`} title="Grid View"><Grid className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Seller</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const colors = { blue: 'bg-blue-100 text-blue-600', yellow: 'bg-yellow-100 text-yellow-600', green: 'bg-green-100 text-green-600', red: 'bg-red-100 text-red-600' };
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`bg-white rounded-lg border p-3 transition-all ${activeTab === tab.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className={`p-1.5 rounded-lg ${colors[tab.color as keyof typeof colors]}`}><Icon className="w-4 h-4" /></div>
                  <span className="text-lg font-bold text-gray-900">{tab.count}</span>
                </div>
                <p className="text-xs text-gray-600">{tab.name}</p>
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search sellers..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <Filter className="w-4 h-4" /><span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Location</label><input type="text" value={filters.location} onChange={(e) => setFilters({...filters, location: e.target.value})} placeholder="City" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label><select value={filters.rating} onChange={(e) => setFilters({...filters, rating: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">All</option><option value="4">4+ Stars</option><option value="4.5">4.5+ Stars</option></select></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Min Revenue</label><select value={filters.revenue} onChange={(e) => setFilters({...filters, revenue: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">Any</option><option value="1000000">₹10L+</option><option value="5000000">₹50L+</option><option value="10000000">₹1Cr+</option></select></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Joined From</label><input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Joined To</label><input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"><X className="w-3 h-3" />Clear all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedSellers.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-blue-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">{selectedSellers.length} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => handleBulkAction('Reject')} className="px-3 py-1 bg-red-500 rounded-md text-sm hover:bg-red-600">Reject</button>
                <button onClick={() => handleBulkAction('Delete')} className="px-3 py-1 bg-gray-700 rounded-md text-sm hover:bg-gray-800">Delete</button>
                <button onClick={() => setSelectedSellers([])} className="p-1 hover:bg-blue-700 rounded"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden items-center justify-end gap-2 mb-4">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Menu className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Grid className="w-4 h-4" /></button>
        </div>

        {/* Content Area */}
        {filteredSellers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sellers found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Clear Filters</button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedSellers.length === paginatedSellers.length} onChange={handleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('companyName')}>Seller {sortField === 'companyName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('location')}>Location {sortField === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('revenue')}>Revenue {sortField === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedSellers.includes(seller.id)} onChange={() => handleSelectSeller(seller.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-blue-600" /></div>
                          <div><div className="font-medium text-gray-900">{seller.companyName}</div><div className="text-xs text-gray-500">{seller.ownerName}</div></div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="text-sm">{seller.email}</div><div className="text-xs text-gray-500">{seller.phone}</div></td>
                      <td className="px-4 py-3 text-sm">{seller.location}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatNumber(seller.revenue)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1 text-sm font-medium text-blue-600"><Percent className="w-3 h-3" /> {productCommission}%</div></td>
                      <td className="px-4 py-3">{getStatusBadge(seller.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelectedSeller(seller); setShowModal('details'); }} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openEditModal(seller)} className="p-1 hover:bg-green-100 rounded text-green-600" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => openDeleteModal(seller)} className="p-1 hover:bg-red-100 rounded text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          {seller.status === 'pending' && (
                            <>
                              <button onClick={() => { setSelectedSeller(seller); setShowModal('approve'); }} className="p-1 hover:bg-green-100 rounded text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => { setSelectedSeller(seller); setShowModal('reject'); }} className="p-1 hover:bg-red-100 rounded text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredSellers.length)} of {filteredSellers.length} sellers</div>
              <div className="flex items-center gap-2">
                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-gray-200 rounded text-sm"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select>
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev-1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                <span className="text-sm">Page {currentPage} of {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev+1))} disabled={currentPage === totalPages} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedSellers.map((seller) => (
              <motion.div key={seller.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -2 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5 text-blue-600" /></div>
                      <div><h3 className="font-semibold text-gray-900">{seller.companyName}</h3><p className="text-xs text-gray-500">{seller.ownerName}</p></div>
                    </div>
                    {getStatusBadge(seller.status)}
                  </div>
                  <div className="space-y-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{seller.email}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" /><span>{seller.phone}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /><span>{seller.location}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
                    <div className="text-center"><p className="text-sm font-semibold text-gray-900">{seller.products}</p><p className="text-xs text-gray-500">Products</p></div>
                    <div className="text-center"><p className="text-sm font-semibold text-gray-900">{seller.orders}</p><p className="text-xs text-gray-500">Orders</p></div>
                    <div className="text-center"><p className="text-sm font-semibold text-green-600">{formatNumber(seller.revenue)}</p><p className="text-xs text-gray-500">Revenue</p></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-medium"><Percent className="w-3 h-3" /> Commission: {productCommission}%</div>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedSeller(seller); setShowModal('details'); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEditModal(seller)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => openDeleteModal(seller)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination for grid view */}
        {viewMode === 'grid' && filteredSellers.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredSellers.length)} of {filteredSellers.length}</div>
            <div className="flex items-center gap-2">
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border border-gray-200 rounded text-sm"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select>
              <button onClick={() => setCurrentPage(prev => Math.max(1, prev-1))} disabled={currentPage === 1} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev+1))} disabled={currentPage === totalPages} className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* ==================== MODALS ==================== */}
        <AnimatePresence>
          {/* Add Seller Modal */}
          {showModal === 'add' && (
            <Modal title="Add New Seller" onClose={() => setShowModal('none')} size="lg">
              <SellerForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddSeller} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Add Seller</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Edit Seller Modal */}
          {showModal === 'edit' && selectedSeller && (
            <Modal title="Edit Seller" onClose={() => setShowModal('none')} size="lg">
              <SellerForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6">
                <button onClick={handleEditSeller} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Delete Confirmation */}
          {showModal === 'delete' && selectedSeller && (
            <Modal title="Delete Seller" onClose={() => setShowModal('none')}>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-800">Are you sure you want to delete <span className="font-semibold">{selectedSeller.companyName}</span>? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteSeller} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Delete</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Approve Modal */}
          {showModal === 'approve' && selectedSeller && (
            <Modal title="Approve Seller" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg"><p className="text-sm text-green-800">Approve <span className="font-semibold">{selectedSeller.companyName}</span></p></div>
                <div className="flex gap-3"><button onClick={handleApproveSeller} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
              </div>
            </Modal>
          )}

          {/* Reject Modal */}
          {showModal === 'reject' && selectedSeller && (
            <Modal title="Reject Seller" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg"><p className="text-sm text-red-800">Reject <span className="font-semibold">{selectedSeller.companyName}</span></p></div>
                <div className="flex gap-3"><button onClick={handleRejectSeller} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button><button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
              </div>
            </Modal>
          )}

          {/* Details Modal */}
          {showModal === 'details' && selectedSeller && (
            <Modal title="Seller Details" onClose={() => setShowModal('none')} size="lg">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Company</p><p className="font-medium">{selectedSeller.companyName}</p></div>
                  <div><p className="text-xs text-gray-500">Owner</p><p>{selectedSeller.ownerName}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="text-sm">{selectedSeller.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p>{selectedSeller.phone}</p></div>
                  <div><p className="text-xs text-gray-500">Location</p><p>{selectedSeller.location}</p></div>
                  <div><p className="text-xs text-gray-500">Joined Date</p><p>{selectedSeller.joinedDate}</p></div>
                  <div><p className="text-xs text-gray-500">Products</p><p>{selectedSeller.products}</p></div>
                  <div><p className="text-xs text-gray-500">Orders</p><p>{selectedSeller.orders}</p></div>
                  <div><p className="text-xs text-gray-500">Revenue</p><p className="font-semibold text-green-600">{formatNumber(selectedSeller.revenue)}</p></div>
                  <div><p className="text-xs text-gray-500">Rating</p><p>{selectedSeller.rating}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedSeller.status)}</div>
                </div>
                <div className="border-t border-gray-200 pt-4"><button onClick={() => setShowModal('none')} className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Close</button></div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Form Component for Add/Edit
const SellerForm = ({ formData, setFormData, errors }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; errors: Partial<Record<keyof FormData, string>> }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label><input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.companyName}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label><input type="text" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.ownerName ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.ownerName}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.email}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="10-digit number" /><p className="text-xs text-red-500 mt-1">{errors.phone}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.location}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Revenue (₹)</label><input type="number" value={formData.revenue} onChange={(e) => setFormData({...formData, revenue: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-200 rounded-lg" /></div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, onClose, size = 'md' }: { title: string; children: React.ReactNode; onClose: () => void; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default SellerManagement;