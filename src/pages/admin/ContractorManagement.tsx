// src/pages/admin/ContractorManagement.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, CheckCircle, XCircle, MoreVertical, Download,
  Users, UserPlus, MapPin, Phone, Mail,
  Star, Clock, HardHat, 
  Menu, X, ChevronLeft, ChevronRight, Grid,
  Building2
} from 'lucide-react';

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

const ContractorManagement = () => {
  // Simplified state management
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid'); // Default to grid for mobile
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'approve' | 'reject' | 'details' | 'commission' | 'block'>('none');
  const [rejectionReason, setRejectionReason] = useState('');
  const [commission, setCommission] = useState('8');
  
  // Filter states
  const [filters, setFilters] = useState({
    specialization: '',
    experience: '',
    rating: '',
    revenue: ''
  });

  // Mock data - Simplified contractor data
  const [contractors] = useState<Contractor[]>([
    {
      id: 'CON-001',
      companyName: 'Rajesh Constructions',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@constructions.com',
      phone: '+91 ',
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
      phone: '+91 ',
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
      phone: '+91 ',
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
      phone: '+91 ',
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
      phone: '+91 ',
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
  ]);

  const specializations = [
    'Civil Contractor', 'Interior Designer', 'Electrician', 
    'Plumber', 'Architect', 'Carpenter', 'Painter'
  ];

  const tabs = [
    { id: 'all', name: 'All', icon: Users, count: contractors.length, color: 'gray' },
    { id: 'pending', name: 'Pending', icon: Clock, count: contractors.filter(c => c.status === 'pending').length, color: 'yellow' },
    { id: 'approved', name: 'Approved', icon: CheckCircle, count: contractors.filter(c => c.status === 'approved').length, color: 'green' },
    { id: 'rejected', name: 'Rejected', icon: XCircle, count: contractors.filter(c => c.status === 'rejected').length, color: 'red' },
   
  ];

  // Filter contractors
  const filteredContractors = contractors.filter(contractor => {
    if (activeTab !== 'all' && contractor.status !== activeTab) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        contractor.companyName.toLowerCase().includes(query) ||
        contractor.ownerName.toLowerCase().includes(query) ||
        contractor.specialization.toLowerCase().includes(query) ||
        contractor.location.toLowerCase().includes(query)
      );
    }
    
    if (filters.specialization && contractor.specialization !== filters.specialization) return false;
    if (filters.rating && contractor.rating < parseFloat(filters.rating)) return false;
    
    return true;
  });

  const handleSelectAll = () => {
    if (selectedContractors.length === filteredContractors.length) {
      setSelectedContractors([]);
    } else {
      setSelectedContractors(filteredContractors.map(c => c.id));
    }
  };

  const handleSelectContractor = (id: string) => {
    setSelectedContractors(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} ${selectedContractors.length} contractors`);
    setSelectedContractors([]);
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


  const formatNumber = (num: number) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header Section */}
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
            {/* View Toggle - Hidden on mobile, visible on tablet/desktop */}
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Table View"
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid View"
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
            <button className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Stats Cards - Simplified */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const colors = {
              gray: 'bg-gray-100 text-gray-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              green: 'bg-green-100 text-green-600',
              red: 'bg-red-100 text-red-600'
            };
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`bg-white rounded-lg border p-3 transition-all ${
                  activeTab === tab.id 
                    ? 'border-orange-500 ring-1 ring-orange-500' 
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

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contractors..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${
                  showFilters ? 'bg-orange-600 text-white border-orange-600' : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              
              <select
                value={filters.specialization}
                onChange={(e) => setFilters({...filters, specialization: e.target.value})}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">All Types</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
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
                    <label className="block text-xs font-medium text-gray-500 mb-1">Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => setFilters({...filters, experience: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="5">5+ years</option>
                      <option value="10">10+ years</option>
                      <option value="15">15+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters({...filters, rating: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Revenue</label>
                    <select
                      value={filters.revenue}
                      onChange={(e) => setFilters({...filters, revenue: e.target.value})}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"
                    >
                      <option value="">Any</option>
                      <option value="1000000">₹10L+</option>
                      <option value="5000000">₹50L+</option>
                      <option value="10000000">₹1Cr+</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setFilters({specialization: '', experience: '', rating: '', revenue: ''})}
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
          {selectedContractors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-orange-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between"
            >
              <span className="text-sm font-medium">{selectedContractors.length} selected</span>
              <div className="flex items-center gap-2">
                <button onClick={() => handleBulkAction('Approve')} className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Approve</button>
                <button onClick={() => handleBulkAction('Reject')} className="px-3 py-1 bg-red-500 rounded-md text-sm hover:bg-red-600">Reject</button>
                <button onClick={() => setSelectedContractors([])} className="p-1 hover:bg-orange-700 rounded">
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
              viewMode === 'table' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        {filteredContractors.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No contractors found</h3>
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
                        checked={selectedContractors.length === filteredContractors.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contractor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContractors.map((contractor) => (
                    <tr key={contractor.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedContractors.includes(contractor.id)}
                          onChange={() => handleSelectContractor(contractor.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <HardHat className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{contractor.companyName}</div>
                            <div className="text-xs text-gray-500">{contractor.ownerName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">{contractor.email}</div>
                        <div className="text-xs text-gray-500">{contractor.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-sm">{contractor.specialization}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {contractor.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(contractor.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => { setSelectedContractor(contractor); setShowModal('details'); }}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {contractor.status === 'pending' && (
                            <>
                              <button
                                onClick={() => { setSelectedContractor(contractor); setShowModal('approve'); }}
                                className="p-1 hover:bg-green-100 rounded text-green-600"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => { setSelectedContractor(contractor); setShowModal('reject'); }}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1 hover:bg-gray-100 rounded text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
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
            {filteredContractors.map((contractor) => (
              <motion.div
                key={contractor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <HardHat className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contractor.companyName}</h3>
                        <p className="text-xs text-gray-500">{contractor.ownerName}</p>
                      </div>
                    </div>
                    {getStatusBadge(contractor.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{contractor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{contractor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{contractor.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-t border-gray-100">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{contractor.projects}</p>
                      <p className="text-xs text-gray-500">Projects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-green-600">{formatNumber(contractor.revenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{contractor.rating}</span>
                      </div>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="flex gap-2 mt-2">
                    {getDocumentStatus(contractor.documents.gst)}
                    {getDocumentStatus(contractor.documents.pan)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => { setSelectedContractor(contractor); setShowModal('details'); }}
                      className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {contractor.status === 'pending' && (
                      <>
                        <button
                          onClick={() => { setSelectedContractor(contractor); setShowModal('approve'); }}
                          className="p-1.5 hover:bg-green-50 rounded text-green-600"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setSelectedContractor(contractor); setShowModal('reject'); }}
                          className="p-1.5 hover:bg-red-50 rounded text-red-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredContractors.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredContractors.length} of {contractors.length} contractors
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modals - Simplified */}
        <AnimatePresence>
          {/* Approve Modal */}
          {showModal === 'approve' && selectedContractor && (
            <Modal title="Approve Contractor" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    Approve <span className="font-semibold">{selectedContractor.companyName}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
                  <input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal('none')} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                  <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Reject Modal */}
          {showModal === 'reject' && selectedContractor && (
            <Modal title="Reject Contractor" onClose={() => setShowModal('none')}>
              <div className="space-y-4">
                <div className="bg-red-50 p-3 rounded-lg">
                  <p className="text-sm text-red-800">
                    Reject <span className="font-semibold">{selectedContractor.companyName}</span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter rejection reason..."
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal('none')} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    Reject
                  </button>
                  <button onClick={() => setShowModal('none')} className="flex-1 border border-gray-200 py-2 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Details Modal */}
          {showModal === 'details' && selectedContractor && (
            <Modal title="Contractor Details" onClose={() => setShowModal('none')} size="lg">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="font-medium">{selectedContractor.companyName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p>{selectedContractor.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedContractor.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p>{selectedContractor.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p>{selectedContractor.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Specialization</p>
                    <p>{selectedContractor.specialization}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <button onClick={() => setShowModal('none')} className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50">
                    Close
                  </button>
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
const Modal = ({ title, children, onClose, size = 'md' }: { title: string; children: React.ReactNode; onClose: () => void; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
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

export default ContractorManagement;