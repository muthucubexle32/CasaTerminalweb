// src/pages/admin/Dashboard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  ShoppingBag,
  CreditCard,
  Award,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  PieChart,
  Calendar,
  ChevronRight,
  MoreHorizontal,
  Star,
  HardHat,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend } from 'recharts';

// Mock data for charts
const revenueData = [
  { name: 'Jan', revenue: 45, orders: 14 },
  { name: 'Feb', revenue: 52, orders: 16 },
  { name: 'Mar', revenue: 48, orders: 15 },
  { name: 'Apr', revenue: 58, orders: 18 },
  { name: 'May', revenue: 62, orders: 19 },
  { name: 'Jun', revenue: 59, orders: 18 },
  { name: 'Jul', revenue: 65, orders: 21 },
  { name: 'Aug', revenue: 68, orders: 22 },
  { name: 'Sep', revenue: 72, orders: 23 },
  { name: 'Oct', revenue: 75, orders: 24 },
  { name: 'Nov', revenue: 78, orders: 25 },
  { name: 'Dec', revenue: 82, orders: 26 }
];

const categoryData = [
  { name: 'Materials', value: 58, color: '#502d13' },
  { name: 'Equipment', value: 25, color: '#7b4a26' },
  { name: 'Services', value: 17, color: '#a06e3a' }
];

// Helper to format large numbers
const formatNumber = (num: number) => {
  if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSellers: 0,
    totalContractors: 0,
    totalRentals: 0,
    totalProducts: 0,
    pendingApprovals: 0,
    totalRevenue: 0,
    totalCommission: 0,
    pendingPayouts: 0,
    activeOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    averageRating: 0,
    customerSatisfaction: 0,
    growthRate: 0
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [showStats, setShowStats] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  const fetchDashboardData = () => {
    setIsRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setStats({
        totalSellers: 156,
        totalContractors: 89,
        totalRentals: 45,
        totalProducts: 1234,
        pendingApprovals: 23,
        totalRevenue: 4567890,
        totalCommission: 456789,
        pendingPayouts: 123456,
        activeOrders: 234,
        completedOrders: 1890,
        cancelledOrders: 45,
        averageRating: 4.5,
        customerSatisfaction: 92,
        growthRate: 15.8
      });

      setRecentActivities([
        { id: 1, action: 'New seller registered', user: 'ABC Constructions', time: '5 min ago', type: 'success', icon: Users },
        { id: 2, action: 'Payment received', user: 'Order #ORD-2024-1234', time: '10 min ago', type: 'info', icon: DollarSign },
        { id: 3, action: 'Payout requested', user: 'XYZ Enterprises', time: '15 min ago', type: 'warning', icon: CreditCard },
        { id: 4, action: 'Product approved', user: 'Premium TMT Steel', time: '20 min ago', type: 'success', icon: Package },
        { id: 5, action: 'Dispute raised', user: 'Order #ORD-2024-5678', time: '25 min ago', type: 'error', icon: AlertCircle },
        { id: 6, action: 'New contractor joined', user: 'Rajesh Constructions', time: '30 min ago', type: 'success', icon: Briefcase },
        { id: 7, action: 'Equipment booked', user: 'JCB 3DX', time: '35 min ago', type: 'info', icon: Truck },
        { id: 8, action: 'Commission paid', user: 'ABC Constructions', time: '40 min ago', type: 'success', icon: DollarSign }
      ]);

      setTopSellers([
        { id: 1, name: 'ABC Constructions', revenue: 456000, orders: 156, rating: 4.8, growth: 23 },
        { id: 2, name: 'XYZ Enterprises', revenue: 389000, orders: 134, rating: 4.6, growth: 18 },
        { id: 3, name: 'PQR Builders', revenue: 298000, orders: 98, rating: 4.7, growth: 15 },
        { id: 4, name: 'Singh Interiors', revenue: 267000, orders: 87, rating: 4.5, growth: 12 },
        { id: 5, name: 'Patel Electricals', revenue: 234000, orders: 76, rating: 4.4, growth: 10 }
      ]);

      setRecentOrders([
        { id: 'ORD-2024-1234', customer: 'Rahul Sharma', amount: 45000, status: 'completed', date: '2024-01-15' },
        { id: 'ORD-2024-1235', customer: 'Priya Patel', amount: 28500, status: 'processing', date: '2024-01-15' },
        { id: 'ORD-2024-1236', customer: 'Amit Kumar', amount: 125000, status: 'pending', date: '2024-01-14' },
        { id: 'ORD-2024-1237', customer: 'Sneha Reddy', amount: 8900, status: 'completed', date: '2024-01-14' },
        { id: 'ORD-2024-1238', customer: 'Vikram Singh', amount: 67000, status: 'cancelled', date: '2024-01-13' }
      ]);

      setIsRefreshing(false);
      setLoading(false);
    }, 1500);
  };

  const cardData = [
    {
      title: 'Total Sellers',
      value: formatNumber(stats.totalSellers),
      icon: Users,
      color: 'blue',
      trend: +12,
      trendLabel: 'vs last month',
      bgColor: 'bg-blue-50',
      details: { active: 142, pending: 8, blocked: 6, verified: 145 }
    },
    {
      title: 'Total Contractors',
      value: formatNumber(stats.totalContractors),
      icon: Briefcase,
      color: 'green',
      trend: +8,
      trendLabel: 'vs last month',
      bgColor: 'bg-green-50',
      details: { active: 76, pending: 5, projects: 34, verified: 76 }
    },
    {
      title: 'Total Rentals',
      value: formatNumber(stats.totalRentals),
      icon: Truck,
      color: 'purple',
      trend: +5,
      trendLabel: 'vs last month',
      bgColor: 'bg-purple-50',
      details: { available: 15, booked: 28, maintenance: 2, total: 45 }
    },
    {
      title: 'Total Products',
      value: formatNumber(stats.totalProducts),
      icon: Package,
      color: 'yellow',
      trend: +15,
      trendLabel: 'vs last month',
      bgColor: 'bg-yellow-50',
      details: { active: 1045, pending: 23, lowStock: 15, featured: 88 }
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'indigo',
      trend: +23,
      trendLabel: 'vs last month',
      bgColor: 'bg-indigo-50',
      details: { monthly: 4567890, weekly: 1234567, daily: 176234, average: 4567 }
    },
    {
      title: 'Commission Earned',
      value: formatCurrency(stats.totalCommission),
      icon: TrendingUp,
      color: 'pink',
      trend: +18,
      trendLabel: 'vs last month',
      bgColor: 'bg-pink-50',
      details: { rate: '8.5%', pending: 45678, paid: 411111, expected: 500000 }
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'orange',
      trend: -3,
      trendLabel: 'less than yesterday',
      bgColor: 'bg-orange-50',
      details: { sellers: 12, contractors: 5, rentals: 3, products: 3 }
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: ShoppingBag,
      color: 'red',
      trend: +8,
      trendLabel: 'vs last month',
      bgColor: 'bg-red-50',
      details: { processing: 145, shipped: 67, delivered: 22, cancelled: 12 }
    }
  ];

  const StatCard = ({ data, index }: { data: typeof cardData[0]; index: number }) => {
    const Icon = data.icon;
    const isPositive = data.trend > 0;
    const isNegative = data.trend < 0;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group"
      >
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br from-${data.color}-500 to-${data.color}-600 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1">
              {isPositive && <ArrowUpRight className="w-4 h-4 text-green-500" />}
              {isNegative && <ArrowUpRight className="w-4 h-4 text-red-500 rotate-90" />}
              <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
                {Math.abs(data.trend)}%
              </span>
              <span className="text-xs text-gray-400">{data.trendLabel}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-800">{data.value}</h3>
            <p className="text-sm text-gray-500 mt-1">{data.title}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Active: {data.details.active || data.details.processing || data.details.available || data.details.active}</span>
              <button className="text-[#502d13] hover:text-[#7b4a26] font-medium flex items-center gap-1">
                View <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#502d13] via-[#7b4a26] to-[#a06e3a] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </motion.div>
    );
  };

  const ActivityItem = ({ activity, idx }: { activity: any; idx: number }) => {
    const Icon = activity.icon;
    const colors: Record<string, string> = {
      success: 'text-green-500 bg-green-50',
      info: 'text-blue-500 bg-blue-50',
      warning: 'text-yellow-500 bg-yellow-50',
      error: 'text-red-500 bg-red-50'
    };
    // Ensure activity.type is a valid key
    const colorClass = colors[activity.type as keyof typeof colors] || colors.info;
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group"
      >
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{activity.action}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{activity.user}</span>
            <span>•</span>
            <span>{activity.time}</span>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </motion.div>
    );
  };

  const SellerCard = ({ seller, rank }: { seller: any; rank: number }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        rank === 0 ? 'bg-yellow-100 text-yellow-600' :
        rank === 1 ? 'bg-gray-100 text-gray-600' :
        rank === 2 ? 'bg-orange-100 text-orange-600' :
        'bg-gray-100 text-gray-500'
      }`}>
        {rank + 1}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-800">{seller.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
          <span>{seller.orders} orders</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {seller.rating}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-800">{formatCurrency(seller.revenue)}</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" />
          {seller.growth}%
        </p>
      </div>
    </motion.div>
  );

  const OrderRow = ({ order }: { order: any }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          order.status === 'completed' ? 'bg-green-100 text-green-800' :
          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
    </tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#502d13] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <HardHat className="w-8 h-8 text-[#502d13]" />
          </div>
        </div>
        <p className="ml-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#502d13]" />
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#502d13]"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showStats ? <Eye className="w-4 h-4 text-gray-600" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cardData.map((card, idx) => (
            <StatCard key={card.title} data={card} index={idx} />
          ))}
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue and order trends</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#502d13]"></div>
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#7b4a26]"></div>
                <span className="text-xs text-gray-500">Orders</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#502d13" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#502d13" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tickFormatter={(value) => `₹${value}L`} tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}`} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#374151' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#502d13" fill="url(#colorRevenue)" strokeWidth={2} />
                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#7b4a26" fill="none" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Revenue by Category</h2>
              <p className="text-sm text-gray-500">Distribution across services</p>
            </div>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
            {categoryData.map((cat) => (
              <div key={cat.name} className="text-center">
                <div className="text-lg font-bold text-gray-800">{cat.value}%</div>
                <div className="text-xs text-gray-500 mt-1">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Orders</p>
              <p className="text-lg font-bold text-gray-800">{stats.completedOrders}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% from last month</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending Orders</p>
              <p className="text-lg font-bold text-gray-800">{stats.activeOrders - stats.completedOrders}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Awaiting processing</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelled</p>
              <p className="text-lg font-bold text-gray-800">{stats.cancelledOrders}</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>2.4% cancellation rate</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg Rating</p>
              <p className="text-lg font-bold text-gray-800">{stats.averageRating} ★</p>
            </div>
          </div>
          <div className="mt-2 text-xs text-purple-600 flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>Based on 1,245 reviews</span>
          </div>
        </div>
      </div>

      {/* Recent Activities & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest platform updates</p>
            </div>
            <button className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {recentActivities.slice(0, 5).map((activity, idx) => (
              <ActivityItem key={activity.id} activity={activity} idx={idx} />
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Top Sellers</h2>
              <p className="text-xs text-gray-500 mt-0.5">By revenue this month</p>
            </div>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-2">
            {topSellers.map((seller, idx) => (
              <SellerCard key={seller.id} seller={seller} rank={idx} />
            ))}
          </div>
          <button className="w-full mt-4 text-center text-sm text-[#502d13] hover:text-[#7b4a26] font-medium flex items-center justify-center gap-1 py-2 border-t border-gray-100 pt-4">
            View All Sellers <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <p className="text-xs text-gray-500 mt-0.5">Latest transactions</p>
          </div>
          <button className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium flex items-center gap-1">
            View All Orders <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper component for Trophy icon (if not available in lucide-react)
const Trophy = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L16 9l-4 2-4-2 1.714-1.143L12 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12M9 12h6" />
  </svg>
);

export default Dashboard;