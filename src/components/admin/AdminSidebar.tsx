// src/components/admin/AdminSidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Truck,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Shield,
  HardHat,
  Wrench,
  Building2,
  Hammer,
  Ruler,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  AlertCircle,
  User,
  Activity,
  
  Sun,
  Moon,
  Minimize2,
  Maximize2,
  Info,
  MessageCircle,
  UserPlus} from 'lucide-react';
import logo from "/logo.png";
import { useState, useEffect, useCallback } from 'react';

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
}

interface SubMenuItem {
  name: string;
  icon: any;
  path: string;
  badge?: string;
}

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  color: string;
  bgColor: string;
  badge?: string;
  constructionIcon: any;
  subItems?: SubMenuItem[];
  stats?: { value: string; label: string };
  description?: string;
}

const AdminSidebar = ({ isOpen, setIsOpen, isMobile }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoError, setLogoError] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      // Just trigger re-render on resize
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Enhanced menu items with more details
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      constructionIcon: HardHat,
      stats: { value: '24', label: 'Active Projects' },
      description: 'Overview & Analytics'
    },
    {
      title: 'Seller Management',
      icon: Users,
      path: '/admin/sellers',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      badge: '12',
      constructionIcon: Building2,
      
    },
    {
      title: 'Contractor Management',
      icon: Briefcase,
      path: '/admin/contractors',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      badge: '5',
      constructionIcon: Hammer,
      
    },
    {
      title: 'Rental Management',
      icon: Truck,
      path: '/admin/rentals',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      badge: '3',
      constructionIcon: Wrench,
     
      
    },
    {
      title: 'Products Management',
      icon: Package,
      path: '/admin/products',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      constructionIcon: Package,
     
    },
    {
      title: 'Payments & Commission',
      icon: CreditCard,
      path: '/admin/payments',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      badge: '₹24.5K',
      constructionIcon: CreditCard,
     
    },
    {
      title: 'Reports',
      icon: BarChart3,
      path: '/admin/reports',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      constructionIcon: Ruler,
     
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      constructionIcon: Settings,
      
    }
  ];

  // Notifications data
  const notifications = [
    { 
      id: 1, 
      title: 'New Seller Registration', 
      description: 'ABC Constructions requested approval',
      time: '5 min ago', 
      type: 'success',
      icon: UserPlus,
      color: 'text-green-500',
      bg: 'bg-green-50',
      read: false
    },
    { 
      id: 2, 
      title: 'Payment Pending', 
      description: '3 orders awaiting payment confirmation',
      time: '1 hour ago', 
      type: 'warning',
      icon: AlertCircle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      read: false
    },
    { 
      id: 3, 
      title: 'System Update', 
      description: 'Platform updated to v2.5.0',
      time: '2 hours ago', 
      type: 'info',
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      read: true
    },
    { 
      id: 4, 
      title: 'New Dispute Raised', 
      description: 'Order #ORD-2024-1234 requires attention',
      time: '3 hours ago', 
      type: 'error',
      icon: MessageCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      read: false
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/admin/login');
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: -320,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  const menuItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { 
      scale: 1.02, 
      x: 5,
      transition: { duration: 0.2 } 
    }
  };

  const subItemVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  // Toggle button component
  const ToggleButton = () => (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsOpen(!isOpen)}
      className={`
        fixed top-20 z-50 flex items-center justify-center
        w-10 h-10 rounded-full shadow-xl
        bg-gradient-to-r from-[#502d13] to-[#7b4a26]
        text-[#e9ddc8] border-2 border-[#e9ddc8]/30
        hover:shadow-2xl transition-all duration-300
        ${isOpen ? 'left-[310px]' : 'left-4'}
        ${isMobile ? 'flex' : 'hidden lg:flex'}
      `}
    >
      {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </motion.button>
  );

  return (
    <>
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 right-0 z-40
          h-16 bg-white/95 backdrop-blur-md shadow-lg
          border-b border-gray-200
          flex items-center justify-between px-4
          transition-all duration-300
          ${isOpen && !isMobile ? 'left-80' : 'left-0'}
          ${isMobile ? 'left-0' : ''}
        `}
      >
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
            >
              <Menu className="w-5 h-5 text-gray-600" />
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Menu
              </span>
            </motion.button>
          )}
          
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-96 group focus-within:ring-2 focus-within:ring-[#502d13] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
            />
            <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white rounded border border-gray-200 text-gray-500">
              <span>⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group hidden lg:block"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-gray-600" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-600" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Fullscreen
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group hidden lg:block"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {isDarkMode ? 'Light' : 'Dark'} Mode
            </span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Notifications
              </span>
            </motion.button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#502d13] to-[#7b4a26]">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white">Notifications</h3>
                      <span className="px-2 py-1 bg-white/20 text-white text-xs rounded-full">
                        {notifications.filter(n => !n.read).length} New
                      </span>
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <motion.div
                          key={notif.id}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          className={`p-4 border-b border-gray-100 last:border-0 cursor-pointer ${
                            !notif.read ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`${notif.bg} p-2 rounded-lg`}>
                              <Icon className={`w-4 h-4 ${notif.color}`} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.description}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-400">{notif.time}</p>
                                {!notif.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button className="w-full text-center text-sm text-[#502d13] hover:text-[#7b4a26] font-medium py-1 transition-colors">
                      View All Notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative group">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#502d13] to-[#7b4a26] rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="w-5 h-5 text-[#e9ddc8]" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block group-hover:rotate-180 transition-transform duration-300" />
            </motion.div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div className="p-4 bg-gradient-to-r from-[#502d13] to-[#7b4a26] rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Admin User</p>
                    <p className="text-white/80 text-xs">admin@casaterminal.com</p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <Link
                  to="/admin/profile"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>My Profile</span>
                </Link>
                
                <Link
                  to="/admin/settings"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>Settings</span>
                </Link>

                <Link
                  to="/admin/activity"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white">
                    <Activity className="w-4 h-4 text-gray-600" />
                  </div>
                  <span>Activity Log</span>
                </Link>

                <div className="border-t border-gray-100 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-red-50 rounded-lg group-hover:bg-white">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <ToggleButton />

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className={`
          fixed top-0 left-0 h-full
          bg-gradient-to-b from-[#1a0f07] to-[#2d1a0c]
          text-[#e9ddc8] shadow-2xl z-50
          w-80 overflow-hidden
          ${isOpen ? 'block' : 'hidden lg:block'}
        `}
      >
        {/* Animated construction pattern background */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #e9ddc8 0px, #e9ddc8 4px, transparent 4px, transparent 20px)`,
            backgroundSize: '200% 200%'
          }}
        />

        {/* Logo Area */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative h-20 flex items-center justify-between px-4 border-b border-[#e9ddc8]/10 bg-gradient-to-r from-[#2d1a0c] to-[#1a0f07]"
        >
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-12 h-12  flex items-center justify-center  group-hover:shadow-xl transition-all">
                {!logoError ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-8 h-8 object-contain"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <HardHat className="w-6 h-6 text-[#502d13]" />
                )}
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center"
              >
                <Wrench className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>
            <div>
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-lg block tracking-wider"
              >
                CASA TERMINAL
              </motion.span>
              <span className="text-xs text-[#e9ddc8]/40">Construction Management</span>
            </div>
          </Link>
          
          {/* Mobile close button */}
          {isMobile && (
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-[#e9ddc8]/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>


        {/* Menu Items */}
        <div className="relative h-[calc(100vh-16rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-[#e9ddc8]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#e9ddc8]/40">
          <nav className="p-3 space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const ConstructionIcon = item.constructionIcon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const isExpanded = expandedSection === item.title;

              return (
                <motion.div
                  key={item.path}
                  variants={menuItemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    whileHover="hover"
                    onHoverStart={() => setHoveredItem(item.path)}
                    onHoverEnd={() => setHoveredItem(null)}
                  >
                    <Link
                      to={item.path}
                      onClick={() => {
                        if (isMobile) setIsOpen(false);
                        if (item.subItems) {
                          setExpandedSection(isExpanded ? null : item.title);
                        }
                      }}
                      className={`
                        relative flex items-center justify-between px-3 py-3 rounded-xl
                        transition-all duration-300 group
                        ${isActive
                          ? 'bg-gradient-to-r from-[#e9ddc8] to-[#d4c4ab] text-[#502d13] shadow-lg'
                          : 'text-[#e9ddc8]/70 hover:bg-[#e9ddc8]/10 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: hoveredItem === item.path ? 360 : 0 }}
                          transition={{ duration: 0.5 }}
                          className={`relative p-1.5 rounded-lg ${
                            isActive ? 'bg-[#502d13]/10' : 'bg-[#e9ddc8]/5'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${
                            isActive ? 'text-[#502d13]' : item.color
                          }`} />
                        </motion.div>
                        <div>
                          <span className="text-sm font-medium block">{item.title}</span>
                          {item.description && (
                            <span className="text-[10px] text-[#e9ddc8]/40">{item.description}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.stats && !isActive && (
                          <div className="text-right">
                            <span className="text-xs font-bold">{item.stats.value}</span>
                            <span className="text-[8px] text-[#e9ddc8]/40 block">{item.stats.label}</span>
                          </div>
                        )}
                        {item.badge && (
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`text-xs px-2 py-1 rounded-full ${
                              isActive
                                ? 'bg-[#502d13] text-[#e9ddc8]'
                                : 'bg-[#e9ddc8]/10 text-[#e9ddc8]'
                            }`}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                        {item.subItems && (
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`} />
                        )}
                      </div>

                      {/* Hover effect icon */}
                      {hoveredItem === item.path && (
                        <motion.div
                          initial={{ scale: 0, x: -20 }}
                          animate={{ scale: 1, x: 0 }}
                          className="absolute -left-1 top-1/2 -translate-y-1/2"
                        >
                          <ConstructionIcon className="w-3 h-3 text-yellow-500" />
                        </motion.div>
                      )}
                    </Link>
                  </motion.div>

                  {/* Submenu Items */}
                  <AnimatePresence>
                    {item.subItems && isExpanded && (
                      <motion.div
                        variants={subItemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="ml-11 mt-1 space-y-1"
                      >
                        {item.subItems.map((subItem, idx) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <motion.div
                              key={subItem.path}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Link
                                to={subItem.path}
                                onClick={() => isMobile && setIsOpen(false)}
                                className={`
                                  flex items-center justify-between px-3 py-2 text-xs
                                  rounded-lg transition-all
                                  ${isSubActive
                                    ? 'bg-[#e9ddc8]/20 text-[#e9ddc8]'
                                    : 'text-[#e9ddc8]/50 hover:text-[#e9ddc8] hover:bg-[#e9ddc8]/5'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-2">
                                  <SubIcon className="w-3 h-3" />
                                  <span>{subItem.name}</span>
                                </div>
                                {subItem.badge && (
                                  <span className="text-[8px] px-1.5 py-0.5 bg-[#e9ddc8]/10 rounded-full">
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className="my-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e9ddc8]/10"></div>
              </div>
              <div className="relative flex justify-center">
                <motion.span
                  
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="px-2 bg-[#1a0f07] text-[#e9ddc8]/30"
                >
                  <Wrench className="w-3 h-3" />
                </motion.span>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#e9ddc8]/70 hover:bg-red-500/10 hover:text-red-500 transition-all group relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              </motion.div>
              <span className="text-sm font-medium">Logout</span>
              
              <motion.div
                className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors"
                initial={false}
              />
            </motion.button>
          </nav>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e9ddc8]/10 bg-gradient-to-t from-[#1a0f07] to-transparent"
        >
         
          <div className="flex items-center justify-center mt-2 text-[10px] text-[#e9ddc8]/20">
            © 2024 Casa Terminal. All rights reserved.
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content Spacer */}
      <div className={`h-16 transition-all duration-300 ${isOpen && !isMobile ? 'ml-80' : 'ml-0'}`} />
    </>
  );
};

export default AdminSidebar;