// src/pages/admin/Reports.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Download, RefreshCw, 
  Users, Calendar, Clock, DollarSign,
  TrendingUp, 
  CreditCard, 
  Info, 
  X, 
  FileBarChart,
  Package,
  Mail,
  MoreVertical,
  ShoppingBag} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie,
  AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

// Define proper types for chart data
interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

interface CommissionData {
  name: string;
  commission: number;
  paid: number;
  pending: number;
}

interface UserData {
  name: string;
  sellers: number;
  contractors: number;
  rentals: number;
}

interface PieData {
  name: string;
  value: number;
}

interface SummaryData {
  [key: string]: string | number;
}

interface ChartData {
  lineData: RevenueData[] | CommissionData[] | UserData[];
  pieData: PieData[];
  summary: SummaryData;
}

interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'commission' | 'users' | 'products' | 'orders' | 'payments';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dateRange: 'today' | 'yesterday' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  generatedAt: string;
  generatedBy: string;
  size: string;
  url: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  type: string;
  defaultColumns: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    enabled: boolean;
  };
}

const Reports = () => {
  const [activeReport, setActiveReport] = useState('revenue');
  const [dateRange, setDateRange] = useState('30');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [emailReport, setEmailReport] = useState('');
  const [scheduleConfig, setScheduleConfig] = useState({
    frequency: 'weekly',
    recipients: ['admin@casaterminal.com'],
    dayOfWeek: 'monday',
    timeOfDay: '09:00',
    format: 'pdf'
  });

  // Mock data - Generated Reports
  const [generatedReports, setGeneratedReports] = useState<Report[]>([
    {
      id: 'RPT-2024-001',
      name: 'Revenue Report - Jan 2024',
      type: 'revenue',
      format: 'pdf',
      dateRange: 'month',
      generatedAt: '2024-01-31T23:59:59',
      generatedBy: 'Admin',
      size: '2.4 MB',
      url: '#'
    },
    {
      id: 'RPT-2024-002',
      name: 'Commission Report - Q4 2023',
      type: 'commission',
      format: 'excel',
      dateRange: 'quarter',
      generatedAt: '2024-01-01T10:30:00',
      generatedBy: 'Admin',
      size: '1.8 MB',
      url: '#'
    },
    {
      id: 'RPT-2024-003',
      name: 'User Activity Report - Weekly',
      type: 'users',
      format: 'csv',
      dateRange: 'week',
      generatedAt: '2024-01-29T08:15:00',
      generatedBy: 'System',
      size: '956 KB',
      url: '#'
    }
  ]);

  // Report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Track revenue trends, growth metrics, and financial performance',
      icon: TrendingUp,
      color: 'text-green-600',
      type: 'revenue',
      defaultColumns: ['Date', 'Revenue', 'Orders', 'Avg Order Value'],
      schedule: {
        frequency: 'daily',
        recipients: ['finance@casaterminal.com'],
        enabled: true
      }
    },
    {
      id: 'commission',
      name: 'Commission Report',
      description: 'Analyze commission earnings, payout status, and provider earnings',
      icon: DollarSign,
      color: 'text-blue-600',
      type: 'commission',
      defaultColumns: ['Provider', 'Type', 'Revenue', 'Commission', 'Net Amount'],
      schedule: {
        frequency: 'weekly',
        recipients: ['accounts@casaterminal.com'],
        enabled: true
      }
    },
    {
      id: 'users',
      name: 'User Activity Report',
      description: 'Monitor user registrations, engagement, and activity metrics',
      icon: Users,
      color: 'text-purple-600',
      type: 'users',
      defaultColumns: ['Date', 'New Users', 'Active Users', 'Sessions']
    },
    {
      id: 'products',
      name: 'Product Performance',
      description: 'Track product sales, inventory, and category performance',
      icon: Package,
      color: 'text-yellow-600',
      type: 'products',
      defaultColumns: ['Product', 'Category', 'Sales', 'Revenue', 'Stock']
    },
    {
      id: 'orders',
      name: 'Orders Report',
      description: 'Analyze order volume, status distribution, and fulfillment metrics',
      icon: ShoppingBag,
      color: 'text-orange-600',
      type: 'orders',
      defaultColumns: ['Order ID', 'Customer', 'Amount', 'Status', 'Date']
    },
    {
      id: 'payments',
      name: 'Payments Summary',
      description: 'Track payment transactions, refunds, and dispute resolution',
      icon: CreditCard,
      color: 'text-indigo-600',
      type: 'payments',
      defaultColumns: ['Transaction ID', 'Amount', 'Status', 'Method', 'Date']
    }
  ];

  // Chart data based on report type
  const getChartData = (): ChartData => {
    switch(activeReport) {
      case 'revenue':
        return {
          lineData: [
            { name: 'Jan', revenue: 450000, orders: 145 },
            { name: 'Feb', revenue: 520000, orders: 168 },
            { name: 'Mar', revenue: 480000, orders: 156 },
            { name: 'Apr', revenue: 580000, orders: 187 },
            { name: 'May', revenue: 620000, orders: 198 },
            { name: 'Jun', revenue: 590000, orders: 189 },
            { name: 'Jul', revenue: 650000, orders: 210 },
            { name: 'Aug', revenue: 680000, orders: 223 },
            { name: 'Sep', revenue: 720000, orders: 234 },
            { name: 'Oct', revenue: 750000, orders: 245 },
            { name: 'Nov', revenue: 780000, orders: 256 },
            { name: 'Dec', revenue: 820000, orders: 267 }
          ] as RevenueData[],
          pieData: [
            { name: 'Construction Materials', value: 58 },
            { name: 'Equipment Rental', value: 25 },
            { name: 'Professional Services', value: 17 }
          ],
          summary: {
            totalRevenue: 8540000,
            growth: 15.8,
            avgOrderValue: 4567,
            totalOrders: 2678,
            topDay: '2024-01-15',
            topDayRevenue: 124500
          }
        };
      case 'commission':
        return {
          lineData: [
            { name: 'Jan', commission: 22500, paid: 18000, pending: 4500 },
            { name: 'Feb', commission: 26000, paid: 22000, pending: 4000 },
            { name: 'Mar', commission: 24000, paid: 20000, pending: 4000 },
            { name: 'Apr', commission: 29000, paid: 25000, pending: 4000 },
            { name: 'May', commission: 31000, paid: 28000, pending: 3000 },
            { name: 'Jun', commission: 29500, paid: 26000, pending: 3500 },
            { name: 'Jul', commission: 32500, paid: 29000, pending: 3500 },
            { name: 'Aug', commission: 34000, paid: 31000, pending: 3000 },
            { name: 'Sep', commission: 36000, paid: 33000, pending: 3000 },
            { name: 'Oct', commission: 37500, paid: 35000, pending: 2500 },
            { name: 'Nov', commission: 39000, paid: 37000, pending: 2000 },
            { name: 'Dec', commission: 41000, paid: 39000, pending: 2000 }
          ] as CommissionData[],
          pieData: [
            { name: 'Sellers', value: 45 },
            { name: 'Contractors', value: 30 },
            { name: 'Rentals', value: 25 }
          ],
          summary: {
            totalCommission: 381000,
            avgRate: 8.5,
            pendingPayouts: 38500,
            paidPayouts: 342500,
            topProvider: 'ABC Constructions',
            topProviderCommission: 45600
          }
        };
      case 'users':
        return {
          lineData: [
            { name: 'Jan', sellers: 12, contractors: 8, rentals: 5 },
            { name: 'Feb', sellers: 15, contractors: 10, rentals: 7 },
            { name: 'Mar', sellers: 18, contractors: 12, rentals: 8 },
            { name: 'Apr', sellers: 22, contractors: 15, rentals: 10 },
            { name: 'May', sellers: 25, contractors: 18, rentals: 12 },
            { name: 'Jun', sellers: 28, contractors: 20, rentals: 14 },
            { name: 'Jul', sellers: 32, contractors: 23, rentals: 16 },
            { name: 'Aug', sellers: 35, contractors: 25, rentals: 18 },
            { name: 'Sep', sellers: 38, contractors: 28, rentals: 20 },
            { name: 'Oct', sellers: 42, contractors: 30, rentals: 22 },
            { name: 'Nov', sellers: 45, contractors: 33, rentals: 24 },
            { name: 'Dec', sellers: 48, contractors: 35, rentals: 26 }
          ] as UserData[],
          pieData: [
            { name: 'Sellers', value: 48 },
            { name: 'Contractors', value: 35 },
            { name: 'Rentals', value: 26 }
          ],
          summary: {
            totalUsers: 109,
            activeUsers: 98,
            pendingApprovals: 11,
            blockedUsers: 5,
            avgRating: 4.6
          }
        };
      default:
        return {
          lineData: [],
          pieData: [],
          summary: {}
        };
    }
  };

  const chartData = getChartData();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowExportModal(false);
      // Add to generated reports
      const newReport: Report = {
        id: `RPT-2024-${String(generatedReports.length + 1).padStart(3, '0')}`,
        name: `${reportTemplates.find(r => r.id === activeReport)?.name} - ${new Date().toLocaleDateString()}`,
        type: activeReport as any,
        format: exportFormat as any,
        dateRange: dateRange === 'custom' ? 'custom' : 'month',
        generatedAt: new Date().toISOString(),
        generatedBy: 'Admin',
        size: '1.2 MB',
        url: '#'
      };
      setGeneratedReports([newReport, ...generatedReports]);
    }, 3000);
  };

  const COLORS = ['#502d13', '#7b4a26', '#a06e3a', '#c28a5c', '#e9ddc8'];

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Render appropriate chart based on active report
  const renderChart = () => {
    switch(activeReport) {
      case 'revenue':
        return (
          <AreaChart data={chartData.lineData as RevenueData[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value: any) => formatCurrency(value)}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke="#502d13" 
              fill="#502d13" 
              fillOpacity={0.1}
              name="Revenue"
            />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="orders" 
              stroke="#7b4a26" 
              fill="#7b4a26" 
              fillOpacity={0.1}
              name="Orders"
            />
          </AreaChart>
        );
      case 'commission':
        return (
          <BarChart data={chartData.lineData as CommissionData[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => formatCurrency(value)}
            />
            <Legend />
            <Bar dataKey="commission" fill="#502d13" name="Total Commission" />
            <Bar dataKey="paid" fill="#7b4a26" name="Paid" />
            <Bar dataKey="pending" fill="#a06e3a" name="Pending" />
          </BarChart>
        );
      case 'users':
        return (
          <LineChart data={chartData.lineData as UserData[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sellers" stroke="#502d13" name="Sellers" />
            <Line type="monotone" dataKey="contractors" stroke="#7b4a26" name="Contractors" />
            <Line type="monotone" dataKey="rentals" stroke="#a06e3a" name="Rentals" />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-[#502d13]" />
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and analyze detailed reports for your platform
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="hidden sm:inline">Schedule</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#502d13] text-white rounded-lg hover:bg-[#7b4a26] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <motion.button
              key={template.id}
              whileHover={{ y: -2 }}
              onClick={() => setActiveReport(template.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                activeReport === template.id
                  ? 'border-[#502d13] bg-[#502d13]/5'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${template.color}`} />
              <span className="text-xs font-medium text-gray-700 block text-center">
                {template.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {['7', '30', '90', '365'].map((days) => (
              <button
                key={days}
                onClick={() => {
                  setDateRange(days);
                  setShowDatePicker(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === days && !showDatePicker
                    ? 'bg-[#502d13] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Last {days} days
              </button>
            ))}
            
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showDatePicker
                  ? 'bg-[#502d13] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Custom Range
            </button>

            <button className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  />
                </div>
                <button
                  onClick={() => {
                    setDateRange('custom');
                    setShowDatePicker(false);
                  }}
                  className="px-4 py-2 bg-[#502d13] text-white rounded-lg hover:bg-[#7b4a26]"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(chartData.summary).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {typeof value === 'number' ? 
                key.includes('Revenue') || key.includes('Commission') || key.includes('Payout') ?
                  formatCurrency(value)
                  : value.toLocaleString()
                : value
              }
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line/Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {reportTemplates.find(r => r.id === activeReport)?.name} - Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={chartData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Recently Generated Reports</h2>
          <button className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    <div className="text-xs text-gray-500">{report.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 uppercase">{report.format}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{report.dateRange}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(report.generatedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">{new Date(report.generatedAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-green-100 rounded text-green-600" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-purple-100 rounded text-purple-600" title="Share">
                        <Mail className="w-4 h-4" />
                      </button>
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

      {/* Generate Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Report</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select
                    value={activeReport}
                    onChange={(e) => setActiveReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  >
                    {reportTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {dateRange === 'custom' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['pdf', 'excel', 'csv', 'json'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setExportFormat(format)}
                        className={`p-2 border rounded-lg text-sm font-medium transition-colors ${
                          exportFormat === format
                            ? 'bg-[#502d13] text-white border-[#502d13]'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Report (Optional)
                  </label>
                  <input
                    type="email"
                    value={emailReport}
                    onChange={(e) => setEmailReport(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Report Generation</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Large reports may take a few minutes to generate. 
                        You will be notified when the report is ready.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex-1 bg-[#502d13] text-white py-2 rounded-lg hover:bg-[#7b4a26] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule Report</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select
                    value={activeReport}
                    onChange={(e) => setActiveReport(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  >
                    {reportTemplates.map(template => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={scheduleConfig.frequency}
                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {scheduleConfig.frequency === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Day of Week
                    </label>
                    <select
                      value={scheduleConfig.dayOfWeek}
                      onChange={(e) => setScheduleConfig({ ...scheduleConfig, dayOfWeek: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time of Day
                  </label>
                  <input
                    type="time"
                    value={scheduleConfig.timeOfDay}
                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, timeOfDay: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    value={scheduleConfig.format}
                    onChange={(e) => setScheduleConfig({ ...scheduleConfig, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipients
                  </label>
                  <div className="space-y-2">
                    {scheduleConfig.recipients.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            const newRecipients = [...scheduleConfig.recipients];
                            newRecipients[index] = e.target.value;
                            setScheduleConfig({ ...scheduleConfig, recipients: newRecipients });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#502d13]"
                        />
                        <button
                          onClick={() => {
                            const newRecipients = scheduleConfig.recipients.filter((_, i) => i !== index);
                            setScheduleConfig({ ...scheduleConfig, recipients: newRecipients });
                          }}
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setScheduleConfig({
                          ...scheduleConfig,
                          recipients: [...scheduleConfig.recipients, '']
                        });
                      }}
                      className="text-sm text-[#502d13] hover:text-[#7b4a26] font-medium"
                    >
                      + Add Recipient
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    // Save schedule logic
                    setShowScheduleModal(false);
                  }}
                  className="flex-1 bg-[#502d13] text-white py-2 rounded-lg hover:bg-[#7b4a26]"
                >
                  Save Schedule
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Reports;