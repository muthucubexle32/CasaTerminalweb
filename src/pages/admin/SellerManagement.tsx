// src/pages/admin/SellerManagement.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Percent
} from 'lucide-react';

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

interface CommissionRates {
  other: number;
}

const SellerManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'details' | 'approve' | 'reject' | 'commission' | 'block'>('none');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [productCommission, setProductCommission] = useState<number>(5);
  
  // Filter states
  const [filters, setFilters] = useState({
    location: '',
    rating: '',
    revenue: ''
  });

  // Mock data - Simplified
  const [sellers] = useState<Seller[]>([
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
  ]);

  // Load commission rates from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const rates: CommissionRates = JSON.parse(saved);
      setProductCommission(rates.other ?? 5);
    }
  }, []);

  const tabs = [
    { id: 'all', name: 'All', icon: Users, count: sellers.length, color: 'blue' },
    { id: 'pending', name: 'Pending', icon: Clock, count: sellers.filter(s => s.status === 'pending').length, color: 'yellow' },
    { id: 'approved', name: 'Approved', icon: CheckCircle, count: sellers.filter(s => s.status === 'approved').length, color: 'green' },
    { id: 'rejected', name: 'Rejected', icon: XCircle, count: sellers.filter(s => s.status === 'rejected').length, color: 'red' },
   
  ];

  // Filter sellers
  const filteredSellers = sellers.filter(seller => {
    if (activeTab !== 'all' && seller.status !== activeTab) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        seller.companyName.toLowerCase().includes(query) ||
        seller.ownerName.toLowerCase().includes(query) ||
        seller.email.toLowerCase().includes(query) ||
        seller.location.toLowerCase().includes(query)
      );
    }
    
    if (filters.location && !seller.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.rating && seller.rating < parseFloat(filters.rating)) return false;
    
    return true;
  });

  // Sort sellers
  const sortedSellers = [...filteredSellers].sort((a, b) => {
    const dateA = new Date(a.joinedDate).getTime();
    const dateB = new Date(b.joinedDate).getTime();
    return dateB - dateA;
  });

  const handleSelectAll = () => {
    if (selectedSellers.length === filteredSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(filteredSellers.map(s => s.id));
    }
  };

  const handleSelectSeller = (id: string) => {
    setSelectedSellers(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} ${selectedSellers.length} sellers`);
    setSelectedSellers([]);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      
    };
    
    const icons = {
      approved: CheckCircle,
      pending: Clock,
      rejected: XCircle,
     
    };
    
    const Icon = icons[status as keyof typeof icons];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
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
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
              Seller Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage and monitor all sellers
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
            
            {/* Export Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            {/* Add Button */}
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const colors = {
              blue: 'bg-blue-100 text-blue-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              green: 'bg-green-100 text-green-600',
              red: 'bg-red-100 text-red-600',
            
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`bg-white rounded-lg border p-3 transition-all ${
                  activeTab === tab.id 
                    ? 'border-blue-500 ring-1 ring-blue-500' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={`p-1.5 rounded-lg ${colors[tab.color as keyof typeof colors]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{tab.count}</span>
                </div>
                <p className="text-xs text-gray-600">{tab.name}</p>
              </button>
            );
          })}
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
                placeholder="Search sellers..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                  showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      placeholder="City"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    />
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
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setFilters({location: '', rating: '', revenue: ''})}
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
          {selectedSellers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-blue-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between"
            >
              <span className="text-sm font-medium">{selectedSellers.length} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => handleBulkAction('Reject')} className="px-3 py-1 bg-red-500 rounded-md text-sm hover:bg-red-600">Reject</button>
                <button onClick={() => setSelectedSellers([])} className="p-1 hover:bg-blue-700 rounded">
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
              viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        {filteredSellers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sellers found</h3>
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
                        checked={selectedSellers.length === filteredSellers.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Commission</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedSellers.includes(seller.id)}
                          onChange={() => handleSelectSeller(seller.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{seller.companyName}</div>
                            <div className="text-xs text-gray-500">{seller.ownerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{seller.email}</div>
                        <div className="text-xs text-gray-500">{seller.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{seller.location}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-xs">Products: {seller.products}</div>
                          <div className="text-xs">Orders: {seller.orders}</div>
                          <div className="text-xs font-medium text-green-600">{formatNumber(seller.revenue)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                          <Percent className="w-3 h-3" /> {productCommission}%
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(seller.status)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedSeller(seller); setShowModal('details'); }}
                          className="p-1 hover:bg-blue-100 rounded text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
            {sortedSellers.map((seller) => (
              <motion.div
                key={seller.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{seller.companyName}</h3>
                        <p className="text-xs text-gray-500">{seller.ownerName}</p>
                      </div>
                    </div>
                    {getStatusBadge(seller.status)}
                  </div>

                  <div className="space-y-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{seller.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{seller.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{seller.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{seller.products}</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{seller.orders}</p>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-green-600">{formatNumber(seller.revenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-medium">
                      <Percent className="w-3 h-3" />
                      Commission: {productCommission}%
                    </div>
                    <button
                      onClick={() => { setSelectedSeller(seller); setShowModal('details'); }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredSellers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredSellers.length} of {sellers.length}
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {showModal === 'details' && selectedSeller && (
            <Modal title="Seller Details" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="font-medium">{selectedSeller.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p>{selectedSeller.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p>{selectedSeller.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p>{selectedSeller.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedSeller.status)}</div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Performance</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold">{selectedSeller.products}</p>
                      <p className="text-xs text-gray-500">Products</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold">{selectedSeller.orders}</p>
                      <p className="text-xs text-gray-500">Orders</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{formatNumber(selectedSeller.revenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
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
        className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
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

export default SellerManagement;