import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, CheckCircle, XCircle, Download,
  Clock, AlertCircle, DollarSign,
  TrendingUp, RefreshCw, 
  CreditCard, Wallet, Globe, 
  Menu, X, ChevronLeft, ChevronRight, Grid, 
  Percent, Banknote, Smartphone, Save, Edit2
} from 'lucide-react';

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  providerName: string;
  providerType: string;
  amount: number;
  commission: number;
  status: string;
  paymentMethod: string;
  date: string;
}

interface Payout {
  id: string;
  providerName: string;
  providerType: string;
  amount: number;
  status: string;
  date: string;
}

interface CommissionRates {
  cement: number;
  bricks: number;
  steel: number;
  other: number;
  vehicle: number;
  equipment: number;
}

const PaymentsManagement = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState<'none' | 'details' | 'refund' | 'dispute'>('none');
  
  const [filters, setFilters] = useState({
    provider: '',
    status: '',
    dateRange: ''
  });

  const [commissionRates, setCommissionRates] = useState<CommissionRates>({
    cement: 5,
    bricks: 5,
    steel: 5,
    other: 5,
    vehicle: 10,
    equipment: 8,
  });
  const [editingCommission, setEditingCommission] = useState(false);
  const [tempRates, setTempRates] = useState<CommissionRates>(commissionRates);

  useEffect(() => {
    const saved = localStorage.getItem('adminCommissionRates');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCommissionRates(parsed);
      setTempRates(parsed);
    }
  }, []);

  const [transactions] = useState<Transaction[]>([
    { id: 'TXN-001', orderId: 'ORD-1234', customerName: 'Rahul Sharma', providerName: 'ABC Constructions', providerType: 'seller', amount: 45000, commission: 2250, status: 'completed', paymentMethod: 'upi', date: '2024-01-15' },
    { id: 'TXN-002', orderId: 'ORD-1235', customerName: 'Priya Patel', providerName: 'Singh Interiors', providerType: 'contractor', amount: 28500, commission: 2280, status: 'pending', paymentMethod: 'card', date: '2024-01-15' },
    { id: 'TXN-003', orderId: 'ORD-1236', customerName: 'Amit Kumar', providerName: 'JCB Rentals', providerType: 'rental', amount: 125000, commission: 12500, status: 'disputed', paymentMethod: 'bank', date: '2024-01-14' },
    { id: 'TXN-004', orderId: 'ORD-1237', customerName: 'Sneha Reddy', providerName: 'PQR Builders', providerType: 'seller', amount: 8900, commission: 445, status: 'refunded', paymentMethod: 'card', date: '2024-01-14' },
    { id: 'TXN-005', orderId: 'ORD-1238', customerName: 'Vikram Singh', providerName: 'Patel Electricals', providerType: 'contractor', amount: 67000, commission: 5360, status: 'completed', paymentMethod: 'netbanking', date: '2024-01-13' }
  ]);

  const [payouts] = useState<Payout[]>([
    { id: 'PO-001', providerName: 'ABC Constructions', providerType: 'seller', amount: 121125, status: 'pending', date: '2024-01-16' },
    { id: 'PO-002', providerName: 'Singh Interiors', providerType: 'contractor', amount: 78752, status: 'processing', date: '2024-01-15' },
    { id: 'PO-003', providerName: 'JCB Rentals', providerType: 'rental', amount: 210600, status: 'completed', date: '2024-01-14' }
  ]);

  const tabs = [
    { id: 'transactions', name: 'Transactions', icon: CreditCard, count: transactions.length, color: 'blue' },
    { id: 'payouts', name: 'Payouts', icon: Wallet, count: payouts.length, color: 'green' },
    { id: 'disputes', name: 'Disputes', icon: AlertCircle, count: transactions.filter(t => t.status === 'disputed').length, color: 'red' },
    { id: 'refunds', name: 'Refunds', icon: RefreshCw, count: transactions.filter(t => t.status === 'refunded').length, color: 'purple' },
    { id: 'commission', name: 'Commission', icon: Percent, count: 0, color: 'orange' }
  ];

  const summaryStats = {
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalCommission: transactions.reduce((sum, t) => sum + t.commission, 0),
    pendingPayouts: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    avgCommission: (transactions.reduce((sum, t) => sum + (t.commission / t.amount * 100), 0) / transactions.length).toFixed(1)
  };

  const filteredTransactions = transactions.filter(t => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return t.id.toLowerCase().includes(query) || t.customerName.toLowerCase().includes(query) || t.providerName.toLowerCase().includes(query);
    }
    if (filters.status && t.status !== filters.status) return false;
    return true;
  });

  const filteredPayouts = payouts.filter(p => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return p.id.toLowerCase().includes(query) || p.providerName.toLowerCase().includes(query);
    }
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });

  const handleSelectAll = () => {
    if (activeTab === 'transactions') {
      if (selectedItems.length === filteredTransactions.length) setSelectedItems([]);
      else setSelectedItems(filteredTransactions.map(t => t.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      disputed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
      failed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const icons: Record<string, any> = {
      completed: CheckCircle, pending: Clock, processing: RefreshCw, disputed: AlertCircle, refunded: RefreshCw, failed: XCircle
    };
    const Icon = icons[status] || Clock;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        <Icon className="w-3 h-3" /> {status}
      </span>
    );
  };

  const getPaymentIcon = (method: string) => {
    const icons: Record<string, any> = { upi: Smartphone, card: CreditCard, bank: Banknote, netbanking: Globe };
    const Icon = icons[method] || CreditCard;
    return <Icon className="w-4 h-4" />;
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const formatNumber = (num: number) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handleEditCommission = () => { setTempRates(commissionRates); setEditingCommission(true); };
  const handleCancelEdit = () => setEditingCommission(false);
  const handleSaveCommission = () => {
    setCommissionRates(tempRates);
    localStorage.setItem('adminCommissionRates', JSON.stringify(tempRates));
    setEditingCommission(false);
    alert('Commission rates updated successfully!');
  };
  const handleTempRateChange = (category: keyof CommissionRates, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 100) setTempRates(prev => ({ ...prev, [category]: num }));
  };

  const renderCommissionManagement = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div><h2 className="text-lg font-semibold text-gray-800">Commission Rates by Category</h2><p className="text-sm text-gray-500">Set commission percentage for each category</p></div>
        {!editingCommission ? (
          <button onClick={handleEditCommission} className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 w-full sm:w-auto"><Edit2 className="w-4 h-4" /> Edit Rates</button>
        ) : (
          <div className="flex gap-2"><button onClick={handleCancelEdit} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button><button onClick={handleSaveCommission} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Save className="w-4 h-4" /> Save Changes</button></div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {(['cement', 'bricks', 'steel', 'other', 'vehicle', 'equipment'] as const).map(cat => (
          <div key={cat} className="border border-gray-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{cat} Commission (%)</label>
            {editingCommission ? (
              <input type="number" step="0.1" min="0" max="100" value={tempRates[cat]} onChange={(e) => handleTempRateChange(cat, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
            ) : (
              <div className="text-2xl font-bold text-gray-900">{commissionRates[cat]}%</div>
            )}
            <p className="text-xs text-gray-500 mt-2">Applied to all {cat} {cat === 'vehicle' ? 'rentals' : cat === 'equipment' ? 'rentals' : 'products'}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg"><p className="text-sm text-blue-800"><strong>Note:</strong> Commission rates are applied automatically to new orders. Changes will affect future transactions only.</p></div>
    </div>
  );

  const renderTransactions = () => (
    <>
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center"><CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" /><h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3><p className="text-sm text-gray-500">Try adjusting your search or filters</p></div>
      ) : viewMode === 'table' ? (
        <div className="hidden sm:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr><th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedItems.length === filteredTransactions.length} onChange={handleSelectAll} className="rounded border-gray-300 text-blue-600" /></th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><input type="checkbox" checked={selectedItems.includes(tx.id)} onChange={() => handleSelectItem(tx.id)} className="rounded border-gray-300 text-blue-600" /></td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.id}</td>
                    <td className="px-4 py-3 text-sm">{tx.customerName}</td>
                    <td className="px-4 py-3"><div className="text-sm">{tx.providerName}</div><div className="text-xs text-gray-500 capitalize">{tx.providerType}</div></td>
                    <td className="px-4 py-3"><div className="text-sm font-medium">{formatCurrency(tx.amount)}</div><div className="flex items-center gap-1 text-xs text-gray-500">{getPaymentIcon(tx.paymentMethod)}<span>{tx.paymentMethod}</span></div></td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(tx.commission)}</td>
                    <td className="px-4 py-3">{getStatusBadge(tx.status)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{tx.date}</td>
                    <td className="px-4 py-3"><button onClick={() => { setSelectedTransaction(tx); setShowModal('details'); }} className="p-1 hover:bg-blue-100 rounded text-blue-600"><Eye className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTransactions.map(tx => (
            <motion.div key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3"><div><div className="flex items-center gap-2 mb-1"><span className="text-sm font-medium text-gray-900">{tx.id}</span><span className="text-xs text-gray-500">• {tx.date}</span></div><h3 className="font-semibold text-gray-900">{tx.customerName}</h3></div>{getStatusBadge(tx.status)}</div>
                <div className="space-y-2 mb-3 text-sm"><div className="flex items-center justify-between"><span className="text-gray-500">Provider:</span><span className="font-medium">{tx.providerName}</span></div><div className="flex items-center justify-between"><span className="text-gray-500">Amount:</span><span className="font-bold text-green-600">{formatCurrency(tx.amount)}</span></div><div className="flex items-center justify-between"><span className="text-gray-500">Commission:</span><span>{formatCurrency(tx.commission)}</span></div></div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100"><div className="flex items-center gap-1 text-gray-500">{getPaymentIcon(tx.paymentMethod)}<span className="text-xs capitalize">{tx.paymentMethod}</span></div><button onClick={() => { setSelectedTransaction(tx); setShowModal('details'); }} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View →</button></div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  const renderPayouts = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPayouts.map(payout => (
        <motion.div key={payout.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between mb-3"><div><span className="text-sm font-medium text-gray-900">{payout.id}</span><h3 className="font-semibold text-gray-900 mt-1">{payout.providerName}</h3></div>{getStatusBadge(payout.status)}</div>
            <div className="space-y-2 mb-3"><div className="flex items-center justify-between"><span className="text-gray-500">Amount:</span><span className="font-bold text-green-600">{formatCurrency(payout.amount)}</span></div><div className="flex items-center justify-between"><span className="text-gray-500">Date:</span><span>{payout.date}</span></div></div>
            <div className="pt-2 border-t border-gray-100"><button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Process →</button></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div><h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"><DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" /> Payments & Commission</h1><p className="text-xs sm:text-sm text-gray-500 mt-1">Track transactions, manage payouts, and monitor commissions</p></div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button onClick={() => setViewMode('table')} className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Menu className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Grid className="w-4 h-4" /></button>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"><Download className="w-4 h-4 text-gray-600" /><span className="hidden sm:inline">Export</span></button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">Revenue</span><TrendingUp className="w-4 h-4 text-green-600" /></div><p className="text-lg font-bold text-gray-900">{formatNumber(summaryStats.totalRevenue)}</p><p className="text-xs text-green-600 mt-1">↑ 15.8%</p></div>
          <div className="bg-white rounded-lg border border-gray-200 p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">Commission</span><Percent className="w-4 h-4 text-blue-600" /></div><p className="text-lg font-bold text-gray-900">{formatNumber(summaryStats.totalCommission)}</p><p className="text-xs text-blue-600 mt-1">Avg {summaryStats.avgCommission}%</p></div>
          <div className="bg-white rounded-lg border border-gray-200 p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">Pending</span><Clock className="w-4 h-4 text-yellow-600" /></div><p className="text-lg font-bold text-gray-900">{formatNumber(summaryStats.pendingPayouts)}</p><p className="text-xs text-yellow-600 mt-1">{payouts.filter(p => p.status === 'pending').length} requests</p></div>
          <div className="bg-white rounded-lg border border-gray-200 p-3"><div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500">Disputes</span><AlertCircle className="w-4 h-4 text-red-600" /></div><p className="text-lg font-bold text-gray-900">{transactions.filter(t => t.status === 'disputed').length}</p><p className="text-xs text-red-600 mt-1">{transactions.filter(t => t.status === 'refunded').length} refunds</p></div>
        </div>

        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <nav className="flex -mb-px space-x-4 sm:space-x-8 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const colorClass = { blue: 'text-blue-600 border-blue-600', green: 'text-green-600 border-green-600', red: 'text-red-600 border-red-600', purple: 'text-purple-600 border-purple-600', orange: 'text-orange-600 border-orange-600' }[tab.color];
              return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${activeTab === tab.id ? colorClass : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Icon className="w-4 h-4" /><span>{tab.name}</span>{tab.count > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gray-100">{tab.count}</span>}</button>;
            })}
          </nav>
        </div>

        {activeTab !== 'commission' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Search ${activeTab}...`} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
              <div className="flex gap-2"><button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-50'}`}><Filter className="w-4 h-4" /><span className="hidden sm:inline">Filters</span></button><select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"><option value="">All Status</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="disputed">Disputed</option><option value="refunded">Refunded</option></select></div>
            </div>
            <AnimatePresence>{showFilters && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-gray-200"><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="block text-xs font-medium text-gray-500 mb-1">Provider</label><input type="text" value={filters.provider} onChange={(e) => setFilters({...filters, provider: e.target.value})} placeholder="Provider name" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg" /></div><div><label className="block text-xs font-medium text-gray-500 mb-1">Date Range</label><select value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg"><option value="">All Time</option><option value="today">Today</option><option value="week">This Week</option><option value="month">This Month</option></select></div></div><div className="flex justify-end mt-4"><button onClick={() => setFilters({provider: '', status: '', dateRange: ''})} className="text-sm text-gray-600 hover:text-gray-900">Clear all</button></div></motion.div>)}</AnimatePresence>
          </div>
        )}

        {activeTab !== 'commission' && selectedItems.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-blue-600 text-white p-3 rounded-lg mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">{selectedItems.length} selected</span>
            <div className="flex items-center gap-2"><button className="px-3 py-1 bg-green-500 rounded-md text-sm hover:bg-green-600">Process</button><button className="px-3 py-1 bg-yellow-500 rounded-md text-sm hover:bg-yellow-600">Export</button><button onClick={() => setSelectedItems([])} className="p-1 hover:bg-blue-700 rounded"><X className="w-4 h-4" /></button></div>
          </motion.div>
        )}

        {activeTab !== 'commission' && (
          <div className="flex sm:hidden items-center justify-end gap-2 mb-4">
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Menu className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}><Grid className="w-4 h-4" /></button>
          </div>
        )}

        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'payouts' && renderPayouts()}
        {activeTab === 'commission' && renderCommissionManagement()}

        {activeTab === 'transactions' && filteredTransactions.length > 0 && (
          <div className="mt-6 flex items-center justify-between"><p className="text-sm text-gray-500">Showing {filteredTransactions.length} of {transactions.length}</p><div className="flex items-center gap-2"><button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button><button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button><button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button><button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button></div></div>
        )}

        <AnimatePresence>
          {showModal === 'details' && selectedTransaction && (
            <Modal title="Transaction Details" onClose={() => setShowModal('none')}>
              <div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-gray-500">Transaction ID</p><p className="font-medium">{selectedTransaction.id}</p></div><div><p className="text-xs text-gray-500">Order ID</p><p>{selectedTransaction.orderId}</p></div><div><p className="text-xs text-gray-500">Customer</p><p>{selectedTransaction.customerName}</p></div><div><p className="text-xs text-gray-500">Provider</p><p>{selectedTransaction.providerName}</p></div><div><p className="text-xs text-gray-500">Amount</p><p className="font-bold text-green-600">{formatCurrency(selectedTransaction.amount)}</p></div><div><p className="text-xs text-gray-500">Commission</p><p>{formatCurrency(selectedTransaction.commission)}</p></div><div><p className="text-xs text-gray-500">Status</p><div className="mt-1">{getStatusBadge(selectedTransaction.status)}</div></div><div><p className="text-xs text-gray-500">Date</p><p>{selectedTransaction.date}</p></div></div><button onClick={() => setShowModal('none')} className="w-full border border-gray-200 py-2 rounded-lg hover:bg-gray-50 mt-4">Close</button></div>
            </Modal>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="p-4 sm:p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold">{title}</h2><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div>{children}</div>
    </motion.div>
  </div>
);

export default PaymentsManagement;