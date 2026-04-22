// src/pages/admin/ProductsManagement.tsx
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search, Filter, Eye, CheckCircle, XCircle, Download,
  Star, Clock, Package, Edit2, Menu, X, ChevronLeft, ChevronRight, Grid,
  PlusCircle, Image as ImageIcon, Percent, Trash2
} from 'lucide-react';

// ==================== TYPES ====================
interface Product {
  id: string;
  name: string;
  category: string;
  sellerName: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  rating: number;
  soldCount: number;
  image?: string;
}

interface FormData {
  name: string;
  category: string;
  sellerName: string;
  price: number;
  stock: number;
  featured: boolean;
}

interface CommissionRates {
  cement: number;
  bricks: number;
  steel: number;
  other: number;
  vehicle: number;
  equipment: number;
}

// ==================== MOCK DATA ====================
const initialProducts: Product[] = [
  {
    id: 'PRD-001',
    name: 'UltraTech Cement (50kg)',
    category: 'Construction',
    sellerName: 'ABC Constructions',
    price: 350,
    stock: 5000,
    status: 'active',
    featured: true,
    rating: 4.5,
    soldCount: 1250
  },
  {
    id: 'PRD-002',
    name: 'TATA TMT Steel Bars (12mm)',
    category: 'Construction',
    sellerName: 'XYZ Enterprises',
    price: 750,
    stock: 2500,
    status: 'active',
    featured: false,
    rating: 4.8,
    soldCount: 850
  },
  {
    id: 'PRD-003',
    name: 'JCB 3DX Backhoe Loader',
    category: 'Equipment',
    sellerName: 'JCB Rentals',
    price: 8500,
    stock: 5,
    status: 'pending',
    featured: false,
    rating: 0,
    soldCount: 0
  },
  {
    id: 'PRD-004',
    name: 'Bosch Hammer Drill',
    category: 'Tools',
    sellerName: 'Power Tools',
    price: 4500,
    stock: 150,
    status: 'active',
    featured: true,
    rating: 4.6,
    soldCount: 320
  },
  {
    id: 'PRD-005',
    name: 'Asian Paints Royale',
    category: 'Paint',
    sellerName: 'PQR Builders',
    price: 2200,
    stock: 0,
    status: 'inactive',
    featured: false,
    rating: 4.3,
    soldCount: 430
  }
];

// Helper functions
const generateId = () => `PRD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const categories = ['Construction', 'Equipment', 'Tools', 'Paint', 'Electrical', 'Plumbing'];

// ==================== MAIN COMPONENT ====================
const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'details' | 'edit' | 'delete' | 'approve' | 'reject' | 'feature' | 'add'>('none');
  const [productCommission, setProductCommission] = useState(5);
  
  // Filters
  const [filters, setFilters] = useState({
    category: '',
    stock: '',
    rating: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting
  const [sortField, setSortField] = useState<keyof Product>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Form state for add/edit
  const [formData, setFormData] = useState<FormData>({
    name: '', category: '', sellerName: '', price: 0, stock: 0, featured: false
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Load mock data and commission
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProducts(initialProducts);
      setLoading(false);
    };
    loadData();

    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const rates: CommissionRates = JSON.parse(saved);
      setProductCommission(rates.other ?? 5);
    }
    const handleCommissionUpdate = () => {
      const updated = localStorage.getItem('adminCommissionRates');
      if (updated) setProductCommission(JSON.parse(updated).other ?? 5);
    };
    window.addEventListener('commissionUpdate', handleCommissionUpdate);
    return () => window.removeEventListener('commissionUpdate', handleCommissionUpdate);
  }, []);

  // Tabs
  const tabs = [
    { id: 'all', name: 'All', icon: Package, count: products.length, color: 'blue' },
    { id: 'active', name: 'Active', icon: CheckCircle, count: products.filter(p => p.status === 'active').length, color: 'green' },
    { id: 'pending', name: 'Pending', icon: Clock, count: products.filter(p => p.status === 'pending').length, color: 'yellow' },
    { id: 'inactive', name: 'Inactive', icon: XCircle, count: products.filter(p => p.status === 'inactive').length, color: 'gray' },
    { id: 'featured', name: 'Featured', icon: Star, count: products.filter(p => p.featured).length, color: 'purple' }
  ];

  // Filter, search, sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Tab filter
    if (activeTab !== 'all') {
      if (activeTab === 'featured') filtered = filtered.filter(p => p.featured);
      else filtered = filtered.filter(p => p.status === activeTab);
    }
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    
    // Advanced filters
    if (filters.category) filtered = filtered.filter(p => p.category === filters.category);
    if (filters.stock === 'instock') filtered = filtered.filter(p => p.stock > 0);
    else if (filters.stock === 'lowstock') filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
    else if (filters.stock === 'outofstock') filtered = filtered.filter(p => p.stock === 0);
    if (filters.rating) filtered = filtered.filter(p => p.rating >= parseFloat(filters.rating));
    
    // Sorting – handle undefined values by converting to safe comparables
    filtered.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      switch (sortField) {
        case 'name':
        case 'category':
        case 'sellerName':
        case 'status':
          aVal = a[sortField] ?? '';
          bVal = b[sortField] ?? '';
          break;
        case 'price':
        case 'stock':
        case 'soldCount':
        case 'rating':
          aVal = a[sortField] ?? 0;
          bVal = b[sortField] ?? 0;
          break;
        case 'featured':
          aVal = a[sortField] ? 1 : 0;
          bVal = b[sortField] ? 1 : 0;
          break;
        default:
          aVal = a[sortField] ?? '';
          bVal = b[sortField] ?? '';
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [products, activeTab, searchQuery, filters, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  useEffect(() => setCurrentPage(1), [activeTab, searchQuery, filters, sortField, sortOrder]);

  // CRUD Handlers
  const handleAddProduct = async () => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) errors.name = 'Product name required';
    if (!formData.category) errors.category = 'Category required';
    if (!formData.sellerName.trim()) errors.sellerName = 'Seller name required';
    if (formData.price <= 0) errors.price = 'Price must be > 0';
    if (formData.stock < 0) errors.stock = 'Stock cannot be negative';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    const newProduct: Product = {
      id: generateId(),
      ...formData,
      status: 'pending',
      rating: 0,
      soldCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    toast.success('Product added successfully');
    setShowModal('none');
    resetForm();
    setLoading(false);
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!formData.name.trim()) errors.name = 'Product name required';
    if (!formData.category) errors.category = 'Category required';
    if (!formData.sellerName.trim()) errors.sellerName = 'Seller name required';
    if (formData.price <= 0) errors.price = 'Price must be > 0';
    if (formData.stock < 0) errors.stock = 'Stock cannot be negative';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setProducts(prev => prev.map(p => p.id === selectedProduct.id
      ? { ...p, ...formData, status: p.status === 'active' ? 'pending' : p.status }
      : p
    ));
    toast.success('Product updated successfully');
    setShowModal('none');
    setSelectedProduct(null);
    resetForm();
    setLoading(false);
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    toast.success('Product deleted');
    setShowModal('none');
    setSelectedProduct(null);
    setLoading(false);
  };

  const handleApproveProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, status: 'active' } : p));
    toast.success(`${selectedProduct.name} approved`);
    setShowModal('none');
    setSelectedProduct(null);
    setLoading(false);
  };

  const handleRejectProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, status: 'inactive' } : p));
    toast.success(`${selectedProduct.name} rejected`);
    setShowModal('none');
    setSelectedProduct(null);
    setLoading(false);
  };

  const handleFeatureProduct = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, featured: !p.featured } : p));
    toast.success(`${selectedProduct.name} ${selectedProduct.featured ? 'removed from' : 'added to'} featured`);
    setShowModal('none');
    setSelectedProduct(null);
    setLoading(false);
  };

  const handleBulkAction = async (action: string) => {
    if (!selectedProducts.length) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    let updated = [...products];
    if (action === 'Approve') {
      updated = updated.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'active' } : p);
      toast.success(`${selectedProducts.length} product(s) approved`);
    } else if (action === 'Reject') {
      updated = updated.map(p => selectedProducts.includes(p.id) ? { ...p, status: 'inactive' } : p);
      toast.success(`${selectedProducts.length} product(s) rejected`);
    } else if (action === 'Feature') {
      updated = updated.map(p => selectedProducts.includes(p.id) ? { ...p, featured: true } : p);
      toast.success(`${selectedProducts.length} product(s) featured`);
    } else if (action === 'Delete') {
      updated = updated.filter(p => !selectedProducts.includes(p.id));
      toast.success(`${selectedProducts.length} product(s) deleted`);
    }
    setProducts(updated);
    setSelectedProducts([]);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({ name: '', category: '', sellerName: '', price: 0, stock: 0, featured: false });
    setFormErrors({});
  };

  const openAddModal = () => { resetForm(); setSelectedProduct(null); setShowModal('add'); };
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      sellerName: product.sellerName,
      price: product.price,
      stock: product.stock,
      featured: product.featured
    });
    setFormErrors({});
    setShowModal('edit');
  };
  const openDeleteModal = (product: Product) => { setSelectedProduct(product); setShowModal('delete'); };
  const openApproveModal = (product: Product) => { setSelectedProduct(product); setShowModal('approve'); };
  const openRejectModal = (product: Product) => { setSelectedProduct(product); setShowModal('reject'); };
  const openFeatureModal = (product: Product) => { setSelectedProduct(product); setShowModal('feature'); };

  const handleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) setSelectedProducts([]);
    else setSelectedProducts(paginatedProducts.map(p => p.id));
  };
  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };
  const clearFilters = () => {
    setFilters({ category: '', stock: '', rating: '' });
    setSearchQuery('');
    setActiveTab('all');
  };
  const handleSort = (field: keyof Product) => {
    if (sortField === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  const getStatusBadge = (status: string) => {
    const styles = { active: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', inactive: 'bg-gray-100 text-gray-800' };
    const icons = { active: CheckCircle, pending: Clock, inactive: XCircle };
    const Icon = icons[status as keyof typeof icons];
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}><Icon className="w-3 h-3" />{status}</span>;
  };
  const getStockStatus = (stock: number) => {
    if (stock === 0) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    if (stock < 10) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>;
  };

  if (loading && products.length === 0) {
    return <div className="flex justify-center items-center min-h-[400px]"><div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" /> Products Management</h1><p className="text-xs sm:text-sm text-gray-500 mt-1">Manage your product catalog and inventory</p></div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-purple-50 text-purple-600' : 'text-gray-500'}`}><Menu className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-500'}`}><Grid className="w-4 h-4" /></button>
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4 text-gray-600" /></button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"><PlusCircle className="w-4 h-4" /><span className="hidden sm:inline">Add Product</span></button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const colors = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', yellow: 'bg-yellow-100 text-yellow-600', gray: 'bg-gray-100 text-gray-600', purple: 'bg-purple-100 text-purple-600' };
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`bg-white rounded-lg border p-3 transition-all ${activeTab === tab.id ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-1"><div className={`p-1.5 rounded-lg ${colors[tab.color as keyof typeof colors]}`}><Icon className="w-4 h-4" /></div><span className="text-lg font-bold text-gray-900">{tab.count}</span></div>
                <p className="text-xs text-gray-600">{tab.name}</p>
              </button>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
            <div className="flex gap-2">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${showFilters ? 'bg-purple-600 text-white' : 'bg-white hover:bg-gray-50'}`}><Filter className="w-4 h-4" />Filters</button>
              <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"><option value="">All Categories</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
          <AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Stock Status</label><select value={filters.stock} onChange={(e) => setFilters({...filters, stock: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">All</option><option value="instock">In Stock</option><option value="lowstock">Low Stock</option><option value="outofstock">Out of Stock</option></select></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label><select value={filters.rating} onChange={(e) => setFilters({...filters, rating: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">All</option><option value="4">4+ Stars</option><option value="4.5">4.5+ Stars</option><option value="5">5 Stars</option></select></div></div><div className="flex justify-end mt-4"><button onClick={clearFilters} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"><X className="w-3 h-3" />Clear all</button></div></motion.div>)}</AnimatePresence>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>{selectedProducts.length > 0 && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-purple-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between"><span className="text-sm font-medium">{selectedProducts.length} selected</span><div className="flex gap-2"><button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md hover:bg-green-600">Approve</button><button onClick={() => handleBulkAction('Reject')} className="px-3 py-1 bg-red-500 rounded-md hover:bg-red-600">Reject</button><button onClick={() => handleBulkAction('Feature')} className="px-3 py-1 bg-yellow-500 rounded-md hover:bg-yellow-600">Feature</button><button onClick={() => handleBulkAction('Delete')} className="px-3 py-1 bg-gray-700 rounded-md hover:bg-gray-800">Delete</button><button onClick={() => setSelectedProducts([])} className="p-1 hover:bg-purple-700 rounded"><X className="w-4 h-4" /></button></div></motion.div>)}</AnimatePresence>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden justify-end gap-2 mb-4">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-white border'}`}><Menu className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white border'}`}><Grid className="w-4 h-4" /></button>
        </div>

        {/* Content */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center"><Package className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3><p className="text-sm text-gray-500">Try adjusting your search or filters</p><button onClick={clearFilters} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg">Clear Filters</button></div>
        ) : viewMode === 'table' ? (
          <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr><th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0} onChange={handleSelectAll} className="rounded border-gray-300 text-purple-600" /></th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>Product {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('category')}>Category {sortField === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('price')}>Price {sortField === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('stock')}>Stock {sortField === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('soldCount')}>Sales {sortField === 'soldCount' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('rating')}>Rating {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('status')}>Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedProducts.includes(product.id)} onChange={() => handleSelectProduct(product.id)} className="rounded border-gray-300 text-purple-600" /></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-400" /></div><div><div className="font-medium text-gray-900">{product.name}</div><div className="text-xs text-gray-500">{product.sellerName}</div></div></div></td>
                      <td className="px-4 py-3 text-sm">{product.category}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.price)}</td>
                      <td className="px-4 py-3">{getStockStatus(product.stock)}</td>
                      <td className="px-4 py-3 text-sm">{formatNumber(product.soldCount)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm">{product.rating}</span></div></td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1 text-xs text-purple-600"><Percent className="w-3 h-3" />{productCommission}%</div></td>
                      <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
                      <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => { setSelectedProduct(product); setShowModal('details'); }} className="p-1 hover:bg-blue-100 rounded text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openEditModal(product)} className="p-1 hover:bg-green-100 rounded text-green-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => openDeleteModal(product)} className="p-1 hover:bg-red-100 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>{product.status === 'pending' && (<><button onClick={() => openApproveModal(product)} className="p-1 hover:bg-green-100 rounded text-green-600"><CheckCircle className="w-4 h-4" /></button><button onClick={() => openRejectModal(product)} className="p-1 hover:bg-red-100 rounded text-red-600"><XCircle className="w-4 h-4" /></button></>)}<button onClick={() => openFeatureModal(product)} className="p-1 hover:bg-yellow-100 rounded text-yellow-600"><Star className="w-4 h-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products</div>
              <div className="flex items-center gap-2"><select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border rounded text-sm"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button><span className="text-sm">Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map(product => (
              <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -2 }} className="bg-white rounded-lg border overflow-hidden">
                <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                  {product.featured && <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full"><Star className="w-3 h-3 fill-current" /></div>}
                  {product.status === 'pending' && <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</div>}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2"><div><h3 className="font-semibold text-gray-900">{product.name}</h3><p className="text-xs text-gray-500">{product.sellerName}</p></div>{getStatusBadge(product.status)}</div>
                  <div className="flex items-center justify-between mb-2"><span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span className="text-sm">{product.rating}</span></div></div>
                  <div className="flex items-center justify-between text-sm mb-3"><span className="text-gray-500">Sold: {formatNumber(product.soldCount)}</span>{getStockStatus(product.stock)}</div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-1 text-xs text-purple-600"><Percent className="w-3 h-3" />Commission: {productCommission}%</div><div className="flex gap-1"><button onClick={() => { setSelectedProduct(product); setShowModal('details'); }} className="p-1.5 hover:bg-blue-50 rounded text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => openEditModal(product)} className="p-1.5 hover:bg-green-50 rounded text-green-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => openDeleteModal(product)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button></div></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination for grid */}
        {viewMode === 'grid' && filteredProducts.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-500">Showing {((currentPage-1)*itemsPerPage)+1} to {Math.min(currentPage*itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</div>
            <div className="flex items-center gap-2"><select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border rounded text-sm"><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button><span className="text-sm">Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button></div>
          </div>
        )}

        {/* ==================== MODALS ==================== */}
        <AnimatePresence>
          {showModal === 'add' && (
            <Modal title="Add Product" onClose={() => setShowModal('none')} size="lg">
              <ProductForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6"><button onClick={handleAddProduct} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Add Product</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'edit' && selectedProduct && (
            <Modal title="Edit Product" onClose={() => setShowModal('none')} size="lg">
              <ProductForm formData={formData} setFormData={setFormData} errors={formErrors} />
              <div className="flex gap-3 mt-6"><button onClick={handleEditProduct} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Save Changes</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'delete' && selectedProduct && (
            <Modal title="Delete Product" onClose={() => setShowModal('none')}>
              <div className="bg-red-50 p-4 rounded-lg mb-4"><p className="text-sm text-red-800">Are you sure you want to delete <span className="font-semibold">{selectedProduct.name}</span>? This action cannot be undone.</p></div>
              <div className="flex gap-3"><button onClick={handleDeleteProduct} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Delete</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'approve' && selectedProduct && (
            <Modal title="Approve Product" onClose={() => setShowModal('none')}>
              <div className="bg-green-50 p-4 rounded-lg mb-4"><p className="text-sm text-green-800">Approve <span className="font-semibold">{selectedProduct.name}</span>?</p></div>
              <div className="flex gap-3"><button onClick={handleApproveProduct} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'reject' && selectedProduct && (
            <Modal title="Reject Product" onClose={() => setShowModal('none')}>
              <div className="bg-red-50 p-4 rounded-lg mb-4"><p className="text-sm text-red-800">Reject <span className="font-semibold">{selectedProduct.name}</span>?</p></div>
              <div className="flex gap-3"><button onClick={handleRejectProduct} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'feature' && selectedProduct && (
            <Modal title={selectedProduct.featured ? "Remove from Featured" : "Add to Featured"} onClose={() => setShowModal('none')}>
              <div className="bg-yellow-50 p-4 rounded-lg mb-4"><p className="text-sm text-yellow-800">{selectedProduct.featured ? `Remove ${selectedProduct.name} from featured?` : `Add ${selectedProduct.name} to featured?`}</p></div>
              <div className="flex gap-3"><button onClick={handleFeatureProduct} className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700">Confirm</button><button onClick={() => setShowModal('none')} className="flex-1 border py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>
            </Modal>
          )}
          {showModal === 'details' && selectedProduct && (
            <Modal title="Product Details" onClose={() => setShowModal('none')}>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">ID</p><p className="font-medium">{selectedProduct.id}</p></div>
                <div><p className="text-xs text-gray-500">Name</p><p>{selectedProduct.name}</p></div>
                <div><p className="text-xs text-gray-500">Category</p><p>{selectedProduct.category}</p></div>
                <div><p className="text-xs text-gray-500">Seller</p><p>{selectedProduct.sellerName}</p></div>
                <div><p className="text-xs text-gray-500">Price</p><p className="font-bold text-green-600">{formatCurrency(selectedProduct.price)}</p></div>
                <div><p className="text-xs text-gray-500">Stock</p><p>{selectedProduct.stock}</p></div>
                <div><p className="text-xs text-gray-500">Sold</p><p>{selectedProduct.soldCount}</p></div>
                <div><p className="text-xs text-gray-500">Rating</p><div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-current" /><span>{selectedProduct.rating}</span></div></div>
                <div><p className="text-xs text-gray-500">Status</p>{getStatusBadge(selectedProduct.status)}</div>
                <div><p className="text-xs text-gray-500">Commission</p><p className="text-purple-600 font-medium">{productCommission}%</p></div>
              </div>
              <button onClick={() => setShowModal('none')} className="w-full mt-4 border py-2 rounded-lg hover:bg-gray-50">Close</button>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Product Form Component
const ProductForm = ({ formData, setFormData, errors }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>>; errors: Partial<Record<keyof FormData, string>> }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.name}</p></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Category *</label><select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.category ? 'border-red-500' : 'border-gray-200'}`}><option value="">Select</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select><p className="text-xs text-red-500 mt-1">{errors.category}</p></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Seller Name *</label><input type="text" value={formData.sellerName} onChange={(e) => setFormData({...formData, sellerName: e.target.value})} className={`w-full px-3 py-2 border rounded-lg ${errors.sellerName ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.sellerName}</p></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label><input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className={`w-full px-3 py-2 border rounded-lg ${errors.price ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.price}</p></div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label><input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className={`w-full px-3 py-2 border rounded-lg ${errors.stock ? 'border-red-500' : 'border-gray-200'}`} /><p className="text-xs text-red-500 mt-1">{errors.stock}</p></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4 text-purple-600 rounded" /><label className="text-sm text-gray-700">Featured Product</label></div>
    </div>
  </div>
);

// Modal Component
const Modal = ({ title, children, onClose, size = 'md' }: { title: string; children: React.ReactNode; onClose: () => void; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="p-4 sm:p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>{children}</div>
      </motion.div>
    </div>
  );
};

export default ProductsManagement;