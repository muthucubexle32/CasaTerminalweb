// src/pages/admin/ProductsManagement.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, CheckCircle, XCircle, MoreVertical, Download,
  Star, Clock, Package, 
  Edit2, 
  
  Menu, X, ChevronLeft, ChevronRight, Grid, 
  PlusCircle, Image as ImageIcon} from 'lucide-react';

// Simplified Product Interface
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

const ProductsManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Default grid for mobile
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'details' | 'edit' | 'delete' | 'approve' | 'reject' | 'stock'>('none');
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    stock: '',
    rating: ''
  });

  // Mock data - Simplified
  const [products] = useState<Product[]>([
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
  ]);

  const categories = ['Construction', 'Equipment', 'Tools', 'Paint', 'Electrical', 'Plumbing'];

  const tabs = [
    { id: 'all', name: 'All', icon: Package, count: products.length, color: 'blue' },
    { id: 'active', name: 'Active', icon: CheckCircle, count: products.filter(p => p.status === 'active').length, color: 'green' },
    { id: 'pending', name: 'Pending', icon: Clock, count: products.filter(p => p.status === 'pending').length, color: 'yellow' },
    { id: 'inactive', name: 'Inactive', icon: XCircle, count: products.filter(p => p.status === 'inactive').length, color: 'gray' },
    { id: 'featured', name: 'Featured', icon: Star, count: products.filter(p => p.featured).length, color: 'purple' }
  ];

  // Filter products
  const filteredProducts = products.filter(product => {
    if (activeTab !== 'all') {
      if (activeTab === 'featured' && !product.featured) return false;
      if (activeTab !== 'featured' && product.status !== activeTab) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.sellerName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }
    
    if (filters.category && product.category !== filters.category) return false;
    if (filters.stock) {
      if (filters.stock === 'instock' && product.stock === 0) return false;
      if (filters.stock === 'lowstock' && product.stock > 10) return false;
      if (filters.stock === 'outofstock' && product.stock > 0) return false;
    }
    if (filters.rating && product.rating < parseFloat(filters.rating)) return false;
    
    return true;
  });

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} ${selectedProducts.length} products`);
    setSelectedProducts([]);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    const icons = {
      active: CheckCircle,
      pending: Clock,
      inactive: XCircle
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    } else if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">In Stock</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              Products Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
            
            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            {/* Add Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Total</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-green-600 mt-1">↑ 12%</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Active</span>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{products.filter(p => p.status === 'active').length}</p>
            <p className="text-xs text-green-600 mt-1">↑ 8%</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Pending</span>
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{products.filter(p => p.status === 'pending').length}</p>
            <p className="text-xs text-yellow-600 mt-1">Need review</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Featured</span>
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-lg font-bold text-gray-900">{products.filter(p => p.featured).length}</p>
            <p className="text-xs text-purple-600 mt-1">Premium</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex -mb-px space-x-4 sm:space-x-8 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const colors = {
                blue: 'text-blue-600 border-blue-600',
                green: 'text-green-600 border-green-600',
                yellow: 'text-yellow-600 border-yellow-600',
                gray: 'text-gray-600 border-gray-600',
                purple: 'text-purple-600 border-purple-600'
              };
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? colors[tab.color as keyof typeof colors]
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                  showFilters ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock Status</label>
                    <select
                      value={filters.stock}
                      onChange={(e) => setFilters({...filters, stock: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="instock">In Stock</option>
                      <option value="lowstock">Low Stock</option>
                      <option value="outofstock">Out of Stock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    >
                      <option value="">All</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setFilters({category: '', stock: '', rating: ''})}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-purple-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between"
            >
              <span className="text-sm font-medium">{selectedProducts.length} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => handleBulkAction('Feature')} className="px-3 py-1 bg-yellow-500 rounded-md text-sm hover:bg-yellow-600">Feature</button>
                <button onClick={() => setSelectedProducts([])} className="p-1 hover:bg-purple-700 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile View Toggle */}
        <div className="flex sm:hidden items-center justify-end gap-2 mb-4">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg ${
              viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View - Desktop */
          <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sellerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{product.category}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">{formatCurrency(product.price)}</div>
                      </td>
                      <td className="px-4 py-3">{getStockStatus(product.stock)}</td>
                      <td className="px-4 py-3 text-sm">{formatNumber(product.soldCount)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{product.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(product.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedProduct(product); setShowModal('details'); }}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { setSelectedProduct(product); setShowModal('edit'); }}
                            className="p-1 hover:bg-green-100 rounded text-green-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {product.status === 'pending' && (
                            <button
                              onClick={() => { setSelectedProduct(product); setShowModal('approve'); }}
                              className="p-1 hover:bg-green-100 rounded text-green-600"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View - Mobile & Desktop */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="relative h-32 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white p-1 rounded-full">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                  {product.status === 'pending' && (
                    <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Pending
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.sellerName}</p>
                    </div>
                    {getStatusBadge(product.status)}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-gray-500">Sold: {formatNumber(product.soldCount)}</span>
                    {getStockStatus(product.stock)}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => { setSelectedProduct(product); setShowModal('details'); }}
                      className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedProduct(product); setShowModal('edit'); }}
                      className="p-1.5 hover:bg-green-50 rounded text-green-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-50 rounded text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {/* Details Modal */}
          {showModal === 'details' && selectedProduct && (
            <Modal title="Product Details" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Product ID</p>
                    <p className="font-medium">{selectedProduct.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p>{selectedProduct.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p>{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Seller</p>
                    <p>{selectedProduct.sellerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-bold text-green-600">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p>{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{selectedProduct.rating}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal('none')}
                  className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50 mt-4"
                >
                  Close
                </button>
              </div>
            </Modal>
          )}

          {/* Edit Modal */}
          {showModal === 'edit' && selectedProduct && (
            <Modal title="Edit Product" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    defaultValue={selectedProduct.name}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct.price}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      defaultValue={selectedProduct.stock}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    defaultValue={selectedProduct.status}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">Save</button>
                  <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductsManagement;