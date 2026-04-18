// src/components/admin/AdminHeader.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Search, Bell, User, Settings, LogOut, ChevronDown,
  Shield, HardHat, Clock, Sun, Moon, X
} from 'lucide-react';

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = [
    { id: 1, title: 'New seller registration', time: '5 min ago', type: 'success' },
    { id: 2, title: 'Payment pending', time: '1 hour ago', type: 'warning' },
    { id: 3, title: 'System update', time: '2 hours ago', type: 'info' },
    { id: 4, title: 'New dispute raised', time: '3 hours ago', type: 'error' },
  ];

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      localStorage.clear();
      navigate('/admin/login');
    }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="fixed top-0 right-0 left-0 bg-white shadow-sm z-30 h-16 border-b">
      <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500" />
      <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800">CASA TERMINAL</h1>
              <p className="text-[10px] text-gray-500">Admin Panel</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full text-sm">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-gray-600">{formatTime(currentTime)}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{formatDate(currentTime)}</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 lg:w-80">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <button onClick={() => setShowSearch(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-3 border-b bg-gray-50">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-gray-50 border-b last:border-0">
                        <p className="text-sm font-medium">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <button className="w-full text-center text-sm text-orange-600 hover:text-orange-700 py-1">
                      View all
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
                >
                  <div className="p-3 border-b bg-gray-50">
                    <p className="font-medium">Admin User</p>
                    <p className="text-xs text-gray-500">admin@site.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg">
                      <User className="w-4 h-4" /> Profile
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded-lg">
                      <Settings className="w-4 h-4" /> Settings
                    </button>
                    <div className="border-t my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                  />
                </div>
                <button onClick={() => setShowSearch(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AdminHeader;