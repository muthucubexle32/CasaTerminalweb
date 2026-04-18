import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, CheckCircle, XCircle, Download,
  Users, UserPlus, MapPin, Phone, Mail,
  Star, Clock, DollarSign, Package,
  ChevronDown, ChevronUp, Menu, X, Grid, Truck,
  AlertCircle, Building2, Shield,
  Plus, MoreHorizontal, ChevronLeft, ChevronRight, Percent
} from 'lucide-react';

interface DocumentStatus {
  gst: 'verified' | 'pending' | 'rejected';
  pan: 'verified' | 'pending' | 'rejected';
  license: 'verified' | 'pending' | 'rejected';
  insurance: 'verified' | 'pending' | 'rejected';
  bank: 'verified' | 'pending' | 'rejected';
  address: 'verified' | 'pending' | 'rejected';
}

interface Equipment {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  status: 'available' | 'rented' | 'maintenance';
  location: string;
  image?: string;
}

interface RentalProvider {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  city: string;
  state: string;
  equipmentTypes: string[];
  experience: string;
  gst: string;
  pan: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  joinedDate: string;
  stats: {
    totalEquipment: number;
    availableEquipment: number;
    rentedEquipment: number;
    underMaintenance: number;
    revenue: number;
    rating: number;
    commission: number;
  };
  documents: DocumentStatus;
  equipment: Equipment[];
  verificationNotes?: string;
}

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

interface ModalState {
  type: 'details' | 'approve' | 'reject' | 'block' | 'commission' | 'equipment' | null;
  open: boolean;
}

interface FormData {
  commission: string;
  rejectionReason: string;
  blockReason: string;
  blockDuration: string;
  handleRentals: string;
}

interface Filters {
  equipmentType: string;
  city: string;
  minRating: string;
  availability: string;
}

interface SortConfig {
  field: string;
  order: 'asc' | 'desc';
}

interface CommissionRates {
  cement: number;
  bricks: number;
  steel: number;
  other: number;
  vehicle: number;
  equipment: number;
}

const RentalManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProvider, setSelectedProvider] = useState<RentalProvider | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: null, open: false });
  const [formData, setFormData] = useState<FormData>({ commission: '10', rejectionReason: '', blockReason: '', blockDuration: 'permanent', handleRentals: 'cancel' });
  const [filters, setFilters] = useState<Filters>({ equipmentType: '', city: '', minRating: '', availability: '' });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'joinedDate', order: 'desc' });
  const [vehicleCommission, setVehicleCommission] = useState<number>(10);
  const [equipmentCommission, setEquipmentCommission] = useState<number>(8);

  const [providers] = useState<RentalProvider[]>([
    { id: 'REN-2024-001', companyName: 'JCB Rentals Mumbai', ownerName: 'Suresh Yadav', email: 'suresh@jcbmumbai.com', phone: '+91 98765 43210', location: 'Andheri East, Mumbai', city: 'Mumbai', state: 'Maharashtra', equipmentTypes: ['Heavy Equipment', 'Construction Vehicles'], experience: '12 years', gst: '27AABCU9603R1ZM', pan: 'ABCDE1234F', status: 'approved', joinedDate: '2024-01-15', stats: { totalEquipment: 45, availableEquipment: 15, rentedEquipment: 28, underMaintenance: 2, revenue: 12500000, rating: 4.7, commission: 10 }, documents: { gst: 'verified', pan: 'verified', license: 'verified', insurance: 'verified', bank: 'verified', address: 'verified' }, equipment: [{ id: 'EQ-001', name: 'JCB 3DX Backhoe Loader', category: 'Heavy Equipment', dailyRate: 8500, weeklyRate: 56000, monthlyRate: 210000, status: 'rented', location: 'Mumbai Central' }, { id: 'EQ-002', name: 'Hitachi EX200 Excavator', category: 'Heavy Equipment', dailyRate: 12000, weeklyRate: 78000, monthlyRate: 290000, status: 'available', location: 'Andheri' }] },
    { id: 'REN-2024-002', companyName: 'Delhi Crane Services', ownerName: 'Vikram Singh', email: 'vikram@delhicranes.com', phone: '+91 87654 32109', location: 'Connaught Place, Delhi', city: 'Delhi', state: 'Delhi', equipmentTypes: ['Cranes', 'Lifting Equipment'], experience: '8 years', gst: '07ABCDE1234F1Z5', pan: 'FGHIJ5678K', status: 'pending', joinedDate: '2024-01-16', stats: { totalEquipment: 12, availableEquipment: 8, rentedEquipment: 4, underMaintenance: 0, revenue: 4500000, rating: 0, commission: 10 }, documents: { gst: 'verified', pan: 'pending', license: 'pending', insurance: 'verified', bank: 'verified', address: 'pending' }, equipment: [{ id: 'EQ-004', name: 'Tata Hydra Crane 12Ton', category: 'Crane', dailyRate: 9500, weeklyRate: 62000, monthlyRate: 230000, status: 'available', location: 'Connaught Place' }] },
    { id: 'REN-2024-003', companyName: 'Power Tools Ahmedabad', ownerName: 'Rahul Patel', email: 'rahul@powertools.in', phone: '+91 76543 21098', location: 'Navrangpura, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', equipmentTypes: ['Power Tools', 'Construction Tools'], experience: '5 years', gst: '24FGHIJ5678K1L2', pan: 'KLMNO9012P', status: 'approved', joinedDate: '2024-01-10', stats: { totalEquipment: 234, availableEquipment: 89, rentedEquipment: 134, underMaintenance: 11, revenue: 5670000, rating: 4.5, commission: 10 }, documents: { gst: 'verified', pan: 'verified', license: 'verified', insurance: 'verified', bank: 'verified', address: 'verified' }, equipment: [{ id: 'EQ-006', name: 'Bosch Hammer Drill', category: 'Power Tool', dailyRate: 450, weeklyRate: 2800, monthlyRate: 10000, status: 'rented', location: 'Navrangpura' }] }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const rates: CommissionRates = JSON.parse(saved);
      setVehicleCommission(rates.vehicle ?? 10);
      setEquipmentCommission(rates.equipment ?? 8);
    }
  }, []);

  const equipmentCategories = ['Heavy Equipment', 'Cranes', 'Power Tools', 'Concrete Equipment', 'Earth Moving', 'Lifting Equipment'];
  const cities = ['Mumbai', 'Delhi', 'Ahmedabad', 'Pune', 'Bangalore', 'Chennai'];

  const tabs: Tab[] = [
    { id: 'all', label: 'All Providers', icon: Users, count: providers.length, color: 'blue' },
    { id: 'pending', label: 'Pending', icon: Clock, count: providers.filter(p => p.status === 'pending').length, color: 'yellow' },
    { id: 'approved', label: 'Approved', icon: CheckCircle, count: providers.filter(p => p.status === 'approved').length, color: 'green' },
    { id: 'rejected', label: 'Rejected', icon: XCircle, count: providers.filter(p => p.status === 'rejected').length, color: 'red' },
    { id: 'blocked', label: 'Blocked', icon: Shield, count: providers.filter(p => p.status === 'blocked').length, color: 'gray' }
  ];

  const filteredProviders = useMemo(() => {
    return providers
      .filter(provider => {
        if (activeTab !== 'all' && provider.status !== activeTab) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return provider.companyName.toLowerCase().includes(q) || provider.ownerName.toLowerCase().includes(q) || provider.email.toLowerCase().includes(q) || provider.city.toLowerCase().includes(q) || provider.equipmentTypes.some(t => t.toLowerCase().includes(q));
        }
        if (filters.equipmentType && !provider.equipmentTypes.includes(filters.equipmentType)) return false;
        if (filters.city && provider.city !== filters.city) return false;
        if (filters.minRating && provider.stats.rating < parseFloat(filters.minRating)) return false;
        return true;
      })
      .sort((a, b) => {
        const field = sortConfig.field;
        let aVal: any, bVal: any;
        if (field === 'revenue' || field === 'rating' || field === 'totalEquipment') { aVal = a.stats[field as keyof typeof a.stats]; bVal = b.stats[field as keyof typeof b.stats]; }
        else if (field === 'companyName') { aVal = a.companyName; bVal = b.companyName; }
        else { aVal = a.joinedDate; bVal = b.joinedDate; }
        if (sortConfig.order === 'asc') return aVal > bVal ? 1 : -1;
        else return aVal < bVal ? 1 : -1;
      });
  }, [providers, activeTab, searchQuery, filters, sortConfig]);

  const handleSelectAll = useCallback(() => {
    if (selectedProviders.length === filteredProviders.length) setSelectedProviders([]);
    else setSelectedProviders(filteredProviders.map(p => p.id));
  }, [filteredProviders, selectedProviders.length]);

  const handleSelectProvider = useCallback((id: string) => {
    setSelectedProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }, []);

  const handleBulkAction = useCallback((action: string) => { console.log(`Bulk ${action}:`, selectedProviders); setSelectedProviders([]); }, [selectedProviders]);
  const handleSort = useCallback((field: string) => { setSortConfig(prev => ({ field, order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc' })); }, []);
  const clearFilters = useCallback(() => { setFilters({ equipmentType: '', city: '', minRating: '', availability: '' }); setSearchQuery(''); }, []);
  const handleApprove = useCallback(() => { console.log('Approved:', selectedProvider?.id); setModalState({ type: null, open: false }); }, [selectedProvider]);
  const handleReject = useCallback(() => { console.log('Rejected:', selectedProvider?.id); setModalState({ type: null, open: false }); setFormData(prev => ({ ...prev, rejectionReason: '' })); }, [selectedProvider]);
  const handleCommissionUpdate = useCallback(() => { console.log('Commission updated:', selectedProvider?.id); setModalState({ type: null, open: false }); }, [selectedProvider]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  const getStatusBadge = (status: string) => {
    const styles = { approved: 'bg-green-100 text-green-800', pending: 'bg-yellow-100 text-yellow-800', rejected: 'bg-red-100 text-red-800', blocked: 'bg-gray-100 text-gray-800' };
    const icons = { approved: CheckCircle, pending: Clock, rejected: XCircle, blocked: Shield };
    const Icon = icons[status as keyof typeof icons] || AlertCircle;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}><Icon className="w-3 h-3" />{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };
  const getDocumentIcon = (status: string) => {
    const icons = { verified: <CheckCircle className="w-4 h-4 text-green-500" />, pending: <Clock className="w-4 h-4 text-yellow-500" />, rejected: <XCircle className="w-4 h-4 text-red-500" /> };
    return icons[status as keyof typeof icons] || null;
  };
  const getEquipmentStatusBadge = (status: string) => {
    const styles = { available: 'bg-green-100 text-green-800', rented: 'bg-blue-100 text-blue-800', maintenance: 'bg-yellow-100 text-yellow-800' };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };
  const handleAction = useCallback((action: string) => { setModalState({ type: null, open: false }); setModalState({ type: action as ModalState['type'], open: true }); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"><Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#502d13]" /> Rental Management</h1><p className="text-xs sm:text-sm text-gray-500 mt-1">Manage equipment rental providers and their inventory</p></div>
          <div className="flex items-center gap-2"><div className="flex items-center bg-gray-100 rounded-lg p-1"><button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-white shadow-sm text-[#502d13]' : 'text-gray-600'}`}><Menu className="w-4 h-4" /></button><button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#502d13]' : 'text-gray-600'}`}><Grid className="w-4 h-4" /></button></div><button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4 text-gray-600" /></button><button className="flex items-center gap-2 px-4 py-2 bg-[#502d13] text-white rounded-lg hover:bg-[#7b4a26] text-sm"><UserPlus className="w-4 h-4" /><span className="hidden sm:inline">Add Provider</span></button></div>
        </div>
        <div className="border-b border-gray-200 mb-6 overflow-x-auto"><nav className="flex -mb-px space-x-6 sm:space-x-8">{tabs.map(tab => { const Icon = tab.icon; const isActive = activeTab === tab.id; return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${isActive ? 'border-[#502d13] text-[#502d13]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Icon className="w-4 h-4" /><span className="hidden sm:inline">{tab.label}</span><span className={`ml-1 sm:ml-2 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[#502d13] text-white' : 'bg-gray-100 text-gray-600'}`}>{tab.count}</span></button>); })}</nav></div>
        <div className="mb-6"><div className="flex flex-col sm:flex-row gap-3"><div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by company, owner, location..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#502d13] text-sm" /></div><button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${showFilters ? 'bg-[#502d13] text-white border-[#502d13]' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><Filter className="w-4 h-4" />Filters</button><select value={sortConfig.field} onChange={(e) => handleSort(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#502d13]"><option value="joinedDate">Join Date</option><option value="companyName">Company Name</option><option value="revenue">Revenue</option><option value="rating">Rating</option><option value="totalEquipment">Equipment Count</option></select><button onClick={() => setSortConfig(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white">{sortConfig.order === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button></div><AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 bg-white p-4 rounded-lg border border-gray-200"><div className="grid grid-cols-1 sm:grid-cols-4 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Equipment Type</label><select value={filters.equipmentType} onChange={(e) => setFilters(prev => ({ ...prev, equipmentType: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"><option value="">All</option>{equipmentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div><div><label className="block text-xs font-medium text-gray-500 mb-1">City</label><select value={filters.city} onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"><option value="">All</option>{cities.map(city => <option key={city} value={city}>{city}</option>)}</select></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Min Rating</label><select value={filters.minRating} onChange={(e) => setFilters(prev => ({ ...prev, minRating: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"><option value="">All</option><option value="4">4+ Stars</option><option value="4.5">4.5+ Stars</option><option value="5">5 Stars</option></select></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Availability</label><select value={filters.availability} onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"><option value="">All</option><option value="available">Available</option><option value="rented">Rented</option><option value="maintenance">Maintenance</option></select></div></div><div className="flex justify-end gap-2 mt-4"><button onClick={clearFilters} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Clear All</button><button onClick={() => setShowFilters(false)} className="px-4 py-2 text-sm bg-[#502d13] text-white rounded-lg hover:bg-[#7b4a26]">Apply Filters</button></div></motion.div>)}</AnimatePresence></div>
        <AnimatePresence>{selectedProviders.length > 0 && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-4 bg-[#502d13] text-white p-3 rounded-lg flex items-center justify-between"><div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="text-sm font-medium">{selectedProviders.length} selected</span></div><div className="flex items-center gap-2"><button onClick={() => handleBulkAction('approve')} className="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-700 text-sm">Approve</button><button onClick={() => handleBulkAction('reject')} className="px-3 py-1 bg-red-600 rounded-lg hover:bg-red-700 text-sm">Reject</button><button onClick={() => setSelectedProviders([])} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button></div></motion.div>)}</AnimatePresence>
        {viewMode === 'table' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-4 py-3"><input type="checkbox" checked={selectedProviders.length === filteredProviders.length && filteredProviders.length > 0} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-[#502d13]" /></th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y divide-gray-200">{filteredProviders.map(provider => (<tr key={provider.id} className="hover:bg-gray-50"><td className="px-4 py-3"><input type="checkbox" checked={selectedProviders.includes(provider.id)} onChange={() => handleSelectProvider(provider.id)} className="w-4 h-4 rounded border-gray-300 text-[#502d13]" /></td><td className="px-4 py-3"><button onClick={() => { setSelectedProvider(provider); setModalState({ type: 'details', open: true }); }} className="flex items-center gap-3"><div className="w-8 h-8 bg-[#502d13]/10 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-[#502d13]" /></div><div className="text-left"><div className="text-sm font-medium text-gray-900">{provider.companyName}</div><div className="text-xs text-gray-500">{provider.ownerName}</div></div></button></td><td className="px-4 py-3"><div className="text-sm">{provider.email}</div><div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" />{provider.phone}</div></td><td className="px-4 py-3"><div className="space-y-1"><div className="flex items-center gap-2 text-sm"><Package className="w-3 h-3 text-gray-400" /><span>Total: {provider.stats.totalEquipment}</span></div><div className="flex items-center gap-2 text-xs"><CheckCircle className="w-3 h-3 text-green-500" /><span>Available: {provider.stats.availableEquipment}</span></div></div></td><td className="px-4 py-3"><div className="space-y-1"><div className="text-sm font-medium text-green-600">{formatCurrency(provider.stats.revenue)}</div>{provider.stats.rating > 0 && (<div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /><span className="text-xs">{provider.stats.rating}</span></div>)}</div></td><td className="px-4 py-3"><div className="flex flex-col gap-1"><div className="flex items-center gap-1 text-xs"><Percent className="w-3 h-3 text-blue-500" />Vehicle: {vehicleCommission}%</div><div className="flex items-center gap-1 text-xs"><Percent className="w-3 h-3 text-green-500" />Equipment: {equipmentCommission}%</div></div></td><td className="px-4 py-3">{getStatusBadge(provider.status)}</td><td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => { setSelectedProvider(provider); setModalState({ type: 'details', open: true }); }} className="p-1 hover:bg-blue-100 rounded text-blue-600"><Eye className="w-4 h-4" /></button>{provider.status === 'pending' && (<><button onClick={() => { setSelectedProvider(provider); setModalState({ type: 'approve', open: true }); }} className="p-1 hover:bg-green-100 rounded text-green-600"><CheckCircle className="w-4 h-4" /></button><button onClick={() => { setSelectedProvider(provider); setModalState({ type: 'reject', open: true }); }} className="p-1 hover:bg-red-100 rounded text-red-600"><XCircle className="w-4 h-4" /></button></>)}<button onClick={() => { setSelectedProvider(provider); setModalState({ type: 'commission', open: true }); }} className="p-1 hover:bg-purple-100 rounded text-purple-600"><DollarSign className="w-4 h-4" /></button><button className="p-1 hover:bg-gray-100 rounded text-gray-600"><MoreHorizontal className="w-4 h-4" /></button></div></td></tr>))}</tbody></table></div><div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between"><div className="text-sm text-gray-500">Showing {filteredProviders.length} of {providers.length} providers</div><div className="flex items-center gap-2"><button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button><button className="px-3 py-1 bg-[#502d13] text-white rounded-lg text-sm">1</button><button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button><button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredProviders.map(provider => (<motion.div key={provider.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer" onClick={() => { setSelectedProvider(provider); setModalState({ type: 'details', open: true }); }}><div className="p-4"><div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#502d13]/10 rounded-lg flex items-center justify-center"><Building2 className="w-5 h-5 text-[#502d13]" /></div><div><h3 className="font-medium text-gray-900">{provider.companyName}</h3><p className="text-xs text-gray-500">{provider.ownerName}</p></div></div>{getStatusBadge(provider.status)}</div><div className="space-y-2 mb-3 text-sm"><div className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{provider.email}</span></div><div className="flex items-center gap-2 text-gray-600"><MapPin className="w-4 h-4 text-gray-400" /><span>{provider.city}, {provider.state}</span></div><div className="flex flex-wrap gap-1 mt-2">{provider.equipmentTypes.slice(0, 2).map((type, i) => <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">{type}</span>)}{provider.equipmentTypes.length > 2 && <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">+{provider.equipmentTypes.length - 2}</span>}</div></div><div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100"><div className="text-center"><p className="text-xs text-gray-500">Total</p><p className="text-sm font-semibold">{provider.stats.totalEquipment}</p></div><div className="text-center"><p className="text-xs text-gray-500">Available</p><p className="text-sm font-semibold text-green-600">{provider.stats.availableEquipment}</p></div><div className="text-center"><p className="text-xs text-gray-500">Rented</p><p className="text-sm font-semibold text-blue-600">{provider.stats.rentedEquipment}</p></div></div><div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100"><div className="flex flex-col gap-0.5"><div className="flex items-center gap-1 text-xs"><Percent className="w-3 h-3 text-blue-500" />Vehicle: {vehicleCommission}%</div><div className="flex items-center gap-1 text-xs"><Percent className="w-3 h-3 text-green-500" />Equipment: {equipmentCommission}%</div></div><div className="flex items-center gap-1"><button onClick={(e) => { e.stopPropagation(); setSelectedProvider(provider); setModalState({ type: 'equipment', open: true }); }} className="p-1 hover:bg-gray-100 rounded"><Package className="w-4 h-4 text-gray-600" /></button><button onClick={(e) => { e.stopPropagation(); setSelectedProvider(provider); setModalState({ type: 'commission', open: true }); }} className="p-1 hover:bg-gray-100 rounded"><DollarSign className="w-4 h-4 text-gray-600" /></button></div></div></div></motion.div>))}</div>
        )}
        {filteredProviders.length === 0 && (<div className="text-center py-12 bg-white rounded-xl border border-gray-200"><Truck className="w-12 h-12 text-gray-400 mx-auto mb-3" /><h3 className="text-lg font-medium text-gray-900 mb-1">No providers found</h3><p className="text-sm text-gray-500">Try adjusting your search or filters</p><button onClick={clearFilters} className="mt-4 px-4 py-2 bg-[#502d13] text-white rounded-lg text-sm hover:bg-[#7b4a26]">Clear Filters</button></div>)}
        <AnimatePresence>{modalState.open && selectedProvider && (<>{modalState.type === 'details' && <DetailsModal provider={selectedProvider} onClose={() => setModalState({ type: null, open: false })} onAction={handleAction} getStatusBadge={getStatusBadge} formatCurrency={formatCurrency} />}{modalState.type === 'approve' && <ApproveModal provider={selectedProvider} commission={formData.commission} onCommissionChange={(v: string) => setFormData(prev => ({ ...prev, commission: v }))} onConfirm={handleApprove} onClose={() => setModalState({ type: null, open: false })} getDocumentIcon={getDocumentIcon} />}{modalState.type === 'reject' && <RejectModal provider={selectedProvider} reason={formData.rejectionReason} onReasonChange={(v: string) => setFormData(prev => ({ ...prev, rejectionReason: v }))} onConfirm={handleReject} onClose={() => { setModalState({ type: null, open: false }); setFormData(prev => ({ ...prev, rejectionReason: '' })); }} />}{modalState.type === 'commission' && <CommissionModal provider={selectedProvider} commission={formData.commission} onCommissionChange={(v: string) => setFormData(prev => ({ ...prev, commission: v }))} onConfirm={handleCommissionUpdate} onClose={() => setModalState({ type: null, open: false })} />}{modalState.type === 'equipment' && <EquipmentModal provider={selectedProvider} onClose={() => setModalState({ type: null, open: false })} getEquipmentStatusBadge={getEquipmentStatusBadge} formatCurrency={formatCurrency} />}</>)}</AnimatePresence>
      </div>
    </div>
  );
};

// Modal components (kept identical to original, just included for completeness)
const DetailsModal: React.FC<any> = ({ provider, onClose, onAction, getStatusBadge, formatCurrency }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div className="p-6"><div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="w-12 h-12 bg-[#502d13]/10 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-[#502d13]" /></div><div><h2 className="text-xl font-bold text-gray-900">{provider.companyName}</h2><p className="text-sm text-gray-500">ID: {provider.id}</p></div></div><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div><div className="space-y-6"><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-medium text-gray-900 mb-3">Basic Information</h3><div className="grid grid-cols-2 gap-4"><InfoItem label="Owner Name" value={provider.ownerName} /><InfoItem label="Email" value={provider.email} /><InfoItem label="Phone" value={provider.phone} /><InfoItem label="Experience" value={provider.experience} /><InfoItem label="GST" value={provider.gst} /><InfoItem label="PAN" value={provider.pan} /><InfoItem label="Joined Date" value={new Date(provider.joinedDate).toLocaleDateString()} /><InfoItem label="Status" value={getStatusBadge(provider.status)} /></div></div><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-medium text-gray-900 mb-3">Location</h3><div className="grid grid-cols-2 gap-4"><InfoItem label="City" value={provider.city} /><InfoItem label="State" value={provider.state} /><div className="col-span-2"><InfoItem label="Full Address" value={provider.location} /></div></div></div><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-medium text-gray-900 mb-3">Equipment Categories</h3><div className="flex flex-wrap gap-2">{provider.equipmentTypes.map((type: string, i: number) => <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200">{type}</span>)}</div></div><div className="bg-gray-50 p-4 rounded-lg"><h3 className="font-medium text-gray-900 mb-3">Performance Metrics</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-4"><StatCard label="Total Equipment" value={provider.stats.totalEquipment} /><StatCard label="Available" value={provider.stats.availableEquipment} color="green" /><StatCard label="Rented" value={provider.stats.rentedEquipment} color="blue" /><StatCard label="Revenue" value={formatCurrency(provider.stats.revenue)} color="green" /></div></div>{provider.verificationNotes && (<div className="bg-yellow-50 p-4 rounded-lg"><p className="text-sm text-yellow-800">{provider.verificationNotes}</p></div>)}</div><div className="flex gap-3 mt-6">{provider.status === 'pending' && (<><button onClick={() => onAction('approve')} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => onAction('reject')} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">Reject</button></>)}<button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Close</button></div></div>
    </motion.div>
  </motion.div>
);

const ApproveModal: React.FC<{ provider: RentalProvider; commission: string; onCommissionChange: (v: string) => void; onConfirm: () => void; onClose: () => void; getDocumentIcon: (status: string) => React.ReactNode }> = ({ provider, commission, onCommissionChange, onConfirm, onClose, getDocumentIcon }) => (
  <ModalWrapper title="Approve Provider" onClose={onClose}><div className="space-y-4"><div className="bg-green-50 p-4 rounded-lg"><p className="text-sm text-green-800">You are about to approve <span className="font-semibold">{provider.companyName}</span></p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Commission Percentage (%)</label><input type="number" value={commission} onChange={(e) => onCommissionChange(e.target.value)} min="0" max="100" step="0.1" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#502d13]" /></div><div className="bg-yellow-50 p-4 rounded-lg"><h3 className="font-medium text-yellow-800 mb-2">Document Status</h3><div className="space-y-2">{Object.entries(provider.documents).map(([key, value]) => (<div key={key} className="flex items-center gap-2">{getDocumentIcon(value)}<span className="text-sm capitalize">{key}: {value}</span></div>))}</div></div><ModalActions confirmLabel="Approve Provider" confirmColor="green" onConfirm={onConfirm} onClose={onClose} /></div></ModalWrapper>
);

const RejectModal: React.FC<any> = ({ provider, reason, onReasonChange, onConfirm, onClose }) => (
  <ModalWrapper title="Reject Provider" onClose={onClose}><div className="space-y-4"><div className="bg-red-50 p-4 rounded-lg"><p className="text-sm text-red-800">You are about to reject <span className="font-semibold">{provider.companyName}</span></p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection <span className="text-red-500">*</span></label><textarea value={reason} onChange={(e) => onReasonChange(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#502d13]" placeholder="Please provide a reason..." required /></div><ModalActions confirmLabel="Reject Provider" confirmColor="red" onConfirm={onConfirm} onClose={onClose} disabled={!reason.trim()} /></div></ModalWrapper>
);

const CommissionModal: React.FC<any> = ({ provider, commission, onCommissionChange, onConfirm, onClose }) => (
  <ModalWrapper title="Set Commission Rate" onClose={onClose}><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Provider</label><p className="text-sm text-gray-900">{provider.companyName}</p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Current Commission (%)</label><p className="text-sm text-gray-900">{provider.stats.commission}%</p></div><div><label className="block text-sm font-medium text-gray-700 mb-1">New Commission Percentage (%)</label><input type="number" value={commission} onChange={(e) => onCommissionChange(e.target.value)} min="0" max="100" step="0.1" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#502d13]" /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label><input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#502d13]" defaultValue={new Date().toISOString().split('T')[0]} /></div><ModalActions confirmLabel="Update Commission" confirmColor="purple" onConfirm={onConfirm} onClose={onClose} /></div></ModalWrapper>
);

const EquipmentModal: React.FC<any> = ({ provider, onClose, getEquipmentStatusBadge, formatCurrency }) => (
  <ModalWrapper title="Equipment Inventory" onClose={onClose} size="lg"><div className="space-y-4">{provider.equipment.map((item: any) => (<div key={item.id} className="bg-gray-50 p-4 rounded-lg"><div className="flex items-start justify-between mb-3"><div><h3 className="font-medium text-gray-900">{item.name}</h3><p className="text-xs text-gray-500">ID: {item.id}</p><p className="text-xs text-gray-500">Category: {item.category}</p></div>{getEquipmentStatusBadge(item.status)}</div><div className="grid grid-cols-3 gap-4 mb-3"><div><p className="text-xs text-gray-500">Daily</p><p className="text-sm font-medium">{formatCurrency(item.dailyRate)}</p></div><div><p className="text-xs text-gray-500">Weekly</p><p className="text-sm font-medium">{formatCurrency(item.weeklyRate)}</p></div><div><p className="text-xs text-gray-500">Monthly</p><p className="text-sm font-medium">{formatCurrency(item.monthlyRate)}</p></div></div><div className="flex items-center justify-between pt-2 border-t border-gray-200"><div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /><span className="text-xs text-gray-500">{item.location}</span></div><button className="text-xs text-blue-600 hover:text-blue-800">View Details</button></div></div>))}<button className="w-full mt-4 bg-[#502d13] text-white py-2 rounded-lg hover:bg-[#7b4a26] flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Add New Equipment</button></div></ModalWrapper>
);

const ModalWrapper: React.FC<{ title: string; children: React.ReactNode; onClose: () => void; size?: 'sm' | 'md' | 'lg' }> = ({ title, children, onClose, size = 'md' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' };
  return (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}><motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`bg-white rounded-xl shadow-xl ${sizes[size]} w-full`} onClick={(e) => e.stopPropagation()}><div className="p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-900">{title}</h2><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>{children}</div></motion.div></motion.div>);
};

const ModalActions: React.FC<{ confirmLabel: string; confirmColor: 'green' | 'red' | 'purple' | 'blue'; onConfirm: () => void; onClose: () => void; disabled?: boolean }> = ({ confirmLabel, confirmColor, onConfirm, onClose, disabled }) => {
  const colors = { green: 'bg-green-600 hover:bg-green-700', red: 'bg-red-600 hover:bg-red-700', purple: 'bg-purple-600 hover:bg-purple-700', blue: 'bg-blue-600 hover:bg-blue-700' };
  return (<div className="flex gap-3 mt-6"><button onClick={onConfirm} disabled={disabled} className={`flex-1 text-white py-2 rounded-lg transition-colors ${colors[confirmColor]} disabled:opacity-50 disabled:cursor-not-allowed`}>{confirmLabel}</button><button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50">Cancel</button></div>);
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (<div><p className="text-xs text-gray-500">{label}</p><p className="text-sm font-medium">{value}</p></div>);
const StatCard: React.FC<{ label: string; value: string | number; color?: 'gray' | 'green' | 'blue' }> = ({ label, value, color = 'gray' }) => {
  const colors = { gray: 'text-gray-900', green: 'text-green-600', blue: 'text-blue-600' };
  return (<div className="text-center"><p className={`text-2xl font-bold ${colors[color]}`}>{value}</p><p className="text-xs text-gray-500">{label}</p></div>);
};

export default RentalManagement;