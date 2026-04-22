// src/pages/admin/ContractorManagement.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search, Filter, Eye, CheckCircle, XCircle,  Download,
  Users, UserPlus, MapPin, Phone, Mail,
  Star, Clock, HardHat, Menu, X, ChevronLeft, ChevronRight, Grid,
  Building2, Edit2, Trash2, Percent, 
} from 'lucide-react';

// ==================== TYPES ====================
interface Contractor {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  experience: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  joinedDate: string;
  projects: number;
  revenue: number;
  rating: number;
  documents: {
    gst: 'verified' | 'pending' | 'rejected';
    pan: 'verified' | 'pending' | 'rejected';
  };
}

interface FormData {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  specialization: string;
  experience: string;
  revenue: number;
}

// ==================== MOCK DATA ====================
const initialContractors: Contractor[] = [
  {
    id: 'CON-001',
    companyName: 'Rajesh Constructions',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@constructions.com',
    phone: '+91 98765 43210',
    location: 'Mumbai',
    specialization: 'Civil Contractor',
    experience: '15 years',
    status: 'approved',
    joinedDate: '2024-01-15',
    projects: 45,
    revenue: 12500000,
    rating: 4.8,
    documents: { gst: 'verified', pan: 'verified' }
  },
  {
    id: 'CON-002',
    companyName: 'Singh Interiors',
    ownerName: 'Amar Singh',
    email: 'amar@interiors.com',
    phone: '+91 87654 32109',
    location: 'Delhi',
    specialization: 'Interior Designer',
    experience: '8 years',
    status: 'pending',
    joinedDate: '2024-01-16',
    projects: 0,
    revenue: 0,
    rating: 0,
    documents: { gst: 'verified', pan: 'pending' }
  },
  {
    id: 'CON-003',
    companyName: 'Patel Electricals',
    ownerName: 'Kunal Patel',
    email: 'kunal@electricals.com',
    phone: '+91 76543 21098',
    location: 'Ahmedabad',
    specialization: 'Electrician',
    experience: '12 years',
    status: 'approved',
    joinedDate: '2024-01-10',
    projects: 67,
    revenue: 8900000,
    rating: 4.6,
    documents: { gst: 'verified', pan: 'verified' }
  },
  {
    id: 'CON-004',
    companyName: 'Mehta Plumbing',
    ownerName: 'Rakesh Mehta',
    email: 'rakesh@plumbing.com',
    phone: '+91 65432 10987',
    location: 'Jaipur',
    specialization: 'Plumber',
    experience: '10 years',
    status: 'rejected',
    joinedDate: '2024-01-12',
    projects: 0,
    revenue: 0,
    rating: 0,
    documents: { gst: 'verified', pan: 'rejected' }
  },
  {
    id: 'CON-005',
    companyName: 'Desai Architects',
    ownerName: 'Vikram Desai',
    email: 'vikram@architects.com',
    phone: '+91 54321 09876',
    location: 'Pune',
    specialization: 'Architect',
    experience: '20 years',
    status: 'blocked',
    joinedDate: '2023-12-20',
    projects: 89,
    revenue: 15600000,
    rating: 4.9,
    documents: { gst: 'verified', pan: 'verified' }
  }
];

// Helper functions
const generateId = () => `CON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const formatNumber = (num: number) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const specializations = [
  'Civil Contractor', 'Interior Designer', 'Electrician', 
  'Plumber', 'Architect', 'Carpenter', 'Painter'
];

// ==================== MAIN COMPONENT ====================
const ContractorManagement = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'approve' | 'reject' | 'details' | 'commission' | 'block' | 'add' | 'edit' | 'delete'>('none');
  const [rejectionReason, setRejectionReason] = useState('');
  const [commission, setCommission] = useState('8');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof Contractor>('joinedDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Filters
  const [filters, setFilters] = useState({
    specialization: '',
    experience: '',
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
    specialization: '',
    experience: '',
    revenue: 0
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setContractors(initialContractors);
      setLoading(false);
    };
    loadData();

    // Load commission rates from localStorage (admin commission page)
    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const rates = JSON.parse(saved);
      setCommission(rates.contractor?.toString() ?? '8');
    }
    const handleCommissionUpdate = () => {
      const updated = localStorage.getItem('adminCommissionRates');
      if (updated) setCommission(JSON.parse(updated).contractor?.toString() ?? '8');
    };
    window.addEventListener('commissionUpdate', handleCommissionUpdate);
    return () => window.removeEventListener('commissionUpdate', handleCommissionUpdate);
  }, []);

  // Tabs configuration
  const tabs = [
    { id: 'all', name: 'All', icon: Users, count: contractors.length, color: 'gray' },
    { id: 'pending', name: 'Pending', icon: Clock, count: contractors.filter(c => c.status === 'pending').length, color: 'yellow' },
    { id: 'approved', name: 'Approved', icon: CheckCircle, count: contractors.filter(c => c.status === 'approved').length, color: 'green' },
    { id: 'rejected', name: 'Rejected', icon: XCircle, count: contractors.filter(c => c.status === 'rejected').length, color: 'red' }
  ];

  // Filter, search, and sort contractors
  const filteredContractors = useMemo(() => {
    let filtered = [...contractors];
    
    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(c => c.status === activeTab);
    }
    
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(c =>
        c.companyName.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    
    // Advanced filters
    if (filters.specialization) {
      filtered = filtered.filter(c => c.specialization === filters.specialization);
    }
    if (filters.experience) {
      const years = parseInt(filters.experience);
      filtered = filtered.filter(c => parseInt(c.experience) >= years);
    }
    if (filters.rating) {
      filtered = filtered.filter(c => c.rating >= parseFloat(filters.rating));
    }
    if (filters.revenue) {
      const minRevenue = parseInt(filters.revenue);
      filtered = filtered.filter(c => c.revenue >= minRevenue);
    }
    if (filters.dateFrom) {
      filtered = filtered.filter(c => c.joinedDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(c => c.joinedDate <= filters.dateTo);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === 'revenue' || sortField === 'projects' || sortField === 'rating') {
        aVal = a[sortField] as number;
        bVal = b[sortField] as number;
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [contractors, activeTab, searchQuery, filters, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredContractors.length / itemsPerPage);
  const paginatedContractors = filteredContractors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, filters, sortField, sortOrder]);

  // Handlers
  const handleSort = (field: keyof Contractor) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    if (selectedContractors.length === paginatedContractors.length) {
      setSelectedContractors([]);
    } else {
      setSelectedContractors(paginatedContractors.map(c => c.id));
    }
  };

  const handleSelectContractor = (id: string) => {
    setSelectedContractors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedContractors.length) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    let updated = [...contractors];
    if (action === 'Approve') {
      updated = updated.map(c => selectedContractors.includes(c.id) ? { ...c, status: 'approved' } : c);
      toast.success(`${selectedContractors.length} contractor(s) approved`);
    } else if (action === 'Reject') {
      updated = updated.map(c => selectedContractors.includes(c.id) ? { ...c, status: 'rejected' } : c);
      toast.success(`${selectedContractors.length} contractor(s) rejected`);
    } else if (action === 'Delete') {
      updated = updated.filter(c => !selectedContractors.includes(c.id));
      toast.success(`${selectedContractors.length} contractor(s) deleted`);
    }
    setContractors(updated);
    setSelectedContractors([]);
    setLoading(false);
  };

  const handleAddContractor = async () => {
    // Validate form
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = '10-digit number required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newContractor: Contractor = {
      id: generateId(),
      ...formData,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      projects: 0,
      revenue: 0,
      rating: 0,
      documents: { gst: 'pending', pan: 'pending' }
    };
    setContractors(prev => [newContractor, ...prev]);
    toast.success('Contractor added successfully');
    setShowModal('none');
    resetForm();
    setLoading(false);
  };

  const handleEditContractor = async () => {
    if (!selectedContractor) return;
    // Validate
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = '10-digit number required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setContractors(prev =>
      prev.map(c => c.id === selectedContractor.id
        ? { ...c, ...formData, status: c.status === 'approved' ? 'pending' : c.status } // require re-approval if changed
        : c
      )
    );
    toast.success('Contractor updated successfully');
    setShowModal('none');
    setSelectedContractor(null);
    resetForm();
    setLoading(false);
  };

  const handleDeleteContractor = async () => {
    if (!selectedContractor) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setContractors(prev => prev.filter(c => c.id !== selectedContractor.id));
    toast.success('Contractor deleted');
    setShowModal('none');
    setSelectedContractor(null);
    setLoading(false);
  };

  const handleApproveContractor = async () => {
    if (!selectedContractor) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setContractors(prev =>
      prev.map(c => c.id === selectedContractor.id ? { ...c, status: 'approved' } : c)
    );
    toast.success(`${selectedContractor.companyName} approved`);
    setShowModal('none');
    setSelectedContractor(null);
    setLoading(false);
  };

  const handleRejectContractor = async () => {
    if (!selectedContractor) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setContractors(prev =>
      prev.map(c => c.id === selectedContractor.id ? { ...c, status: 'rejected' } : c)
    );
    toast.success(`${selectedContractor.companyName} rejected`);
    setShowModal('none');
    setSelectedContractor(null);
    setRejectionReason('');
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      ownerName: '',
      email: '',
      phone: '',
      location: '',
      specialization: '',
      experience: '',
      revenue: 0
    });
    setFormErrors({});
  };

  const openAddModal = () => {
    resetForm();
    setSelectedContractor(null);
    setShowModal('add');
  };

  const openEditModal = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setFormData({
      companyName: contractor.companyName,
      ownerName: contractor.ownerName,
      email: contractor.email,
      phone: contractor.phone,
      location: contractor.location,
      specialization: contractor.specialization,
      experience: contractor.experience,
      revenue: contractor.revenue
    });
    setFormErrors({});
    setShowModal('edit');
  };

  const openDeleteModal = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setShowModal('delete');
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      experience: '',
      rating: '',
      revenue: '',
      dateFrom: '',
      dateTo: ''
    });
    setSearchQuery('');
    setActiveTab('all');
  };

  // Status badge component
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

  const getDocumentStatus = (status: string) => {
    const styles = {
      verified: 'text-green-600 bg-green-50',
      pending: 'text-yellow-600 bg-yellow-50',
      rejected: 'text-red-600 bg-red-50'
    };
    const icons = {
      verified: CheckCircle,
      pending: Clock,
      rejected: XCircle
    };
    const Icon = icons[status as keyof typeof icons];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Loading skeleton
  if (loading && contractors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading contractors...</p>
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
              <HardHat className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600" />
              Contractor Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage and monitor all contractors in one place
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-orange-50 text-orange-600' : 'text-gray-500'}`} title="Table View"><Menu className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-500'}`} title="Grid View"><Grid className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Contractor</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const colors = { gray: 'bg-gray-100 text-gray-600', yellow: 'bg-yellow-100 text-yellow-600', green: 'bg-green-100 text-green-600', red: 'bg-red-100 text-red-600' };
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`bg-white rounded-lg border p-3 transition-all ${activeTab === tab.id ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}>
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
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search contractors..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <Filter className="w-4 h-4" /><span className="hidden sm:inline">Filters</span>
              </button>
              <select value={filters.specialization} onChange={(e) => setFilters({...filters, specialization: e.target.value})} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
                <option value="">All Types</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Experience (Years)</label><select value={filters.experience} onChange={(e) => setFilters({...filters, experience: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">Any</option><option value="5">5+ years</option><option value="10">10+ years</option><option value="15">15+ years</option></select></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label><select value={filters.rating} onChange={(e) => setFilters({...filters, rating: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">Any</option><option value="4">4+ Stars</option><option value="4.5">4.5+ Stars</option><option value="5">5 Stars</option></select></div>
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
          {selectedContractors.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-orange-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">{selectedContractors.length} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => handleBulkAction('Reject')} className="px-3 py-1 bg-red-500 rounded-md text-sm hover:bg-red-600">Reject</button>
                <button onClick={() => handleBulkAction('Delete')} className="px-3 py-1 bg-gray-700 rounded-md text-sm hover:bg-gray-800">Delete</button>
                <button onClick={() => setSelectedContractors([])} className="p-1 hover:bg-orange-700 rounded"><X className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden items-center justify-end gap-2 mb-4">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Menu className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Grid className="w-4 h-4" /></button>
        </div>

        {/* Content Area */}
        {filteredContractors.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No contractors found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700">Clear Filters</button>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedContractors.length === paginatedContractors.length} onChange={handleSelectAll} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" /></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('companyName')}>Contractor {sortField === 'companyName' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('location')}>Location {sortField === 'location' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('revenue')}>Revenue {sortField === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedContractors.map((contractor) => (
                    <tr key={contractor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedContractors.includes(contractor.id)} onChange={() => handleSelectContractor(contractor.id)} className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><HardHat className="w-4 h-4 text-orange-600" /></div>
                          <div><div className="font-medium text-gray-900">{contractor.companyName}</div><div className="text-xs text-gray-500">{contractor.ownerName}</div></div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><div className="text-sm">{contractor.email}</div><div className="text-xs text-gray-500">{contractor.phone}</div></td>
                      <td className="px-4 py-3 text-sm">{contractor.location}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatNumber(contractor.revenue)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1 text-sm font-medium text-orange-600"><Percent className="w-3 h-3" /> {commission}%</div></td>
                      <td className="px-4 py-3">{getStatusBadge(contractor.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelectedContractor(contractor); setShowModal('details'); }} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => openEditModal(contractor)} className="p-1 hover:bg-green-100 rounded text-green-600" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => openDeleteModal(contractor)} className="p-1 hover:bg-red-100 rounded text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          {contractor.status === 'pending' && (
                            <>
                              <button onClick={() => { setSelectedContractor(contractor); setShowModal('approve'); }} className="p-1 hover:bg-green-100 rounded text-green-600" title="Approve"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => { setSelectedContractor(contractor); setShowModal('reject'); }} className="p-1 hover:bg-red-100 rounded text-red-600" title="Reject"><XCircle className="w-4 h-4" /></button>
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
              <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredContractors.length)} of {filteredContractors.length} contractors</div>
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
            {paginatedContractors.map((contractor) => (
              <motion.div key={contractor.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -2 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"><HardHat className="w-5 h-5 text-orange-600" /></div>
                      <div><h3 className="font-semibold text-gray-900">{contractor.companyName}</h3><p className="text-xs text-gray-500">{contractor.ownerName}</p></div>
                    </div>
                    {getStatusBadge(contractor.status)}
                  </div>
                  <div className="space-y-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{contractor.email}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" /><span>{contractor.phone}</span></div>
                    <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /><span>{contractor.location}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
                    <div className="text-center"><p className="text-sm font-semibold text-gray-900">{contractor.projects}</p><p className="text-xs text-gray-500">Projects</p></div>
                    <div className="text-center"><p className="text-sm font-semibold text-green-600">{formatNumber(contractor.revenue)}</p><p className="text-xs text-gray-500">Revenue</p></div>
                    <div className="text-center"><div className="flex items-center justify-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /><span className="text-sm font-semibold">{contractor.rating}</span></div><p className="text-xs text-gray-500">Rating</p></div>
                  </div>
                  <div className="flex gap-2 mt-2">{getDocumentStatus(contractor.documents.gst)}{getDocumentStatus(contractor.documents.pan)}</div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-medium"><Percent className="w-3 h-3" /> Commission: {commission}%</div>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedContractor(contractor); setShowModal('details'); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEditModal(contractor)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => openDeleteModal(contractor)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination for grid view */}
        {viewMode === 'grid' && filteredContractors.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredContractors.length)} of {filteredContractors.length}</div>
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
          {/* Add Contractor Modal */}
          {showModal === 'add' && (
            <Modal title="Add New Contractor" onClose={() => setShowModal('none')} size="lg">
              <ContractorForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddContractor} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Add Contractor</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Edit Contractor Modal */}
          {showModal === 'edit' && selectedContractor && (
            <Modal title="Edit Contractor" onClose={() => setShowModal('none')} size="lg">
              <ContractorForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6">
                <button onClick={handleEditContractor} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Changes</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Delete Confirmation */}
          {showModal === 'delete' && selectedContractor && (
            <Modal title="Delete Contractor" onClose={() => setShowModal('none')}>
              <div className="bg-red-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-800">Are you sure you want to delete <span className="font-semibold">{selectedContractor.companyName}</span>? This action cannot be undone.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDeleteContractor} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Delete</button>
                <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
              </div>
            </Modal>
          )}

          {/* Approve Modal */}
          {showModal === 'approve' && selectedContractor && (
            <Modal title="Approve Contractor" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg"><p className="text-sm text-green-800">Approve <span className="font-semibold">{selectedContractor.companyName}</span></p></div>
                <div className="flex gap-3"><button onClick={handleApproveContractor} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
              </div>
            </Modal>
          )}

          {/* Reject Modal */}
          {showModal === 'reject' && selectedContractor && (
            <Modal title="Reject Contractor" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg"><p className="text-sm text-red-800">Reject <span className="font-semibold">{selectedContractor.companyName}</span></p></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Reason</label><textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Enter rejection reason..." /></div>
                <div className="flex gap-3"><button onClick={handleRejectContractor} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button><button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
              </div>
            </Modal>
          )}

          {/* Details Modal */}
          {showModal === 'details' && selectedContractor && (
            <Modal title="Contractor Details" onClose={() => setShowModal('none')} size="lg">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Company</p><p className="font-medium">{selectedContractor.companyName}</p></div>
                  <div><p className="text-xs text-gray-500">Owner</p><p>{selectedContractor.ownerName}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p className="text-sm">{selectedContractor.email}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p>{selectedContractor.phone}</p></div>
                  <div><p className="text-xs text-gray-500">Location</p><p>{selectedContractor.location}</p></div>
                  <div><p className="text-xs text-gray-500">Specialization</p><p>{selectedContractor.specialization}</p></div>
                  <div><p className="text-xs text-gray-500">Experience</p><p>{selectedContractor.experience}</p></div>
                  <div><p className="text-xs text-gray-500">Joined Date</p><p>{selectedContractor.joinedDate}</p></div>
                  <div><p className="text-xs text-gray-500">Projects</p><p>{selectedContractor.projects}</p></div>
                  <div><p className="text-xs text-gray-500">Revenue</p><p className="font-semibold text-green-600">{formatNumber(selectedContractor.revenue)}</p></div>
                  <div><p className="text-xs text-gray-500">Rating</p><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{selectedContractor.rating}</span></div></div>
                  <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedContractor.status)}</div>
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
const ContractorForm = ({ formData, setFormData, errors }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; errors: Partial<Record<keyof FormData, string>> }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label><input type="text" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.companyName}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label><input type="text" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.ownerName ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.ownerName}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.email}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="10-digit number" /><p className="text-xs text-red-500 mt-1">{errors.phone}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Location *</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.location}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label><select value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.specialization ? 'border-red-500' : 'border-gray-200'}`}><option value="">Select</option>{specializations.map(s => <option key={s} value={s}>{s}</option>)}</select><p className="text-xs text-red-500 mt-1">{errors.specialization}</p></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label><input type="text" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} placeholder="e.g., 10 years" className={`w-full px-3 py-2 border rounded-lg ${errors.experience ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.experience}</p></div>
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

export default ContractorManagement;